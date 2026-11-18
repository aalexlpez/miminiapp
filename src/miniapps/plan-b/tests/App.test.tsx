import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { getPlanCopy } from '../i18n/copy';
import { sessionKey } from '../browser/session';
import { emptySession } from '../domain/session-state';
import { captureNarrativeDate } from '../domain/narrative-date';

beforeEach(() => {
  vi.restoreAllMocks();
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );
  window.sessionStorage.clear();
  window.localStorage.clear();
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
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
async function example(
  user: ReturnType<typeof userEvent.setup>,
  locale: 'es' | 'en' = 'es',
) {
  const copy = getPlanCopy(locale);
  await user.click(screen.getByRole('button', { name: copy.ui.exampleButton }));
  await user.click(screen.getByRole('button', { name: copy.flow.nextPurpose }));
  await user.click(screen.getByRole('button', { name: copy.obstacles.time }));
  await user.click(screen.getByRole('button', { name: copy.flow.nextOther }));
}
async function finish(
  user: ReturnType<typeof userEvent.setup>,
  locale: 'es' | 'en' = 'es',
) {
  const copy = getPlanCopy(locale);
  await user.click(
    screen.getByRole('button', { name: copy.flow.nextSituation }),
  );
  await user.click(screen.getByRole('button', { name: copy.ui.viewPlan }));
}
describe('guided plan journey', () => {
  it.each(['es', 'en'] as const)(
    'completes the %s example, edits without losing text and resets only its key',
    async (locale) => {
      window.localStorage.setItem('miminiapp.appearance', 'dark');
      window.sessionStorage.setItem('another', 'keep');
      const copy = getPlanCopy(locale),
        user = await start(locale);
      expect(screen.getByLabelText(copy.ui.goalLabel)).toHaveValue('');
      expect(window.sessionStorage.getItem(sessionKey)).toBeNull();
      await example(user, locale);
      expect(screen.getByText(copy.ui.exampleTag)).toBeInTheDocument();
      expect(
        screen.getByLabelText(`${copy.ui.if} — ${copy.ui.situationLabel}`),
      ).toHaveValue(copy.example.situation);
      expect(
        screen.queryByLabelText(`${copy.ui.then} — ${copy.ui.actionLabel}`),
      ).not.toBeInTheDocument();
      await finish(user, locale);
      expect(screen.getByTestId('plan-sentence')).toHaveTextContent(
        copy.example.action,
      );
      await user.click(
        screen.getByRole('button', { name: copy.exports.editPlan }),
      );
      expect(
        screen.getByLabelText(`${copy.ui.then} — ${copy.ui.actionLabel}`),
      ).toHaveValue(copy.example.action);
      await user.click(screen.getByRole('button', { name: copy.ui.viewPlan }));
      await user.click(screen.getByRole('button', { name: copy.ui.reset }));
      expect(window.sessionStorage.getItem(sessionKey)).toBeNull();
      expect(window.sessionStorage.getItem('another')).toBe('keep');
      expect(window.localStorage.getItem('miminiapp.appearance')).toBe('dark');
      expect(screen.queryByText(copy.ui.exampleTag)).not.toBeInTheDocument();
    },
  );
  it('enforces Unicode limits and rejects pasted line breaks without rewriting', async () => {
    const user = await start(),
      copy = getPlanCopy('es');
    const input = screen.getByLabelText(copy.ui.goalLabel);
    fireEvent.change(input, { target: { value: 'ab' } });
    await user.click(
      screen.getByRole('button', { name: copy.flow.nextPurpose }),
    );
    expect(screen.getByRole('alert')).toHaveTextContent('3');
    expect(input).toHaveFocus();
    await user.paste('hola\nmundo');
    expect(input).toHaveValue('ab');
    expect(screen.getByRole('alert')).toHaveTextContent(copy.ui.errorLine);
    fireEvent.change(input, { target: { value: '😊'.repeat(81) } });
    expect(screen.getByRole('alert')).toHaveTextContent('80');
    fireEvent.change(input, { target: { value: '😊'.repeat(80) } });
    await user.click(
      screen.getByRole('button', { name: copy.flow.nextPurpose }),
    );
    expect(
      screen.getByRole('group', { name: copy.flow.obstacleTitle }),
    ).toBeInTheDocument();
  });
  it('preserves both phrases through purpose/obstacle edits and changes only the suggested field', async () => {
    const user = await start(),
      copy = getPlanCopy('es');
    await example(user);
    await user.click(screen.getByRole('button', { name: copy.ui.back }));
    await user.click(screen.getByRole('button', { name: copy.ui.back }));
    fireEvent.change(screen.getByLabelText(copy.ui.goalLabel), {
      target: { value: 'Un propósito diferente' },
    });
    await user.click(
      screen.getByRole('button', { name: copy.flow.nextPurpose }),
    );
    await user.click(
      screen.getByRole('button', { name: copy.obstacles.motivation }),
    );
    await user.click(screen.getByRole('button', { name: copy.flow.nextOther }));
    expect(
      screen.getByLabelText(`${copy.ui.if} — ${copy.ui.situationLabel}`),
    ).toHaveValue(copy.example.situation);
    await user.click(
      screen.getByText(copy.flow.ideas, { selector: 'summary' }),
    );
    await user.click(
      screen.getByRole('button', {
        name: copy.suggestions.situation.motivation[0],
      }),
    );
    await user.click(
      screen.getByRole('button', { name: copy.flow.nextSituation }),
    );
    expect(
      screen.getByLabelText(`${copy.ui.then} — ${copy.ui.actionLabel}`),
    ).toHaveValue(copy.example.action);
    await user.click(
      screen.getByText(copy.flow.ideas, { selector: 'summary' }),
    );
    await user.click(
      screen.getByRole('button', {
        name: copy.suggestions.action.motivation[0],
      }),
    );
    expect(screen.queryByText(copy.ui.exampleTag)).not.toBeInTheDocument();
    const saved = JSON.parse(window.sessionStorage.getItem(sessionKey)!);
    expect(saved.inputs.situation).toBe(
      copy.suggestions.situation.motivation[0],
    );
    expect(saved.inputs.action).toBe(copy.suggestions.action.motivation[0]);
  });
  it('handles Other and keeps native schedule drafts out of saved results until preparation', async () => {
    const user = await start(),
      copy = getPlanCopy('es');
    fireEvent.change(screen.getByLabelText(copy.ui.goalLabel), {
      target: { value: 'Leer más' },
    });
    await user.click(
      screen.getByRole('button', { name: copy.flow.nextPurpose }),
    );
    await user.click(
      screen.getByRole('button', { name: copy.obstacles.other }),
    );
    await user.click(screen.getByRole('button', { name: copy.flow.nextOther }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(copy.ui.otherLabel), {
      target: { value: 'Mi horario' },
    });
    await user.click(screen.getByRole('button', { name: copy.flow.nextOther }));
    fireEvent.change(
      screen.getByLabelText(`${copy.ui.if} — ${copy.ui.situationLabel}`),
      { target: { value: 'llego tarde' } },
    );
    await user.click(
      screen.getByRole('button', { name: copy.flow.nextSituation }),
    );
    fireEvent.change(
      screen.getByLabelText(`${copy.ui.then} — ${copy.ui.actionLabel}`),
      { target: { value: 'leo una página' } },
    );
    await user.click(screen.getByRole('button', { name: copy.ui.viewPlan }));
    await user.click(
      screen.getByText(copy.flow.calendarOptional, { selector: 'summary' }),
    );
    const time = screen.getByLabelText(copy.ui.timeQuestion);
    fireEvent.change(time, { target: { value: '21:30' } });
    expect(
      JSON.parse(window.sessionStorage.getItem(sessionKey)!).inputs.time,
    ).toBe('');
    for (const name of ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'])
      await user.click(screen.getByRole('button', { name }));
    await user.click(
      screen.getByRole('button', { name: copy.flow.schedulePrepare }),
    );
    expect(screen.getByRole('alert')).toHaveTextContent(copy.ui.errorDays);
    expect(screen.getByRole('button', { name: 'lunes' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'lunes' }));
    await user.click(
      screen.getByRole('button', { name: copy.flow.schedulePrepare }),
    );
    expect(
      JSON.parse(window.sessionStorage.getItem(sessionKey)!).inputs,
    ).toMatchObject({ time: '21:30', days: ['MO'] });
    expect(
      screen.getByRole('button', { name: copy.exports.calendarDownload }),
    ).toBeVisible();
    fireEvent.change(time, { target: { value: '22:00' } });
    expect(
      screen.queryByRole('button', { name: copy.exports.calendarDownload }),
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: copy.flow.scheduleWithoutTime }),
    );
    expect(
      JSON.parse(window.sessionStorage.getItem(sessionKey)!).inputs.time,
    ).toBe('');
  });
  it('blocks native badInput even when the time value appears empty', async () => {
    const user = await start(),
      copy = getPlanCopy('es');
    await example(user);
    await finish(user);
    await user.click(
      screen.getByText(copy.flow.calendarOptional, { selector: 'summary' }),
    );
    const time = screen.getByLabelText(copy.ui.timeQuestion);
    fireEvent.change(time, { target: { value: '' } });
    Object.defineProperty(time, 'validity', {
      configurable: true,
      value: { badInput: true },
    });
    await user.click(
      screen.getByRole('button', { name: copy.flow.schedulePrepare }),
    );
    expect(screen.getByRole('alert')).toHaveTextContent(copy.ui.errorTime);
    expect(time).toHaveFocus();
    expect(
      JSON.parse(window.sessionStorage.getItem(sessionKey)!).inputs.time,
    ).toBe('20:00');
  });
  it('restores a legacy unfinished schedule without blocking or losing the main result', async () => {
    const copy = getPlanCopy('es');
    window.sessionStorage.setItem(
      sessionKey,
      JSON.stringify({
        ...emptySession(),
        step: 'plan',
        inputs: {
          ...copy.example,
          obstacle: 'time',
          otherObstacle: '',
          time: '20:00',
          days: [],
        },
        narrative: captureNarrativeDate(() => new Date(2026, 0, 31)),
      }),
    );
    const user = await start();
    expect(
      screen.getByLabelText(`${copy.ui.then} — ${copy.ui.actionLabel}`),
    ).toHaveValue(copy.example.action);
    await user.click(screen.getByRole('button', { name: copy.ui.viewPlan }));
    expect(screen.getByTestId('plan-sentence')).toHaveTextContent(
      copy.example.action,
    );
    await user.click(
      screen.getByText(copy.flow.calendarOptional, { selector: 'summary' }),
    );
    expect(screen.getByLabelText(copy.ui.timeQuestion)).toHaveValue('20:00');
    expect(
      JSON.parse(window.sessionStorage.getItem(sessionKey)!).inputs.time,
    ).toBe('20:00');
  });
  it('continues in memory with a truthful failed-reset warning when access is denied', async () => {
    vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(() => {
      throw new Error('Denied');
    });
    const user = await start(),
      copy = getPlanCopy('es');
    expect(screen.getByRole('status')).toHaveTextContent(copy.ui.memory);
    await example(user);
    await finish(user);
    await user.click(screen.getByRole('button', { name: copy.ui.reset }));
    expect(
      within(screen.getByTestId('plan-b-app')).getByRole('status'),
    ).toHaveTextContent(copy.ui.deleteFailed);
  });
});

it.each(['es', 'en'] as const)(
  'identifies whitespace-only preview clauses as an example in %s without rewriting the draft',
  async (locale) => {
    const copy = getPlanCopy(locale),
      user = await start(locale);
    fireEvent.change(screen.getByLabelText(copy.ui.goalLabel), {
      target: { value: 'Leer más' },
    });
    await user.click(
      screen.getByRole('button', { name: copy.flow.nextPurpose }),
    );
    await user.click(screen.getByRole('button', { name: copy.obstacles.time }));
    await user.click(screen.getByRole('button', { name: copy.flow.nextOther }));
    fireEvent.change(
      screen.getByLabelText(`${copy.ui.if} — ${copy.ui.situationLabel}`),
      { target: { value: '   ' } },
    );
    expect(
      screen.getByRole('complementary', { name: copy.flow.previewExample }),
    ).toBeVisible();
    expect(
      JSON.parse(window.sessionStorage.getItem(sessionKey)!).inputs.situation,
    ).toBe('   ');
  },
);

it.each(['es', 'en'] as const)(
  'shows only the prepared schedule summary in %s, including weekdays, all days and an individual day',
  async (locale) => {
    const copy = getPlanCopy(locale),
      user = await start(locale);
    await example(user, locale);
    await finish(user, locale);
    await user.click(
      screen.getByText(copy.flow.calendarOptional, { selector: 'summary' }),
    );
    expect(screen.getByText(copy.flow.calendarHint)).toBeVisible();
    const summary = () => document.getElementById('pb-calendar-summary');
    expect(summary()).toHaveTextContent(copy.ui.workingDays);
    expect(summary()).toHaveTextContent(
      locale === 'es' ? '20:00, durante 4 semanas' : '8:00 PM, for 4 weeks',
    );
    const time = screen.getByLabelText(copy.ui.timeQuestion);
    fireEvent.change(time, { target: { value: '21:30' } });
    expect(summary()).toBeNull();
    await user.click(
      screen.getByRole('button', { name: copy.flow.schedulePrepare }),
    );
    expect(summary()).toHaveTextContent(locale === 'es' ? '21:30' : '9:30 PM');
    for (const name of locale === 'es'
      ? ['sábado', 'domingo']
      : ['Saturday', 'Sunday'])
      await user.click(screen.getByRole('button', { name }));
    await user.click(
      screen.getByRole('button', { name: copy.flow.schedulePrepare }),
    );
    expect(summary()).toHaveTextContent(copy.ui.allDays);
    for (const name of locale === 'es'
      ? ['martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
      : ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
      await user.click(screen.getByRole('button', { name }));
    await user.click(
      screen.getByRole('button', { name: copy.flow.schedulePrepare }),
    );
    expect(summary()).toHaveTextContent(locale === 'es' ? 'lun' : 'Mon');
    expect(summary()).not.toHaveTextContent(copy.ui.allDays);
  },
);
