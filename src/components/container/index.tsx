import React from 'react';
import styles from './index.less';
import { CloseOutlined } from '@ant-design/icons';

const Container: React.FC = ({ children }) => {
  return <div className={styles.mainContainer}>{children}</div>;
};

export interface ToolContainerProps {
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
              <CloseOutlined />
            </div>
            {<div>{this.props.children}</div>}
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

export const CenterContainer: React.FC = ({ children }) => {
  return <div className={styles.centerContainer}>{children}</div>;
};

export const EditorContainer: React.FC = ({ children }) => {
  return <div className={styles.editorContainer}>{children}</div>;
};
