import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { asyncRunExtension } from '../../store/actions';
import { SerializedExtensionWithId } from '../../extensions/interface';
import { EditorContainer } from 'components/container';
import * as styles from './index.scss';
import { isUndefined } from 'common/object';
import { GlobalStore } from '../../store/reducers/interface';
import { ImageClipperData } from '../../store/reducers/userPreference/interface';

const useActions = {
  asyncRunExtension: asyncRunExtension.started,
};

const mapStateToProps = ({
  router: {
    location: { pathname },
  },
  clipper: { clipperData },
}: GlobalStore) => {
  return {
    clipperData,
    pathname,
  };
};
type PageState = {};
type PageOwnProps = {
  extension: SerializedExtensionWithId;
};
type PageProps = ReturnType<typeof mapStateToProps> & typeof useActions & PageOwnProps;

class ClipperPluginPage extends React.Component<PageProps, PageState> {
  componentDidMount = () => {
    const { extension, clipperData, pathname } = this.props;
    const data = clipperData[pathname];
    if (isUndefined(data)) {
      this.props.asyncRunExtension({
        extension,
      });
    }
  };

  render() {
    const { clipperData, pathname } = this.props;
    const data = clipperData[pathname] as ImageClipperData;
    if (!data) {
      return <EditorContainer />;
    }
    return (
      <EditorContainer>
        <img src={data.dataUrl} className={styles.imageContent} />
      </EditorContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  (dispatch: Dispatch) =>
    bindActionCreators<typeof useActions, typeof useActions>(useActions, dispatch)
)(ClipperPluginPage as React.ComponentType<PageProps>);
