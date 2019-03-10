import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  updateTextClipperData,
  asyncRunPlugin,
  asyncTakeScreenshot
} from '../../store/actions/clipper';
import { EditorContainer } from '../../components/container';
import * as styles from './index.scss';

const useActions = {
  asyncRunPlugin: asyncRunPlugin.started,
  asyncTakeScreenshot: asyncTakeScreenshot.started,
  updateTextClipperData
};

const mapStateToProps = ({
  router,
  clipper,
  userPreference: { liveRendering, showLineNumber }
}: GlobalStore) => {
  return {
    router,
    clipper,
    liveRendering,
    showLineNumber,
    clipperData: clipper.clipperData,
    pathname: router.location.pathname
  };
};
type PageState = {};
type PageOwnProps = {};
type PageProps = ReturnType<typeof mapStateToProps> &
  typeof useActions &
  PageOwnProps;

class ImagePluginPage extends React.Component<PageProps, PageState> {
  componentDidMount = () => {
    this.props.asyncTakeScreenshot({
      pathname: this.props.pathname
    });
  };

  render() {
    const { clipperData, pathname } = this.props;
    const data = clipperData[pathname];
    if (!data || data.type !== 'image') {
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
    bindActionCreators<typeof useActions, typeof useActions>(
      useActions,
      dispatch
    )
)(ImagePluginPage as React.ComponentType<PageProps>);
