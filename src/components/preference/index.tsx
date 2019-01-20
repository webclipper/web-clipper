import * as React from 'react';
import { Tabs, Select, Switch } from 'antd';
import * as styles from './index.scss';
import { BookSerializer } from '../../services/api/reposService';
import { StorageUserInfo } from '../../services/common/store';
import update from 'immutability-helper';
import { ClipperPreiviewDataTypeEnum } from '../../enums';

const Option = Select.Option;

export interface PreferenceProps {
  defaultBook: BookSerializer;
  books: BookSerializer[];
  userSetting: StorageUserInfo;
  changeSetting: (userSetting: StorageUserInfo) => void;
}

const TabPane = Tabs.TabPane;

const DefaultClipperPreviewDataTypeList = [
  {
    key: '',
    text: '无'
  },
  {
    key: ClipperPreiviewDataTypeEnum.FULL_PAGE,
    text: '整个页面'
  },
  {
    key: ClipperPreiviewDataTypeEnum.URL,
    text: '网页链接'
  },
  {
    key: ClipperPreiviewDataTypeEnum.READABILITY,
    text: '智能提取'
  },
  {
    key: ClipperPreiviewDataTypeEnum.SELECTED_ITEM,
    text: '手动选择'
  },
  {
    key: ClipperPreiviewDataTypeEnum.SCREENSHOT,
    text: '屏幕截图'
  }
];

export default class Preference extends React.Component<PreferenceProps> {
  onFilterOption = (select: any, option: React.ReactElement<any>) => {
    const title: string = option.props.children;
    return title.indexOf(select) !== -1;
  };

  onBookSelect = (select: number) => {
    const newConfig = update(this.props.userSetting, {
      defualtBookId: {
        $set: select
      }
    });
    this.props.changeSetting(newConfig);
  };

  onSet = (type: ClipperPreiviewDataTypeEnum | '') => {
    const newConfig = update(this.props.userSetting, {
      defaultClipperType: {
        $set: type
      }
    });
    this.props.changeSetting(newConfig);
  };

  onToggleHideQRCode = async () => {
    const closeQRCode = this.props.userSetting.closeQRCode ? true : false;
    const newConfig = update(this.props.userSetting, {
      closeQRCode: {
        $set: !closeQRCode
      }
    });
    this.props.changeSetting(newConfig);
  };

  public render() {
    return (
      <div id="wewe" className={styles.preferenceContainer}>
        <Tabs>
          <TabPane tab="通用" key="1">
            <div className={styles.preferenceForm}>
              <span className={styles.preferenceFormLabel}>默认知识库</span>
              <div className={styles.preferenceFormRight}>
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  onSelect={this.onBookSelect}
                  optionFilterProp="children"
                  filterOption={this.onFilterOption}
                  defaultValue={this.props.defaultBook.id}
                  getPopupContainer={() => {
                    return document.querySelector(
                      `.${styles.preferenceContainer}`
                    ) as HTMLElement;
                  }}
                  dropdownMatchSelectWidth={true}
                >
                  {this.props.books.map(o => {
                    return (
                      <Option key={o.id.toString()} value={o.id}>
                        {o.name}
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>

            <div className={styles.preferenceForm}>
              <span className={styles.preferenceFormLabel}>默认剪藏方式</span>
              <div className={styles.preferenceFormRight}>
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  onSelect={this.onSet}
                  optionFilterProp="children"
                  filterOption={this.onFilterOption}
                  defaultValue={this.props.userSetting.defaultClipperType || ''}
                  getPopupContainer={() => {
                    return document.querySelector(
                      `.${styles.preferenceContainer}`
                    ) as HTMLElement;
                  }}
                  dropdownMatchSelectWidth={true}
                >
                  {DefaultClipperPreviewDataTypeList.map(o => {
                    return (
                      <Option key={o.key} value={o.key}>
                        {o.text}
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>

            <div className={styles.preferenceForm}>
              <span className={styles.preferenceFormLabel}>隐藏二维码</span>
              <div className={styles.preferenceFormRight}>
                <Switch
                  checked={this.props.userSetting.closeQRCode}
                  onChange={this.onToggleHideQRCode}
                />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
