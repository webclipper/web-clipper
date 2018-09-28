import * as React from 'react';
import { Input } from 'antd';
import { ClipperFullPagePreiviewData } from '../../store/ClipperPreview';
import * as styles from './index.scss';

export interface ClipperFullPagePreiviewProps {
    data: ClipperFullPagePreiviewData;
}

const { TextArea } = Input;

class ClipperFullPagePreiview extends React.Component<ClipperFullPagePreiviewProps> {

    onDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        this.props.data.setFullPage(value);
    }

    render() {
        return (

            <div className={styles.preview}>
                <div className={styles.previewTitle}>
                    <span>书签</span>
                </div>
                <div className={styles.previewContent}>
                    <p>备注</p>
                    <TextArea defaultValue={this.props.data.fullPage} autosize={{ minRows: 20, maxRows: 20 }} onChange={this.onDataChange} />

                </div>
            </div>

        );
    }
}

export default ClipperFullPagePreiview;
