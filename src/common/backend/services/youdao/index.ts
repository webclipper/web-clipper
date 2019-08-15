import { ServiceMeta } from '@/common/backend';
import Service from './service';

export default (): ServiceMeta => {
  return {
    name: '有道云笔记',
    icon: 'https://note.youdao.com/web/favicon.ico',
    type: 'youdao',
    homePage: 'https://note.youdao.com/web/',
    service: Service,
  };
};
