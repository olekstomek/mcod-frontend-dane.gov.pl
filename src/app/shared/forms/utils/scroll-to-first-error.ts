const INVALID_SELECTOR = '.is-invalid, .scroll-invalid';
const FIELD_WRAPPER_SELECTOR = '.form-field, .form-group';
const FOCUSABLE_SELECTOR = 'input, select, textarea, button, [tabindex]:not([tabindex="-1"])';
const TOP_OFFSET = 50;

export interface ScrollToFirstErrorOptions {
  scrollBehavior?: ScrollBehavior;
  focusDelayMs?: number;
}

export function scrollToFirstError(root: HTMLElement, options: ScrollToFirstErrorOptions = {}): void {
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scrollBehavior: ScrollBehavior = prefersReducedMotion ? 'instant' : (options.scrollBehavior ?? 'smooth');
  const focusDelayMs = prefersReducedMotion ? 0 : (options.focusDelayMs ?? 50);

  const leaves = Array.from(root.querySelectorAll<HTMLElement>(INVALID_SELECTOR)).filter(
    (el) => el.querySelector(INVALID_SELECTOR) === null,
  );

  if (leaves.length === 0) {
    return;
  }

  const topmost = leaves.reduce((prev, curr) =>
    curr.getBoundingClientRect().top < prev.getBoundingClientRect().top ? curr : prev,
  );

  const scrollTarget: HTMLElement = topmost.closest(FIELD_WRAPPER_SELECTOR) ?? topmost;

  const top = scrollTarget.getBoundingClientRect().top + window.scrollY - TOP_OFFSET;
  window.scrollTo({ top, behavior: scrollBehavior });

  const focusable = topmost.matches(FOCUSABLE_SELECTOR)
    ? topmost
    : topmost.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);

  if (focusable) {
    setTimeout(() => focusable.focus({ preventScroll: true }), focusDelayMs);
  }
}
