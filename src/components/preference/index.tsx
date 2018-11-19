import * as React from 'react';
import { Tabs, Select, Switch } from 'antd';
import * as styles from './index.scss';
import { BookSerializer } from '../../services/api/reposService';
import { StorageUserInfo } from '../../services/common/store';
import update from 'immutability-helper';

const Option = Select.Option;

export interface PreferenceProps {
  defaultBook: BookSerializer;
  books: BookSerializer[];
  userSetting: StorageUserInfo;
  changeSetting: (userSetting: StorageUserInfo) => void;
}

const TabPane = Tabs.TabPane;

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
                      <Option key={o.id} value={o.id}>
                        {o.name}
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
