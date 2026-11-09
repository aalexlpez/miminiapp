import {
  appearanceKey,
  parseAppearance,
  resolveAppearance,
} from '../lib/appearance';

const root = document.documentElement;
if (!root.classList.contains('appearance-ready')) {
  const controls = [
    ...document.querySelectorAll<HTMLButtonElement>('[data-appearance-option]'),
  ];
  let preference = parseAppearance(root.dataset.appearance);
  let memoryOnly = false;
  let system: MediaQueryList | undefined;
  let reduced: MediaQueryList | undefined;
  try {
    system = matchMedia('(prefers-color-scheme: dark)');
    reduced = matchMedia('(prefers-reduced-motion: reduce)');
  } catch {
    /* A browser without media APIs retains a usable light fallback. */
  }

  function render() {
    root.dataset.appearance = preference;
    root.dataset.theme = resolveAppearance(
      preference,
      system?.matches ?? false,
    );
    controls.forEach((button) => {
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.appearanceOption === preference),
      );
    });
  }

  controls.forEach((button) => {
    button.addEventListener('click', () => {
      const next = parseAppearance(button.dataset.appearanceOption);
      if (next === preference) return;
      preference = next;
      try {
        localStorage.setItem(appearanceKey, preference);
        memoryOnly = false;
      } catch {
        memoryOnly = true;
      }
      render();
      // No class toggles, replacement nodes or animation changes in the hero.
      if (reduced && !reduced.matches) {
        const icon = button.querySelector('svg');
        icon?.getAnimations().forEach((animation) => animation.cancel());
        icon?.animate(
          [
            { transform: 'rotate(-70deg)', opacity: 0.55 },
            { transform: 'rotate(0)', opacity: 1 },
          ],
          { duration: 240, easing: 'cubic-bezier(.2,.7,.3,1)' },
        );
      }
    });
    button.disabled = false;
  });
  system?.addEventListener('change', render);
  reduced?.addEventListener('change', () => {
    if (reduced?.matches)
      controls.forEach((button) =>
        button
          .querySelector('svg')
          ?.getAnimations()
          .forEach((a) => a.cancel()),
      );
  });
  window.addEventListener('storage', (event) => {
    if (event.key === appearanceKey || event.key === null) {
      preference = parseAppearance(event.newValue);
      memoryOnly = false;
      render();
    }
  });
  window.addEventListener('pageshow', () => {
    if (!memoryOnly) {
      try {
        preference = parseAppearance(localStorage.getItem(appearanceKey));
      } catch {
        /* Preserve page memory. */
      }
    }
    render();
  });
  render();
  root.classList.add('appearance-ready');
}
