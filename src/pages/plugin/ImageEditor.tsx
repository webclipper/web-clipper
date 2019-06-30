import React, { useEffect } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'dva';
import { asyncRunExtension } from 'pageActions/userPreference';
import { SerializedExtensionWithId } from '../../extensions/interface';
import { EditorContainer } from 'components/container';
import { isUndefined } from 'common/object';
import { GlobalStore } from '../../store/reducers/interface';
import { ImageClipperData } from '../../store/reducers/userPreference/interface';
import * as styles from './index.scss';

const useActions = {
  asyncRunExtension: asyncRunExtension.started,
};

const mapStateToProps = ({ clipper: { clipperData } }: GlobalStore) => {
  return {
    clipperData,
  };
};
type PageOwnProps = {
  pathname: string;
  extension: SerializedExtensionWithId;
};
type PageProps = ReturnType<typeof mapStateToProps> & typeof useActions & PageOwnProps;

const ImageEditor: React.FC<PageProps> = ({
  extension,
  clipperData,
  pathname,
  asyncRunExtension,
}) => {
  useEffect(() => {
    const data = clipperData[pathname];
    if (isUndefined(data)) {
      asyncRunExtension({
        extension,
      });
    }
  }, [pathname, extension.id]);

  const data = clipperData[pathname] as ImageClipperData;
  if (!data) {
    return <EditorContainer />;
  }
  return (
    <EditorContainer>
      <img src={data.dataUrl} className={styles.imageContent} />
    </EditorContainer>
  );
};

export default connect(
  mapStateToProps,
  (dispatch: Dispatch) =>
    bindActionCreators<typeof useActions, typeof useActions>(useActions, dispatch)
)(ImageEditor);
