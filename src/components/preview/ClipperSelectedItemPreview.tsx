import * as React from 'react';
import * as HyperMD from 'HyperMD';
import { ClipperSelectedItemPreiviewData } from '../../store/ClipperPreview';
import * as styles from './index.scss';
import { Button } from 'antd';
import { observer } from 'mobx-react';

export interface ClipperSelectedItemPreiviewProps {
  data: ClipperSelectedItemPreiviewData;
}

@observer
class ClipperSelectedItemPreiview extends React.Component<ClipperSelectedItemPreiviewProps> {

  private mirror: any

  componentDidMount = () => {
    let myTextarea = document.getElementById(styles.previewMarkdownInputArea) as HTMLTextAreaElement;
    this.mirror = HyperMD.fromTextArea(myTextarea, {
      hmdModeLoader: false,
    });
    if (!this.props.data.selectedItem) {
      setTimeout(async () => {
        await this.props.data.clipWeb().then(() => {
          this.mirror.setValue(this.props.data.selectedItem);
        });
      });
    } else {
      this.mirror.setValue(this.props.data.selectedItem);
    }
    this.mirror.on('change', (editor: any) => {
      this.props.data.setSelectedItem(editor.getValue());
    });
    this.mirror.setSize(800, 621);
  }

  handleClick = async () => {
    await this.props.data.clipWeb().then(() => {
      this.mirror.setValue(this.props.data.selectedItem);
    });
  }

  render() {
    return (
      <div className={styles.clipperReadabilityPreview}>
        <div className={styles.previewTitle}>
          <span>手动选择</span>
        </div>
        <textarea id={styles.previewMarkdownInputArea} ></textarea>
        <div className={styles.clipperSelectedItemPreviewButton}>
          <Button onClick={() => { this.handleClick() }}>继续添加</Button>
        </div>
      </div>
    );
  }
}

export default ClipperSelectedItemPreiview;
