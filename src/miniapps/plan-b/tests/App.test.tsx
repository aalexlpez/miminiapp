import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { getPlanCopy } from '../i18n/copy';
import { sessionKey } from '../browser/session';

beforeEach(() => {
  vi.restoreAllMocks();
  window.sessionStorage.clear();
  window.localStorage.clear();
});
afterEach(() => vi.restoreAllMocks());
async function start(locale: 'es' | 'en' = 'es') {
  const user = userEvent.setup();
  render(<App locale={locale} copy={getPlanCopy(locale)} />);
  await waitFor(() =>
    expect(screen.getByTestId('plan-b-app')).toHaveAttribute(
      'data-ready',
      'true',
    ),
  );
  return user;
}
describe('visible plan journey', () => {
  it.each(['es', 'en'] as const)(
    'completes the %s example, preserves it on Back, and resets only its key',
    async (locale) => {
      window.localStorage.setItem('miminiapp.appearance', 'dark');
      window.sessionStorage.setItem('another', 'keep');
      const copy = getPlanCopy(locale);
      const user = await start(locale);
      await user.click(
        screen.getByRole('button', { name: copy.ui.exampleButton }),
      );
      expect(screen.getByLabelText(copy.ui.goalLabel)).toHaveValue(
        copy.example.purpose,
      );
      await user.click(screen.getByRole('button', { name: copy.ui.next }));
      await user.click(
        screen.getByRole('button', { name: copy.obstacles.time }),
      );
      expect(screen.getByText(copy.ui.exampleTag)).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: copy.ui.viewPlan }));
      expect(screen.getByTestId('plan-sentence')).toHaveTextContent(
        copy.example.action,
      );
      await user.click(screen.getByRole('button', { name: copy.ui.back }));
      expect(
        screen.getByLabelText(`${copy.ui.if} — ${copy.ui.situationLabel}`),
      ).toHaveValue(copy.example.situation);
      await user.click(screen.getByRole('button', { name: copy.ui.viewPlan }));
      await user.click(screen.getByRole('button', { name: copy.ui.reset }));
      expect(window.sessionStorage.getItem(sessionKey)).toBeNull();
      expect(window.sessionStorage.getItem('another')).toBe('keep');
      expect(window.localStorage.getItem('miminiapp.appearance')).toBe('dark');
      expect(screen.queryByText(copy.ui.exampleTag)).not.toBeInTheDocument();
    },
  );
  it('enforces Unicode limits and rejects pasted line breaks without silently rewriting', async () => {
    const user = await start();
    const ui = getPlanCopy('es').ui;
    await user.click(screen.getByRole('button', { name: ui.start }));
    const input = screen.getByLabelText(ui.goalLabel);
    fireEvent.change(input, { target: { value: 'ab' } });
    await user.click(screen.getByRole('button', { name: ui.next }));
    expect(screen.getByRole('alert')).toHaveTextContent('3');
    expect(input).toHaveFocus();
    await user.paste('hola\nmundo');
    expect(input).toHaveValue('ab');
    expect(screen.getByRole('alert')).toHaveTextContent(ui.errorLine);
    fireEvent.change(input, { target: { value: '😊'.repeat(81) } });
    expect(screen.getByRole('alert')).toHaveTextContent('80');
    fireEvent.change(input, { target: { value: '😊'.repeat(80) } });
    await user.click(screen.getByRole('button', { name: ui.next }));
    expect(screen.getByRole('group')).toBeInTheDocument();
  });
  it('preserves the sentence when editing the purpose or obstacle and replaces only the suggested field', async () => {
    const copy = getPlanCopy('es');
    const user = await start();
    await user.click(
      screen.getByRole('button', { name: copy.ui.exampleButton }),
    );
    await user.click(screen.getByRole('button', { name: copy.ui.next }));
    await user.click(screen.getByRole('button', { name: copy.obstacles.time }));
    await user.click(screen.getByRole('button', { name: copy.ui.back }));
    await user.click(screen.getByRole('button', { name: copy.ui.back }));
    fireEvent.change(screen.getByLabelText(copy.ui.goalLabel), {
      target: { value: 'Un propósito diferente' },
    });
    await user.click(screen.getByRole('button', { name: copy.ui.next }));
    await user.click(
      screen.getByRole('button', { name: copy.obstacles.motivation }),
    );
    const situation = screen.getByLabelText(
      `${copy.ui.if} — ${copy.ui.situationLabel}`,
    );
    const action = screen.getByLabelText(
      `${copy.ui.then} — ${copy.ui.actionLabel}`,
    );
    expect(situation).toHaveValue(copy.example.situation);
    expect(action).toHaveValue(copy.example.action);
    await user.click(
      screen.getByRole('button', {
        name: copy.suggestions.situation.motivation[0],
      }),
    );
    expect(situation).toHaveValue(copy.suggestions.situation.motivation[0]);
    expect(action).toHaveValue(copy.example.action);
    await user.click(
      screen.getByRole('button', {
        name: copy.suggestions.action.motivation[0],
      }),
    );
    expect(situation).toHaveValue(copy.suggestions.situation.motivation[0]);
    expect(action).toHaveValue(copy.suggestions.action.motivation[0]);
    expect(screen.queryByText(copy.ui.exampleTag)).not.toBeInTheDocument();
  });
  it('handles custom obstacles and an optional empty schedule', async () => {
    const user = await start();
    const copy = getPlanCopy('es');
    await user.click(screen.getByRole('button', { name: copy.ui.start }));
    fireEvent.change(screen.getByLabelText(copy.ui.goalLabel), {
      target: { value: 'Leer más' },
    });
    await user.click(screen.getByRole('button', { name: copy.ui.next }));
    await user.click(
      screen.getByRole('button', { name: copy.obstacles.other }),
    );
    await user.click(screen.getByRole('button', { name: copy.ui.next }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(copy.ui.otherLabel), {
      target: { value: 'Mi horario' },
    });
    await user.click(screen.getByRole('button', { name: copy.ui.next }));
    fireEvent.change(
      screen.getByLabelText(`${copy.ui.if} — ${copy.ui.situationLabel}`),
      { target: { value: 'llego tarde' } },
    );
    fireEvent.change(
      screen.getByLabelText(`${copy.ui.then} — ${copy.ui.actionLabel}`),
      { target: { value: 'leo una página' } },
    );
    await user.click(screen.getByRole('button', { name: copy.ui.viewPlan }));
    await user.click(screen.getByRole('button', { name: copy.ui.addTime }));
    expect(screen.getByLabelText(copy.ui.timeQuestion)).toHaveFocus();
  });
  it('continues with an explicit warning when storage access is denied', async () => {
    vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(() => {
      throw new Error('Denied');
    });
    const user = await start();
    const copy = getPlanCopy('es');
    expect(screen.getByRole('status')).toHaveTextContent(copy.ui.memory);
    await user.click(
      screen.getByRole('button', { name: copy.ui.exampleButton }),
    );
    await user.click(screen.getByRole('button', { name: copy.ui.next }));
    await user.click(screen.getByRole('button', { name: copy.obstacles.time }));
    await user.click(screen.getByRole('button', { name: copy.ui.viewPlan }));
    await user.click(screen.getByRole('button', { name: copy.ui.reset }));
    expect(screen.getByRole('status')).toHaveTextContent(copy.ui.deleteFailed);
  });
});
