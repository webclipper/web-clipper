import { Token } from 'typedi';

export interface ICookieService {
  getAll(details: chrome.cookies.GetAllDetails): Promise<chrome.cookies.Cookie[]>;
  getAllCookieStores(): Promise<chrome.cookies.CookieStore[]>;
}

export const ICookieService = new Token<ICookieService>();
