import localeService from '@/common/locales';
import md5 from '@web-clipper/shared/lib/md5';
import { CreateDocumentRequest, DocumentService } from '../../index';
import { ObsidianFormConfig } from './interface';
import QueryString from 'query-string';

export default class ObsidianService implements DocumentService {
  constructor(private config: ObsidianFormConfig) {}
  getId = () => {
    return md5(JSON.stringify(this.config));
  };

  getUserInfo = async () => {
    return {
      name: 'Obsidian',
      avatar: '',
      description: `Vault: ${this.config.vault}`,
    };
  };

  getRepositories = async () => {
    const folders = (this.config.folder || '').split('\n').map((folder) => {
      return {
        id: folder,
        name: folder,
        groupId: 'obsidian',
        groupName: this.config.vault,
      };
    });
    return folders;
  };

  private async copyContent(content: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(content);
      return;
    } catch {
      // 网页 iframe 的权限策略可能阻止 Clipboard API，使用扩展复制权限兜底。
    }

    const previousFocus = document.activeElement;
    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(textarea);
    try {
      textarea.focus();
      textarea.select();
      if (document.execCommand('copy')) {
        return;
      }
    } catch {
      // 不回退到通过 URL 传输正文，避免长文被静默截断。
    } finally {
      textarea.remove();
      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    }
    throw new Error(localeService.format({ id: 'backend.services.obsidian.clipboardFailed' }));
  }

  createDocument = async (info: CreateDocumentRequest) => {
    await this.copyContent(info.content);
    const file = `${info.repositoryId}/${info.title}`;
    window.open(
      QueryString.stringifyUrl({
        url: 'obsidian://new',
        query: {
          silent: true,
          vault: this.config.vault,
          file,
          clipboard: true,
        },
      })
    );
    return {
      href: QueryString.stringifyUrl({
        url: 'obsidian://open',
        query: {
          vault: this.config.vault,
          file,
        },
      }),
    };
  };
}
