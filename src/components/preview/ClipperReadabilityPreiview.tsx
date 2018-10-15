import * as React from 'react';
import { ClipperReadabilityPreiviewData } from '../../store/ClipperPreview';
import * as styles from './index.scss';
import * as HyperMD from 'HyperMD';
import { observer } from 'mobx-react';

export interface ClipperReadabilityPreiviewProps {
  data: ClipperReadabilityPreiviewData;
}

@observer
class ClipperReadabilityPreiview extends React.Component<ClipperReadabilityPreiviewProps> {

  componentDidMount = () => {
    let myTextarea = document.getElementById(styles.previewMarkdownInputArea) as HTMLTextAreaElement;
    let myCodeMirror = HyperMD.fromTextArea(myTextarea, {
      hmdModeLoader: false,
    });
    myCodeMirror.on('change', (editor: any) => {
      this.props.data.changeContent(editor.getValue());
    });
    myCodeMirror.setSize(800, 621);
  }

  render() {
    return (
      <div className={styles.clipperReadabilityPreview}>
        <div className={styles.previewTitle}>
          <span>智能提取</span>
        </div>
        <textarea id={styles.previewMarkdownInputArea} defaultValue={this.props.data.content} ></textarea>
      </div >
    );
  }
}

export default ClipperReadabilityPreiview;
