export class NumberUtils {
  static formatNumber(value: number, decimals: number = 0): string {
    return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  static formatCurrency(value: number, currency: string = 'USD', locale: string = 'es-AR'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  }

  static formatPercentage(value: number, decimals: number = 0): string {
    return `${(value * 100).toFixed(decimals)}%`;
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  static random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomFloat(min: number, max: number, decimals: number = 2): number {
    const value = Math.random() * (max - min) + min;
    return parseFloat(value.toFixed(decimals));
  }

  static isEven(value: number): boolean {
    return value % 2 === 0;
  }

  static isOdd(value: number): boolean {
    return value % 2 !== 0;
  }

  static isPrime(value: number): boolean {
    if (value <= 1) return false;
    if (value <= 3) return true;
    if (value % 2 === 0 || value % 3 === 0) return false;
    for (let i = 5; i * i <= value; i += 6) {
      if (value % i === 0 || value % (i + 2) === 0) return false;
    }
    return true;
  }

  static factorial(n: number): number {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }

  static fibonacci(n: number): number {
    if (n <= 1) return n;
    let a = 0,
      b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }

  static gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  static lcm(a: number, b: number): number {
    return (a * b) / this.gcd(a, b);
  }

  static roundTo(value: number, decimals: number): number {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
  }

  static ceilTo(value: number, decimals: number): number {
    const multiplier = Math.pow(10, decimals);
    return Math.ceil(value * multiplier) / multiplier;
  }

  static floorTo(value: number, decimals: number): number {
    const multiplier = Math.pow(10, decimals);
    return Math.floor(value * multiplier) / multiplier;
  }

  static toRoman(num: number): string {
    const romanNumerals: [number, string][] = [
      [1000, 'M'],
      [900, 'CM'],
      [500, 'D'],
      [400, 'CD'],
      [100, 'C'],
      [90, 'XC'],
      [50, 'L'],
      [40, 'XL'],
      [10, 'X'],
      [9, 'IX'],
      [5, 'V'],
      [4, 'IV'],
      [1, 'I'],
    ];

    let result = '';
    for (const [value, numeral] of romanNumerals) {
      while (num >= value) {
        result += numeral;
        num -= value;
      }
    }
    return result;
  }

  static fromRoman(roman: string): number {
    const romanMap: Record<string, number> = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000,
    };

    let result = 0;
    for (let i = 0; i < roman.length; i++) {
      const current = romanMap[roman[i]];
      const next = romanMap[roman[i + 1]];
      if (next && current < next) {
        result -= current;
      } else {
        result += current;
      }
    }
    return result;
  }

  static inRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  static sum(...numbers: number[]): number {
    return numbers.reduce((acc, val) => acc + val, 0);
  }

  static average(...numbers: number[]): number {
    return numbers.length > 0 ? this.sum(...numbers) / numbers.length : 0;
  }

  static median(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  static mode(numbers: number[]): number {
    const frequency: Record<number, number> = {};
    let maxFreq = 0;
    let mode = numbers[0];

    numbers.forEach((num) => {
      frequency[num] = (frequency[num] || 0) + 1;
      if (frequency[num] > maxFreq) {
        maxFreq = frequency[num];
        mode = num;
      }
    });

    return mode;
  }

  static parseNumber(value: string): number | null {
    const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
    return isNaN(parsed) ? null : parsed;
  }
}
