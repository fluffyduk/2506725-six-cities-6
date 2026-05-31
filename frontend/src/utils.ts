import { MAX_PERCENT_STARS_WIDTH, STARS_COUNT } from './const';

export const formatDate = (date: string) => new Intl.DateTimeFormat(
  'en-US',
  {'month':'long','year':'numeric'}
).format( new Date(date) );

export const getStarsWidth = (rating: number) =>
  `${(MAX_PERCENT_STARS_WIDTH * Math.min(Math.max(rating, 0), STARS_COUNT)) / STARS_COUNT}%`;

export const getRandomElement = <T>(array: readonly T[]): T => array[Math.floor(Math.random() * array.length)];
export const pluralize = (str: string, count: number) => count === 1 ? str : `${str}s`;
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

type TokenPayload = {
  id?: string;
  email?: string;
  name?: string;
};

type KnownUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  isPro: boolean;
};

export const parseTokenPayload = (token: string): TokenPayload | null => {
  try {
    const [, payload] = token.split('.');

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const decodedPayload = JSON.parse(atob(normalizedPayload)) as TokenPayload;

    return decodedPayload;
  } catch {
    return null;
  }
};

export class Token {
  private static _name = 'six-cities-auth-token';

  static get() {
    const token = localStorage.getItem(this._name);

    return token ?? '';
  }

  static save(token: string) {
    localStorage.setItem(this._name, token);
  }

  static drop() {
    localStorage.removeItem(this._name);
  }
}

export class UserDirectory {
  private static _name = 'six-cities-known-users';

  private static getAll(): Record<string, KnownUser> {
    try {
      return JSON.parse(localStorage.getItem(this._name) ?? '{}') as Record<string, KnownUser>;
    } catch {
      return {};
    }
  }

  static get(id: string): KnownUser | null {
    return this.getAll()[id] ?? null;
  }

  static save(user: KnownUser): void {
    localStorage.setItem(this._name, JSON.stringify({
      ...this.getAll(),
      [user.id]: user,
    }));
  }
}
