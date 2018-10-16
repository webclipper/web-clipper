import { ToolStore } from '../../store/ClipperTool';
import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { Icon } from 'antd';
import * as styles from './index.scss';
import Loading from '../../components/loading';
import ClipperTool from '../../components/clippertool';
import Complate from '../../components/complate';

import PreviewContent from '../../components/preview';

interface ClipperToolContainerProps {
  toolState: ToolStore;
}

@observer
class ClipperToolContainer extends React.Component<ClipperToolContainerProps> {

  @computed get toolStore() {
    return this.props.toolState;
  }

  @computed get showPreiview() {
    return !!this.toolStore.clipperPreiviewDataType && !this.toolStore.submitting && !this.toolStore.complate && !this.toolStore.loading;
  }

  render() {
    let content;
    if (this.toolStore.loading) {
      content = <Loading></Loading>;
    } else {
      if (!this.toolStore.complate) {
        content = <ClipperTool
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
          title={this.toolStore.title} ></ClipperTool>;
      } else {
        content = <Complate href={this.toolStore.createdDocumentHref}></Complate>;
      }
    }
    return (
      <div>
        <div className={styles.previewContainer} onClick={this.toolStore.handleCloseTool}></div>
        <div className={styles.clipperToolContainer}>
          <div style={{ position: 'relative' }}>
            <div className={styles.closeButton} onClick={this.toolStore.handleCloseTool}>
              <Icon type="close" />
            </div>
            <div>
              {content}
            </div>
            {
              this.showPreiview && <PreviewContent map={this.toolStore.clipperPreiviewDataMap} type={this.toolStore.clipperPreiviewDataType}></PreviewContent>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default ClipperToolContainer;
