import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { changeData } from 'pageActions/clipper';
import { asyncRunExtension } from 'pageActions/userPreference';
import { SerializedExtensionWithId } from '../../extensions/interface';
import * as HyperMD from 'hypermd';
import { EditorContainer } from 'components/container';
import { isUndefined } from 'common/object';
import { GlobalStore } from '../../store/reducers/interface';

const useActions = {
  asyncRunExtension: asyncRunExtension.started,
  changeData,
};

const mapStateToProps = ({
  router: {
    location: { pathname },
  },
  clipper: { clipperData },
  userPreference: { liveRendering, showLineNumber },
}: GlobalStore) => {
  return {
    liveRendering,
    showLineNumber,
    clipperData,
    pathname,
  };
};
type PageState = {};
type PageOwnProps = {
  extension: SerializedExtensionWithId;
};
type PageProps = ReturnType<typeof mapStateToProps> & typeof useActions & PageOwnProps;

const editorId = 'DiamondYuan_Love_LJ';

class ClipperPluginPage extends React.Component<PageProps, PageState> {
  private myCodeMirror: any;

  checkExtension = () => {
    const { extension, clipperData, pathname } = this.props;
    const data = clipperData[pathname];
    // eslint-disable-next-line no-undefined
    if (isUndefined(data)) {
      this.props.asyncRunExtension({
        extension,
      });
    }
    return data || '';
  };

  componentDidUpdate = () => {
    const data = this.checkExtension();
    if (this.myCodeMirror) {
      const value = this.myCodeMirror.getValue();
      if (data !== value) {
        try {
          this.myCodeMirror.setValue(data);
        } catch (_error) {}
      }
    }
  };

  componentDidMount = () => {
    const data = this.checkExtension();
    let myTextarea = document.getElementById(editorId) as HTMLTextAreaElement;
    this.myCodeMirror = HyperMD.fromTextArea(myTextarea, {
      lineNumbers: !!this.props.showLineNumber,
      hmdModeLoader: false,
    });
    if (this.myCodeMirror) {
      const value = this.myCodeMirror.getValue();
      if (data !== value) {
        this.myCodeMirror.setValue(data);
      }
    }
    this.myCodeMirror.on('change', (editor: any) => {
      this.props.changeData({
        data: editor.getValue(),
        pathName: this.props.pathname,
      });
    });
    this.myCodeMirror.setSize(800, 621);
    if (this.props.liveRendering) {
      HyperMD.switchToHyperMD(this.myCodeMirror);
    } else {
      HyperMD.switchToNormal(this.myCodeMirror);
    }
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
  (dispatch: Dispatch) =>
    bindActionCreators<typeof useActions, typeof useActions>(useActions, dispatch)
)(ClipperPluginPage as React.ComponentType<PageProps>);
