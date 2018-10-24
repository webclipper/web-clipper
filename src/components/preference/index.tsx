import * as React from 'react';
import { Tabs, Select, message } from 'antd';
import * as styles from './index.scss';
import YuqueApi from '../../services/api/api';
import { BookSerializer } from '../../services/api/reposService';
import { TypedCommonStorageInterface } from '../../services/common/store';
import update from 'immutability-helper';

const Option = Select.Option;

export interface PreferenceProps {
  yuqueapi: YuqueApi;
  defaultBook: BookSerializer;
  books: BookSerializer[];
  storage: TypedCommonStorageInterface;
}

const TabPane = Tabs.TabPane;

export default class Preference extends React.Component<PreferenceProps> {

  onFilterOption = (select: any, option: React.ReactElement<any>) => {
    const title: string = option.props.children;
    return title.indexOf(select) !== -1;
  }

  onBookSelect = async (select: number) => {
    const newConfig = update(await this.props.storage.getUserSetting(), {
      defualtBookId: {
        $set: select
      }
    });
    try {
      await this.props.storage.setUserSetting(newConfig);
      //todo 重写消息
      message.success('默认知识库设置成功');
    } catch (error) {
      message.error('设置默认知识库失败');
    }

  }

  public render() {
    return (
      <div id="wewe" className={styles.preferenceContainer}>
        <Tabs >
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
                  getPopupContainer={() => { return document.querySelector(`.${styles.preferenceContainer}`) as HTMLElement }}
                  dropdownMatchSelectWidth={true}
                >
                  {this.props.books.map(o => { return <Option key={o.id} value={o.id}>{o.name}</Option> })}
                </Select>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
