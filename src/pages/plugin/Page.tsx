import React from 'react';
import { connect, router } from 'dva';
import { ExtensionType } from '@web-clipper/extensions';
import TextEditor from './TextEditor';
import ImageEditor from './ImageEditor';
import { GlobalStore, DvaRouterProps } from '@/common/types';

const { Redirect } = router;

const mapStateToProps = ({ extension: { extensions } }: GlobalStore) => {
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
    return <Redirect to="/"></Redirect>;
  }
  if (extension.type === ExtensionType.Text) {
    return <TextEditor extension={extension} pathname={pathname} />;
  }
  if (extension.type === ExtensionType.Image) {
    return <ImageEditor extension={extension} pathname={pathname} />;
  }
  return <Redirect to="/"></Redirect>;
};

export default connect(mapStateToProps)(ClipperPluginPage);
