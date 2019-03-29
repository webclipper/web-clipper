import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  SerializedExtensionWithId,
  ExtensionType,
} from '../../extensions/interface';
import TextEditor from './TextEditor';
import ImageEditor from './ImageEditor';

const useActions = {};

const mapStateToProps = ({
  router,
  userPreference: { extensions },
}: GlobalStore) => {
  return { router, extensions };
};
type PageState = {};
type PageOwnProps = {};
type PageProps = ReturnType<typeof mapStateToProps> &
  typeof useActions &
  PageOwnProps;

class ClipperPluginPage extends React.Component<PageProps, PageState> {
  render() {
    const extension: SerializedExtensionWithId = this.props.extensions.find(
      o => `/plugins/${o.id}` === this.props.router.location.pathname
    );
    if (!extension) {
      return <div />;
    }
    if (extension.type === ExtensionType.Text) {
      return <TextEditor extension={extension} />;
    }
    if (extension.type === ExtensionType.Image) {
      return <ImageEditor extension={extension} />;
    }
  }
}

export default connect(
  mapStateToProps,
  (dispatch: Dispatch) =>
    bindActionCreators<typeof useActions, typeof useActions>(
      useActions,
      dispatch
    )
)(ClipperPluginPage as React.ComponentType<PageProps>);
