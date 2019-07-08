import React, { useEffect } from 'react';
import { connect } from 'dva';
import { asyncRunExtension } from 'pageActions/userPreference';
import { SerializedExtensionWithId } from '../../extensions/interface';
import { EditorContainer } from 'components/container';
import { isUndefined } from 'common/object';
import { GlobalStore, ImageClipperData } from '@/common/types';
import * as styles from './index.scss';

const mapStateToProps = ({ clipper: { clipperData } }: GlobalStore) => {
  return {
    clipperData,
  };
};
type PageOwnProps = {
  pathname: string;
  extension: SerializedExtensionWithId;
};
type PageProps = ReturnType<typeof mapStateToProps> & PageOwnProps & { dispatch: any };

const ImageEditor: React.FC<PageProps> = ({ extension, clipperData, pathname, dispatch }) => {
  useEffect(() => {
    const data = clipperData[pathname];
    if (isUndefined(data)) {
      dispatch(
        asyncRunExtension.started({
          pathname,
          extension,
        })
      );
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

export default connect(mapStateToProps)(ImageEditor);
