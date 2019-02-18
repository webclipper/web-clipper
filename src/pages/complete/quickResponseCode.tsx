import * as React from 'react';
import * as QRCode from 'qrcode';
import { Switch } from 'antd';
import * as styles from './index.scss';

interface PageState {
  includeToken: boolean;
  quickResponseCodeData: string | null;
}

interface PageProps {
  repositoryId: string;
  accessToken: string;
  documentId: string;
}
const quickResponseCodeHost = 'https://yuquewebclipper.diamondyuan.com/pro/';

export class QuickResponseCode extends React.Component<PageProps, PageState> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      includeToken: false,
      quickResponseCodeData: null
    };
  }

  componentDidMount = () => {
    this.loadQRCode();
  };

  handleChange = (checked: boolean) => {
    this.setState({ includeToken: checked }, () => {
      this.loadQRCode();
    });
  };

  /**
   * 把链接转换成图片的
   */
  loadQRCode = () => {
    const { documentId, accessToken, repositoryId } = this.props;
    const { includeToken } = this.state;

    let url = `${quickResponseCodeHost}/index?repo_id=${repositoryId}&id=${documentId}`;
    if (includeToken) {
      url += `&token=${accessToken}`;
    }
    QRCode.toDataURL(
      url,
      { errorCorrectionLevel: 'H' },
      (err: Error, quickResponseCodeData: string) => {
        if (err) {
          console.log(err);
        }
        this.setState({
          quickResponseCodeData
        });
      }
    );
  };

  render() {
    return (
      <div>
        <div>
          <span style={{ marginRight: '20px' }}>包含 AccessToken</span>
          <Switch onChange={this.handleChange} />
        </div>
        <div className={styles.quickResponseCodeContainer}>
          {this.state.quickResponseCodeData && (
            <img src={this.state.quickResponseCodeData} />
          )}
        </div>
      </div>
    );
  }
}
