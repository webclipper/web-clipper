import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Button, Input, Divider } from 'antd';
import {
  startCreateRepository,
  cancelCreateRepository,
  changeCreateRepositoryTitle,
  asyncCreateRepository
} from '../../store/actions/clipper';

const useActions = {
  onChangeTitle: changeCreateRepositoryTitle,
  onCreateRepository: asyncCreateRepository.started,
  onCancelCreate: cancelCreateRepository,
  onStartCreate: startCreateRepository
};

const mapStateToProps = ({ clipper }: GlobalStore) => {
  const { createMode, repositoryTitle, creating } = clipper.selectRepository;
  return {
    createMode: createMode,
    repositoryTitle: repositoryTitle,
    creating: creating
  };
};

type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageOwnProps = {
  onLockSelect: any;
};
type PageProps = PageStateProps & PageDispatchProps & PageOwnProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(
    useActions,
    dispatch
  );

class DropDownRender extends React.Component<PageProps> {
  onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChangeTitle({
      repositoryTitle: e.target.value
    });
  };

  render() {
    return (
      <div>
        {this.props.children}
        <Divider style={{ margin: '4px 0' }} />
        <div
          style={{ padding: '8px', cursor: 'pointer' }}
          onMouseDown={this.props.onLockSelect}
          onMouseEnter={this.props.onLockSelect}
          onMouseUp={this.props.onLockSelect}
        >
          {!this.props.createMode && (
            <div
              onClick={() => {
                this.props.onStartCreate();
              }}
            >
              新建知识库
            </div>
          )}
          {this.props.createMode && (
            <div>
              <div>
                <Input
                  value={this.props.repositoryTitle}
                  onChange={this.onTitleChange}
                  placeholder='请输入知识库的名称'
                />
              </div>
              <Button
                type='primary'
                disabled={!this.props.repositoryTitle || this.props.creating}
                loading={this.props.creating}
                onClick={this.props.onCreateRepository.bind(this, null, null)}
              >
                确认
              </Button>
              <Button
                onClick={() => {
                  this.props.onCancelCreate();
                }}
              >
                取消
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropDownRender as React.ComponentType<PageOwnProps>);
