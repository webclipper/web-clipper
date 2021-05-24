import { getSignedPostUrl, postArticle } from './../../../common/server';
import { IPermissionsService } from '@/service/common/permissions';
import { Container } from 'typedi';
import { ContextMenuExtension } from '../../contextMenus';
import pako from 'pako';
import request from 'umi-request';

class ContextMenu extends ContextMenuExtension {
  static id = 'contextMenus.saveMHTML.save';

  constructor() {
    super({
      admin: true,
      name: '保存 MHTML',
      description: '保存 MHTML',
      version: '0.0.1',
      contexts: ['page'],
    });
  }

  async run(tab: chrome.tabs.Tab): Promise<void> {
    await Container.get(IPermissionsService).request({
      permissions: ['pageCapture'],
    });
    const mhtml = await this.saveAsMHTML(tab.id!);
    const title = tab.title!;
    const url = tab.url!;
    const memory = await mhtml.arrayBuffer();
    const view = new Uint8Array(memory);
    const value = pako.gzip(view);
    const file = new Blob([value]);
    const signResult = await getSignedPostUrl({ size: file.size, bizType: 'storead' });
    const { key, host, signature, OSSAccessKeyId, policy } = signResult.result;
    let param = new FormData(); // 创建form对象
    param.append('key', key);
    param.append('policy', policy);
    param.append('OSSAccessKeyId', OSSAccessKeyId);
    param.append('success_action_status', '200');
    param.append('signature', signature);
    param.append('file', file);
    await request.post(host, {
      data: param,
      requestType: 'form',
    });
    await postArticle({ url, title, key });
  }

  private saveAsMHTML(tabId: number) {
    return new Promise<Blob>(resolve => {
      chrome.pageCapture.saveAsMHTML(
        {
          tabId,
        },
        resolve
      );
    });
  }
}

export default ContextMenu;
