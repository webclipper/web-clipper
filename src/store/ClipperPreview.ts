import { SelectAreaPosion } from './../services/common/areaSelector/index';
import { Base64ImageToBolb } from '../services/utils/bolb';
import axios from 'axios';

import { observable, action } from 'mobx';

export interface ClipperPreiviewData {
  perpare?(): void;
  toBody(): string;
}

export class ClipperUrlPreiviewData implements ClipperPreiviewData {
  @observable href: string;
  @observable mark: string;

  constructor(href: string) {
    this.href = href;
  }

  @action setMark = (input: string) => {
    this.mark = input;
  };

  @action setHref = (input: string) => {
    this.href = input;
  };

  toBody = () => {
    return `## 链接 \n ${this.href} \n ## 备注 \n ${this.mark}`;
  };
}

//剪辑整个页面
export class ClipperFullPagePreiviewData implements ClipperPreiviewData {
  @observable fullPage: string;

  constructor(fullPage: string) {
    this.fullPage = fullPage;
  }

  @action setFullPage = (input: string) => {
    this.fullPage = input;
  };

  toBody = () => {
    return this.fullPage;
  };
}

export class ClipperSelectedItemPreiviewData implements ClipperPreiviewData {
  @observable selectedItem: string;

  private getSelectItem: () => Promise<String>;

  constructor(getSelectItem: () => Promise<String>) {
    this.selectedItem = '';
    this.getSelectItem = getSelectItem;
  }

  @action setSelectedItem = (input: string) => {
    this.selectedItem = input;
  };

  toBody = () => {
    return this.selectedItem;
  };
  clipWeb = async () => {
    if (this.selectedItem) {
      this.selectedItem += '\n';
    }
    this.selectedItem += await this.getSelectItem();
  };
}

export class ClipperReadabilityPreiviewData implements ClipperPreiviewData {
  @observable content: string;

  constructor(fullPage: string) {
    this.content = fullPage;
  }

  @action changeContent = (input: string) => {
    this.content = input;
  };

  toBody = () => {
    return `${this.content}`;
  };
}

export class ClipperScreenshootPreviewDate implements ClipperPreiviewData {
  @observable image: string;
  base64Capture: string;

  selectArea: SelectAreaPosion;

  result: string;

  imageUrl: string;

  baseHost: string;

  constructor(
    selectArea: SelectAreaPosion,
    base64Capture: string,
    baseHost: string
  ) {
    this.selectArea = selectArea;
    this.base64Capture = base64Capture;
    this.baseHost = baseHost;

    console.log(this.baseHost);
  }

  @action changeResult = (input: string) => {
    this.result = input;
  };

  //todo 需要移动到工具类
  getCookie = async () => {
    return new Promise<void>((resolve, _) => {
      chrome.cookies.get(
        {
          url: this.baseHost,
          name: 'ctoken'
        },
        function(cookie: any) {
          resolve(cookie.value);
        }
      );
    });
  };

  perpare = async () => {
    //todo 异常处理
    const cookie = await this.getCookie();
    let formData = new FormData();
    const blob = Base64ImageToBolb(this.result);
    formData.append('file', blob, 'test.png');
    //todo 不知道企业空间如何。现在这样写
    const result = await axios.post(
      `${this.baseHost}/api/upload/attach?ctoken=${cookie}&type=image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    this.imageUrl = result.data.data.url;
  };
  toBody = () => {
    return `![](${this.imageUrl})`;
  };
}
