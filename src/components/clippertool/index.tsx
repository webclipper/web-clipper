import * as React from 'react';
import { Input, Button, Avatar, Icon, Select } from 'antd';
import 'antd-style';
import * as styles from './index.scss';
import { UserProfile } from '../../services/api/userService';
import { BookSerializer } from '../../services/api/reposService';
import { ClipperPreiviewDataTypeEnum } from '../../enums';
import { StorageUserInfo } from '../../services/common/store';

export interface ClipperToolPorps {
  title: string;
  submitting: boolean;
  uploadingImage: boolean;
  clipperPreiviewDataType: ClipperPreiviewDataTypeEnum;
  books: BookSerializer[];
  userProfile: UserProfile;
  book: BookSerializer;
  userHomePage: string;
  userSetting: StorageUserInfo;
  uploadImage: () => void;
  onSetBookId: (input: number) => void;
  onPostNote: () => void;
  onChangeTitle: (input: string) => void;
  onDeleteElement: () => void;
  onGoToSetting: () => void;
  onClipperData: (type: ClipperPreiviewDataTypeEnum) => void;
}

const Option = Select.Option;

class ClipperTool extends React.Component<ClipperToolPorps> {
  componentDidMount = () => {
    if (this.props.userSetting.defaultClipperType) {
      this.props.onClipperData(this.props.userSetting.defaultClipperType);
    }
  };

  onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChangeTitle(e.target.value);
  };

  onBookSelect = (select: any) => {
    this.props.onSetBookId(select);
  };

  onFilterOption = (select: any, option: React.ReactElement<any>) => {
    const title: string = option.props.children;
    return title.indexOf(select) !== -1;
  };

  saveButtondisabled = () => {
    return !this.props.clipperPreiviewDataType;
  };

  onSyncImage = () => {
    if (this.props.uploadingImage) {
      return;
    }
    this.props.uploadImage();
  };

  render() {
    const { uploadingImage } = this.props;

    return (
      <div id={styles.mainTool}>
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>笔记标题</h1>
          <Input
            defaultValue={this.props.title}
            onChange={this.onTitleChange}
          />
          <Button
            className={styles.saveButton}
            disabled={this.saveButtondisabled()}
            loading={this.props.submitting}
            style={{ marginTop: 16 }}
            size="large"
            type="primary"
            block
            onClick={this.props.onPostNote}
          >
            保存内容
          </Button>
        </section>
        <section className={`${styles.section} ${styles.sectionLine}`}>
          <h1 className={styles.sectionTitle}>小工具</h1>
          <Button
            className={styles.menuButton}
            title="删除网页上的元素"
            onClick={this.props.onDeleteElement}
          >
            <Icon type="delete" />
          </Button>
          <Button
            className={styles.menuButton}
            title="同步图片到语雀"
            onClick={this.onSyncImage}
          >
            <Icon type="sync" spin={uploadingImage} />
          </Button>
        </section>
        <section className={`${styles.section} ${styles.sectionLine}`}>
          <h1 className={styles.sectionTitle}>剪藏格式</h1>
          <Button
            block
            className={styles.menuButton}
            onClick={() => {
              this.props.onClipperData(ClipperPreiviewDataTypeEnum.FULL_PAGE);
            }}
          >
            <Icon type="copy" />
            整个页面
          </Button>
          <Button
            block
            className={styles.menuButton}
            onClick={() => {
              this.props.onClipperData(ClipperPreiviewDataTypeEnum.READABILITY);
            }}
          >
            <Icon type="copy" />
            智能提取
          </Button>
          <Button
            block
            className={styles.menuButton}
            onClick={() => {
              this.props.onClipperData(ClipperPreiviewDataTypeEnum.URL);
            }}
          >
            <Icon type="link" />
            网页链接
          </Button>
          <Button
            block
            className={styles.menuButton}
            onClick={() => {
              this.props.onClipperData(
                ClipperPreiviewDataTypeEnum.SELECTED_ITEM
              );
            }}
          >
            <Icon type="select" />
            手动选择
          </Button>
          <Button
            block
            className={styles.menuButton}
            onClick={() => {
              this.props.onClipperData(ClipperPreiviewDataTypeEnum.SCREENSHOT);
            }}
          >
            <Icon type="picture" />
            屏幕截图
          </Button>
        </section>
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>保存的知识库</h1>
          <Select
            onSelect={this.onBookSelect}
            style={{ width: '100%' }}
            showSearch
            optionFilterProp="children"
            filterOption={this.onFilterOption}
            getPopupContainer={() => {
              return document.getElementById(styles.mainTool)!;
            }}
            defaultValue={this.props.book.id}
            dropdownMatchSelectWidth={true}
          >
            {this.props.books.map(o => {
              return (
                <Option key={o.id} value={o.id}>
                  {o.name}
                </Option>
              );
            })}
          </Select>
        </section>
        <section className={`${styles.toolbar} ${styles.sectionLine}`}>
          <Button
            className={`${styles.toolbarButton} `}
            onClick={this.props.onGoToSetting}
          >
            <Icon type="setting" />
          </Button>
          <a href={this.props.userHomePage} target="_blank">
            <Avatar src={this.props.userProfile.avatar_url} />
          </a>
        </section>
      </div>
    );
  }
}

export default ClipperTool;
