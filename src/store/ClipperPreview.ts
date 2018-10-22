
import {
  observable, action,
} from 'mobx';

export interface ClipperPreiviewData {
  toBody(): string;
}

export class ClipperUrlPreiviewData implements ClipperPreiviewData {

  @observable href: string
  @observable mark: string

  constructor(href: string) {
    this.href = href;
  }

  @action setMark = (input: string) => {
    this.mark = input;
  }

  @action setHref = (input: string) => {
    this.href = input;
  }

  toBody = () => {
    return `## 链接 \n ${this.href} \n ## 备注 \n ${this.mark}`;
  }
}

//剪辑整个页面
export class ClipperFullPagePreiviewData implements ClipperPreiviewData {

  @observable fullPage: string

  constructor(fullPage: string) {
    this.fullPage = fullPage;
  }

  @action setFullPage = (input: string) => {
    this.fullPage = input;
  }

  toBody = () => {
    return this.fullPage;
  }
}

export class ClipperSelectedItemPreiviewData implements ClipperPreiviewData {

  @observable selectedItem: string

  private getSelectItem: () => Promise<String>;

  constructor(getSelectItem: () => Promise<String>) {
    this.selectedItem = '';
    this.getSelectItem = getSelectItem;
  }

  @action setSelectedItem = (input: string) => {
    this.selectedItem = input;
  }

  toBody = () => {
    return this.selectedItem;
  }
  clipWeb = async () => {
    if (this.selectedItem) {
      this.selectedItem += '\n';
    }
    this.selectedItem += await this.getSelectItem();
  }
}

export class ClipperReadabilityPreiviewData implements ClipperPreiviewData {

  @observable content: string

  constructor(fullPage: string) {
    this.content = fullPage;
  }

  @action changeContent = (input: string) => {
    this.content = input;
  }

  toBody = () => {
    return `${this.content}`;
  }

}

