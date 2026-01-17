export class UrlHelper {
  static extractIdFromUrl(url: string): number | null {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const id = parseInt(lastPart, 10);
    return isNaN(id) ? null : id;
  }

  static extractIdsFromUrls(urls: string[]): number[] {
    return urls.map((url) => this.extractIdFromUrl(url)).filter((id): id is number => id !== null);
  }

  static buildUrl(base: string, path: string, params?: Record<string, string | number>): string {
    let url = `${base}/${path}`;

    if (params && Object.keys(params).length > 0) {
      const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return url;
  }

  static parseQueryParams(url: string): Record<string, string> {
    const params: Record<string, string> = {};
    const queryString = url.split('?')[1];

    if (!queryString) return params;

    queryString.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      if (key && value) {
        params[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });

    return params;
  }

  static addQueryParam(url: string, key: string, value: string | number): string {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  }

  static removeQueryParam(url: string, key: string): string {
    const [baseUrl, queryString] = url.split('?');
    if (!queryString) return url;

    const params = queryString
      .split('&')
      .filter((param) => !param.startsWith(`${key}=`))
      .join('&');

    return params ? `${baseUrl}?${params}` : baseUrl;
  }

  static updateQueryParam(url: string, key: string, value: string | number): string {
    const withoutParam = this.removeQueryParam(url, key);
    return this.addQueryParam(withoutParam, key, value);
  }

  static getBaseUrl(url: string): string {
    return url.split('?')[0];
  }

  static getQueryString(url: string): string | null {
    const parts = url.split('?');
    return parts.length > 1 ? parts[1] : null;
  }

  static getDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return '';
    }
  }

  static getProtocol(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol;
    } catch {
      return '';
    }
  }

  static getPath(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch {
      return '';
    }
  }

  static isAbsoluteUrl(url: string): boolean {
    return /^https?:\/\//i.test(url);
  }

  static isRelativeUrl(url: string): boolean {
    return !this.isAbsoluteUrl(url);
  }

  static joinPaths(...paths: string[]): string {
    return paths
      .filter(Boolean)
      .map((path, index) => {
        if (index === 0) {
          return path.replace(/\/$/, '');
        }
        return path.replace(/^\/|\/$/g, '');
      })
      .join('/');
  }

  static normalize(url: string): string {
    return url.replace(/([^:]\/)\/+/g, '$1');
  }
}
