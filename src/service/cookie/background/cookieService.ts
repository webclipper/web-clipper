import { Service } from 'typedi';
import { ICookieService } from '@/service/common/cookie';

class ChromeCookieService implements ICookieService {
  get(detail: chrome.cookies.Details): Promise<chrome.cookies.Cookie | null> {
    return new Promise<chrome.cookies.Cookie | null>(r => {
      chrome.cookies.get(detail, r);
    });
  }

  getAll(detail: chrome.cookies.GetAllDetails): Promise<chrome.cookies.Cookie[]> {
    return new Promise<chrome.cookies.Cookie[]>(r => {
      chrome.cookies.getAll(detail, r);
    });
  }
  getAllCookieStores(): Promise<chrome.cookies.CookieStore[]> {
    return new Promise<chrome.cookies.CookieStore[]>(r => {
      chrome.cookies.getAllCookieStores(cookieStores => {
        r(cookieStores);
      });
    });
  }
}

Service(ICookieService)(ChromeCookieService);
