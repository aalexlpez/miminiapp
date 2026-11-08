// Decorative enhancement only. Final, readable SVGs are the default without JS.
const html = document.documentElement;
if (!html.classList.contains('motion-ready')) {
  const roots = [...document.querySelectorAll<SVGSVGElement>('[data-motion]')];
  const controls = [
    ...document.querySelectorAll<HTMLButtonElement>('[data-motion-control]'),
  ];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let manuallyPaused = false;
  let observer: IntersectionObserver | undefined;

  function settle(root: SVGSVGElement) {
    root.dataset.motionAssembled = 'true';
    root.dataset.motionEntered = 'true';
    delete root.dataset.motionHover;
  }

  function render() {
    html.dataset.motionReduced = String(reduced.matches);
    html.dataset.motionPaused = String(manuallyPaused || document.hidden);
    if (reduced.matches)
      roots.filter((r) => r.dataset.motionSeen).forEach(settle);
    for (const button of controls) {
      button.disabled = reduced.matches;
      button.textContent =
        (reduced.matches
          ? button.dataset.reduced
          : manuallyPaused
            ? button.dataset.resume
            : button.dataset.pause) ?? '';
      const status = document.getElementById(
        button.getAttribute('aria-describedby') ?? '',
      );
      if (status)
        status.textContent =
          (reduced.matches
            ? button.dataset.reduced
            : manuallyPaused
              ? button.dataset.paused
              : button.dataset.running) ?? '';
    }
  }

  try {
    observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          const root = target as SVGSVGElement;
          root.dataset.motionVisible = String(isIntersecting);
          if (isIntersecting && !root.dataset.motionSeen) {
            if (reduced.matches || manuallyPaused) settle(root);
            root.dataset.motionSeen = 'true';
          }
        }
      },
      { threshold: 0.16 },
    );
    roots.forEach((root) => observer!.observe(root));
    controls.forEach((button) =>
      button.addEventListener('click', () => {
        if (!html.classList.contains('motion-ready') || reduced.matches) return;
        manuallyPaused = !manuallyPaused;
        render();
      }),
    );
    document.addEventListener('animationend', (event) => {
      const target = event.target;
      if (!(target instanceof SVGElement)) return;
      const root = target.closest<SVGSVGElement>('[data-motion]');
      if (!root) return;
      if (
        event.animationName === 'mma-assemble' &&
        target.classList.contains('p4')
      )
        root.dataset.motionAssembled = 'true';
      if (
        event.animationName === 'mma-hover' &&
        target.classList.contains('p4')
      )
        delete root.dataset.motionHover;
      if (
        event.animationName === 'mma-enter' &&
        target.dataset.entry === 'dots'
      )
        root.dataset.motionEntered = 'true';
    });
    document.addEventListener('pointerover', (event) => {
      if (
        reduced.matches ||
        manuallyPaused ||
        document.hidden ||
        event.pointerType === 'touch' ||
        !matchMedia('(hover: hover)').matches
      )
        return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest('.brand');
      if (
        !link ||
        (event.relatedTarget instanceof Node &&
          link.contains(event.relatedTarget))
      )
        return;
      const root = link.querySelector<SVGSVGElement>('[data-motion="brand"]');
      if (
        root?.dataset.motionAssembled &&
        root.dataset.motionVisible === 'true'
      )
        root.dataset.motionHover = 'true';
    });
    reduced.addEventListener('change', render);
    document.addEventListener('visibilitychange', render);
    window.addEventListener('pageshow', render);
    render();
    html.classList.add('motion-ready');
    controls.forEach((button) => {
      button.hidden = false;
    });
  } catch {
    observer?.disconnect();
    html.classList.remove('motion-ready');
    roots.forEach(settle);
    controls.forEach((button) => {
      button.hidden = true;
    });
  }
}
