export class DateUtils {
  static formatDate(date: Date | string, format: string = 'DD/MM/YYYY'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', String(year))
      .replace('YY', String(year).slice(-2));
  }

  static formatDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const dateStr = this.formatDate(d);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${dateStr} ${hours}:${minutes}`;
  }

  static parseDate(dateString: string): Date | null {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }

  static isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  static addYears(date: Date, years: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }

  static differenceInDays(date1: Date, date2: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((utc2 - utc1) / msPerDay);
  }

  static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  static isToday(date: Date): boolean {
    return this.isSameDay(date, new Date());
  }

  static isPast(date: Date): boolean {
    return date < new Date();
  }

  static isFuture(date: Date): boolean {
    return date > new Date();
  }

  static getMonthName(month: number, locale: string = 'es'): string {
    const date = new Date(2000, month, 1);
    return date.toLocaleDateString(locale, { month: 'long' });
  }

  static getDayName(day: number, locale: string = 'es'): string {
    const date = new Date(2000, 0, day + 2);
    return date.toLocaleDateString(locale, { weekday: 'long' });
  }

  static getQuarter(date: Date): number {
    return Math.floor(date.getMonth() / 3) + 1;
  }

  static getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  static startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  static endOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  static startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  static endOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  static getDaysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  static fromNow(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'hace un momento';
    if (diffMin < 60) return `hace ${diffMin} minuto${diffMin > 1 ? 's' : ''}`;
    if (diffHour < 24) return `hace ${diffHour} hora${diffHour > 1 ? 's' : ''}`;
    if (diffDay < 30) return `hace ${diffDay} día${diffDay > 1 ? 's' : ''}`;
    if (diffDay < 365) {
      const months = Math.floor(diffDay / 30);
      return `hace ${months} mes${months > 1 ? 'es' : ''}`;
    }
    const years = Math.floor(diffDay / 365);
    return `hace ${years} año${years > 1 ? 's' : ''}`;
  }
}
