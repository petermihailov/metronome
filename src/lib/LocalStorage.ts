import type { JSONValue } from '../types/helpers';

const prefix = 'mn';

export interface IStorage<T = unknown> {
  clear: () => boolean;
  get: () => T | null;
  set: (value: T) => boolean;
}

export class StorageField<T extends JSONValue> implements IStorage<T> {
  private readonly key: string;

  constructor(key: string) {
    this.key = `${prefix}_${key}`;
  }

  public clear() {
    try {
      window.localStorage.removeItem(this.key);

      return true;
    } catch (e) {
      return false;
    }
  }

  public get() {
    try {
      const json = window.localStorage.getItem(this.key);

      if (json) {
        return JSON.parse(json) as T;
      }
    } catch (e) {
      /* empty */
    }

    return null;
  }

  public set(value: T) {
    try {
      const json = JSON.stringify(value);

      window.localStorage.setItem(this.key, json);

      return true;
    } catch (e) {
      return false;
    }
  }

  public merge(value: { [x: string]: JSONValue }) {
    const prev = (this.get() || {}) as { [x: string]: JSONValue };
    return this.set({ ...prev, ...value } as T);
  }
}
