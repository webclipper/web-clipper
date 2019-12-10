import * as React from 'react';
import { Form, Modal, Select, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { ImageHostingServiceMeta } from '../../../../common/backend';
import { ImageHosting } from '@/common/types';
import { FormattedMessage } from 'react-intl';

type PageOwnProps = {
  currentImageHosting?: ImageHosting | null;
  imageHostingServicesMeta: { [type: string]: ImageHostingServiceMeta };
  visible: boolean;
  onAddAccount(): void;
  onEditAccount(id: string): void;
  onCancel(): void;
};

type PageProps = PageOwnProps & FormComponentProps;

const formItemLayout = {
  wrapperCol: { span: 17 },
  labelCol: { span: 6, offset: 0 },
};

export default class AddImageHostingModal extends React.Component<PageProps> {
  getImageHostingForm = (info?: Pick<ImageHosting, 'info'>) => {
    const {
      imageHostingServicesMeta,
      form: { getFieldValue },
      form,
    } = this.props;
    const type = getFieldValue('type');
    if (type) {
      const ServiceForm = imageHostingServicesMeta[type]?.form;
      if (ServiceForm) {
        return <ServiceForm form={form} info={info} />;
      }
    }
  };

  handleOk = () => {
    const { currentImageHosting } = this.props;
    if (currentImageHosting) {
      this.props.onEditAccount(currentImageHosting.id);
    } else {
      this.props.onAddAccount();
    }
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const {
      imageHostingServicesMeta,
      visible,
      currentImageHosting,
      form: { getFieldDecorator },
    } = this.props;
    const services = Object.values(imageHostingServicesMeta);
    let title;
    let initImageHosting: Omit<ImageHosting, 'id'>;
    if (currentImageHosting) {
      title = <FormattedMessage id="preference.imageHosting.edit" defaultMessage="Edit" />;
      initImageHosting = currentImageHosting;
    } else {
      title = <FormattedMessage id="preference.imageHosting.add" defaultMessage="Add" />;
      initImageHosting = {
        type: services[0].type,
      };
    }
    return (
      <Modal title={title} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
        <Form {...formItemLayout}>
          <Form.Item
            label={<FormattedMessage id="preference.imageHosting.type" defaultMessage="Type" />}
          >
            {getFieldDecorator('type', {
              initialValue: initImageHosting.type,
              rules: [{ required: true }],
            })(
              <Select>
                {services.map(service => (
                  <Select.Option key={service.type}>{service.name}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {this.getImageHostingForm(initImageHosting.info)}
          <Form.Item
            label={<FormattedMessage id="preference.imageHosting.remark" defaultMessage="Remark" />}
          >
            {getFieldDecorator('remark', {
              initialValue: initImageHosting.remark,
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
