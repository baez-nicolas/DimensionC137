export class DomUtils {
  static addClass(element: HTMLElement, className: string): void {
    element.classList.add(className);
  }

  static removeClass(element: HTMLElement, className: string): void {
    element.classList.remove(className);
  }

  static toggleClass(element: HTMLElement, className: string): void {
    element.classList.toggle(className);
  }

  static hasClass(element: HTMLElement, className: string): boolean {
    return element.classList.contains(className);
  }

  static getElement(selector: string): HTMLElement | null {
    return document.querySelector(selector);
  }

  static getElements(selector: string): NodeListOf<HTMLElement> {
    return document.querySelectorAll(selector);
  }

  static createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    attributes?: Record<string, string>,
    children?: (HTMLElement | string)[],
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);

    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    if (children) {
      children.forEach((child) => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child);
        }
      });
    }

    return element;
  }

  static removeElement(element: HTMLElement): void {
    element.parentNode?.removeChild(element);
  }

  static hide(element: HTMLElement): void {
    element.style.display = 'none';
  }

  static show(element: HTMLElement, displayType: string = 'block'): void {
    element.style.display = displayType;
  }

  static isVisible(element: HTMLElement): boolean {
    return element.style.display !== 'none';
  }

  static getOffset(element: HTMLElement): { top: number; left: number } {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    };
  }

  static scrollTo(element: HTMLElement, behavior: ScrollBehavior = 'smooth'): void {
    element.scrollIntoView({ behavior, block: 'start' });
  }

  static scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
    window.scrollTo({ top: 0, behavior });
  }

  static getScrollPosition(): { x: number; y: number } {
    return {
      x: window.scrollX || window.pageXOffset,
      y: window.scrollY || window.pageYOffset,
    };
  }

  static disableScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  static enableScroll(): void {
    document.body.style.overflow = '';
  }

  static isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  static getViewportSize(): { width: number; height: number } {
    return {
      width: window.innerWidth || document.documentElement.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight,
    };
  }

  static copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text);
  }

  static getComputedStyle(element: HTMLElement, property: string): string {
    return window.getComputedStyle(element).getPropertyValue(property);
  }

  static setStyle(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    Object.assign(element.style, styles);
  }

  static fadeIn(element: HTMLElement, duration: number = 300): Promise<void> {
    return new Promise((resolve) => {
      element.style.opacity = '0';
      element.style.display = 'block';

      let start: number | null = null;
      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        element.style.opacity = String(progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  static fadeOut(element: HTMLElement, duration: number = 300): Promise<void> {
    return new Promise((resolve) => {
      let start: number | null = null;
      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        element.style.opacity = String(1 - progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.style.display = 'none';
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  static getParentByClass(element: HTMLElement, className: string): HTMLElement | null {
    let parent = element.parentElement;
    while (parent && !parent.classList.contains(className)) {
      parent = parent.parentElement;
    }
    return parent;
  }

  static getParentByTag(element: HTMLElement, tagName: string): HTMLElement | null {
    let parent = element.parentElement;
    while (parent && parent.tagName.toLowerCase() !== tagName.toLowerCase()) {
      parent = parent.parentElement;
    }
    return parent;
  }

  static getChildren(element: HTMLElement, selector?: string): HTMLElement[] {
    if (!selector) {
      return Array.from(element.children) as HTMLElement[];
    }
    return Array.from(element.querySelectorAll(selector));
  }

  static insertAfter(newElement: HTMLElement, referenceElement: HTMLElement): void {
    referenceElement.parentNode?.insertBefore(newElement, referenceElement.nextSibling);
  }

  static insertBefore(newElement: HTMLElement, referenceElement: HTMLElement): void {
    referenceElement.parentNode?.insertBefore(newElement, referenceElement);
  }

  static replaceElement(oldElement: HTMLElement, newElement: HTMLElement): void {
    oldElement.parentNode?.replaceChild(newElement, oldElement);
  }

  static empty(element: HTMLElement): void {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  static setAttributes(element: HTMLElement, attributes: Record<string, string>): void {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  static getAttributes(element: HTMLElement): Record<string, string> {
    const attributes: Record<string, string> = {};
    Array.from(element.attributes).forEach((attr) => {
      attributes[attr.name] = attr.value;
    });
    return attributes;
  }

  static matches(element: HTMLElement, selector: string): boolean {
    return element.matches(selector);
  }

  static closest(element: HTMLElement, selector: string): HTMLElement | null {
    return element.closest(selector);
  }
}
