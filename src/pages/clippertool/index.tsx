import { ToolStore } from '../../store/ClipperTool';
import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { Icon } from 'antd';
import * as styles from './index.scss';
import Loading from '../../components/loading';
import ClipperTool from '../../components/clippertool';



interface ClipperToolContainerProps {
    toolState: ToolStore;
}



@observer
class ClipperToolContainer extends React.Component<ClipperToolContainerProps> {

    @computed get toolStore() {
        return this.props.toolState;
    }

    render() {
        let content;
        if (this.toolStore.loading) {
            content = <Loading></Loading>;
        } else {
            if (!this.toolStore.complate) {
                content = <ClipperTool
                    defaultBookId={this.toolStore.defaultBookId}
                    books={this.toolStore.books}
                    onGoToSetting={this.toolStore.onGoToSetting}
                    onDeleteElement={this.toolStore.onDeleteElement}
                    submitting={this.toolStore.submitting}
                    onPostNote={this.toolStore.onPostNote}
                    userProfile={this.toolStore.userProfile}
                    onSetBookId={this.toolStore.onSetBookId}
                    userHomePage={this.toolStore.userHomePage}
                    onChangeTitle={this.toolStore.changeTitle}
                    title={this.toolStore.title} ></ClipperTool>;
            } else {
                content = <p>success</p>;
            }
        }
        return (
            <div className={styles.clipperToolContainer}>
                <div style={{ position: 'relative' }}>
                    <div className={styles.closeButton} onClick={this.toolStore.onClosePage}>
                        <Icon type="close" />
                    </div>
                    <div>
                        {content}
                    </div>
                </div>
            </div>
        );
    }
}



export default ClipperToolContainer;
