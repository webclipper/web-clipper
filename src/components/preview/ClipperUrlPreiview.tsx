import * as React from 'react';
import { Input } from 'antd';
import { ClipperUrlPreiviewData } from '../../store/ClipperPreview';
import * as styles from './index.scss';

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
      <div className={styles.preview}>
        <div className={styles.previewTitle}>
          <span>书签</span>
        </div>
        <div className={styles.previewContent}>
          <p>链接</p>
          <TextArea defaultValue={this.props.data.href} autosize={{ minRows: 2, maxRows: 2 }} onChange={this.onHrefChange} />
          <p>备注</p>
          <TextArea defaultValue={this.props.data.mark} autosize={{ minRows: 6, maxRows: 6 }} onChange={this.onMaskChange} />
        </div>
      </div>
    );
  }
}

export default ClipperUrlPreiview;
