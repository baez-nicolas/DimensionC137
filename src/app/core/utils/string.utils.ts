export class StringUtils {
  static capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  static capitalizeWords(str: string): string {
    if (!str) return '';
    return str
      .split(' ')
      .map((word) => this.capitalize(word))
      .join(' ');
  }

  static truncate(str: string, maxLength: number, suffix: string = '...'): string {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
  }

  static slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  static isEmptyOrWhitespace(str: string | null | undefined): boolean {
    return !str || str.trim().length === 0;
  }

  static extractNumber(str: string): number | null {
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  }

  static padStart(str: string | number, length: number, char: string = '0'): string {
    return String(str).padStart(length, char);
  }

  static padEnd(str: string | number, length: number, char: string = ' '): string {
    return String(str).padEnd(length, char);
  }

  static contains(str: string, search: string, caseSensitive: boolean = false): boolean {
    if (!str || !search) return false;
    if (caseSensitive) {
      return str.includes(search);
    }
    return str.toLowerCase().includes(search.toLowerCase());
  }

  static replaceAll(str: string, search: string, replacement: string): string {
    return str.split(search).join(replacement);
  }

  static toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  static toCamelCase(str: string): string {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  }

  static toPascalCase(str: string): string {
    const camelCase = this.toCamelCase(str);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  }

  static countWords(str: string): number {
    return str.trim().split(/\s+/).filter(Boolean).length;
  }

  static reverse(str: string): string {
    return str.split('').reverse().join('');
  }

  static isUrl(str: string): boolean {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  static extractUrls(str: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return str.match(urlRegex) || [];
  }

  static maskEmail(email: string): string {
    const [username, domain] = email.split('@');
    if (!domain) return email;
    const maskedUsername =
      username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  }

  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
