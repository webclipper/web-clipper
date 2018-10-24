import { TypedCommonStorageInterface } from './../services/common/store/index';
import { ContentScriptTool } from './../services/common/contentScripttool/index';

import {
  observable,
  action,
  runInAction
} from 'mobx';

import YuqueApi from '../services/api/api';
import { BookSerializer } from '../services/api/reposService';
import { UserProfile } from '../services/api/userService';
import store from '../services/common/store';
import { ClipperPreiviewDataTypeEnum } from '../enums';
import { PostDocRequest } from '../services/api/documentService';
import { ClipperUrlPreiviewData, ClipperReadabilityPreiviewData, ClipperPreiviewData, ClipperFullPagePreiviewData, ClipperSelectedItemPreiviewData } from './ClipperPreview';

export class ToolStore {

  //是否初始化
  initialization: boolean;
  yuqueApi: YuqueApi
  //知识库列表
  books: BookSerializer[];
  //用户信息
  userProfile: UserProfile;
  userHomePage: string
  baseHost: string
  contentScriptTool: ContentScriptTool
  url: string
  storage: TypedCommonStorageInterface
  //笔记的标题
  @observable title: string;
  @observable elementId: string;
  @observable submitting: boolean;
  @observable loading: boolean;
  @observable settingPreferemce: boolean;
  @observable complate: boolean;
  @observable book: BookSerializer;
  @observable createdDocumentHref: string;
  @observable clipperPreiviewDataType: ClipperPreiviewDataTypeEnum;
  @observable clipperPreiviewDataMap: { [key: string]: ClipperPreiviewData };

  constructor(contentScriptTool: ContentScriptTool) {
    this.contentScriptTool = contentScriptTool;
    this.initialization = false;
    this.submitting = false;
    this.loading = true;
    this.settingPreferemce = false;
    this.storage = store;
    contentScriptTool.getDocumentInfo().then(re => {
      this.title = re.title;
      this.url = re.url;
    });
  }

  async init() {
    const userSetting = await store.getUserSetting();
    const prepart = !!userSetting && !!userSetting.defualtBookId && !!userSetting.baseURL && !!userSetting.token;
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
    const defaultBook = books.find(o => { return o.id === userSetting.defualtBookId });
    if (!defaultBook) {
      throw Error('默认的知识库被删除了');
    }
    this.userHomePage = `${this.baseHost}/${userProfile.login}`;
    this.yuqueApi = yuqueApi;
    this.userProfile = userProfile;
    this.books = books;
    this.book = defaultBook;
    this.clipperPreiviewDataMap = {};
    this.complateLoading();
  }

  @action complateLoading = () => {
    this.loading = false;
  }

  @action changeTitle = (input: string) => {
    this.title = input;
  }
  @action.bound
  async onPostNote() {
    this.submitting = true;
    const postDocRequest: PostDocRequest = {
      title: this.title,
      body: this.clipperPreiviewDataMap[this.clipperPreiviewDataType].toBody()
    };
    const createdDocument = await this.yuqueApi.documentService.createDocument(this.book.id, postDocRequest);
    runInAction(() => {
      this.complate = true;
      this.submitting = false;
      this.createdDocumentHref = `${this.baseHost}/${this.book.namespace}/${createdDocument.slug}`;
    });
  }

  @action onDeleteElement = async () => {
    await this.contentScriptTool.cleanElement();
  }

  @action onSetBookId = (input: number) => {
    this.book = this.books.find(o => { return o.id === input })!;
  }

  @action onClipperData = async (type: ClipperPreiviewDataTypeEnum) => {
    this.settingPreferemce = false;
    let ClipperPreiviewData = this.clipperPreiviewDataMap[type];
    if (ClipperPreiviewData) {
      this.clipperPreiviewDataType = type;
      return;
    }
    const { getFullPage, getSelectElement, getReadabilityContent } = this.contentScriptTool;

    switch (type) {
      case ClipperPreiviewDataTypeEnum.URL:
        ClipperPreiviewData = new ClipperUrlPreiviewData(this.url);
        break;
      case ClipperPreiviewDataTypeEnum.FULL_PAGE:
        ClipperPreiviewData = new ClipperFullPagePreiviewData(await getFullPage());
        break;
      case ClipperPreiviewDataTypeEnum.SELECTED_ITEM:
        ClipperPreiviewData = new ClipperSelectedItemPreiviewData(getSelectElement);
        break;
      case ClipperPreiviewDataTypeEnum.READABILITY: {
        ClipperPreiviewData = new ClipperReadabilityPreiviewData(await getReadabilityContent());
        break;
      }
      default:
        return;
    }
    this.clipperPreiviewDataType = type;
    this.clipperPreiviewDataMap[type] = ClipperPreiviewData;
  }

  @action onGoToSetting = () => {
    this.settingPreferemce = !this.settingPreferemce;
  }

  handleCloseTool = () => {
    this.contentScriptTool.toggleClipperTool();
  }

}
