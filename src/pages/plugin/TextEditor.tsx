import React, { useEffect } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'dva';
import { changeData } from 'pageActions/clipper';
import { asyncRunExtension } from 'pageActions/userPreference';
import { EditorContainer } from 'components/container';
import { GlobalStore } from 'common/types';
import { IExtensionWithId } from '@/extensions/common';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

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
  extension: IExtensionWithId;
};
type PageProps = ReturnType<typeof mapStateToProps> & typeof useActions & PageOwnProps;

const editorId = 'DiamondYuan_Love_LJ';

const ClipperPluginPage: React.FC<PageProps> = () => {
  useEffect(() => {
    let myTextarea = document.getElementById(editorId) as HTMLTextAreaElement;
    ClassicEditor.create(myTextarea, {
      plugins: [Essentials, Paragraph, Bold, Italic],
      toolbar: ['bold', 'italic'],
    }).then((editor: any) => {
      editor.editing.view.change((writer: any) => {
        writer.setStyle('height', '800px', editor.editing.view.document.getRoot());
        writer.setStyle('width', '800px', editor.editing.view.document.getRoot());
      });
    });
  }, []);

  return (
    <EditorContainer>
      <textarea id={editorId} />
    </EditorContainer>
  );
};

export default connect(mapStateToProps, (dispatch: Dispatch) =>
  bindActionCreators<typeof useActions, typeof useActions>(useActions, dispatch)
)(ClipperPluginPage as React.ComponentType<PageProps>);
