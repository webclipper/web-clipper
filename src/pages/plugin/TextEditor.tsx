import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'dva';
import { changeData } from 'pageActions/clipper';
import { asyncRunExtension } from 'pageActions/userPreference';
import * as HyperMD from 'hypermd';
import { EditorContainer } from 'components/container';
import { isUndefined } from 'common/object';
import { GlobalStore } from 'common/types';
import { IExtensionWithId } from '@/extensions/common';
import { parse } from 'qs';

const useActions = {
  asyncRunExtension: asyncRunExtension.started,
  changeData,
};

const mapStateToProps = ({
  clipper: { clipperData },
  userPreference: { liveRendering },
}: GlobalStore) => {
  return {
    liveRendering,
    clipperData,
  };
};
type PageOwnProps = {
  pathname: string;
  search?: string;
  extension: IExtensionWithId | null;
};
type PageProps = ReturnType<typeof mapStateToProps> & typeof useActions & PageOwnProps;

const editorId = 'DiamondYuan_Love_LJ';

class ClipperPluginPage extends React.Component<PageProps, { markdown: string }> {
  private myCodeMirror: any;

  constructor(props: any) {
    super(props);
    this.state = {
      markdown: '',
    };
  }

  checkExtension = () => {
    const { extension, clipperData, pathname, search } = this.props;
    const data = clipperData[pathname];
    if (isUndefined(data) && extension) {
      this.props.asyncRunExtension({
        pathname,
        extension,
      });
    }
    if (isUndefined(data) && search) {
      const content = parse(search.slice(1));
      this.props.changeData({
        data: content.markdown || '',
        pathName: this.props.pathname,
      });
      this.setState({
        markdown: (content.markdown as string) || '',
      });
      return content.markdown || '';
    }
    if (search && !isUndefined(data)) {
      const content = parse(search.slice(1));
      if (content.markdown !== this.state.markdown) {
        this.setState({
          markdown: (content.markdown as string) || '',
        });
        this.props.changeData({
          data: (content.markdown as string) || '',
          pathName: this.props.pathname,
        });
      }
    }
    return data || '';
  };

  componentDidUpdate = () => {
    const data = this.checkExtension();
    if (this.myCodeMirror) {
      const value = this.myCodeMirror.getValue();
      if (data !== value) {
        try {
          const that = this;
          setTimeout(() => {
            that.myCodeMirror.setValue(data);
            that.myCodeMirror.focus();
            that.myCodeMirror.setCursor(that.myCodeMirror.lineCount(), 0);
          }, 10);
        } catch (_error) {}
      }
    }
  };

  componentDidMount = () => {
    const data = this.checkExtension();
    let myTextarea = document.getElementById(editorId) as HTMLTextAreaElement;
    this.myCodeMirror = HyperMD.fromTextArea(myTextarea, {
      lineNumbers: false,
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

export default connect(mapStateToProps, (dispatch: Dispatch) =>
  bindActionCreators<typeof useActions, typeof useActions>(useActions, dispatch)
)(ClipperPluginPage as React.ComponentType<PageProps>);
