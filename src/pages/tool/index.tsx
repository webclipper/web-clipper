import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToolContainer } from '../../components/container';
import { Button, Input, Icon, Select, Avatar } from 'antd';
import * as styles from './index.scss';
import { emptyFunction } from '../../utils';
import { updateTitle, asyncCreateDocument } from '../../store/actions/clipper';

const useActions = {
  postDocument: asyncCreateDocument.started,
  updateTitle,
  setRepositoryId: emptyFunction,
  uploadImage: emptyFunction
};

const Option = Select.Option;

const mapStateToProps = ({
  userInfo,
  clipper,
  userPreference
}: GlobalStore) => {
  return {
    uploadingImage: true,
    avatar: userInfo.avatar,
    userHomePage: userInfo.homePage,
    title: clipper.title,
    disabledPost: false,
    haveImageService: userPreference.haveImageService,
    currentRepository: { id: 1 },
    repositories: clipper.repositories
  };
};
type PageState = {};

type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageOwnProps = {};
type PageProps = PageStateProps & PageDispatchProps & PageOwnProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(
    useActions,
    dispatch
  );

class Page extends React.Component<PageProps, PageState> {
  onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.updateTitle({
      title: e.target.value
    });
  };

  onRepositorySelect = (select: number) => {
    this.props.setRepositoryId(select);
  };

  onSyncImage = () => {
    this.props.uploadImage();
  };

  onFilterOption = (select: any, option: React.ReactElement<any>) => {
    const title: string = option.props.children;
    return title.indexOf(select) !== -1;
  };

  render() {
    const {
      disabledPost,
      title,
      uploadImage,
      uploadingImage,
      repositories,
      currentRepository,
      avatar,
      userHomePage,
      haveImageService
    } = this.props;
    return (
      <ToolContainer>
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>笔记标题</h1>
          <Input value={title} onChange={this.onTitleChange} />
          <Button
            className={styles.saveButton}
            style={{ marginTop: 16 }}
            size="large"
            type="primary"
            disabled={disabledPost}
            onClick={() => {
              this.props.postDocument();
            }}
            block
          >
            保存内容
          </Button>
        </section>
        <section className={`${styles.section} ${styles.sectionLine}`}>
          <h1 className={styles.sectionTitle}>小工具</h1>
          <Button className={styles.menuButton} title="删除网页上的元素">
            <Icon type="delete" />
          </Button>
          {haveImageService && (
            <Button
              onClick={() => {
                uploadImage();
              }}
              className={styles.menuButton}
              title="同步图片到语雀"
            >
              <Icon type="sync" spin={uploadingImage} />
            </Button>
          )}
        </section>
        <section className={`${styles.section} ${styles.sectionLine}`}>
          <h1 className={styles.sectionTitle}>剪藏格式</h1>
          <Button block className={styles.menuButton}>
            <Icon type="copy" />
            整个页面
          </Button>
          <Button block className={styles.menuButton}>
            <Icon type="copy" />
            智能提取
          </Button>
          <Button block className={styles.menuButton}>
            <Icon type="link" />
            网页链接
          </Button>
          <Button block className={styles.menuButton}>
            <Icon type="select" />
            手动选择
          </Button>
          <Button block className={styles.menuButton}>
            <Icon type="picture" />
            屏幕截图
          </Button>
        </section>
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>保存的知识库</h1>
          <Select
            onSelect={this.onRepositorySelect}
            style={{ width: '100%' }}
            showSearch
            optionFilterProp="children"
            filterOption={this.onFilterOption}
            dropdownMatchSelectWidth={true}
            defaultValue={currentRepository.id}
          >
            {repositories.map(o => {
              return (
                <Option key={o.id} value={o.id}>
                  {o.name}
                </Option>
              );
            })}
          </Select>
        </section>
        <section className={`${styles.toolbar} ${styles.sectionLine}`}>
          <Button className={`${styles.toolbarButton} `}>
            <Icon type="setting" />
          </Button>
          <a href={userHomePage} target="_blank">
            <Avatar src={avatar} />
          </a>
        </section>
      </ToolContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page as React.ComponentType<PageProps>);
