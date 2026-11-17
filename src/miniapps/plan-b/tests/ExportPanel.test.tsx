import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import ExportPanel from '../ExportPanel';
import { getPlanCopy } from '../i18n/copy';
import { defaultDays } from '../domain/validation';
import { createDownloads } from '../browser/exports';

vi.mock('../browser/wallpaper', () => ({
  renderWallpaper: vi.fn(async () => new Blob(['png'], { type: 'image/png' })),
}));
const copy = getPlanCopy('es');
const plan = {
  ...copy.example,
  obstacle: 'time' as const,
  otherObstacle: '',
  time: '20:00',
  days: [...defaultDays],
};
let create: ReturnType<typeof vi.fn>;
let revoke: ReturnType<typeof vi.fn>;
beforeEach(() => {
  create = vi.fn(() => `blob:local-${create.mock.calls.length}`);
  revoke = vi.fn();
  vi.stubGlobal(
    'URL',
    Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke }),
  );
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
async function panel() {
  const view = render(<ExportPanel plan={plan} locale="es" copy={copy} />);
  await screen.findByAltText(copy.exports.imageReady);
  return view;
}
it('shares a prepared PNG from the click and treats cancellation without success or error', async () => {
  const share = vi.fn<(data: ShareData) => Promise<void>>(async () => {
    throw new DOMException('Cancelled', 'AbortError');
  });
  Object.defineProperties(navigator, {
    canShare: { configurable: true, value: () => true },
    share: { configurable: true, value: share },
  });
  await panel();
  fireEvent.click(screen.getByRole('button', { name: copy.exports.saveImage }));
  expect(share).toHaveBeenCalledOnce();
  const file = share.mock.calls[0][0].files![0];
  expect(file.name).toBe('plan-b.png');
  await waitFor(() =>
    expect(
      screen.getByRole('button', { name: copy.exports.saveImage }),
    ).toBeEnabled(),
  );
  expect(screen.queryByText(copy.exports.filePrepared)).not.toBeInTheDocument();
  expect(screen.queryByText(copy.exports.imageError)).not.toBeInTheDocument();
});
it('offers a selectable clean URL after share and clipboard failures', async () => {
  Object.defineProperties(navigator, {
    share: { configurable: true, value: undefined },
    clipboard: {
      configurable: true,
      value: {
        writeText: vi.fn(async () => {
          throw new Error('Denied');
        }),
      },
    },
  });
  await panel();
  fireEvent.click(screen.getByRole('button', { name: copy.exports.share }));
  expect(screen.getByText(copy.exports.shareError)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: copy.exports.copy }));
  const input = await screen.findByLabelText(copy.exports.linkLabel);
  expect(input).toHaveValue(`${window.location.origin}/es/apps/plan-b/`);
  expect(input).not.toHaveValue(expect.stringContaining(plan.purpose));
});
it('revokes the prepared preview and cancels download timers when unmounted', async () => {
  const view = await panel();
  expect(create).toHaveBeenCalledOnce();
  view.unmount();
  expect(revoke).toHaveBeenCalledWith(create.mock.results[0].value);
});
it('keeps a download URL alive long enough and then releases it, including failed clicks', () => {
  vi.useFakeTimers();
  const click = vi
    .spyOn(HTMLAnchorElement.prototype, 'click')
    .mockImplementation(() => {});
  const downloads = createDownloads();
  downloads.save(new Blob(['calendar']), 'plan-b.ics');
  expect(revoke).not.toHaveBeenCalled();
  vi.advanceTimersByTime(60_000);
  expect(revoke).toHaveBeenCalledOnce();
  click.mockImplementation(() => {
    throw new Error('Denied');
  });
  expect(() => downloads.save(new Blob(), 'plan-b.ics')).toThrow();
  expect(document.querySelector('a[download]')).toBeNull();
  expect(revoke).toHaveBeenCalledTimes(2);
  downloads.dispose();
  expect(vi.getTimerCount()).toBe(0);
});
