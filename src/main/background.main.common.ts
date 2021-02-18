import 'regenerator-runtime/runtime';
import 'reflect-metadata';
import '@/service/tab/browser/background/tabService';
import '@/service/cookie/background/cookieService';
import '@/service/trackService';
import Container from 'typedi';
import { ISyncStorageService } from '@/service/common/storage';
import { syncStorageService } from '@/common/chrome/storage';
Container.set(ISyncStorageService, syncStorageService);
