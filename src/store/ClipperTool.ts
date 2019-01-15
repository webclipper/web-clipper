import { TypedCommonStorageInterface } from './../services/common/store/index';
import { ContentScriptTool } from './../services/common/contentScripttool/index';
import { message } from 'antd';
import axios from 'axios';
import { observable, action, runInAction } from 'mobx';

import YuqueApi from '../services/api/api';
import { BookSerializer } from '../services/api/reposService';
import { UserProfile } from '../services/api/userService';
import store, { StorageUserInfo } from '../services/common/store';
import { ClipperPreiviewDataTypeEnum } from '../enums';
import { PostDocRequest } from '../services/api/documentService';
import {
  ClipperUrlPreiviewData,
  ClipperReadabilityPreiviewData,
  ClipperPreiviewData,
  ClipperFullPagePreiviewData,
  ClipperSelectedItemPreiviewData,
  ClipperScreenshootPreviewDate
} from './ClipperPreview';

export class ToolStore {
  //是否初始化
  initialization: boolean;
  yuqueApi: YuqueApi;
  yuqueToken: string;
  //知识库列表
  books: BookSerializer[];
  //用户信息
  userProfile: UserProfile;
  userHomePage: string;
  baseHost: string;
  contentScriptTool: ContentScriptTool;
  url: string;
  storage: TypedCommonStorageInterface;
  //笔记的标题
  @observable title: string;
  @observable userSetting: StorageUserInfo;
  @observable elementId: string;
  @observable submitting: boolean;
  @observable loading: boolean;
  @observable uploadingImage: boolean;
  @observable settingPreference: boolean;
  @observable complete: boolean;
  @observable book: BookSerializer;
  @observable createdDocumentInfo: {
    documentId: number;
    bookId: number;
    host: string;
    namespace: string;
    slug: string;
  };
  @observable clipperPreiviewDataType: ClipperPreiviewDataTypeEnum;
  @observable clipperPreiviewDataMap: { [key: string]: ClipperPreiviewData };

  constructor(contentScriptTool: ContentScriptTool) {
    this.contentScriptTool = contentScriptTool;
    this.initialization = false;
    this.submitting = false;
    this.loading = true;
    this.settingPreference = false;
    this.storage = store;
    this.uploadingImage = false;
    contentScriptTool.getDocumentInfo().then(re => {
      this.title = re.title;
      this.url = re.url;
    });
  }

  async init() {
    const userSetting = await store.getUserSetting();
    const prepart =
      !!userSetting &&
      !!userSetting.defualtBookId &&
      !!userSetting.baseURL &&
      !!userSetting.token;
    if (!prepart) {
      throw Error('语雀基础设置没设置好');
    }
    const yuqueApi = new YuqueApi({
      baseURL: userSetting.baseURL,
      token: userSetting.token
    });
    this.baseHost = userSetting.baseURL.replace('/api/v2/', '');
    const userProfile = await yuqueApi.userService.getUser();
    const books = await yuqueApi.reposService.getUserRepos(userProfile.id);
    const defaultBook = books.find(o => {
      return o.id === userSetting.defualtBookId;
    });
    if (!defaultBook) {
      throw Error('默认的知识库被删除了');
    }
    this.userHomePage = `${this.baseHost}/${userProfile.login}`;
    this.yuqueApi = yuqueApi;
    this.yuqueToken = userSetting.token;
    this.userProfile = userProfile;
    this.books = books;
    this.book = defaultBook;
    this.clipperPreiviewDataMap = {};
    this.userSetting = userSetting;
    this.completeLoading();
  }

  @action completeLoading = () => {
    this.loading = false;
  };

  @action changeTitle = (input: string) => {
    this.title = input;
  };
  @action.bound
  async onPostNote() {
    this.submitting = true;

    const data = this.clipperPreiviewDataMap[this.clipperPreiviewDataType];
    if (data.perpare) {
      await data.perpare();
    }
    const postDocRequest: PostDocRequest = {
      title: this.title,
      body: data.toBody()
    };
    const createdDocument = await this.yuqueApi.documentService.createDocument(
      this.book.id,
      postDocRequest
    );
    runInAction(() => {
      this.complete = true;
      this.submitting = false;
      this.createdDocumentInfo = {
        documentId: createdDocument.id,
        bookId: this.book.id,
        namespace: this.book.namespace,
        slug: createdDocument.slug,
        host: this.baseHost
      };
    });
  }

  @action onDeleteElement = async () => {
    await this.contentScriptTool.cleanElement();
  };

  @action onSetBookId = (input: number) => {
    this.book = this.books.find(o => {
      return o.id === input;
    })!;
  };

  getCookie = async () => {
    return new Promise<void>((resolve, _) => {
      chrome.cookies.get(
        {
          url: 'https://www.yuque.com',
          name: 'ctoken'
        },
        function(cookie: any) {
          resolve(cookie.value);
        }
      );
    });
  };

  @action onClipperData = async (type: ClipperPreiviewDataTypeEnum) => {
    this.settingPreference = false;
    let ClipperPreiviewData = this.clipperPreiviewDataMap[type];
    if (ClipperPreiviewData) {
      this.clipperPreiviewDataType = type;
      return;
    }
    const {
      toggleClipperTool,
      getFullPage,
      getSelectElement,
      getReadabilityContent,
      getSelectArea,
      captureVisibleTabBase64
    } = this.contentScriptTool;

    switch (type) {
      case ClipperPreiviewDataTypeEnum.URL:
        ClipperPreiviewData = new ClipperUrlPreiviewData(this.url);
        break;
      case ClipperPreiviewDataTypeEnum.FULL_PAGE:
        ClipperPreiviewData = new ClipperFullPagePreiviewData(
          await getFullPage()
        );
        break;
      case ClipperPreiviewDataTypeEnum.SELECTED_ITEM:
        ClipperPreiviewData = new ClipperSelectedItemPreiviewData(
          getSelectElement
        );
        break;
      case ClipperPreiviewDataTypeEnum.READABILITY: {
        ClipperPreiviewData = new ClipperReadabilityPreiviewData(
          await getReadabilityContent()
        );
        break;
      }
      case ClipperPreiviewDataTypeEnum.SCREENSHOT: {
        //todo 这里逻辑以后需要修改
        const selectArea = await getSelectArea();
        await toggleClipperTool();
        const base64Capture = await captureVisibleTabBase64();
        await toggleClipperTool();
        ClipperPreiviewData = new ClipperScreenshootPreviewDate(
          selectArea,
          base64Capture,
          this.baseHost
        );
        break;
      }
      default:
        return;
    }
    this.clipperPreiviewDataType = type;
    this.clipperPreiviewDataMap[type] = ClipperPreiviewData;
  };

  @action onGoToSetting = () => {
    this.settingPreference = !this.settingPreference;
  };

  handleCloseTool = () => {
    this.contentScriptTool.toggleClipperTool();
  };

  @action uploadImage = async () => {
    const {
      clipperPreiviewDataType,
      clipperPreiviewDataMap,
      settingPreference
    } = this;
    const data = clipperPreiviewDataMap[clipperPreiviewDataType];
    this.uploadingImage = true;
    if (!clipperPreiviewDataType || settingPreference) {
      this.uploadingImage = false;
      message.info('没有数据');
      return;
    }
    if (this.baseHost !== 'https://www.yuque.com') {
      this.uploadingImage = false;
      message.info('只支持上传到 yuque.com');
      return;
    }
    const cookie = await this.getCookie();
    if (data && data.getContent && data.setContent) {
      let content = data.getContent();
      const result = content.match(/!\[.*?\]\(http(.*?)\)/g);
      if (result) {
        const images: string[] = result
          .map(o => {
            const temp = /!\[.*?\]\((http.*?)\)/.exec(o);
            if (temp) {
              return temp[1];
            }
            return '';
          })
          .filter(o => o && !o.startsWith('https://cdn-pri.nlark.com'));
        for (let image of images) {
          try {
            const res = await axios.get(image, { responseType: 'blob' });
            let blob: Blob = res.data;
            if (blob.type === 'image/webp') {
              blob = blob.slice(0, blob.size, 'image/jpeg');
            }
            const imageContentType = [
              'image/svg+xml',
              'image/jpeg',
              'image/webp',
              'image/png',
              'image/gif'
            ];
            if (imageContentType.indexOf(blob.type) !== -1) {
              let formData = new FormData();
              formData.append('file', blob, 'test.png');
              const result = await axios.post(
                `${
                  this.baseHost
                }/api/upload/attach?ctoken=${cookie}&type=image`,
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                }
              );
              content = content.replace(image, result.data.data.url);
              data.setContent(content);
            }
          } catch (error) {
            console.log('上传失败');
          }
        }
      }
    }
    message.info('上传成功');
    this.uploadingImage = false;
  };

  @action setUserSetting = async (newSetting: StorageUserInfo) => {
    try {
      await this.storage.setUserSetting(newSetting);
      this.userSetting = newSetting;
    } catch (error) {
      message.success('设置失败');
    }
    message.error('设置成功');
  };
}
