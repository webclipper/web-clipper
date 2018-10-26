import * as React from 'react';
import { observer } from 'mobx-react';
import * as styles from './index.scss';
import { ClipperScreenshootPreviewDate } from '../../store/ClipperPreview';

export interface ClipperScreenshootPreviewPreiviewProps {
  data: ClipperScreenshootPreviewDate;
}

function loadImage(date: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = date;
  });
}

@observer
class ClipperScreenshootPreview extends React.Component<ClipperScreenshootPreviewPreiviewProps> {

  private drawer: HTMLCanvasElement

  componentDidMount = async () => {

    if (!this.drawer || !this.drawer.getContext('2d') || !this.props.data.selectArea.leftTop || !this.props.data.selectArea.rightBottom) {
      return;
    }

    const base64Capture = this.props.data.base64Capture;
    const img = await loadImage(base64Capture);
    let ctx = this.drawer.getContext('2d')!;
    let sx;
    let sy;
    let sheight;
    let swidth;
    if (this.props.data.selectArea.rightBottom.clientX === this.props.data.selectArea.leftTop.clientX && this.props.data.selectArea.rightBottom.clientY === this.props.data.selectArea.leftTop.clientY) {
      sx = 0;
      sy = 0;
      swidth = img.width;
      sheight = img.height;
    } else {
      const dpi = img.width / document.body.clientWidth;
      sx = this.props.data.selectArea.leftTop.clientX * dpi;
      sy = this.props.data.selectArea.leftTop.clientY * dpi;
      swidth = (this.props.data.selectArea.rightBottom.clientX - this.props.data.selectArea.leftTop.clientX) * dpi;
      sheight = (this.props.data.selectArea.rightBottom.clientY - this.props.data.selectArea.leftTop.clientY) * dpi;
    }
    this.drawer.height = sheight;
    this.drawer.width = swidth;
    ctx.drawImage(img, sx, sy, swidth, sheight, 0, 0, swidth, sheight);
    this.props.data.changeResult(this.drawer.toDataURL());
  }

  render() {
    return (
      <div className={styles.screenshotCapturePreview}>
        <div className={styles.screenshotCaptureCanvasContainer}>
          <canvas ref={(ref) => { this.drawer = ref! }} style={{ maxHeight: '100%', maxWidth: '100%' }} ></canvas>
        </div>
      </div>
    );
  }
}

export default ClipperScreenshootPreview;

