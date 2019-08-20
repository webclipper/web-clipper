import React, { useState } from 'react';
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

const ModalTitle = () => (
  <div className={styles.modalTitle}>
    <FormattedMessage id="preference.accountList.addAccount" defaultMessage="Add Account" />
    <a href={'https://www.yuque.com/yuqueclipper/help_cn/bind_account'} target="_blank">
      <Icon type="question-circle" />
    </a>
  </div>
);

const Page: React.FC<PageProps> = ({
  imageHosting,
  repositories,
  imageHostingServicesMeta,
  servicesMeta,
  onCancel,
  verified,
  onVerifiedAccount,
  onAdd,
  form,
  form: { getFieldDecorator },
  visible,
}) => {
  const [type, setType] = useState<string>(Object.values(servicesMeta)[0].type);
  const handleCancel = () => onCancel();
  const handleOk = () => {
    if (service.oauthUrl) {
      onCancel();
      return;
    }
    if (!verified) {
      onVerifiedAccount();
      return;
    }
    onAdd();
  };
  const handleTypeChange = (type: string) => {
    setType(type);
    const values = form.getFieldsValue();
    form.resetFields(Object.keys(omit(values, ['type'])));
  };

  const service = servicesMeta[type];

  const getBaseForm = () => {
    return (
      <React.Fragment>
        <Divider />
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
                if (meta.support && !meta.support(type)) {
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
      </React.Fragment>
    );
  };

  const ModalProps = () => {
    let okText;
    if (verified) {
      okText = <FormattedMessage id="preference.accountList.bind" defaultMessage="Bind" />;
    } else {
      okText = <FormattedMessage id="preference.accountList.ok" defaultMessage="Ok" />;
    }
    if (service.oauthUrl) {
      okText = (
        <a href={service.oauthUrl} target="_blank">
          Bind
        </a>
      );
    }
    return { okText, title: <ModalTitle /> };
  };

  return (
    <Modal
      visible={visible}
      okType="primary"
      onCancel={handleCancel}
      onOk={handleOk}
      {...ModalProps()}
    >
      <Form labelCol={{ span: 7, offset: 0 }} wrapperCol={{ span: 17 }}>
        <Form.Item
          label={<FormattedMessage id="preference.accountList.type" defaultMessage="Type" />}
        >
          {getFieldDecorator('type', {
            initialValue: type,
          })(
            <Select disabled={verified} onChange={handleTypeChange}>
              {Object.values(servicesMeta).map(o => (
                <Select.Option key={o.type}>{o.name}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {!!service.form && <service.form form={form} verified={verified} />}
        {!service.oauthUrl && getBaseForm()}
      </Form>
    </Modal>
  );
};

export default Page;
