import * as React from 'react';
import * as styles from './index.scss';
import { Icon } from 'antd';

export default class Container extends React.Component {
  public render() {
    return <div className={styles.mainContainer}>{this.props.children}</div>;
  }
}

interface ToolContainerProps {
  onClickCloseButton?: () => void;
}

export class ToolContainer extends React.Component<ToolContainerProps> {
  onClickCloseButton = () => {
    if (this.props.onClickCloseButton) {
      this.props.onClickCloseButton();
    }
  };

  public render() {
    return (
      <Container>
        <div className={styles.toolContainer}>
          <div className={styles.closeButton} onClick={this.onClickCloseButton}>
            <Icon type='close' />
          </div>
          {<div>{this.props.children}</div>}
        </div>
      </Container>
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
