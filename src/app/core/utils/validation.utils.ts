export class ValidationUtils {
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isPhoneNumber(phone: string, countryCode: string = 'AR'): boolean {
    const patterns: Record<string, RegExp> = {
      AR: /^(\+54|0)?9?\d{10}$/,
      US: /^(\+1)?[2-9]\d{9}$/,
      ES: /^(\+34)?[6-9]\d{8}$/,
    };
    const pattern = patterns[countryCode] || /^\+?\d{10,15}$/;
    return pattern.test(phone.replace(/[\s-]/g, ''));
  }

  static isPostalCode(code: string, countryCode: string = 'AR'): boolean {
    const patterns: Record<string, RegExp> = {
      AR: /^\d{4}$/,
      US: /^\d{5}(-\d{4})?$/,
      ES: /^\d{5}$/,
    };
    const pattern = patterns[countryCode] || /^\d{4,10}$/;
    return pattern.test(code);
  }

  static isCreditCard(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  static isIPv4(ip: string): boolean {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;
    return ip.split('.').every((octet) => parseInt(octet, 10) <= 255);
  }

  static isIPv6(ip: string): boolean {
    const ipv6Regex = /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$/;
    return ipv6Regex.test(ip);
  }

  static isAlpha(str: string): boolean {
    return /^[a-zA-Z]+$/.test(str);
  }

  static isAlphanumeric(str: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(str);
  }

  static isNumeric(str: string): boolean {
    return /^\d+$/.test(str);
  }

  static isHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }

  static isStrongPassword(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
    );
  }

  static isValidUsername(username: string): boolean {
    return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
  }

  static isValidSlug(slug: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  }

  static isJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  static isEmpty(value: any): boolean {
    if (value == null) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  static isNotEmpty(value: any): boolean {
    return !this.isEmpty(value);
  }

  static minLength(str: string, min: number): boolean {
    return str.length >= min;
  }

  static maxLength(str: string, max: number): boolean {
    return str.length <= max;
  }

  static lengthBetween(str: string, min: number, max: number): boolean {
    return str.length >= min && str.length <= max;
  }

  static matches(str: string, pattern: RegExp): boolean {
    return pattern.test(str);
  }

  static isDate(value: any): boolean {
    return value instanceof Date && !isNaN(value.getTime());
  }

  static isFutureDate(date: Date): boolean {
    return date > new Date();
  }

  static isPastDate(date: Date): boolean {
    return date < new Date();
  }

  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  static isPositive(value: number): boolean {
    return value > 0;
  }

  static isNegative(value: number): boolean {
    return value < 0;
  }

  static isInteger(value: number): boolean {
    return Number.isInteger(value);
  }

  static isFloat(value: number): boolean {
    return !Number.isInteger(value);
  }
}
