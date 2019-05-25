import * as React from 'react';
import { Form, Modal, Select, Icon, Divider } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as styles from './index.scss';
import { ImageHostingServiceMeta } from 'common/backend';
import ImageHostingSelectOption from 'components/imageHostingSelectOption';
import { Repository } from 'common/backend/services/interface';
import repositorySelectOptions from 'components/repositorySelectOptions';
import {
  AccountPreference,
  UserPreferenceStore,
  ImageHosting,
} from '../../../../store/reducers/userPreference/interface';

type PageOwnProps = {
  imageHostingServicesMeta: {
    [type: string]: ImageHostingServiceMeta;
  };
  servicesMeta: UserPreferenceStore['servicesMeta'];
  imageHosting: ImageHosting[];
  currentAccount: AccountPreference;
  visible: boolean;
  repositories: Repository[];
  verifying: boolean;
  verified: boolean;
  onCancel(): void;
  onEdit(id: string): void;
};
type PageProps = PageOwnProps & FormComponentProps;

export default class extends React.Component<PageProps> {
  handleCancel = () => {
    this.props.onCancel();
  };

  handleOk = () => {
    this.props.onEdit(this.props.currentAccount.id);
  };

  getTitle = () => (
    <div className={styles.modalTitle}>
      编辑账号
      <a href={'https://www.yuque.com/yuqueclipper/help_cn/bind_account'} target="_blank">
        <Icon type="question-circle" />
      </a>
    </div>
  );

  getServicesForm = (currentAccount: AccountPreference) => {
    const { servicesMeta, form } = this.props;
    const { type, ...info } = currentAccount;
    const service = servicesMeta[type];
    if (service && service.form) {
      return <service.form form={form} info={info} />;
    }
  };

  render() {
    const {
      visible,
      currentAccount,
      servicesMeta,
      imageHosting,
      repositories,
      imageHostingServicesMeta,
      verified,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Modal
        visible={visible}
        title={this.getTitle()}
        okText={'确认'}
        okType="primary"
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
        <Form labelCol={{ span: 6, offset: 0 }} wrapperCol={{ span: 18 }}>
          <Form.Item label="类型">
            {getFieldDecorator('type', {
              initialValue: currentAccount.type,
            })(
              <Select disabled>
                {Object.values(servicesMeta).map(o => (
                  <Select.Option key={o.type}>{o.name}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {this.getServicesForm(currentAccount)}
          {<Divider />}
          <Form.Item label="默认知识库">
            {getFieldDecorator('defaultRepositoryId', {
              initialValue: currentAccount.defaultRepositoryId,
            })(
              <Select allowClear disabled={!verified}>
                {repositorySelectOptions(repositories)}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="图床">
            {getFieldDecorator('imageHosting', {
              initialValue: currentAccount.imageHosting,
            })(
              <Select allowClear className={styles.imageHostingSelect}>
                {imageHosting.map(({ id, type, remark }) => {
                  const meta = imageHostingServicesMeta[type];
                  if (meta.support && !meta.support(currentAccount.type)) {
                    return null;
                  }
                  return (
                    <Select.Option key={id} value={id}>
                      <ImageHostingSelectOption
                        id={id}
                        icon={meta.icon}
                        name={meta.name}
                        remark={remark}
                      />
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
