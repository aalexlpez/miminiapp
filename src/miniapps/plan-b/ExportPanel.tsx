import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Locale } from '../../lib/locales';
import { defaultDays, weekdays, type PlanInputs } from './domain/validation';
import type { PlanCopy } from './i18n/copy';
import { formatPlanText } from './i18n/calendar-copy';
import { fill } from './i18n/fill';
import { renderWallpaper } from './browser/wallpaper';
import { Arrow } from './PlanPreview';
import BrandMark from './BrandMark';
import {
  calendarFile,
  cleanToolUrl,
  createDownloads,
  isShareCancellation,
  openGoogleCalendar,
} from './browser/exports';

function GoogleConsent({
  copy,
  onCancel,
  onConfirm,
}: {
  copy: PlanCopy['exports'];
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement;
    const element = dialog.current!;
    element.showModal();
    cancel.current?.focus();
    return () => {
      element.close();
      if (previous instanceof HTMLElement && previous.isConnected)
        previous.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="pb-dialog"
      aria-labelledby="pb-google-title"
      aria-describedby="pb-google-warning"
      onCancel={onCancel}
    >
      <h3 id="pb-google-title">{copy.google}</h3>
      <p id="pb-google-warning">{copy.googleWarning}</p>
      <div className="pb-actions">
        <button data-pb-export type="button" ref={cancel} onClick={onCancel}>
          {copy.cancel}
        </button>
        <button data-pb-export type="button" onClick={onConfirm}>
          {copy.continue}
        </button>
      </div>
    </dialog>
  );
}

type ImageState = { url: string; file: File } | 'pending' | 'error';
export default function ExportPanel({
  plan,
  locale,
  copy,
  calendarEditor,
  heading,
  onEdit,
}: {
  plan: PlanInputs;
  locale: Locale;
  copy: PlanCopy;
  calendarEditor?: (
    onExport: (input: PlanInputs, kind: 'ics' | 'google') => void,
  ) => ReactNode;
  heading?: ReactNode;
  onEdit?: () => void;
}) {
  const text = copy.exports;
  const [downloads] = useState(createDownloads);
  const [image, setImage] = useState<ImageState>('pending');
  const [attempt, setAttempt] = useState(0);
  const [consent, setConsent] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const pendingGoogle = useRef(plan);
  const [notice, setNotice] = useState('');
  const [manual, setManual] = useState('');
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const active = useRef(false);
  const imageOptions = useRef<HTMLDetailsElement>(null);
  const sentence = formatPlanText(plan, locale).description.split('\n', 1)[0];
  const filename = locale === 'es' ? 'plan-b' : 'bad-day-plan';
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      downloads.dispose();
    };
  }, [downloads]);
  useEffect(() => {
    let mounted = true;
    let sequence = 0;
    let owned: string | undefined;
    async function prepare() {
      const current = ++sequence;
      await Promise.resolve();
      if (!mounted || current !== sequence) return;
      setImage('pending');
      if (owned) {
        URL.revokeObjectURL(owned);
        owned = undefined;
      }
      try {
        const blob = await renderWallpaper(sentence, text.imageLabel);
        if (!mounted || current !== sequence) return;
        owned = URL.createObjectURL(blob);
        setImage({
          url: owned,
          file: new File([blob], `${filename}.png`, { type: 'image/png' }),
        });
      } catch {
        if (mounted && current === sequence) setImage('error');
      }
    }
    void prepare();
    const observer = new MutationObserver(() => {
      void prepare();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const changed = () => {
      void prepare();
    };
    media.addEventListener('change', changed);
    return () => {
      mounted = false;
      sequence++;
      observer.disconnect();
      media.removeEventListener('change', changed);
      if (owned) URL.revokeObjectURL(owned);
    };
  }, [sentence, text.imageLabel, filename, attempt]);

  function downloadCalendar(candidate: PlanInputs = plan) {
    try {
      downloads.save(calendarFile(candidate, locale), `${filename}.ics`);
      setNotice(text.filePrepared);
    } catch {
      setNotice(text.exportError);
    }
  }
  function confirmGoogle() {
    setConsent(false);
    if (!navigator.onLine) {
      setNotice(text.offline);
      return;
    }
    try {
      setNotice(
        openGoogleCalendar(pendingGoogle.current, locale)
          ? text.googleOpened
          : text.popupError,
      );
    } catch {
      setNotice(text.exportError);
    }
  }
  async function saveImage() {
    if (typeof image === 'string' || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setNotice('');
    try {
      let supported = false;
      try {
        supported =
          !!navigator.share && !!navigator.canShare?.({ files: [image.file] });
      } catch {
        /* Download remains available. */
      }
      if (supported) await navigator.share({ files: [image.file] });
      else downloads.save(image.file, image.file.name);
      if (active.current) setNotice(text.filePrepared);
    } catch (error) {
      if (active.current && !isShareCancellation(error)) {
        setNotice(text.imageError);
        if (imageOptions.current) imageOptions.current.open = true;
      }
    } finally {
      inFlight.current = false;
      if (active.current) setBusy(false);
    }
  }
  async function shareTool() {
    if (inFlight.current) return;
    if (!navigator.share) {
      setNotice(text.shareError);
      return;
    }
    inFlight.current = true;
    setBusy(true);
    setNotice('');
    try {
      await navigator.share({
        text: text.shareText,
        url: cleanToolUrl(locale),
      });
      if (active.current) setNotice(text.shared);
    } catch (error) {
      if (active.current && !isShareCancellation(error))
        setNotice(text.shareError);
    } finally {
      inFlight.current = false;
      if (active.current) setBusy(false);
    }
  }
  function downloadImage() {
    if (typeof image === 'string') return;
    try {
      downloads.save(image.file, image.file.name);
      setNotice(text.filePrepared);
    } catch {
      setNotice(text.imageError);
    }
  }
  async function copyLink() {
    const url = cleanToolUrl(locale);
    setNotice('');
    try {
      await navigator.clipboard.writeText(url);
      if (active.current) {
        setNotice(text.copied);
        setManual('');
      }
    } catch {
      if (active.current) {
        setNotice(text.manualCopy);
        setManual(url);
      }
    }
  }
  function scheduleSummary() {
    const days =
      plan.days.length === 7
        ? copy.ui.allDays
        : plan.days.length === 5 &&
            defaultDays.every((day) => plan.days.includes(day))
          ? copy.ui.workingDays
          : plan.days
              .map((day) =>
                new Intl.DateTimeFormat(locale, {
                  weekday: 'short',
                  timeZone: 'UTC',
                }).format(
                  new Date(Date.UTC(2026, 10, 16 + weekdays.indexOf(day))),
                ),
              )
              .join(', ');
    const [hour, minute] = plan.time.split(':').map(Number);
    const time = new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(2026, 0, 1, hour, minute)));
    return fill(copy.ui.calendarSummary, { days, time });
  }
  const calendarActions = plan.time ? (
    <section aria-labelledby="pb-calendar-title">
      <h3 id="pb-calendar-title">{text.calendarTitle}</h3>
      <p id="pb-calendar-summary">{scheduleSummary()}</p>
      <p>{text.duplicateWarning}</p>
      <div className="pb-actions">
        <button data-pb-export type="button" onClick={() => downloadCalendar()}>
          {text.calendarDownload}
        </button>
        <button
          data-pb-export
          type="button"
          onClick={() => {
            pendingGoogle.current = plan;
            setConsent(true);
          }}
        >
          {text.google}
        </button>
      </div>
    </section>
  ) : null;
  return (
    <div
      className="pb-exports"
      data-testid="plan-exports"
      onClickCapture={(event) => {
        if (
          event.detail > 1 &&
          event.target instanceof Element &&
          event.target.closest('[data-pb-export]')
        ) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
      onKeyDownCapture={(event) => {
        if (
          event.key === 'Enter' &&
          event.repeat &&
          event.target instanceof Element &&
          event.target.closest('[data-pb-export]')
        )
          event.preventDefault();
      }}
    >
      <div className="pb-result-layout">
        <div className="pb-result-content">
          {heading}
          <p className="pb-result" data-testid="plan-sentence" dir="auto">
            {sentence}
          </p>
          <p className="pb-goal" dir="auto">
            {copy.ui.goalLabel}: {plan.purpose}
          </p>
          <div className="pb-actions pb-save-actions">
            <button
              data-pb-export
              type="button"
              className="pb-primary"
              disabled={busy || typeof image === 'string'}
              aria-busy={busy || image === 'pending'}
              onClick={downloadImage}
            >
              {text.saveImage}
              <Arrow />
            </button>
            {calendarEditor && (
              <button
                type="button"
                className="pb-reminder-button"
                aria-expanded={calendarOpen}
                aria-controls="pb-reminder-editor"
                onClick={() => setCalendarOpen(!calendarOpen)}
              >
                {copy.flow.calendarOptional}
              </button>
            )}
            {onEdit && (
              <button
                data-pb-export
                type="button"
                className="pb-secondary"
                data-pb-navigation
                onClick={onEdit}
              >
                {text.editPlan}
              </button>
            )}
          </div>
          <p role="status" aria-atomic="true" className="pb-image-status">
            {image === 'pending'
              ? text.imagePreparing
              : image === 'error'
                ? text.imagePrepareError
                : ''}
          </p>
          {image === 'error' && (
            <button
              data-pb-export
              type="button"
              onClick={() => setAttempt((value) => value + 1)}
            >
              {text.retryImage}
            </button>
          )}
          {typeof image !== 'string' && (
            <details className="pb-image-options" ref={imageOptions}>
              <summary>{text.imageOptions}</summary>
              <p className="pb-hint">{text.imageNotice}</p>
              <div className="pb-actions">
                <button
                  data-pb-export
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    void saveImage();
                  }}
                >
                  {text.shareImage}
                </button>
                <button
                  data-pb-export
                  type="button"
                  disabled={busy}
                  onClick={downloadImage}
                >
                  {text.downloadImage}
                </button>
                <a
                  data-pb-export
                  href={image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {text.openImage}
                </a>
              </div>
              <p className="pb-hint">{text.imageInstructions}</p>
              <p className="pb-hint">{text.offlineNote}</p>
            </details>
          )}
          <div className="pb-result-options">
            {calendarEditor ? (
              <section
                id="pb-reminder-editor"
                className="pb-calendar-options pb-reveal"
                hidden={!calendarOpen}
                aria-label={copy.flow.calendarOptional}
              >
                <h3>{copy.flow.calendarOptional}</h3>
                {calendarEditor((input, kind) => {
                  if (kind === 'ics') downloadCalendar(input);
                  else {
                    pendingGoogle.current = input;
                    setConsent(true);
                  }
                })}
              </section>
            ) : (
              calendarActions
            )}
            <details className="pb-share-options">
              <summary>{text.shareTitle}</summary>
              <p className="pb-hint">{text.shareHelp}</p>
              <div className="pb-actions">
                <button
                  data-pb-export
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    void shareTool();
                  }}
                >
                  {text.share}
                </button>
                <button
                  data-pb-export
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    void copyLink();
                  }}
                >
                  {text.copy}
                </button>
              </div>
              {manual && (
                <div className="pb-field">
                  <label htmlFor="pb-tool-link">{text.linkLabel}</label>
                  <input
                    id="pb-tool-link"
                    readOnly
                    dir="ltr"
                    value={manual}
                    onFocus={(event) => event.currentTarget.select()}
                  />
                </div>
              )}
            </details>
          </div>
          <p role="status" aria-atomic="true">
            {notice}
          </p>
        </div>
        <aside
          className="pb-preview pb-result-preview"
          aria-labelledby="pb-wallpaper-title"
        >
          <div className="pb-preview-caption">
            <h3 id="pb-wallpaper-title">{text.wallpaperTitle}</h3>
            <BrandMark />
          </div>
          {typeof image !== 'string' ? (
            <img
              className="pb-wallpaper-preview"
              src={image.url}
              width={1179}
              height={2556}
              alt={text.imageReady}
            />
          ) : (
            <div className="pb-image-placeholder" aria-hidden="true" />
          )}
          <p className="pb-preview-footer">{text.imageDimensions}</p>
        </aside>
      </div>
      {consent && (
        <GoogleConsent
          copy={text}
          onCancel={() => setConsent(false)}
          onConfirm={confirmGoogle}
        />
      )}
    </div>
  );
}
