
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


function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export class ToolStore {

    //是否初始化
    initialization: boolean;
    yuqueApi: YuqueApi
    defaultBookId: number;
    //知识库列表
    books: BookSerializer[];
    //用户信息
    userProfile: UserProfile;
    userHomePage: string
    //笔记的标题
    @observable title: string;
    @observable elementId: string;
    @observable submitting: boolean;
    @observable loading: boolean;
    @observable complate: boolean;
    @observable bookId: number;

    constructor(elementId: string) {
        this.initialization = false;
        this.title = document.title;
        this.submitting = false;
        this.loading = true;
        this.elementId = elementId;
    }
    async init() {
        const userSetting = await store.getUserSetting();
        const prepart = !!userSetting && !!userSetting.defualtBookId && !!userSetting.baseURL && !!userSetting.token;
        if (!prepart) {
            throw Error('语雀基础设施没设置好');
        }
        this.defaultBookId = userSetting.defualtBookId!;
        const yuqueApi = new YuqueApi({
            baseURL: userSetting.baseURL,
            token: userSetting.token
        });
        const userProfile = await yuqueApi.userService.getUser();
        const books = await yuqueApi.reposService.getUserRepos(userProfile.id);
        this.yuqueApi = yuqueApi;
        this.userProfile = userProfile;
        this.books = books;
        this.userHomePage = `${userSetting.baseURL.replace('/api/v2/', '')}/${userProfile.login}`;
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
        await sleep(1000);
        console.log(this);
        runInAction(() => {
            this.submitting = false;
        });
    }

    @action onDeleteElement = () => {
        new Highlighter().start().then(element => {
            $(element).remove();
        });
    }

    @action onSetBookId = (input: number) => {
        this.bookId = input;
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
