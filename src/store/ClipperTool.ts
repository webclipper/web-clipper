
import {
    observable,
    action,
    runInAction

} from 'mobx';

import YuqueApi from '../services/api/api';
import { BookSerializer } from '../services/api/reposService';
import { UserProfile } from '../services/api/userService';
import store from '../services/common/store';
import Highlighter from '../services/common/highlight';
import { ActionMessageType } from '../enums/actionMessageType';
import { ClipperPreiviewDataTypeEnum } from '../enums';
import { PostDocRequest } from '../services/api/documentService';
import { ClipperUrlPreiviewData, ClipperPreiviewData } from './ClipperPreview';



export class ToolStore {

    containerId: string
    //是否初始化
    initialization: boolean;
    yuqueApi: YuqueApi
    //知识库列表
    books: BookSerializer[];
    //用户信息
    userProfile: UserProfile;
    userHomePage: string
    baseHost: string
    //笔记的标题
    @observable title: string;
    @observable elementId: string;
    @observable submitting: boolean;
    @observable loading: boolean;
    @observable complate: boolean;
    @observable book: BookSerializer;
    @observable createdDocumentHref: string;
    @observable clipperPreiviewDataType: ClipperPreiviewDataTypeEnum;
    @observable clipperPreiviewDataMap: { [key: string]: ClipperPreiviewData };

    constructor(elementId: string) {
        this.initialization = false;
        this.title = document.title;
        this.submitting = false;
        this.loading = true;
        this.elementId = elementId;
    }


    async init(containerId: string) {
        this.containerId = containerId;
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
        $(`#${this.containerId}`).hide();
        try {
            await new Highlighter().start().then(element => {
                $(element).remove();
            });
        } catch (error) {

        }
        $(`#${this.containerId}`).show();
    }

    @action onSetBookId = (input: number) => {
        this.book = this.books.find(o => { return o.id === input })!;
    }

    //剪藏URL
    @action onClipperUrl = () => {
        this.clipperPreiviewDataType = ClipperPreiviewDataTypeEnum.URL;
        this.clipperPreiviewDataMap[this.clipperPreiviewDataType] = new ClipperUrlPreiviewData(window.location.href);
    }

    onGoToSetting = () => {
        chrome.runtime.sendMessage({
            action: ActionMessageType.GO_TO_SETTINGS,
        });
    }

    onClosePage = () => {
        $(`#${this.elementId}`).toggle();
    }

}
