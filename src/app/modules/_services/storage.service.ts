import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  userPrefix?: string;

  constructor() {}

  ngOnInit() {}

  /**
   * Set Item to storage
   * @param {string} key
   * @param {string|object} value
   * @param {boolean} usePrefix
   * @param {Storage} storage
   */
  private setItem(
    key: string,
    value: string | object,
    usePrefix: boolean = false,
    storage: Storage
  ): void {
    let newKey = this.getKey(key, usePrefix);
    if (typeof value === 'string') {
      storage.setItem(newKey, value);
    } else {
      storage.setItem(newKey, JSON.stringify(value));
    }
  }

  /**
   * Set Item to sessionStorage
   * @param {string} key
   * @param {string|object} value
   * @param {boolean} usePrefix
   */
  setItemSession(key: string, value: string | object, usePrefix: boolean = false): void {
    this.setItem(key, value, usePrefix, this.getSessionStorage());
  }

  /**
   * Set Item to localStorage
   * @param {string} key
   * @param {string|object} value
   * @param {boolean} usePrefix
   */
  setItemLocal(key: string, value: string | object, usePrefix: boolean = false): void {
    this.setItem(key, value, usePrefix, this.getLocalStorage());
  }

  /**
   * Get Item from storage
   * @param {string} key
   * @param {boolean} usePrefix
   * @param {Storage} storage
   * @returns {*} data
   */
  private getItem(key: string, usePrefix: boolean = false, storage: Storage): any {
    let newKey = this.getKey(key, usePrefix);

    const data = storage.getItem(newKey);

    if (data && this.IsJsonString(data as string)) {
      return JSON.parse(data as string);
    } else {
      return data;
    }
  }

  /**
   * Get Item from localStorage
   * @param {string} key
   * @param {boolean} usePrefix
   * @returns {string} storage
   */
  getItemLocal(key: string, usePrefix: boolean = false): any {
    return this.getItem(key, usePrefix, this.getLocalStorage());
  }

  /**
   * Get Item from sessionStorage
   * @param {string} key
   * @param {boolean} usePrefix
   * @returns {string} storage
   */
  getItemSession(key: string, usePrefix: boolean = false): any {
    return this.getItem(key, usePrefix, this.getSessionStorage());
  }

  /**
   * Remove Item from storage
   * @param {string} key
   * @param {boolean} usePrefix
   * @param {Storage} storage
   */
  private removeItem(key: string, usePrefix: boolean = false, storage: Storage): void {
    let newKey = this.getKey(key, usePrefix);
    storage.removeItem(newKey);
  }

  /**
   * Remove Item from localStorage
   * @param {string} key
   * @param {boolean} usePrefix
   */
  removeItemLocal(key: string, usePrefix: boolean = false): void {
    this.removeItem(key, usePrefix, this.getLocalStorage());
  }

  /**
   * Remove Item from sessionStorage
   * @param {string} key
   * @param {boolean} usePrefix
   */
  removeItemSession(key: string, usePrefix: boolean = false): void {
    this.removeItem(key, usePrefix, this.getSessionStorage());
  }

  /**
   * Is item exist in Storage
   * @param {string} key
   * @param {boolean} usePrefix
   * @returns {boolean} true if exist else false
   */
  private isItemExists(
    key: string,
    usePrefix: boolean = false,
    storage: Storage
  ): boolean {
    let newKey = this.getKey(key, usePrefix);
    return storage.getItem(newKey) !== null;
  }

  /**
   * Is item exist in sessionStorage
   * @param {string} key
   * @param {boolean} usePrefix
   * @returns {boolean} true if exist else false
   */
  itemExistsSession(key: string, usePrefix: boolean = false): boolean {
    return this.isItemExists(key, usePrefix, this.getSessionStorage());
  }

  /**
   * Is item exist in localStorage
   * @param {string} key
   * @param {boolean} usePrefix
   * @returns {boolean} true if exist else false
   */
  itemExistsLocal(key: string, usePrefix: boolean = false): boolean {
    return this.isItemExists(key, usePrefix, this.getLocalStorage());
  }

  /**
   * Is str a string
   * @param {string} str
   * @returns {boolean}
   */
  private IsJsonString(str: string): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }


  /**
   * Get LocalStorage
   * @returns LocalStorage
   */
  private getLocalStorage(): Storage {
    return window.localStorage;
  }


  /**
   * Get SessionStorage
   * @returns SessionStorage
   */
  private getSessionStorage(): Storage {
    return window.sessionStorage;
  }

  /**
   * Get the corect key
   * @param key
   * @param usePrefix
   * @returns
   */
  private getKey(key: string, usePrefix: boolean): string {
    return usePrefix ? this.userPrefix + '-' + key : key;
  }
}
