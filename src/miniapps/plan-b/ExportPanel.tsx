import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Locale } from '../../lib/locales';
import type { PlanInputs } from './domain/validation';
import type { PlanCopy } from './i18n/copy';
import { formatPlanText } from './i18n/calendar-copy';
import { renderWallpaper } from './browser/wallpaper';
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
        <button type="button" ref={cancel} onClick={onCancel}>
          {copy.cancel}
        </button>
        <button type="button" onClick={onConfirm}>
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
}: {
  plan: PlanInputs;
  locale: Locale;
  copy: PlanCopy;
  calendarEditor?: (actions: ReactNode) => ReactNode;
}) {
  const text = copy.exports;
  const [downloads] = useState(createDownloads);
  const [image, setImage] = useState<ImageState>('pending');
  const [attempt, setAttempt] = useState(0);
  const [consent, setConsent] = useState(false);
  const [notice, setNotice] = useState('');
  const [manual, setManual] = useState('');
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const active = useRef(false);
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

  function downloadCalendar() {
    try {
      downloads.save(calendarFile(plan, locale), `${filename}.ics`);
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
        openGoogleCalendar(plan, locale) ? text.googleOpened : text.popupError,
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
      if (active.current && !isShareCancellation(error))
        setNotice(text.imageError);
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
  const calendarActions = plan.time ? (
    <section aria-labelledby="pb-calendar-title">
      <h3 id="pb-calendar-title">{text.calendarTitle}</h3>
      <p>{text.duplicateWarning}</p>
      <div className="pb-actions">
        <button type="button" onClick={downloadCalendar}>
          {text.calendarDownload}
        </button>
        <button type="button" onClick={() => setConsent(true)}>
          {text.google}
        </button>
      </div>
    </section>
  ) : null;
  return (
    <div className="pb-exports" data-testid="plan-exports">
      {calendarEditor ? (
        <details className="pb-calendar-options">
          <summary>{copy.flow.calendarOptional}</summary>
          {calendarEditor(calendarActions)}
        </details>
      ) : (
        calendarActions
      )}
      <section aria-labelledby="pb-wallpaper-title">
        <h3 id="pb-wallpaper-title">{text.wallpaperTitle}</h3>
        <p>{text.imageNotice}</p>
        <p role="status">
          {image === 'pending'
            ? text.imagePreparing
            : image === 'error'
              ? text.imagePrepareError
              : text.imageReady}
        </p>
        {typeof image !== 'string' && (
          <>
            <img
              className="pb-wallpaper-preview"
              src={image.url}
              width={1179}
              height={2556}
              alt={text.imageReady}
            />
            <div className="pb-actions">
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  void saveImage();
                }}
              >
                {text.saveImage}
              </button>
              <a href={image.url} target="_blank" rel="noopener noreferrer">
                {text.openImage}
              </a>
            </div>
            <p className="pb-hint">{text.imageInstructions}</p>
          </>
        )}
        {image === 'error' && (
          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
          >
            {text.retryImage}
          </button>
        )}
      </section>
      <section aria-labelledby="pb-share-title">
        <h3 id="pb-share-title">{text.shareTitle}</h3>
        <div className="pb-actions">
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              void shareTool();
            }}
          >
            {text.share}
          </button>
          <button
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
      </section>
      <p role="status" aria-atomic="true">
        {notice}
      </p>
      <p className="pb-hint">{text.offlineNote}</p>
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
