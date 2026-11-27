/* global document, matchMedia, clearTimeout, setTimeout */
'use strict';

const copy = {
  es: {
    skip: 'Ir a la receta',
    language: 'Idioma',
    appearance: 'Apariencia',
    system: 'Sistema',
    light: 'Claro',
    dark: 'Oscuro',
    title: 'Receta a medida',
    description: 'Ajusta una receta a tus raciones o a la cantidad que tienes de un ingrediente.',
    source: 'Ingredientes de la receta',
    example: 'Ver un ejemplo',
    edit: 'Editar ingredientes',
    paste: 'Pega los ingredientes',
    sourceHelp: 'Una línea por ingrediente, con la cantidad delante.',
    original: 'Raciones de la receta',
    optional: '(opcional)',
    invalidServings: 'Escribe un número entero del 1 al 99.',
    reset: 'Empezar otra vez',
    seeResult: 'Ver resultado',
    result: 'Ingredientes ajustados',
    empty: 'Aquí verás los ingredientes ajustados.',
    adjustHint: 'Toca una cantidad para ajustar toda la receta.',
    lastValid: 'Mostrando el último ajuste válido.',
    target: 'Raciones que quiero',
    less: 'Quitar una ración',
    more: 'Añadir una ración',
    copy: 'Copiar ingredientes',
    copyPreview: 'Vista previa de copia',
    copyHelp: 'Selecciona el texto de la maqueta para copiarlo.',
    reviewNote: 'Maqueta I1. Prueba los ajustes con las líneas de los ejemplos.',
    frame: 'Marco de la página',
    compact: 'Compacto',
    standard: 'Estándar',
    exampleState: 'Ejemplo',
    byServings: 'Por raciones',
    asWritten: 'Cantidades originales',
    basedOn: 'Según',
    preview: 'Vista previa',
    back: 'Volver a raciones',
    backTo: (count) => 'Volver a ' + count + ' raciones',
    yields: (count) => 'Rinde ' + count + ' raciones',
    before: 'Original',
    changeAmount: (ingredient) => 'Cambiar cantidad de ' + ingredient,
    taste: 'Tal cual',
    check: 'Revisar cantidad',
    checkSeparator: 'Revisar separador',
    needsReview: 'Las líneas para revisar se conservan tal cual.',
    have: 'Tengo',
    use: 'Usar cantidad',
    cancel: 'Cancelar',
    invalidAmount: 'Escribe una cantidad positiva, como 2 o 1/2.',
    egg: 'Bate un huevo y mide la parte que necesitas.',
    packet: 'Mide la fracción del sobre.',
  },
  en: {
    skip: 'Skip to the recipe',
    language: 'Language',
    appearance: 'Appearance',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    title: 'Recipe Resizer',
    description: 'Scale a recipe by servings or by how much of one ingredient you have.',
    source: 'Recipe ingredients',
    example: 'Try an example',
    edit: 'Edit ingredients',
    paste: 'Paste your ingredients',
    sourceHelp: 'One ingredient per line, with the amount first.',
    original: 'Original servings',
    optional: '(optional)',
    invalidServings: 'Enter a whole number from 1 to 99.',
    reset: 'Start over',
    seeResult: 'See result',
    result: 'Adjusted ingredients',
    empty: 'Your adjusted ingredients will appear here.',
    adjustHint: 'Tap an amount to adjust the whole recipe.',
    lastValid: 'Showing the last valid adjustment.',
    target: 'Servings I want',
    less: 'Subtract one serving',
    more: 'Add one serving',
    copy: 'Copy ingredients',
    copyPreview: 'Copy preview',
    copyHelp: 'Select the text in the prototype to copy it.',
    reviewNote: 'I1 prototype. Try adjustments with the example ingredients.',
    frame: 'Page layout',
    compact: 'Compact',
    standard: 'Standard',
    exampleState: 'Example',
    byServings: 'By servings',
    asWritten: 'Original amounts',
    basedOn: 'Based on',
    preview: 'Preview',
    back: 'Back to servings',
    backTo: (count) => 'Back to ' + count + ' servings',
    yields: (count) => 'Makes ' + count + ' servings',
    before: 'Original',
    changeAmount: (ingredient) => 'Change amount of ' + ingredient,
    taste: 'As written',
    check: 'Check amount',
    checkSeparator: 'Check number separator',
    needsReview: 'Lines marked for review are kept as written.',
    have: 'I have',
    use: 'Use this amount',
    cancel: 'Cancel',
    invalidAmount: 'Enter a positive amount such as 2 or 1/2.',
    egg: 'Beat an egg and measure the fraction you need.',
    packet: 'Measure the fraction of the packet.',
  },
};

// These specimens drive the design review. General ingredient parsing belongs to I2.
const examples = {
  es: {
    servings: 8,
    lines: [
      { printed: '1', ingredient: 'yogur natural', quantity: 1 },
      { printed: '3', ingredient: 'huevos', quantity: 3, tip: 'egg' },
      { printed: '1', ingredient: 'vaso de yogur de aceite', quantity: 1 },
      { printed: '2', ingredient: 'vasos de yogur de azúcar', quantity: 2 },
      { printed: '3', ingredient: 'vasos de yogur de harina', quantity: 3 },
      { printed: '1', ingredient: 'sobre de levadura química (16 g por sobre)', quantity: 1, tip: 'packet' },
      { ingredient: 'una pizca de sal' },
    ],
  },
  en: {
    servings: 4,
    lines: [
      { printed: '1½', ingredient: 'cups flour', quantity: 1.5 },
      { printed: '2', ingredient: 'tbsp sugar', quantity: 2 },
      { printed: '2', ingredient: 'tsp baking powder', quantity: 2 },
      { printed: '1¼', ingredient: 'cups milk', quantity: 1.25 },
      { printed: '1', ingredient: 'egg', quantity: 1, tip: 'egg' },
      { printed: '3', ingredient: 'tbsp melted butter', quantity: 3 },
      { ingredient: 'a pinch of salt' },
    ],
  },
};

function specimenText(line) {
  return line.printed ? line.printed + ' ' + line.ingredient : line.ingredient;
}

const specimens = new Map(
  Object.values(examples).flatMap(({ lines }) =>
    lines.map((line) => [specimenText(line), line]),
  ),
);
const fractions = {
  '1/2': '½', '1/3': '⅓', '2/3': '⅔', '1/4': '¼', '3/4': '¾',
  '1/8': '⅛', '3/8': '⅜', '5/8': '⅝', '7/8': '⅞',
};
const compactWidth = matchMedia('(max-width: 760px)');
const systemDark = matchMedia('(prefers-color-scheme: dark)');
const root = document.documentElement;
const byId = (name) => document.getElementById('recipe-' + name);
const ui = Object.fromEntries([
  'theme', 'frame', 'example', 'source-body', 'expand', 'ingredients', 'origin',
  'origin-error', 'reset', 'jump', 'result-title', 'factor', 'empty', 'results',
  'basis', 'return', 'adjust-hint', 'last-valid', 'toolbar', 'servings',
  'target', 'target-error', 'less', 'more', 'yield', 'copy', 'list',
  'copy-panel', 'copy-text', 'status',
].map((name) => [name, byId(name)]));

let language = 'es';
let words = copy.es;
let rows = [];
let originalServings = null;
let targetServings = null;
let reference = null;
let draft = null;
let example = false;
let statusTimer;

function formatNumber(value, maximumFractionDigits = 2) {
  return new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
    useGrouping: false,
    maximumFractionDigits,
  }).format(value);
}

function formatAmount(value) {
  if (Number.isInteger(value)) return formatNumber(value);
  const whole = Math.floor(value);
  const part = value - whole;
  for (let denominator = 2; denominator <= 16; denominator += 1) {
    const numerator = Math.round(part * denominator);
    if (numerator < 1 || numerator >= denominator) continue;
    if (Math.abs(part - numerator / denominator) > 1e-10) continue;
    const slash = numerator + '/' + denominator;
    const glyph = fractions[slash];
    return whole ? formatNumber(whole) + (glyph || ' ' + slash) : glyph || slash;
  }
  const approximation = Math.round(value * 100) / 100;
  if (approximation === value) return formatNumber(approximation);
  if (approximation > 0 && Math.abs(value - approximation) / value <= 0.02) {
    return '≈ ' + formatNumber(approximation);
  }
  return value >= 0.0001 ? '≈ ' + formatNumber(value, 8) : '≈ ' + value.toExponential(2);
}

function parseServings(text) {
  return /^[1-9][0-9]?$/.test(text.trim()) ? Number(text) : null;
}

function parseAvailable(text) {
  const value = text.trim();
  if (/^[1-9][0-9]{0,2}[.,][0-9]{3}$/.test(value)) return null;
  const parts = /^(\d+)\s*\/\s*([1-9]\d*)$/.exec(value);
  const numeric = parts
    ? Number(parts[1]) / Number(parts[2])
    : /^\d+(?:[.,]\d+)?$/.test(value) && Number(value.replace(',', '.'));
  return numeric > 0 && Number.isFinite(numeric) ? numeric : null;
}

function makeElement(tag, className) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  return element;
}

function closeCopy() {
  ui['copy-panel'].hidden = true;
  ui.copy.setAttribute('aria-expanded', 'false');
}

function setEditorCollapsed(collapsed) {
  const hide = collapsed && compactWidth.matches;
  ui['source-body'].closest('.recipe-source').dataset.collapsed = String(hide);
  ui['source-body'].hidden = hide;
  ui.expand.hidden = !hide;
  ui.example.hidden = hide;
  ui.expand.setAttribute('aria-expanded', String(!hide));
}

function goToResult() {
  if (!rows.length) return;
  setEditorCollapsed(true);
  ui['result-title'].focus();
  ui['result-title'].scrollIntoView({ block: 'nearest' });
}

function makeRow(raw, index) {
  const line = raw.replace(/^(?:[•*-])\s+/, '').trim();
  const fixture = specimens.get(line);
  const item = makeElement('li', 'recipe-line');
  const detail = makeElement('div', fixture?.quantity ? '' : 'recipe-unchanged');
  const ingredient = makeElement('span', 'recipe-ingredient');
  const note = makeElement('span', 'recipe-note');
  const row = { raw, fixture, item, note, index };
  ingredient.textContent = fixture?.ingredient ?? raw;
  detail.append(ingredient, note);
  if (fixture?.quantity) {
    row.amount = makeElement('button', 'recipe-amount');
    row.amountText = makeElement('span');
    row.amountDescription = makeElement('span', 'recipe-screen-reader');
    row.amount.append(row.amountText, row.amountDescription);
    row.amount.type = 'button';
    row.amount.setAttribute('aria-expanded', 'false');
    row.amount.addEventListener('click', () => {
      if (draft?.row === row) {
        closeDraft(true);
        render();
      } else {
        openDraft(row);
      }
    });
    item.append(row.amount);
  }
  item.append(detail);
  return row;
}

function updateRows() {
  closeDraft(false);
  closeCopy();
  rows = ui.ingredients.value.split(/\r?\n/).filter((line) => line.trim()).map(makeRow);
  if (reference) {
    const matches = rows.filter((row) => row.raw === reference.row.raw && row.fixture?.quantity);
    reference = matches.length === 1 ? { ...reference, row: matches[0] } : null;
  }
  ui.list.replaceChildren(...rows.map((row) => row.item));
  render();
}

function markError(input, error, invalid) {
  input.setAttribute('aria-invalid', String(invalid));
  error.hidden = !invalid;
}

function activeAdjustment() {
  const stock = draft?.preview ?? reference;
  const servings = targetServings ?? originalServings;
  const factor = stock
    ? stock.amount / stock.row.fixture.quantity
    : originalServings && servings ? servings / originalServings : 1;
  const yieldValue = stock && originalServings ? originalServings * factor : null;
  return { stock, servings, factor, yieldValue };
}

function paintRow(row, factor, stock) {
  if (!row.amount) {
    const separator = /^[1-9]\d{0,2}[.,]\d{3}(?:\s|$)/.test(row.raw);
    row.note.textContent = row.fixture ? words.taste : separator ? words.checkSeparator : words.check;
    row.note.classList.toggle('recipe-error', !row.fixture);
    return;
  }
  const amount = stock?.row === row ? stock.amount : row.fixture.quantity * factor;
  const display = formatAmount(amount);
  row.item.dataset.reference = String(stock?.row === row);
  row.amountText.textContent = display;
  row.amountDescription.textContent = ' · ' + words.changeAmount(row.fixture.ingredient);
  const message = amount === row.fixture.quantity ? [] : [words.before + ' ' + row.fixture.printed];
  if (row.fixture.tip && !Number.isInteger(amount)) message.push(words[row.fixture.tip]);
  row.note.textContent = message.join(' · ');
  row.note.hidden = !message.length;
}

function render() {
  const hasRows = rows.length > 0;
  const hasAmounts = rows.some((row) => row.amount);
  const { stock, servings, factor, yieldValue } = activeAdjustment();
  const invalid = ui.origin.getAttribute('aria-invalid') === 'true' ||
    (ui.target.getAttribute('aria-invalid') === 'true' && !stock);
  const showServings = !!originalServings && !stock;
  const factorText = formatAmount(factor);
  const yieldText = yieldValue === null ? '' : words.yields(
    Number.isInteger(yieldValue) ? formatNumber(yieldValue) : '≈ ' + formatNumber(yieldValue, 1),
  );

  ui.empty.hidden = hasRows;
  ui.results.hidden = !hasRows;
  ui.factor.hidden = !hasAmounts;
  ui.factor.textContent = factorText.startsWith('≈') ? '≈ ×' + factorText.slice(2) : '×' + factorText;
  ui.jump.hidden = !compactWidth.matches || !hasRows;
  ui.reset.disabled = !hasRows && !ui.origin.value;
  ui['adjust-hint'].hidden = !hasAmounts;
  ui['last-valid'].hidden = !invalid && !draft?.invalid;
  ui.toolbar.hidden = !hasAmounts;
  ui.servings.hidden = !showServings;
  ui.yield.hidden = !yieldText;
  ui.yield.textContent = yieldText;
  ui.copy.disabled = !!draft || invalid;
  if (ui.copy.disabled) closeCopy();

  if (document.activeElement !== ui.target && ui.target.getAttribute('aria-invalid') !== 'true') {
    ui.target.value = servings ?? '';
  }
  ui.less.disabled = !servings || servings <= 1;
  ui.more.disabled = !servings || servings >= 99;
  const basis = stock
    ? words.basedOn + ' ' + formatAmount(stock.amount) + ' ' + stock.row.fixture.ingredient
    : originalServings ? words.byServings : words.asWritten;
  ui.basis.textContent = [example && words.exampleState, draft && words.preview, basis].filter(Boolean).join(' · ');
  ui.return.hidden = !stock;
  ui.return.textContent = servings ? words.backTo(servings) : words.back;
  for (const row of rows) paintRow(row, factor, stock);
  if (!ui['copy-panel'].hidden) updateCopyText();

  clearTimeout(statusTimer);
  const announcement = hasAmounts
    ? [basis, ui.factor.textContent, yieldText].filter(Boolean).join('. ')
    : hasRows ? words.needsReview : words.empty;
  statusTimer = setTimeout(() => { ui.status.textContent = announcement; }, 220);
}

function closeDraft(restoreFocus) {
  if (!draft) return;
  const { row, form } = draft;
  form.remove();
  row.amount.setAttribute('aria-expanded', 'false');
  row.amount.removeAttribute('aria-controls');
  draft = null;
  if (restoreFocus) row.amount.focus();
}

function openDraft(row) {
  closeDraft(false);
  closeCopy();
  const form = makeElement('form', 'recipe-have');
  const label = makeElement('label');
  const have = makeElement('span');
  const input = makeElement('input');
  const apply = makeElement('button', 'recipe-button recipe-primary');
  const cancel = makeElement('button', 'recipe-button recipe-quiet');
  const error = makeElement('p', 'recipe-error');

  form.id = 'recipe-have-' + row.index;
  error.id = form.id + '-error';
  input.inputMode = 'decimal';
  input.setAttribute('aria-describedby', error.id);
  input.placeholder = row.fixture.printed;
  label.append(have, input);
  apply.type = 'submit';
  apply.disabled = true;
  cancel.type = 'button';
  error.hidden = true;
  form.append(label, apply, cancel, error);
  row.item.append(form);
  row.amount.setAttribute('aria-expanded', 'true');
  row.amount.setAttribute('aria-controls', form.id);
  draft = { row, form, input, have, apply, cancel, error, invalid: false, preview: null };
  localizeDraft();

  input.addEventListener('input', () => {
    const amount = parseAvailable(input.value);
    draft.invalid = input.value.trim() !== '' && amount === null;
    if (amount !== null) draft.preview = { row, amount };
    if (input.value.trim() === '') draft.preview = null;
    apply.disabled = amount === null;
    markError(input, error, draft.invalid);
    render();
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (apply.disabled || !draft.preview) return;
    reference = draft.preview;
    closeDraft(true);
    render();
  });
  cancel.addEventListener('click', () => { closeDraft(true); render(); });
  form.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    closeDraft(true);
    render();
  });
  render();
  input.focus();
}

function localizeDraft() {
  if (!draft) return;
  draft.have.textContent = words.have;
  draft.input.setAttribute('aria-label', words.have + ' · ' + draft.row.fixture.ingredient);
  draft.apply.textContent = words.use;
  draft.cancel.textContent = words.cancel;
  draft.error.textContent = words.invalidAmount;
}

function updateCopyText() {
  const { stock, servings, yieldValue } = activeAdjustment();
  const count = stock
    ? yieldValue === null
      ? ''
      : words.yields(Number.isInteger(yieldValue) ? formatNumber(yieldValue) : '≈ ' + formatNumber(yieldValue, 1))
    : servings ? words.yields(formatNumber(servings)) : '';
  const heading = [ui.factor.textContent, count].filter(Boolean).join(' · ');
  const lines = rows.map((row) => row.amount
    ? row.amountText.textContent + ' ' + row.fixture.ingredient
    : row.raw);
  if (rows.some((row) => !row.fixture)) lines.push('', words.needsReview);
  ui['copy-text'].value = [heading, '', ...lines].join('\n');
}

function localize(nextLanguage) {
  language = nextLanguage;
  words = copy[language];
  root.lang = language;
  document.title = words.title + ' · MiMiniApp';
  for (const element of document.querySelectorAll('[data-copy]')) {
    element.textContent = words[element.dataset.copy];
  }
  for (const element of document.querySelectorAll('[data-label]')) {
    element.setAttribute('aria-label', words[element.dataset.label]);
  }
  for (const button of document.querySelectorAll('[data-language]')) {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  }
  ui.ingredients.placeholder = examples[language].lines.slice(0, 2).map(specimenText).join('\n');
  localizeDraft();
  render();
}

function updateOrigin() {
  const value = ui.origin.value.trim();
  const handled = parseServings(value);
  markError(ui.origin, ui['origin-error'], value !== '' && handled === null);
  if (handled || value === '') originalServings = handled;
  render();
}

function changeTarget(value) {
  const target = parseServings(String(value));
  markError(ui.target, ui['target-error'], target === null);
  if (target) {
    closeDraft(false);
    reference = null;
    targetServings = target;
  }
  render();
}

ui.origin.addEventListener('input', updateOrigin);
ui.target.addEventListener('input', () => changeTarget(ui.target.value));
ui.less.addEventListener('click', () => changeTarget((targetServings ?? originalServings) - 1));
ui.more.addEventListener('click', () => changeTarget((targetServings ?? originalServings) + 1));
ui.return.addEventListener('click', () => {
  closeDraft(false);
  reference = null;
  render();
  (originalServings ? (ui.more.disabled ? ui.less : ui.more) : ui['result-title']).focus();
});
ui.ingredients.addEventListener('input', () => { example = false; updateRows(); });
ui.jump.addEventListener('click', goToResult);
ui.expand.addEventListener('click', () => { setEditorCollapsed(false); ui.ingredients.focus(); });
ui.example.addEventListener('click', () => {
  const { lines, servings } = examples[language];
  ui.ingredients.value = lines.map(specimenText).join('\n');
  ui.origin.value = String(servings);
  originalServings = servings;
  targetServings = null;
  reference = null;
  example = true;
  markError(ui.origin, ui['origin-error'], false);
  markError(ui.target, ui['target-error'], false);
  updateRows();
  goToResult();
});
ui.reset.addEventListener('click', () => {
  ui.ingredients.value = '';
  ui.origin.value = '';
  originalServings = targetServings = reference = null;
  example = false;
  markError(ui.origin, ui['origin-error'], false);
  markError(ui.target, ui['target-error'], false);
  updateRows();
  ui.ingredients.focus();
});
ui.copy.addEventListener('click', () => {
  if (!ui['copy-panel'].hidden) {
    closeCopy();
    return;
  }
  updateCopyText();
  ui['copy-panel'].hidden = false;
  ui.copy.setAttribute('aria-expanded', 'true');
  ui['copy-text'].focus();
  ui['copy-text'].select();
});

function applyTheme() {
  root.dataset.theme = ui.theme.value === 'system'
    ? (systemDark.matches ? 'dark' : 'light')
    : ui.theme.value;
}

ui.theme.addEventListener('change', applyTheme);
systemDark.addEventListener('change', applyTheme);
ui.frame.addEventListener('change', () => { root.dataset.frame = ui.frame.value; });
compactWidth.addEventListener('change', () => { setEditorCollapsed(false); render(); });
for (const button of document.querySelectorAll('[data-language]')) {
  button.addEventListener('click', () => localize(button.dataset.language));
}
applyTheme();
localize('es');
