import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import PhraseChoices from '../PhraseChoices';

function Example({ initial = '' }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <PhraseChoices
        name="situation"
        label="Situación"
        values={['llego tarde', 'cambia mi rutina']}
        value={value}
        customLabel="Escribir la mía"
        onChange={setValue}
      >
        <label>
          Mi situación
          <input value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
      </PhraseChoices>
      <output>{value}</output>
    </>
  );
}
it('selects one real value with the keyboard and lets the person customize without losing it', async () => {
  const user = userEvent.setup();
  render(<Example />);
  await user.tab();
  await user.keyboard(' ');
  expect(screen.getByRole('radio', { name: 'llego tarde' })).toBeChecked();
  expect(screen.getByRole('status')).toHaveTextContent('llego tarde');
  await user.click(screen.getByRole('radio', { name: 'Escribir la mía' }));
  expect(screen.getByLabelText('Mi situación')).toHaveValue('llego tarde');
  await user.clear(screen.getByLabelText('Mi situación'));
  await user.type(screen.getByLabelText('Mi situación'), 'mi caso personal');
  expect(screen.getByRole('status')).toHaveTextContent('mi caso personal');
});
it('restores existing custom text and does not replace it until another option is explicitly selected', async () => {
  const user = userEvent.setup();
  render(<Example initial="situación recuperada" />);
  expect(screen.getByRole('radio', { name: 'Escribir la mía' })).toBeChecked();
  expect(screen.getByLabelText('Mi situación')).toHaveValue(
    'situación recuperada',
  );
  await user.click(screen.getByRole('radio', { name: 'cambia mi rutina' }));
  expect(screen.getByRole('status')).toHaveTextContent('cambia mi rutina');
  expect(screen.queryByLabelText('Mi situación')).not.toBeInTheDocument();
});
