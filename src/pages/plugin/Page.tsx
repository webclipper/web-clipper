import React from 'react';
import { connect } from 'react-redux';
import { ExtensionType } from '../../extensions/interface';
import TextEditor from './TextEditor';
import ImageEditor from './ImageEditor';
import { GlobalStore } from '../../store/reducers/interface';

const mapStateToProps = ({
  userPreference: { extensions },
  routing: {
    location: { pathname },
  },
}: GlobalStore) => {
  return { extensions, pathname };
};

type PageProps = ReturnType<typeof mapStateToProps>;

const ClipperPluginPage: React.FC<PageProps> = ({ pathname, extensions }) => {
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
