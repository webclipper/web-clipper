import { LocaleModel } from '@/common/locales/interface';
import antd from 'antd/lib/locale-provider/en_US';

const messages = {
  'tool.title': 'Title',
  'tool.save': 'Save Content',
  'tool.repository': 'Repository',
  'tool.toolExtensions': 'Tool Extension',
  'tool.clipExtensions': 'Clip Extension',
  'backend.services.youdao.name': 'Youdao',
  'backend.services.yuque.name': 'Yuque',
  'page.complete.error': 'Some Error',
  'page.complete.success': 'Success',
  'page.complete.message': 'Go to {name}',
  'backend.imageHosting.yuque.name': 'Yuque',
  'preference.tab.account': 'Account',
  'preference.tab.changelog': 'Changelog',
  'preference.extensions.clipExtensions.tooltip':
    'Click on the 🌟 to choose the default extension.',
  'preference.basic.configLanguage.description':
    'My native language is Chinese,Welcome to submit a translation on GitHub.',
};

const model: LocaleModel = {
  antd,
  name: 'English',
  locale: 'en-US',
  messages,
  alias: ['en'],
};

export default model;
