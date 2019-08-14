import * as React from 'react';
import { Form, Modal, Select, Icon, Divider } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as styles from './index.scss';
import { omit } from 'lodash';
import { ImageHostingServiceMeta, Repository } from 'common/backend';
import ImageHostingSelectOption from 'components/imageHostingSelectOption';
import { UserPreferenceStore, ImageHosting } from '@/common/types';
import repositorySelectOptions from 'components/repositorySelectOptions';
import { FormattedMessage } from 'react-intl';

type PageOwnProps = {
  imageHostingServicesMeta: {
    [type: string]: ImageHostingServiceMeta;
  };
  servicesMeta: UserPreferenceStore['servicesMeta'];
  imageHosting: ImageHosting[];
  visible: boolean;
  repositories: Repository[];
  verified: boolean;
  onCancel(): void;
  onAdd(): void;
  onVerifiedAccount(): void;
};
type PageProps = PageOwnProps & FormComponentProps;

type PageState = {
  type: string;
};

const DEFAULT_TYPE = 'yuque';

export default class extends React.Component<PageProps, PageState> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      type: DEFAULT_TYPE,
    };
  }

  handleCancel = () => {
    this.props.onCancel();
  };

  handleOk = () => {
    const { verified } = this.props;
    if (!verified) {
      this.props.onVerifiedAccount();
      return;
    }
    this.props.onAdd();
  };

  handleTypeChange = (type: string) => {
    this.setState({
      type,
    });
    const { form } = this.props;
    const values = form.getFieldsValue();
    form.resetFields(Object.keys(omit(values, ['type'])));
  };

  getTitle = () => {
    return (
      <div className={styles.modalTitle}>
        <FormattedMessage id="preference.accountList.addAccount" defaultMessage="Add Account" />
        <a href={'https://www.yuque.com/yuqueclipper/help_cn/bind_account'} target="_blank">
          <Icon type="question-circle" />
        </a>
      </div>
    );
  };

  getServicesForm = () => {
    const { servicesMeta, form, verified } = this.props;
    const { type } = this.state;
    if (type) {
      const service = servicesMeta[type];
      if (service && service.form) {
        return <service.form form={form} verified={verified} />;
      }
    }
  };

  render() {
    const {
      verified,
      visible,
      servicesMeta,
      imageHosting,
      repositories,
      imageHostingServicesMeta,
      form: { getFieldDecorator },
    } = this.props;

    let okText;
    if (verified) {
      okText = '绑定';
    } else {
      okText = '确认';
    }

    return (
      <Modal
        visible={visible}
        title={this.getTitle()}
        okText={okText}
        okType="primary"
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
        <Form labelCol={{ span: 7, offset: 0 }} wrapperCol={{ span: 17 }}>
          <Form.Item
            label={<FormattedMessage id="preference.accountList.type" defaultMessage="Type" />}
          >
            {getFieldDecorator('type', {
              initialValue: DEFAULT_TYPE,
            })(
              <Select disabled={verified} onChange={this.handleTypeChange}>
                {Object.values(servicesMeta).map(o => (
                  <Select.Option key={o.type}>{o.name}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {this.getServicesForm()}
          {<Divider />}
          <Form.Item
            label={
              <FormattedMessage
                id="preference.accountList.defaultRepository"
                defaultMessage="Default Repository"
              />
            }
          >
            {getFieldDecorator('defaultRepositoryId')(
              <Select disabled={!verified}>{repositorySelectOptions(repositories)}</Select>
            )}
          </Form.Item>
          <Form.Item
            label={
              <FormattedMessage id="preference.accountList.imageHost" defaultMessage="Image Host" />
            }
          >
            {getFieldDecorator('imageHosting')(
              <Select className={styles.imageHostingSelect} disabled={!verified}>
                {imageHosting.map(({ id, type, remark }) => {
                  const meta = imageHostingServicesMeta[type];
                  if (meta.support && !meta.support(this.state.type)) {
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
