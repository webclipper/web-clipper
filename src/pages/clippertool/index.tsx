import { ToolStore } from '../../store/ClipperTool';
import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { Icon } from 'antd';
import * as styles from './index.scss';
import Loading from '../../components/loading';
import ClipperTool from '../../components/clippertool';
import Complate from '../../components/complete';

import PreviewContent from '../../components/preview';
import Preference from '../../components/preference';

interface ClipperToolContainerProps {
  toolState: ToolStore;
}

@observer
class ClipperToolContainer extends React.Component<ClipperToolContainerProps> {
  @computed
  get toolStore() {
    return this.props.toolState;
  }

  @computed
  get showPreiview() {
    return (
      !!this.toolStore.clipperPreiviewDataType &&
      !this.toolStore.submitting &&
      !this.toolStore.complate &&
      !this.toolStore.loading
    );
  }

  render() {
    let content;
    if (this.toolStore.loading) {
      content = <Loading />;
    } else {
      if (!this.toolStore.complate) {
        content = (
          <ClipperTool
            userSetting={this.toolStore.userSetting}
            clipperPreiviewDataType={this.toolStore.clipperPreiviewDataType}
            book={this.toolStore.book}
            books={this.toolStore.books}
            onGoToSetting={this.toolStore.onGoToSetting}
            onDeleteElement={this.toolStore.onDeleteElement}
            submitting={this.toolStore.submitting}
            onPostNote={this.toolStore.onPostNote}
            onClipperData={this.toolStore.onClipperData}
            userProfile={this.toolStore.userProfile}
            onSetBookId={this.toolStore.onSetBookId}
            userHomePage={this.toolStore.userHomePage}
            onChangeTitle={this.toolStore.changeTitle}
            title={this.toolStore.title}
          />
        );
      } else {
        content = (
          <Complate
            userSetting={this.toolStore.userSetting}
            createdDocumentInfo={this.toolStore.createdDocumentInfo}
            yuqueToken={this.toolStore.yuqueToken}
          />
        );
      }
    }
    return (
      <div>
        <div
          className={styles.previewContainer}
          onClick={this.toolStore.handleCloseTool}
        />
        <div className={styles.clipperToolContainer}>
          <div style={{ position: 'relative' }}>
            <div
              className={styles.closeButton}
              onClick={this.toolStore.handleCloseTool}
            >
              <Icon type="close" />
            </div>
            <div>{content}</div>
            {!this.toolStore.settingPreference && this.showPreiview && (
              <PreviewContent
                map={this.toolStore.clipperPreiviewDataMap}
                type={this.toolStore.clipperPreiviewDataType}
              />
            )}
            {this.toolStore.settingPreference && (
              <div className={styles.settingContainer}>
                <Preference
                  changeSetting={this.toolStore.setUserSetting}
                  userSetting={this.toolStore.userSetting}
                  books={this.toolStore.books}
                  defaultBook={this.toolStore.book}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ClipperToolContainer;
