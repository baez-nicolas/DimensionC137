export class ArrayUtils {
  static chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  static unique<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  static uniqueBy<T>(array: T[], key: keyof T): T[] {
    const seen = new Set();
    return array.filter((item) => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }

  static groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce(
      (groups, item) => {
        const groupKey = String(item[key]);
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
      },
      {} as Record<string, T[]>,
    );
  }

  static sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  static shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static sample<T>(array: T[]): T | undefined {
    return array[Math.floor(Math.random() * array.length)];
  }

  static sampleMany<T>(array: T[], count: number): T[] {
    const shuffled = this.shuffle(array);
    return shuffled.slice(0, count);
  }

  static sum(array: number[]): number {
    return array.reduce((acc, val) => acc + val, 0);
  }

  static average(array: number[]): number {
    return array.length > 0 ? this.sum(array) / array.length : 0;
  }

  static min(array: number[]): number | undefined {
    return array.length > 0 ? Math.min(...array) : undefined;
  }

  static max(array: number[]): number | undefined {
    return array.length > 0 ? Math.max(...array) : undefined;
  }

  static range(start: number, end: number, step: number = 1): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
    return result;
  }

  static partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
    const pass: T[] = [];
    const fail: T[] = [];
    array.forEach((item) => {
      if (predicate(item)) {
        pass.push(item);
      } else {
        fail.push(item);
      }
    });
    return [pass, fail];
  }

  static intersection<T>(array1: T[], array2: T[]): T[] {
    const set2 = new Set(array2);
    return array1.filter((item) => set2.has(item));
  }

  static difference<T>(array1: T[], array2: T[]): T[] {
    const set2 = new Set(array2);
    return array1.filter((item) => !set2.has(item));
  }

  static flatten<T>(array: (T | T[])[]): T[] {
    return array.reduce((acc: T[], val) => {
      return acc.concat(Array.isArray(val) ? this.flatten(val) : val);
    }, []);
  }

  static compact<T>(array: (T | null | undefined)[]): T[] {
    return array.filter((item): item is T => item != null);
  }

  static findLast<T>(array: T[], predicate: (item: T) => boolean): T | undefined {
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate(array[i])) {
        return array[i];
      }
    }
    return undefined;
  }

  static zip<T, U>(array1: T[], array2: U[]): [T, U][] {
    const length = Math.min(array1.length, array2.length);
    const result: [T, U][] = [];
    for (let i = 0; i < length; i++) {
      result.push([array1[i], array2[i]]);
    }
    return result;
  }

  static isEmpty<T>(array: T[] | null | undefined): boolean {
    return !array || array.length === 0;
  }

  static isNotEmpty<T>(array: T[] | null | undefined): boolean {
    return !this.isEmpty(array);
  }
}
