import { GetUrlOptions } from './types';

export class Route {
  constructor(private readonly pathname: string) {}

  get path() {
    return this.pathname;
  }

  getPathname({ params, query }: GetUrlOptions = {}): string {
    if (!params && !query) {
      return this.path;
    }
    const url = new URL(this.path);

    if (query) {
      url.search = new URLSearchParams(query).toString();
    }
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.pathname = url.pathname.replace(`:${key}`, value);
      }
    }

    return url.toString();
  }
}
