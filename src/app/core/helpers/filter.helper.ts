export class FilterHelper {
  static filterByName<T extends { name: string }>(items: T[], searchTerm: string): T[] {
    if (!searchTerm || searchTerm.trim() === '') return items;

    const lowerSearch = searchTerm.toLowerCase().trim();
    return items.filter((item) => item.name.toLowerCase().includes(lowerSearch));
  }

  static filterByStatus<T extends { status: string }>(items: T[], status: string | null): T[] {
    if (!status || status === 'all') return items;
    return items.filter((item) => item.status.toLowerCase() === status.toLowerCase());
  }

  static filterByType<T extends { type: string }>(items: T[], type: string | null): T[] {
    if (!type || type === 'all') return items;
    return items.filter((item) => item.type.toLowerCase().includes(type.toLowerCase()));
  }

  static filterByGender<T extends { gender: string }>(items: T[], gender: string | null): T[] {
    if (!gender || gender === 'all') return items;
    return items.filter((item) => item.gender.toLowerCase() === gender.toLowerCase());
  }

  static filterBySpecies<T extends { species: string }>(items: T[], species: string | null): T[] {
    if (!species || species === 'all') return items;
    return items.filter((item) => item.species.toLowerCase() === species.toLowerCase());
  }

  static filterByMultipleCriteria<T>(items: T[], filters: Partial<Record<keyof T, any>>): T[] {
    return items.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === null || value === undefined || value === '' || value === 'all') {
          return true;
        }

        const itemValue = item[key as keyof T];

        if (typeof itemValue === 'string' && typeof value === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }

        return itemValue === value;
      });
    });
  }

  static sortByField<T>(items: T[], field: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return [...items].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  static uniqueValues<T>(items: T[], field: keyof T): any[] {
    const values = items.map((item) => item[field]);
    return [...new Set(values)];
  }

  static groupByField<T>(items: T[], field: keyof T): Map<any, T[]> {
    const groups = new Map<any, T[]>();

    items.forEach((item) => {
      const key = item[field];
      const existing = groups.get(key) || [];
      groups.set(key, [...existing, item]);
    });

    return groups;
  }

  static searchInMultipleFields<T>(items: T[], searchTerm: string, fields: (keyof T)[]): T[] {
    if (!searchTerm || searchTerm.trim() === '') return items;

    const lowerSearch = searchTerm.toLowerCase().trim();

    return items.filter((item) => {
      return fields.some((field) => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerSearch);
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchTerm);
        }
        return false;
      });
    });
  }

  static filterByRange<T>(items: T[], field: keyof T, min: number, max: number): T[] {
    return items.filter((item) => {
      const value = item[field];
      if (typeof value === 'number') {
        return value >= min && value <= max;
      }
      return false;
    });
  }

  static filterByDateRange<T>(items: T[], field: keyof T, startDate: Date, endDate: Date): T[] {
    return items.filter((item) => {
      const value = item[field];
      if (value instanceof Date) {
        return value >= startDate && value <= endDate;
      }
      if (typeof value === 'string') {
        const date = new Date(value);
        return date >= startDate && date <= endDate;
      }
      return false;
    });
  }

  static hasAnyValue<T>(item: T, fields: (keyof T)[], searchTerm: string): boolean {
    const lowerSearch = searchTerm.toLowerCase();
    return fields.some((field) => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerSearch);
      }
      return false;
    });
  }

  static matchesAllFilters<T>(item: T, filters: Partial<Record<keyof T, any>>): boolean {
    return Object.entries(filters).every(([key, value]) => {
      if (value === null || value === undefined || value === '' || value === 'all') {
        return true;
      }
      return item[key as keyof T] === value;
    });
  }
}
