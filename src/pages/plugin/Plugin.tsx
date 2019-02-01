import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as HyperMD from 'hypermd';
import {
  updateTextClipperData,
  asyncRunPlugin
} from '../../store/actions/clipper';
import { EditorContainer } from '../../components/container';

const useActions = {
  asyncRunPlugin: asyncRunPlugin.started,
  updateTextClipperData
};

const mapStateToProps = ({ router, clipper }: GlobalStore) => {
  return {
    router,
    clipper,
    clipperData: clipper.clipperData,
    pathname: router.location.pathname
  };
};
type PageState = {};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageOwnProps = {
  plugin: ClipperPluginWithRouter;
};
type PageProps = PageStateProps & PageDispatchProps & PageOwnProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(
    useActions,
    dispatch
  );

const editorId = 'DiamondYuan_Love_LJ';

class ClipperPluginPage extends React.Component<PageProps, PageState> {
  private myCodeMirror: any;

  componentDidUpdate() {
    const { clipperData, pathname } = this.props;
    const data: TextClipperData = (clipperData[
      pathname
    ] as TextClipperData) || { type: 'text', data: '' };

    if (this.myCodeMirror) {
      const value = this.myCodeMirror.getValue();
      if (data.data !== value) {
        this.myCodeMirror.setValue(data.data);
      }
    }
  }

  componentDidMount = () => {
    const { clipperData, pathname, plugin } = this.props;
    let myTextarea = document.getElementById(editorId) as HTMLTextAreaElement;
    this.myCodeMirror = HyperMD.fromTextArea(myTextarea, {
      hmdModeLoader: false
    });
    if (!clipperData[pathname] && pathname === plugin.router) {
      this.props.asyncRunPlugin({
        plugin
      });
    }
    const data: TextClipperData = (clipperData[
      pathname
    ] as TextClipperData) || { type: 'text', data: '' };
    this.myCodeMirror.setValue(data.data);
    this.myCodeMirror.on('change', (editor: any) => {
      this.props.updateTextClipperData({
        path: pathname,
        data: {
          type: 'text',
          data: editor.getValue()
        }
      });
    });
    this.myCodeMirror.setSize(800, 621);
  };

  render() {
    return (
      <EditorContainer>
        <textarea id={editorId} />
      </EditorContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClipperPluginPage as React.ComponentType<PageProps>);
