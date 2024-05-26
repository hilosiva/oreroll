interface ExtendedIntersectionObserverInit extends IntersectionObserverInit {
  once?: boolean;
  scrub?: boolean;
}

interface entryOptions {
  start: number;
  end: number;
  target?: Element | null;
}

const easeInOutQuad = (t: number) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

export default class Oreroll {
  els: NodeListOf<HTMLElement>;
  cb?: (entry: IntersectionObserverEntry, isInView: boolean, progress?: number) => void;
  options?: ExtendedIntersectionObserverInit;
  io: IntersectionObserver | null;
  count: number;
  requestAnimationFrameId: Map<Element, number>;
  entries: Map<Element, entryOptions>;
  windowHeight: number;

  constructor(els: string, options?: ExtendedIntersectionObserverInit, cb?: (entry: IntersectionObserverEntry, isInView: boolean) => void) {
    this.els = document.querySelectorAll<HTMLElement>(els);
    const defaultOptions: ExtendedIntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
      once: true,
      scrub: false,
    };
    this.io = null;
    this.cb = cb;
    this.options = Object.assign(defaultOptions, options);
    this.count = 0;
    this.requestAnimationFrameId = new Map();
    this.entries = new Map();
    this.windowHeight = window.innerHeight;

    this._init();
  }

  private _handleIntersection(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    entries.forEach((entry) => {
      const entryOptions = this.entries.get(entry.target);
      const target = entryOptions?.target || entry.target;

      if (entry.isIntersecting) {
        target.setAttribute("data-inview", "true");

        if (this.cb && !this.options?.scrub) this.cb(entry, true);

        if (this.options?.scrub) {
          this._scrub(entry, entryOptions!);
        }

        if (this.options?.once) {
          observer.unobserve(entry.target);
        }

        this.count++;
      } else {
        if (!this.options?.once) {
          // 1度だけではない場合
          target.setAttribute("data-inview", "false");

          if (entry.rootBounds?.bottom && entry.boundingClientRect.bottom > entry.rootBounds?.bottom) {
            // 要素が下に出た
          }

          if (this.cb && !this.options?.scrub) this.cb(entry, false);
        }

        const animationFrameId = this.requestAnimationFrameId.get(entry.target);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          this.requestAnimationFrameId.delete(entry.target);
        }
      }
    });

    if (this.options?.once && this.count === this.els.length) {
      this.destroy();
      this.requestAnimationFrameId.clear();
    }
  }

  private _scrub(entry: IntersectionObserverEntry, entryOptions: entryOptions) {
    const windowHeight = entry.rootBounds?.height || window.innerHeight;
    const target = entryOptions?.target || entry.target;

    let scrollY: number | null = null;
    const updateScrub = () => {
      if (scrollY !== window.scrollY) {
        if (!(target instanceof HTMLElement)) {
          console.error(`${target}がHTMLElementではありません`);
          return;
        }

        const rect = entry.target.getBoundingClientRect();
        const start = entryOptions.start * windowHeight;
        const end = entryOptions.end * windowHeight;
        const progress = Math.floor(Math.min(Math.max((rect.top - start) / (end - start), 0), 1) * 1000) / 1000;

        target.style.setProperty("--progress", `${progress}`);

        if (this.cb && !this.options?.scrub) this.cb(entry, true, progress);
      }

      const animationFrameId = requestAnimationFrame(updateScrub);
      this.requestAnimationFrameId.set(entry.target, animationFrameId);

      scrollY = window.scrollY;
    };

    updateScrub();
  }

  private _initObserver() {
    this.io = new IntersectionObserver((entries, observer) => {
      this._handleIntersection(entries, observer);
    }, this.options);
  }

  private _observeElements() {
    this.els.forEach((el) => {
      const entryOptions: entryOptions = {
        start: el.getAttribute("data-start") !== null ? Number(el.getAttribute("data-start")) : 1,
        end: el.getAttribute("data-end") !== null ? Number(el.getAttribute("data-end")) : 0,
      };

      // target
      const targetSelector = el.getAttribute("data-inview-target");
      if (targetSelector) entryOptions.target = document.querySelector(targetSelector);

      const target = entryOptions?.target || el;

      target.setAttribute("data-inview", "false");

      this.entries.set(el, entryOptions);
      this.io?.observe(el);
    });
  }

  private _init() {
    if (!this.els?.length) {
      return;
    }

    this._initObserver();
    this._observeElements();
  }

  destroy() {
    this.io?.disconnect();
    this.requestAnimationFrameId.forEach((id) => cancelAnimationFrame(id));
    this.requestAnimationFrameId.clear();
  }
}
