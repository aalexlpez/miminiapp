// FE-01/I3 design prototype. No product imports, persistence, analytics or remote calls.
const $ = (selector) => document.querySelector(selector);
const assets = {
  light: '../../../../public/brand/wordmark-compact.svg',
  dark: '../../../../public/brand/wordmark-compact-dark.svg',
};
const esc = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ],
  );
const arrow =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const dictionaries = {
  es: {
    name: 'Plan B',
    description: 'Un plan para seguir, incluso en un mal día.',
    steps: ['Tu propósito', 'El obstáculo', 'La señal', 'Tu respuesta'],
    questions: [
      '¿Qué quieres lograr?',
      '¿Qué podría ponértelo difícil?',
      '¿Cuándo aparece ese obstáculo?',
      '¿Qué harás en ese momento?',
    ],
    hints: [
      'Elige algo que te importe. El plan B te ayudará cuando ese propósito se complique.',
      'Imagina que es 1 de {month} y lo has dejado. ¿Qué ha pasado? Al elegir, avanzarás.',
      'Una situación concreta que puedas reconocer. Esa será tu señal para actuar.',
      'Algo pequeño y posible, incluso en un mal día. Cinco minutos pueden bastar.',
    ],
    labels: ['Tu propósito', 'Otro obstáculo', 'Si…', 'Entonces…'],
    placeholders: [
      'Por ejemplo: leer más',
      'Cuéntalo en pocas palabras',
      'llego tarde a casa',
      'leo dos páginas antes de dormir',
    ],
    next: [
      'Elegir mi obstáculo',
      'Reconocer la señal',
      'Elegir mi respuesta',
      'Ver mi plan',
    ],
    back: 'Atrás',
    ideas: '¿Necesitas una idea?',
    example: 'Ver un ejemplo',
    exampleTag: 'Ejemplo',
    purposes: [
      'Hacer ejercicio',
      'Leer más',
      'Ahorrar',
      'Aprender un idioma',
      'Dormir mejor',
      'Usar menos el móvil',
    ],
    obstacles: [
      'No tuve tiempo',
      'Perdí las ganas',
      'Algo se cruzó',
      'Era demasiado',
      'Se me olvidó',
      'Otra cosa',
    ],
    situations: [
      ['llego tarde a casa', 'tengo el día lleno de reuniones'],
      ['no me apetece nada', 'llego sin energía'],
      ['surge un imprevisto', 'cambian mis planes'],
      ['me parece demasiado', 'llevo varios días sin hacerlo'],
      ['llega la hora y no me he acordado', 'salgo de mi rutina'],
      [],
    ],
    actions: [
      ['hago una versión de 5 minutos', 'lo hago nada más levantarme'],
      [
        'empiezo solo 2 minutos y luego decido',
        'preparo lo que necesito y empiezo por lo más fácil',
      ],
      ['lo muevo a la mañana siguiente', 'hago la mitad ese día'],
      ['hago la versión mínima', 'vuelvo con la mitad del objetivo'],
      [
        'lo hago en cuanto vea el recordatorio',
        'lo uno a algo que ya hago, como el café',
      ],
      ['hago una versión de 5 minutos', 'lo muevo al día siguiente'],
    ],
    exampleData: [
      'Hacer ejercicio 3 veces por semana',
      'llego a casa después de las 20:00',
      'hago 5 minutos de estiramientos antes de sentarme en el sofá',
    ],
    if: 'Si',
    then: 'entonces',
    preview: 'Tu plan va tomando forma',
    examplePreview: 'Así puede quedar · ejemplo',
    ghostGoal: 'Un propósito. Una segunda oportunidad.',
    ghostSituation: 'el día se complica',
    ghostAction: 'hago una versión pequeña de mi propósito',
    previewNote: 'Una señal concreta + una respuesta posible.',
    previewFooter:
      'No necesitas un día perfecto. Necesitas saber qué hacer cuando no lo sea.',
    privateShort: 'Sin cuenta. Solo en este navegador.',
    how: 'Cómo funciona',
    privateFull:
      'Dinos tu propósito, reconoce el obstáculo y elige una respuesta pequeña. Tu plan aparece al terminar. En la app, se guardará temporalmente en esta pestaña si el navegador lo permite. Google o el destino de compartir una imagen recibirán el plan solo si tú lo eliges. Este prototipo no guarda progreso.',
    required: 'Escribe al menos 3 caracteres para continuar.',
    long: 'Este campo admite un máximo de {max} caracteres. Acorta tu frase; no la recortaremos.',
    line: 'Usa una sola frase, sin saltos de línea.',
    count: 'caracteres',
    resultTitle: 'Ya tienes una forma de seguir.',
    resultHint: 'Guárdala donde puedas verla en un día difícil.',
    resultGoal: 'Tu propósito:',
    ready: 'Tu plan está listo',
    save: 'Guardar mi plan',
    edit: 'Editar mi plan',
    previewPng: 'Tu fondo de pantalla',
    pngNote: 'PNG · 1179 × 2556 · imagen estática',
    calendar: 'Añadir un recordatorio (opcional)',
    calendarHint:
      'La app preparará una serie de cuatro semanas. Tú decides guardarla; los avisos dependen de tu calendario.',
    time: 'Hora local',
    days: 'Días',
    dayUnit: 'día',
    daysUnit: 'días',
    withoutTime: 'Continuar sin recordatorio',
    withoutTimeNotice:
      'Sin recordatorio. Tu plan y tu imagen siguen disponibles.',
    calendarFile: 'Ver resumen del calendario',
    google: 'Google Calendar',
    noTime: 'Añade una hora para preparar el recordatorio.',
    noDays: 'Elige al menos un día.',
    summary:
      'Vista previa de la propuesta: {days} {unit} por semana, a las {time}, durante cuatro semanas. Aquí no se genera un evento.',
    share: 'Compartir la herramienta',
    shareHelp:
      'Se compartirá un enlace limpio de Plan B, sin tu frase ni tu horario.',
    shareAction: 'Ver qué se compartirá',
    shareNotice:
      'La app compartirá /es/apps/plan-b/. Este prototipo no copia ni envía enlaces.',
    restart: 'Empezar otra vez',
    downloaded: 'PNG preparado. Comprueba la descarga de tu navegador.',
    imageError:
      'No se pudo preparar la imagen. Tu plan sigue aquí; vuelve a intentarlo.',
    imagePreparing: 'Preparando tu imagen…',
    imagePrivacy:
      'La imagen contiene tu plan. Si la envías a otra app, esa app lo recibirá.',
    consentTitle: 'Antes de abrir Google',
    consent:
      'Tu frase, propósito, hora y días se enviarán a Google para preparar el evento. Tendrás que guardarlo allí. Cancelar no envía nada.',
    cancel: 'Cancelar',
    confirm: 'Continuar',
    googleNotice:
      'Propuesta: aquí se abrirá Google Calendar tras tu confirmación. El prototipo no abre ni envía nada.',
    theme: 'Cambiar tema',
    footer: 'Hecho para explorar',
    review: 'Propuesta I3 · recorrido y diseño por aprobar · sin guardar datos',
    tools: 'Controles de revisión del prototipo',
    max: 'Textos máximos',
    reset: 'Reiniciar prototipo',
    limits:
      'PNG real. Calendario y compartir muestran estados de propuesta; no abren servicios. Sin persistencia de sesión.',
  },
  en: {
    name: 'Bad Day Plan',
    description: 'A way to keep going, even on a bad day.',
    steps: ['Your goal', 'The obstacle', 'The cue', 'Your response'],
    questions: [
      'What do you want to achieve?',
      'What could get in your way?',
      'When does that obstacle show up?',
      'What will you do in that moment?',
    ],
    hints: [
      'Pick something that matters to you. Your bad day plan will help when that goal gets difficult.',
      "Imagine it's {month} 1 and you've stopped. What happened? Choosing an obstacle opens the next step.",
      'A specific situation you can recognise. This will be your cue to act.',
      'Something small and possible, even on a bad day. Five minutes can be enough.',
    ],
    labels: ['Your goal', 'Another obstacle', 'If…', 'Then…'],
    placeholders: [
      'For example: read more',
      'Say it in a few words',
      'I get home late',
      'I read two pages before bed',
    ],
    next: [
      'Choose obstacle',
      'Recognise the cue',
      'Choose response',
      'See my plan',
    ],
    back: 'Back',
    ideas: 'Need an idea?',
    example: 'See an example',
    exampleTag: 'Example',
    purposes: [
      'Exercise more',
      'Read more',
      'Save money',
      'Learn a language',
      'Sleep better',
      'Use my phone less',
    ],
    obstacles: [
      'I ran out of time',
      'I lost motivation',
      'Something came up',
      'It was too much',
      'I forgot',
      'Something else',
    ],
    situations: [
      ['I get home late', 'my day is full of meetings'],
      ["I don't feel like it at all", 'I have no energy left'],
      ['something unexpected happens', 'my plans change'],
      ['it feels like too much', "I've skipped a few days"],
      ["the time comes and I haven't remembered", 'my routine changes'],
      [],
    ],
    actions: [
      ['I do a 5-minute version', 'I do it right after I wake up'],
      [
        'I start with just 2 minutes and then decide',
        'I get things ready and start with the easiest part',
      ],
      ['I move it to the next morning', 'I do half of it that day'],
      ['I do the smallest version', 'I come back with half the goal'],
      [
        'I do it as soon as I see the reminder',
        'I attach it to something I already do, like coffee',
      ],
      ['I do a 5-minute version', 'I move it to the next day'],
    ],
    exampleData: [
      'Exercise 3 times a week',
      'I get home after 8 p.m.',
      'I do 5 minutes of stretching before I sit on the couch',
    ],
    if: 'If',
    then: 'then',
    preview: 'Your plan is taking shape',
    examplePreview: 'What it could look like · example',
    ghostGoal: 'One goal. Another way forward.',
    ghostSituation: 'the day gets difficult',
    ghostAction: 'I do a small version of my goal',
    previewNote: 'A specific cue + a possible response.',
    previewFooter:
      "You don't need a perfect day. You need to know what to do when it isn't.",
    privateShort: 'No account. Only in this browser.',
    how: 'How it works',
    privateFull:
      'Tell us your goal, recognise the obstacle, and choose a small response. Your plan appears at the end. In the app, progress will be saved temporarily in this tab when the browser allows it. Google or an image-sharing destination will receive your plan only when you choose. This prototype does not save progress.',
    required: 'Write at least 3 characters to continue.',
    long: 'This field allows up to {max} characters. Shorten your sentence; we will not cut it off.',
    line: 'Use one sentence, without line breaks.',
    count: 'characters',
    resultTitle: 'You have a way to keep going.',
    resultHint: 'Save it somewhere you can see on a difficult day.',
    resultGoal: 'Your goal:',
    ready: 'Your plan is ready',
    save: 'Save my plan',
    edit: 'Edit my plan',
    previewPng: 'Your wallpaper',
    pngNote: 'PNG · 1179 × 2556 · static image',
    calendar: 'Add a reminder (optional)',
    calendarHint:
      'The app will prepare a four-week series. You choose to save it; alerts depend on your calendar settings.',
    time: 'Local time',
    days: 'Days',
    dayUnit: 'day',
    daysUnit: 'days',
    withoutTime: 'Continue without a reminder',
    withoutTimeNotice: 'No reminder. Your plan and image are still available.',
    calendarFile: 'Preview calendar summary',
    google: 'Google Calendar',
    noTime: 'Add a time to prepare the reminder.',
    noDays: 'Choose at least one day.',
    summary:
      'Proposal preview: {days} {unit} a week, at {time}, for four weeks. No event is generated here.',
    share: 'Share the tool',
    shareHelp:
      'A clean Bad Day Plan link will be shared, without your sentence or schedule.',
    shareAction: 'Preview what will be shared',
    shareNotice:
      'The app will share /en/apps/plan-b/. This prototype does not copy or send links.',
    restart: 'Start again',
    downloaded: 'PNG prepared. Check your browser download.',
    imageError:
      'The image could not be prepared. Your plan is still here; try again.',
    imagePreparing: 'Preparing your image…',
    imagePrivacy:
      'The image contains your plan. If you send it to another app, that app will receive it.',
    consentTitle: 'Before opening Google',
    consent:
      'Your sentence, goal, time, and days will be sent to Google to prepare the event. You will still need to save it there. Cancel sends nothing.',
    cancel: 'Cancel',
    confirm: 'Continue',
    googleNotice:
      'Proposal: Google Calendar would open after your confirmation. This prototype opens and sends nothing.',
    theme: 'Change theme',
    footer: 'Made for exploring',
    review: 'I3 proposal · flow and design awaiting approval · no saved data',
    tools: 'Prototype review controls',
    max: 'Maximum-length text',
    reset: 'Reset prototype',
    limits:
      'Real PNG. Calendar and sharing show proposal states; no services open. No session persistence.',
  },
};
let locale = 'es',
  step = 0,
  error = '',
  started = null,
  example = false;
let data = {
  purpose: '',
  obstacle: -1,
  other: '',
  situation: '',
  action: '',
  time: '',
  days: [0, 1, 2, 3, 4],
};
let wallpaper = null,
  imageEpoch = 0;
const copy = () => dictionaries[locale];
const fields = ['purpose', 'other', 'situation', 'action'];
const limits = { purpose: 80, other: 60, situation: 90, action: 90 };
const begin = () => {
  started ??= new Date();
};
const sentence = () =>
  `${copy().if} ${data.situation.trim()}, ${copy().then} ${data.action.trim()}.`;
function invalid(field, value) {
  const c = copy(),
    length = [...value.trim()].length;
  if (/[\r\n\u2028\u2029]/u.test(value)) return c.line;
  if (length < 3) return c.required;
  if (length > limits[field]) return c.long.replace('{max}', limits[field]);
  return '';
}
function paintPreview() {
  if (step === 4) return;
  const c = copy();
  $('#preview-title').textContent =
    data.situation || data.action ? c.preview : c.examplePreview;
  $('#preview-goal').textContent = data.purpose.trim() || c.ghostGoal;
  $('#preview-sentence').innerHTML =
    `<span class="connector">${c.if}</span> <span class="${data.situation ? '' : 'ghost'}">${esc(data.situation.trim() || c.ghostSituation)}</span>, <span class="connector">${c.then}</span> <span class="${data.action ? '' : 'ghost'}">${esc(data.action.trim() || c.ghostAction)}</span>.`;
  $('#preview-note').textContent = c.previewNote;
}
function fieldMarkup(field, label) {
  const c = copy(),
    max = limits[field],
    index = fields.indexOf(field);
  const control =
    field === 'purpose' || field === 'other'
      ? `<input id="answer" name="${field}" type="text" value="${esc(data[field])}" autocomplete="off" placeholder="${esc(c.placeholders[index])}" aria-describedby="field-help field-error" aria-invalid="${!!error}">`
      : `<textarea id="answer" name="${field}" rows="2" autocomplete="off" dir="auto" placeholder="${esc(c.placeholders[index])}" aria-describedby="field-help field-error" aria-invalid="${!!error}">${esc(data[field])}</textarea>`;
  return `<label class="field-label" for="answer">${label}</label><div class="input-wrap">${control}</div><div class="field-meta"><span id="field-help">${field === 'purpose' ? '3–80' : field === 'other' ? '3–60' : '3–90'} ${c.count}</span><span id="count">${[...data[field].trim()].length} / ${max}</span></div><p class="error" id="field-error" role="alert">${esc(error)}</p>`;
}
function ideasMarkup() {
  const c = copy(),
    values =
      step === 0
        ? c.purposes
        : step === 2
          ? c.situations[data.obstacle]
          : c.actions[data.obstacle];
  if (!values?.length) return '';
  return `<details class="suggestions"><summary>${c.ideas}</summary><div class="suggestion-list">${values.map((value) => `<button type="button" data-suggest="${esc(value)}">${esc(value)}</button>`).join('')}</div></details>`;
}
function previewMarkup() {
  return `<div class="preview-caption"><span id="preview-title"></span><span class="paper-mark" aria-hidden="true">B</span></div><div class="paper"><p class="paper-goal" id="preview-goal"></p><p class="paper-sentence" id="preview-sentence"></p><svg class="continuity" viewBox="0 0 320 40" aria-hidden="true"><path d="M4 23H110Q136 23 145 10Q155-2 167 12Q176 25 200 25H315" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg><p class="paper-note" id="preview-note"></p></div><p class="preview-footer" id="preview-footer">${copy().previewFooter}</p>`;
}
function render(focus = true) {
  const c = copy(),
    monthDate = new Date(started ?? new Date());
  monthDate.setDate(1);
  monthDate.setMonth(monthDate.getMonth() + 1);
  const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(
    monthDate,
  );
  document.documentElement.lang = locale;
  $('#app-name').textContent = c.name;
  $('#app-description').textContent = c.description;
  $('#review-label').textContent = c.review;
  $('#review-tools-label').textContent = c.tools;
  $('#review-limits').textContent = c.limits;
  $('#example').textContent = c.example;
  $('#maximum').textContent = c.max;
  $('#empty').textContent = c.reset;
  $('#footer-copy').textContent = c.footer;
  $('#locale').textContent = locale === 'es' ? 'EN' : 'ES';
  $('#locale').setAttribute(
    'aria-label',
    locale === 'es'
      ? 'EN · Change language to English'
      : 'ES · Cambiar idioma a español',
  );
  $('#theme').setAttribute('aria-label', c.theme);
  $('.skip').textContent =
    locale === 'es' ? 'Saltar a la pregunta' : 'Skip to the question';
  $('#privacy-short').textContent = c.privateShort;
  $('#privacy-label').textContent = c.how;
  $('#privacy-full').textContent = c.privateFull;
  $('#step-number').textContent =
    step === 4 ? c.ready : `${step + 1} ${locale === 'es' ? 'de' : 'of'} 4`;
  $('#step-name').textContent = step === 4 ? '' : c.steps[step];
  $('.progress-track').setAttribute(
    'aria-label',
    locale === 'es' ? 'Progreso' : 'Progress',
  );
  [...$('.progress-track').children].forEach((el, i) => {
    el.className = i < step ? 'done' : i === step ? 'current' : '';
    el.setAttribute('aria-label', c.steps[i]);
    if (i === step) el.setAttribute('aria-current', 'step');
    else el.removeAttribute('aria-current');
  });
  const content = $('#step-content');
  content.className = step === 4 ? 'result-enter' : 'step-enter';
  if (step < 4) {
    let question = c.questions[step];
    if (step === 0 && (started ?? new Date()).getMonth() === 0)
      question =
        locale === 'es'
          ? '¿Qué quieres lograr este año?'
          : 'What do you want to achieve this year?';
    const controls =
      step === 1
        ? `<div class="obstacle-list" role="group" aria-label="${esc(question)}">${c.obstacles.map((label, i) => `<button type="button" data-obstacle="${i}" aria-pressed="${data.obstacle === i}">${label}${arrow}</button>`).join('')}</div>${data.obstacle === 5 ? `<div class="other-field">${fieldMarkup('other', c.labels[1])}</div>` : ''}`
        : fieldMarkup(
            fields[step === 0 ? 0 : step],
            c.labels[step === 0 ? 0 : step],
          ) + ideasMarkup();
    content.innerHTML = `<h2 id="step-title" tabindex="-1">${question}</h2><p class="step-hint">${c.hints[step].replace('{month}', month)}</p>${example ? `<p class="success-label">${c.exampleTag}</p>` : ''}<form id="question-form" novalidate>${controls}<div class="actions ${step === 0 ? 'start-actions' : ''}">${step === 0 ? `<button class="primary" type="submit">${c.next[0]}${arrow}</button><button class="secondary" type="button" data-example>${c.example}</button>` : `<button class="secondary" type="button" data-back>${c.back}</button>${step !== 1 || data.obstacle === 5 ? `<button class="primary" type="submit">${c.next[step]}${arrow}</button>` : ''}`}</div></form>`;
    $('.preview').className = 'preview';
    $('.preview').innerHTML = previewMarkup();
    paintPreview();
    $('#question-form').addEventListener('submit', next);
    const answer = $('#answer');
    if (answer) {
      answer.addEventListener('input', () => {
        begin();
        if (data[answer.name] !== answer.value) example = false;
        data[answer.name] = answer.value;
        $('#count').textContent =
          `${[...answer.value.trim()].length} / ${limits[answer.name]}`;
        if (error) showError(invalid(answer.name, answer.value));
        paintPreview();
      });
      answer.addEventListener('paste', (event) => {
        if (/[\r\n\u2028\u2029]/u.test(event.clipboardData.getData('text'))) {
          event.preventDefault();
          showError(c.line);
        }
      });
    }
  } else {
    content.innerHTML = `<h2 id="step-title" tabindex="-1">${c.resultTitle}</h2><p class="step-hint">${c.resultHint}</p><p class="result-lead" dir="auto">${esc(sentence())}</p><p class="result-goal">${c.resultGoal} ${esc(data.purpose.trim())}</p><div class="actions"><button class="primary" type="button" id="save-image">${c.save}${arrow}</button><button class="secondary" type="button" data-edit>${c.edit}</button></div><p class="step-hint" style="font-size:12px;margin-top:14px">${c.imagePrivacy}</p><div class="result-options"><details id="calendar"><summary>${c.calendar}</summary><div class="calendar-body"><p>${c.calendarHint}</p><label class="field-label" for="calendar-time">${c.time}</label><input class="calendar-time" id="calendar-time" name="time" type="time" value="${esc(data.time)}"><fieldset style="border:0;padding:0;margin:16px 0"><legend class="field-label">${c.days}</legend><div class="days">${Array.from(
      { length: 7 },
      (_, i) => {
        const date = new Date(2026, 10, 16 + i),
          short = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(
            date,
          ),
          full = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(
            date,
          );
        return `<button type="button" data-day="${i}" aria-label="${full}" aria-pressed="${data.days.includes(i)}">${short}</button>`;
      },
    ).join(
      '',
    )}</div></fieldset><div class="option-actions"><button type="button" data-calendar>${c.calendarFile}</button><button type="button" data-google>${c.google}</button><button type="button" data-without-time>${c.withoutTime}</button></div><p id="calendar-notice" role="status"></p></div></details><details><summary>${c.share}</summary><div class="calendar-body"><p>${c.shareHelp}</p><div class="option-actions"><button type="button" data-share>${c.shareAction}</button></div></div></details></div><div class="actions"><button class="secondary" type="button" data-reset>${c.restart}</button></div>`;
    $('.preview').className = 'preview result-preview';
    $('.preview').innerHTML =
      `<div class="preview-caption"><span id="preview-title">${c.previewPng}</span><span class="paper-mark" aria-hidden="true">B</span></div><canvas class="wallpaper" id="wallpaper" role="img" aria-label="${esc(sentence())}" width="1179" height="2556"></canvas><p class="preview-footer">${c.pngNote}</p>`;
    $('#calendar-time').addEventListener('input', (event) => {
      data.time = event.target.value;
    });
    $('#save-image').addEventListener('click', saveImage);
    void prepareImage();
  }
  if (focus) $('#step-title').focus();
}
function showError(message) {
  error = message;
  $('#field-error').textContent = message;
  $('#answer')?.setAttribute('aria-invalid', String(!!message));
}
function next(event) {
  event.preventDefault();
  const field = fields[step === 1 ? 1 : step];
  const message = invalid(field, data[field]);
  if (message) {
    showError(message);
    $('#answer').focus();
    return;
  }
  begin();
  error = '';
  step++;
  render();
}
function useExample() {
  begin();
  data = {
    purpose: copy().exampleData[0],
    obstacle: 0,
    other: '',
    situation: copy().exampleData[1],
    action: copy().exampleData[2],
    time: '20:00',
    days: [0, 1, 2, 3, 4],
  };
  step = 0;
  error = '';
  example = true;
  render();
}
function reset() {
  step = 0;
  started = null;
  error = '';
  example = false;
  wallpaper = null;
  imageEpoch++;
  data = {
    purpose: '',
    obstacle: -1,
    other: '',
    situation: '',
    action: '',
    time: '',
    days: [0, 1, 2, 3, 4],
  };
  $('#announcement').textContent = '';
  render();
}
function validateCalendar() {
  const time = $('#calendar-time');
  if (!data.time || time.validity.badInput) {
    $('#calendar-notice').textContent = copy().noTime;
    time.focus();
    return false;
  }
  if (!data.days.length) {
    $('#calendar-notice').textContent = copy().noDays;
    $('[data-day]').focus();
    return false;
  }
  $('#calendar-notice').textContent = '';
  return true;
}
document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.hasAttribute('data-example') || button.id === 'example')
    useExample();
  else if (button.hasAttribute('data-back')) {
    error = '';
    step--;
    render();
  } else if (button.hasAttribute('data-edit')) {
    step = 3;
    render();
  } else if (button.hasAttribute('data-reset') || button.id === 'empty')
    reset();
  else if (button.hasAttribute('data-obstacle') && step === 1) {
    begin();
    if (data.obstacle !== Number(button.dataset.obstacle)) example = false;
    data.obstacle = Number(button.dataset.obstacle);
    error = '';
    if (data.obstacle !== 5) step = 2;
    render();
    if (data.obstacle === 5) $('#answer').focus();
  } else if (button.hasAttribute('data-suggest')) {
    const answer = $('#answer');
    answer.value = button.dataset.suggest;
    answer.dispatchEvent(new Event('input'));
    answer.focus();
  } else if (button.hasAttribute('data-day')) {
    const day = Number(button.dataset.day);
    data.days = data.days.includes(day)
      ? data.days.filter((value) => value !== day)
      : [...data.days, day].sort();
    button.setAttribute('aria-pressed', String(data.days.includes(day)));
  } else if (button.hasAttribute('data-calendar') && validateCalendar())
    $('#calendar-notice').textContent = copy()
      .summary.replace('{days}', data.days.length)
      .replace(
        '{unit}',
        data.days.length === 1 ? copy().dayUnit : copy().daysUnit,
      )
      .replace(
        '{time}',
        new Intl.DateTimeFormat(locale, {
          hour: 'numeric',
          minute: '2-digit',
        }).format(new Date(2026, 0, 1, ...data.time.split(':').map(Number))),
      );
  else if (button.hasAttribute('data-google') && validateCalendar()) {
    const c = copy();
    $('#google-title').textContent = c.consentTitle;
    $('#google-description').textContent = c.consent;
    $('#google-cancel').textContent = c.cancel;
    $('#google-confirm').textContent = c.confirm;
    $('#google-dialog').showModal();
    $('#google-cancel').focus();
  } else if (button.hasAttribute('data-without-time')) {
    data.time = '';
    $('#calendar-time').value = '';
    $('#calendar').open = false;
    $('#announcement').textContent = copy().withoutTimeNotice;
  } else if (button.hasAttribute('data-share'))
    $('#announcement').textContent = copy().shareNotice;
  else if (button.id === 'google-cancel') $('#google-dialog').close();
  else if (button.id === 'google-confirm') {
    $('#google-dialog').close();
    $('#announcement').textContent = copy().googleNotice;
  } else if (button.id === 'locale') {
    locale = locale === 'es' ? 'en' : 'es';
    error = '';
    $('#announcement').textContent = '';
    render();
  } else if (button.id === 'theme') {
    document.documentElement.dataset.theme =
      document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    $('#wordmark').src = assets[document.documentElement.dataset.theme];
    if (step === 4) void prepareImage();
  } else if (button.id === 'maximum') {
    begin();
    data.purpose = 'P'.repeat(80);
    data.obstacle = 0;
    data.situation = 'W'.repeat(90);
    data.action = 'W'.repeat(90);
    step = 4;
    error = '';
    example = false;
    render();
  }
});
function wrapText(ctx, text, maxWidth) {
  const graphemes = [
    ...new Intl.Segmenter(locale, { granularity: 'grapheme' }).segment(text),
  ].map((item) => item.segment);
  const lines = [];
  let line = '';
  for (const part of graphemes) {
    if (ctx.measureText(line + part).width > maxWidth && line) {
      const lastSpace = line.search(/\s+\S*$/u);
      if (lastSpace > 0) {
        lines.push(line.slice(0, lastSpace + 1));
        line = line.slice(lastSpace + 1);
      } else {
        lines.push(line);
        line = '';
      }
    }
    line += part;
  }
  if (line) lines.push(line);
  return lines;
}
async function prepareImage() {
  const epoch = ++imageEpoch,
    canvas = $('#wallpaper');
  wallpaper = null;
  const save = $('#save-image');
  save.disabled = true;
  save.setAttribute('aria-busy', 'true');
  try {
    await document.fonts.ready;
    await document.fonts.load('600 72px "Space Grotesk"');
    if (epoch !== imageEpoch || !canvas.isConnected) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    const dark = document.documentElement.dataset.theme === 'dark';
    const bg = dark ? '#171421' : '#f7f5f0',
      ink = dark ? '#f7f3ff' : '#242136',
      purple = dark ? '#a68aff' : '#653acb';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1179, 2556);
    ctx.strokeStyle = dark ? '#494057' : '#cec6d8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(1100, 2400, 300, Math.PI, Math.PI * 1.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(1100, 2400, 225, Math.PI, Math.PI * 1.8);
    ctx.stroke();
    const text = sentence(),
      left = 118,
      width = 943;
    let size = 82,
      lines;
    do {
      ctx.font = `600 ${size}px "Space Grotesk"`;
      lines = wrapText(ctx, text, width);
      if (
        lines.length * size * 1.3 + 125 <= 1022 &&
        lines.every((line) => ctx.measureText(line).width <= width)
      )
        break;
      size--;
    } while (size >= 48);
    if (size < 48) throw new Error('Text does not fit');
    const blockHeight = lines.length * size * 1.3 + 125,
      top = 818 + (1022 - blockHeight) / 2;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = purple;
    ctx.font = '500 33px "Space Grotesk"';
    ctx.fillText(locale === 'es' ? 'Mi plan B' : 'My bad day plan', left, top);
    ctx.fillStyle = ink;
    ctx.font = `600 ${size}px "Space Grotesk"`;
    lines.forEach((line, i) =>
      ctx.fillText(line, left, top + 85 + i * size * 1.3),
    );
    const underline = top + 85 + lines.length * size * 1.3 + 15;
    ctx.strokeStyle = purple;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(left, underline);
    ctx.lineTo(left + 220, underline);
    ctx.quadraticCurveTo(left + 260, underline, left + 280, underline - 18);
    ctx.quadraticCurveTo(
      left + 300,
      underline - 36,
      left + 320,
      underline - 12,
    );
    ctx.lineTo(left + 360, underline - 12);
    ctx.stroke();
    wallpaper = canvas;
    canvas.dataset.fontSize = String(size);
    canvas.dataset.lines = String(lines.length);
    canvas.dataset.text = text;
    canvas.dataset.textTop = String(top);
    canvas.dataset.textBottom = String(underline + 8);
    canvas.dataset.literalText = String(lines.join('') === text);
  } catch {
    if (epoch === imageEpoch && canvas.isConnected)
      $('#announcement').textContent = copy().imageError;
  } finally {
    if (epoch === imageEpoch && save.isConnected) {
      save.disabled = false;
      save.removeAttribute('aria-busy');
    }
  }
}
async function saveImage() {
  const save = $('#save-image');
  if (save.disabled) return;
  if (!wallpaper) {
    await prepareImage();
    if (!wallpaper) return;
  }
  save.disabled = true;
  try {
    const blob = await new Promise((resolve) =>
      wallpaper.toBlob(resolve, 'image/png'),
    );
    if (!blob) throw new Error('PNG unavailable');
    const url = URL.createObjectURL(blob),
      link = document.createElement('a');
    link.href = url;
    link.download =
      locale === 'es' ? 'plan-b-propuesta.png' : 'bad-day-plan-proposal.png';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    $('#announcement').textContent = copy().downloaded;
  } catch {
    $('#announcement').textContent = copy().imageError;
  } finally {
    if (save.isConnected) save.disabled = false;
  }
}
render(false);
