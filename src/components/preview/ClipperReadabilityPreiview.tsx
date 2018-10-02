import * as React from 'react';
import { Input } from 'antd';
import { ClipperReadabilityPreiviewData } from '../../store/ClipperPreview';
import * as styles from './index.scss';

export interface ClipperReadabilityPreiviewProps {
  data: ClipperReadabilityPreiviewData;
}

const { TextArea } = Input;

class ClipperReadabilityPreiview extends React.Component<ClipperReadabilityPreiviewProps> {

  render() {
    return (
      <div className={styles.preview}>
        <div className={styles.previewTitle}>
          <span>智能提取</span>
        </div>
        <div className={styles.previewContent}>
          <TextArea defaultValue={this.props.data.content} autosize={{ minRows: 6, maxRows: 6 }} />
        </div>
      </div>
    );
  }
}

export default ClipperReadabilityPreiview;
