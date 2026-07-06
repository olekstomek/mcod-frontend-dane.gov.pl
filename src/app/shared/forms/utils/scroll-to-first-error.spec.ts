import { scrollToFirstError } from './scroll-to-first-error';

function mockMatchMedia(prefersReduced: boolean) {
  jest.spyOn(window, 'matchMedia').mockReturnValue({ matches: prefersReduced } as MediaQueryList);
}

function mockScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value });
}

function createRoot(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

function setTop(el: HTMLElement, top: number) {
  jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom: top + 50,
    left: 0,
    right: 100,
    width: 100,
    height: 50,
    x: 0,
    y: top,
    toJSON: () => ({}),
  });
}

describe('scrollToFirstError', () => {
  let root: HTMLElement;
  let scrollToSpy: jest.SpyInstance;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: jest.fn(),
    });
  });

  beforeEach(() => {
    root = createRoot();
    scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    jest.useFakeTimers();
    mockMatchMedia(false);
    mockScrollY(0);
  });

  afterEach(() => {
    document.body.removeChild(root);
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe('when no .is-invalid elements exist', () => {
    it('should do nothing', () => {
      root.innerHTML = '<div class="form-field"><input type="text" /></div>';

      scrollToFirstError(root);

      expect(scrollToSpy).not.toHaveBeenCalled();
    });
  });

  describe('when selecting the topmost invalid element', () => {
    it('should scroll to the nearest .form-field wrapper and focus the invalid input', () => {
      root.innerHTML = `
        <div class="form-field">
          <input type="text" class="is-invalid" id="input" />
        </div>
      `;
      const input = root.querySelector<HTMLInputElement>('#input')!;
      const wrapper = root.querySelector<HTMLElement>('.form-field')!;
      setTop(wrapper, 280);
      setTop(input, 300);
      const focusSpy = jest.spyOn(input, 'focus');

      scrollToFirstError(root);
      jest.runAllTimers();

      expect(scrollToSpy).toHaveBeenCalledWith({ top: 230, behavior: 'smooth' });
      expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    });

    it('should pick the element closest to the top of the page when multiple invalid fields exist', () => {
      root.innerHTML = `
        <div class="form-field">
          <input type="text" class="is-invalid" id="upper" />
        </div>
        <div class="form-field">
          <input type="text" class="is-invalid" id="lower" />
        </div>
      `;
      const upper = root.querySelector<HTMLInputElement>('#upper')!;
      const lower = root.querySelector<HTMLInputElement>('#lower')!;
      const [upperWrapper, lowerWrapper] = Array.from(root.querySelectorAll<HTMLElement>('.form-field'));
      setTop(upperWrapper, 80);
      setTop(upper, 100);
      setTop(lowerWrapper, 380);
      setTop(lower, 400);
      const focusUpper = jest.spyOn(upper, 'focus');
      const focusLower = jest.spyOn(lower, 'focus');

      scrollToFirstError(root);
      jest.runAllTimers();

      expect(scrollToSpy).toHaveBeenCalledWith({ top: 30, behavior: 'smooth' });
      expect(focusUpper).toHaveBeenCalled();
      expect(focusLower).not.toHaveBeenCalled();
    });

    it('should target the leaf .is-invalid element, not an ancestor wrapper that also has .is-invalid', () => {
      root.innerHTML = `
        <div class="input-wrapper is-invalid">
          <input type="text" class="is-invalid" id="leaf" />
        </div>
      `;
      const input = root.querySelector<HTMLInputElement>('#leaf')!;
      setTop(root.querySelector<HTMLElement>('.input-wrapper')!, 200);
      setTop(input, 210);
      const focusSpy = jest.spyOn(input, 'focus');

      scrollToFirstError(root);
      jest.runAllTimers();

      expect(scrollToSpy).toHaveBeenCalledWith({ top: 160, behavior: 'smooth' });
      expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    });
  });

  describe('when selecting the focusable descendant', () => {
    it('should focus the first focusable descendant when the topmost invalid element itself is not focusable', () => {
      root.innerHTML = `
        <div class="form-field">
          <div class="is-invalid" id="imageUpload">
            <button type="button" id="filePicker">Choose file</button>
          </div>
        </div>
      `;
      const imageUpload = root.querySelector<HTMLElement>('#imageUpload')!;
      const formField = root.querySelector<HTMLElement>('.form-field')!;
      const button = root.querySelector<HTMLButtonElement>('#filePicker')!;
      setTop(formField, 330);
      setTop(imageUpload, 350);
      const focusSpy = jest.spyOn(button, 'focus');

      scrollToFirstError(root);
      jest.runAllTimers();

      expect(scrollToSpy).toHaveBeenCalledWith({ top: 280, behavior: 'smooth' });
      expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    });

    it('should still scroll even when no focusable element exists inside .is-invalid', () => {
      root.innerHTML = `
        <div class="form-field">
          <div class="is-invalid" id="errorBanner">
            <span>Field is required</span>
          </div>
        </div>
      `;
      setTop(root.querySelector<HTMLElement>('.form-field')!, 180);
      setTop(root.querySelector<HTMLElement>('#errorBanner')!, 200);

      scrollToFirstError(root);
      jest.runAllTimers();

      expect(scrollToSpy).toHaveBeenCalledWith({ top: 130, behavior: 'smooth' });
    });

    it.each([
      { tag: 'select', html: '<select id="f"><option>x</option></select>' },
      { tag: 'textarea', html: '<textarea id="f"></textarea>' },
      { tag: '[tabindex]', html: '<div id="f" tabindex="0">custom</div>' },
    ])('should focus a $tag element nested inside .is-invalid', ({ html }) => {
      root.innerHTML = `<div class="form-field"><div class="is-invalid">${html}</div></div>`;
      setTop(root.querySelector<HTMLElement>('.form-field')!, 80);
      setTop(root.querySelector<HTMLElement>('.is-invalid')!, 100);
      const focusSpy = jest.spyOn(root.querySelector<HTMLElement>('#f')!, 'focus');

      scrollToFirstError(root);
      jest.runAllTimers();

      expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    });
  });

  describe('when calculating the scroll position', () => {
    it('should include window.scrollY in the calculated scroll position', () => {
      mockScrollY(500);
      root.innerHTML = `
        <div class="form-field">
          <input type="text" class="is-invalid" />
        </div>
      `;
      setTop(root.querySelector<HTMLElement>('.form-field')!, 100);
      setTop(root.querySelector<HTMLElement>('.is-invalid')!, 120);

      scrollToFirstError(root);

      expect(scrollToSpy).toHaveBeenCalledWith({ top: 550, behavior: 'smooth' });
    });

    it('should use .form-group as the scroll target when no .form-field ancestor exists', () => {
      root.innerHTML = `
        <div class="form-group">
          <input type="text" class="is-invalid" id="input" />
        </div>
      `;
      setTop(root.querySelector<HTMLElement>('.form-group')!, 270);
      setTop(root.querySelector<HTMLInputElement>('#input')!, 300);

      scrollToFirstError(root);

      expect(scrollToSpy).toHaveBeenCalledWith({ top: 220, behavior: 'smooth' });
    });
  });

  describe('when prefers-reduced-motion is active', () => {
    it('should use scroll behavior "instant" and zero focus delay', () => {
      mockMatchMedia(true);
      root.innerHTML = `
        <div class="form-field">
          <input type="text" class="is-invalid" id="input" />
        </div>
      `;
      const input = root.querySelector<HTMLInputElement>('#input')!;
      setTop(root.querySelector<HTMLElement>('.form-field')!, 280);
      setTop(input, 300);
      const focusSpy = jest.spyOn(input, 'focus');

      scrollToFirstError(root);
      jest.runAllTimers();

      expect(scrollToSpy).toHaveBeenCalledWith({ top: 230, behavior: 'instant' });
      expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    });
  });

  describe('when custom options are provided', () => {
    it('should use the provided scrollBehavior option instead of the default "smooth"', () => {
      root.innerHTML = `<div class="form-field"><input class="is-invalid" /></div>`;
      setTop(root.querySelector<HTMLElement>('.form-field')!, 80);
      setTop(root.querySelector<HTMLElement>('.is-invalid')!, 100);

      scrollToFirstError(root, { scrollBehavior: 'instant' });

      expect(scrollToSpy).toHaveBeenCalledWith({ top: 30, behavior: 'instant' });
    });

    it('should delay focus by exactly the provided focusDelayMs milliseconds', () => {
      root.innerHTML = `<div class="form-field"><input class="is-invalid" id="input" /></div>`;
      const input = root.querySelector<HTMLInputElement>('#input')!;
      setTop(root.querySelector<HTMLElement>('.form-field')!, 80);
      setTop(input, 100);
      const focusSpy = jest.spyOn(input, 'focus');

      scrollToFirstError(root, { focusDelayMs: 200 });

      jest.advanceTimersByTime(199);
      expect(focusSpy).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1);
      expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    });
  });
});
