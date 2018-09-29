import * as React from 'react';
import { ClipperSelectedItemPreiviewData } from '../../store/ClipperPreview';
import * as styles from './index.scss';
import { Input, Button } from 'antd';
import { observer } from 'mobx-react';

export interface ClipperSelectedItemPreiviewProps {
  data: ClipperSelectedItemPreiviewData;
}

const { TextArea } = Input;

@observer
class ClipperSelectedItemPreiview extends React.Component<ClipperSelectedItemPreiviewProps> {

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
          <TextArea value={this.props.data.selectedItem} autosize={{ minRows: 20, maxRows: 20 }} onChange={this.onDataChange} />
          <Button onClick={() => { this.props.data.addMore() }}>继续添加</Button>
        </div>
      </div>
    );
  }
}

export default ClipperSelectedItemPreiview;
