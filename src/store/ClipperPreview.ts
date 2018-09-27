
import {
    observable,
    action,

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
