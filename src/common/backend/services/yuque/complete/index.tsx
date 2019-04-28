import React, { Component, Fragment } from 'react';
import QuickResponseCode from './quickResponseCode';
import { YuqueCompleteStatus } from '../interface';

interface Props {
  status: YuqueCompleteStatus;
}

export default class extends Component<Props> {
  render() {
    const {
      status: { repositoryId, accessToken, documentId, showQuickResponseCode },
    } = this.props;

    return (
      <Fragment>
        {showQuickResponseCode && (
          <QuickResponseCode
            repositoryId={repositoryId}
            accessToken={accessToken}
            documentId={documentId}
          />
        )}
      </Fragment>
    );
  }
}
