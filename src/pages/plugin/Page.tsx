import React from 'react';
import { connect } from 'dva';
import { ExtensionType } from '../../extensions/interface';
import TextEditor from './TextEditor';
import ImageEditor from './ImageEditor';
import { GlobalStore } from '../../store/reducers/interface';
import { DvaRouterProps } from 'common/types';

const mapStateToProps = ({ userPreference: { extensions } }: GlobalStore) => {
  return { extensions };
};

type PageProps = ReturnType<typeof mapStateToProps>;

const ClipperPluginPage: React.FC<PageProps & DvaRouterProps> = props => {
  const {
    history: {
      location: { pathname },
    },
    extensions,
  } = props;
  const extension = extensions.find(o => `/plugins/${o.id}` === pathname);
  if (!extension) {
    return <div />;
  }
  if (extension.type === ExtensionType.Text) {
    return <TextEditor extension={extension} pathname={pathname} />;
  }
  if (extension.type === ExtensionType.Image) {
    return <ImageEditor extension={extension} pathname={pathname} />;
  }
  return <div>un support plugin</div>;
};

export default connect(mapStateToProps)(ClipperPluginPage);
