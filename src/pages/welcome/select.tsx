import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { CenterContainer } from '../../components/container';
import * as styles from './index.scss';
import { emptyFunction } from '../../utils';
import { Input } from 'antd';

const useActions = {
  toggleQRCodeStatus: emptyFunction
};

const mapStateToProps = (store: GlobalStore) => {
  return {
    closeQRCode: true,
    containToken: true,
    QRCodeContent: '',
    store
  };
};
type PageState = {};

type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageOwnProps = {};
type PageProps = PageStateProps & PageDispatchProps & PageOwnProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(
    useActions,
    dispatch
  );

class Page extends React.Component<PageProps, PageState> {
  render() {
    return (
      <CenterContainer>
        <div className={styles.mainContent}>
          <Input />
        </div>
      </CenterContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page as React.ComponentType<PageProps>);
