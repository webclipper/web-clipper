import * as React from 'react';
import { ClipperFullPagePreiviewData } from '../../store/ClipperPreview';
import * as styles from './index.scss';
import * as HyperMD from 'hypermd';

export interface ClipperFullPagePreiviewProps {
  data: ClipperFullPagePreiviewData;
}

class ClipperFullPagePreiview extends React.Component<ClipperFullPagePreiviewProps> {

  componentDidMount = () => {
    let myTextarea = document.getElementById(styles.previewMarkdownInputArea) as HTMLTextAreaElement;
    let myCodeMirror = HyperMD.fromTextArea(myTextarea, {
      hmdModeLoader: false,
    });
    myCodeMirror.on('change', (editor: any) => {
      this.props.data.setFullPage(editor.getValue());
    });
    myCodeMirror.setSize(800, 621);
  }

  render() {
    return (
      <div className={styles.clipperReadabilityPreview}>
        <div className={styles.previewTitle}>
          <span>整个页面</span>
        </div>
        <textarea id={styles.previewMarkdownInputArea} defaultValue={this.props.data.fullPage} ></textarea>
      </div >
    );
  }
}

export default ClipperFullPagePreiview;
