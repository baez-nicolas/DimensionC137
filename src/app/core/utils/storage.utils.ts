export class LocalStorageUtils {
  static setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  static hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  static getAllKeys(): string[] {
    return Object.keys(localStorage);
  }

  static getSize(): number {
    let size = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length;
      }
    }
    return size;
  }

  static getSizeInMB(): string {
    return (this.getSize() / (1024 * 1024)).toFixed(2);
  }

  static setWithExpiry<T>(key: string, value: T, expiryInMinutes: number): void {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + expiryInMinutes * 60 * 1000,
    };
    this.setItem(key, item);
  }

  static getWithExpiry<T>(key: string): T | null {
    const item = this.getItem<{ value: T; expiry: number }>(key);
    if (!item) return null;

    const now = new Date();
    if (now.getTime() > item.expiry) {
      this.removeItem(key);
      return null;
    }

    return item.value;
  }

  static updateItem<T>(key: string, updater: (current: T | null) => T): void {
    const current = this.getItem<T>(key);
    const updated = updater(current);
    this.setItem(key, updated);
  }

  static exists(key: string): boolean {
    return this.hasItem(key);
  }

  static isEmpty(): boolean {
    return localStorage.length === 0;
  }

  static isNotEmpty(): boolean {
    return !this.isEmpty();
  }
}

export class SessionStorageUtils {
  static setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      sessionStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  }

  static clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }

  static hasItem(key: string): boolean {
    return sessionStorage.getItem(key) !== null;
  }

  static getAllKeys(): string[] {
    return Object.keys(sessionStorage);
  }
}
