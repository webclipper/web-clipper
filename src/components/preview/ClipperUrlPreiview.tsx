import * as React from 'react';
import { Input } from 'antd';
import { ClipperUrlPreiviewData } from '../../store/ClipperPreview';



export interface ClipperUrlPreiviewProps {
    data: ClipperUrlPreiviewData;
}

const { TextArea } = Input;

class ClipperUrlPreiview extends React.Component<ClipperUrlPreiviewProps> {


    onHrefChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        this.props.data.setHref(value);
    }

    onMaskChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        this.props.data.setMark(value);
    }

    render() {
        return (
            <div>
                <p>链接</p>
                <TextArea defaultValue={this.props.data.href} autosize={{ minRows: 2, maxRows: 2 }} onChange={this.onHrefChange} />
                <p>备注</p>
                <TextArea autosize={{ minRows: 6, maxRows: 6 }} onChange={this.onMaskChange} />
            </div>
        );
    }
}



export default ClipperUrlPreiview;
