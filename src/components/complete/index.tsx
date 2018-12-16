import * as React from 'react';
import { Button, Switch } from 'antd';
import 'antd-style';
import * as styles from './index.scss';
import * as QRCode from 'qrcode';
import { StorageUserInfo } from '../../services/common/store';

interface CompleteProps {
  createdDocumentInfo: {
    documentId: number;
    bookId: number;
    host: string;
    namespace: string;
    slug: string;
  };
  userSetting: StorageUserInfo;
  yuqueToken: string;
}
interface CompleteState {
  QRCodeUrl: string;
  incloudToken: boolean;
}

const qrcodeHost = `https://yuquewebclipper.diamondyuan.com/pro/`;

class Complete extends React.Component<CompleteProps, CompleteState> {
  constructor(props: CompleteProps) {
    super(props);
    this.state = {
      QRCodeUrl: '',
      incloudToken: false
    };
  }

  componentDidMount = () => {
    this.loadQRCode();
  };

  loadQRCode = () => {
    let qrResult = `${qrcodeHost}/index?repo_id=${
      this.props.createdDocumentInfo.bookId
    }&id=${this.props.createdDocumentInfo.documentId}`;
    if (this.state.incloudToken) {
      qrResult += `&token=${this.props.yuqueToken}`;
    }
    QRCode.toDataURL(
      qrResult,
      { errorCorrectionLevel: 'H' },
      (err: Error, url: string) => {
        if (err) {
          console.log(err);
        }
        this.setState({
          QRCodeUrl: url
        });
      }
    );
  };

  handleChange = (checked: boolean) => {
    this.setState({ incloudToken: checked }, () => {
      this.loadQRCode();
    });
  };

  public render() {
    const createdDocumentInfo = this.props.createdDocumentInfo;

    return (
      <div id={styles.mainTool}>
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>保存成功</h1>
          <a
            className={styles.menuButton}
            href={`${createdDocumentInfo.host}/${
              createdDocumentInfo.namespace
            }/${createdDocumentInfo.slug}`}
            target="_blank"
          >
            <Button style={{ marginTop: 16 }} size="large" type="primary" block>
              前往语雀查看
            </Button>
          </a>
        </section>
        {!this.props.userSetting.closeQRCode &&
          this.props.createdDocumentInfo.host === 'https://www.yuque.com' && (
          <section className={styles.section}>
            <h1 className={styles.sectionTitle}>
                在小程序上查看（请使用微信扫描）
            </h1>
            <img id={styles.qrcodeArea} src={this.state.QRCodeUrl} />
            <div>
              <span>附带语雀 Token </span>
              <Switch onChange={this.handleChange} />
              {this.state.incloudToken && (
                <p style={{ paddingTop: '10px' }}>
                    扫描后会自动在小程序中登陆，请注意保密。
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    );
  }
}
export default Complete;
