import { ToolExtension } from '@/extensions/common';
import localeService from '@/common/locales';

export default new ToolExtension<any>(
  {
    extensionId: 'link',
    name: 'Link',
    icon: 'link',
    version: '0.0.2',
    automatic: true,
    description: 'Add link at the end of the document.',
    config: {
      scheme: {
        'x-component-props': {
          labelCol: 7,
          wrapperCol: 12,
        },
        type: 'object',
        properties: {
          template: {
            type: 'string',
            title: 'Template',
            'x-component': 'textarea',
            'x-component-props': { autoSize: true },
          },
          autoRunExclude: {
            type: 'string',
            title: 'AutoRunExclude',
            'x-component': 'clipExtensionsSelect',
          },
        },
      },
      default: {
        template: '[{TITLE}]({URL}) \n\n {DOCUMENT}',
      },
    },
    i18nManifest: {
      'zh-CN': {
        name: '链接',
        description: '在文章末尾添加当前地址',
      },
    },
  },
  {
    run: async context => {
      return {
        TITLE: context.document.title,
        URL: context.document.URL,
      };
    },
    afterRun: async context => {
      const config: { template: string } = context.config!;
      return localeService.format(
        { id: 'plugin.link', defaultMessage: config.template },
        { DOCUMENT: context.data, TITLE: context.result.TITLE, URL: context.result.URL }
      );
    },
  }
);
