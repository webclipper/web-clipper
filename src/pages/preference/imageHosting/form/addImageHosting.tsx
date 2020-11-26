import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Modal, Select, Input } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { ImageHostingServiceMeta } from '../../../../common/backend';
import { ImageHosting } from '@/common/types';
import { FormattedMessage } from 'react-intl';
import Container from 'typedi';
import { IPermissionsService } from '@/service/common/permissions';

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

const AddImageHostingModal: React.FC<PageProps> = props => {
  const {
    imageHostingServicesMeta,
    visible,
    currentImageHosting,
    form: { getFieldDecorator, getFieldValue },
  } = props;

  const getImageHostingForm = (info?: Pick<ImageHosting, 'info'>) => {
    const {
      imageHostingServicesMeta,
      form: { getFieldValue },
      form,
    } = props;
    const type = getFieldValue('type');
    if (type) {
      const ServiceForm = imageHostingServicesMeta[type]?.form;
      if (ServiceForm) {
        return <ServiceForm form={form} info={info} />;
      }
    }
  };

  const handleOk = async () => {
    const permissionsService = Container.get(IPermissionsService);
    const type = getFieldValue('type');
    const permission = imageHostingServicesMeta[type]?.permission;
    if (permission) {
      const result = await permissionsService.request(permission);
      if (!result) {
        return;
      }
    }
    const { currentImageHosting } = props;
    if (currentImageHosting) {
      props.onEditAccount(currentImageHosting.id);
    } else {
      props.onAddAccount();
    }
  };

  const services = Object.values(imageHostingServicesMeta);
  let title;
  let initImageHosting: Omit<ImageHosting, 'id'>;
  if (currentImageHosting) {
    title = <FormattedMessage id="preference.imageHosting.edit" defaultMessage="Edit" />;
    initImageHosting = currentImageHosting;
  } else {
    title = <FormattedMessage id="preference.imageHosting.add" defaultMessage="Add" />;
    initImageHosting = {
      type: services.filter(o => !o.builtIn)[0].type,
    };
  }

  return (
    <Modal title={title} visible={visible} onOk={handleOk} onCancel={props.onCancel} destroyOnClose>
      <Form {...formItemLayout}>
        <Form.Item
          label={<FormattedMessage id="preference.imageHosting.type" defaultMessage="Type" />}
        >
          {getFieldDecorator('type', {
            initialValue: initImageHosting.type,
            rules: [{ required: true }],
          })(
            <Select>
              {services
                .filter(o => !o.builtIn)
                .map(service => (
                  <Select.Option key={service.type} value={service.type}>
                    {service.name}
                  </Select.Option>
                ))}
            </Select>
          )}
        </Form.Item>
        {getImageHostingForm(initImageHosting.info)}
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
};

export default AddImageHostingModal;
