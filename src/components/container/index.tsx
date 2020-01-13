import React from 'react';
import styles from './index.less';
import { Icon } from 'antd';

export default class Container extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <div className={styles.mainContainer}>{this.props.children}</div>
      </React.Fragment>
    );
  }
}

interface ToolContainerProps {
  onClickCloseButton?: () => void;
  onClickMask?: () => void;
}

export class ToolContainer extends React.Component<ToolContainerProps> {
  onClickCloseButton = () => {
    if (this.props.onClickCloseButton) {
      this.props.onClickCloseButton();
    }
  };

  handleClickMask = () => {
    if (this.props.onClickMask) {
      this.props.onClickMask();
    }
  };

  public render() {
    return (
      <React.Fragment>
        <div className={styles.mask} onClick={this.handleClickMask}></div>
        <Container>
          <div className={styles.toolContainer}>
            <div className={styles.closeButton} onClick={this.onClickCloseButton}>
              <Icon type="close" />
            </div>
            {<div>{this.props.children}</div>}
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

export class CenterContainer extends React.Component {
  public render() {
    return <div className={styles.centerContainer}>{this.props.children}</div>;
  }
}

export class EditorContainer extends React.Component {
  public render() {
    return (
      <Container>
        <div className={styles.editorContainer}>{this.props.children}</div>
      </Container>
    );
  }
}
