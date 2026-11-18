/** Native hints share the existing platform module; never import a miniapp UI. */
export function initCatalogueHints() {
  for (const card of document.querySelectorAll<HTMLElement>(
    '.catalogue-card',
  )) {
    const link = card.querySelector('.card-link');
    const hint = card.querySelector('.app-tooltip');
    if (!(link instanceof HTMLElement) || !(hint instanceof HTMLElement))
      continue;
    let closeTimer: number | undefined;
    const cancelClose = () => window.clearTimeout(closeTimer);
    const close = () => {
      cancelClose();
      if (hint.matches(':popover-open')) hint.hidePopover();
    };
    const place = () => {
      const rect = link.getBoundingClientRect();
      const margin = 12;
      const left = Math.max(
        margin,
        Math.min(rect.left, innerWidth - hint.offsetWidth - margin),
      );
      const below = rect.bottom + 8;
      const top =
        below + hint.offsetHeight <= innerHeight - margin
          ? below
          : Math.max(margin, rect.top - hint.offsetHeight - 8);
      hint.style.left = `${left}px`;
      hint.style.top = `${top}px`;
    };
    const open = () => {
      cancelClose();
      if (!hint.matches(':popover-open')) hint.showPopover();
      place();
    };
    const deferClose = () => {
      cancelClose();
      closeTimer = window.setTimeout(() => {
        if (!card.matches(':focus-within') && !hint.matches(':hover')) close();
      }, 140);
    };
    card.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') open();
    });
    card.addEventListener('pointerleave', deferClose);
    link.addEventListener('focus', () => {
      if (link.matches(':focus-visible')) open();
    });
    card.addEventListener('focusout', deferClose);
    hint.addEventListener('pointerenter', cancelClose);
    hint.addEventListener('pointerleave', deferClose);
    hint.addEventListener('toggle', () => {
      if (hint.matches(':popover-open')) place();
    });
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, { passive: true });
  }
}
