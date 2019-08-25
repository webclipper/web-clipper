import React, { useEffect } from 'react';
import { Form, Modal, Select, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as styles from './index.scss';
import { ImageHostingServiceMeta } from 'common/backend';
import repositorySelectOptions from 'components/repositorySelectOptions';
import { AccountPreference, UserPreferenceStore, ImageHosting } from '@/common/types';
import { FormattedMessage } from 'react-intl';
import ImageHostingSelect from '@/components/ImageHostingSelect';
import useFilterImageHostingServices from '@/common/hooks/useFilterImageHostingServices';
import useVerifiedAccount from '@/common/hooks/useVerifiedAccount';

type PageOwnProps = {
  imageHostingServicesMeta: {
    [type: string]: ImageHostingServiceMeta;
  };
  servicesMeta: UserPreferenceStore['servicesMeta'];
  imageHosting: ImageHosting[];
  currentAccount: AccountPreference;
  visible: boolean;
  onCancel(): void;
  onEdit(id: string): void;
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
  visible,
  currentAccount,
  servicesMeta,
  form,
  form: { getFieldDecorator },
  onCancel,
  onEdit,
  imageHosting,
  imageHostingServicesMeta,
}) => {
  const {
    accountStatus: { verified, repositories },
    verifyAccount,
    serviceForm,
  } = useVerifiedAccount({
    form,
    services: servicesMeta,
    initAccount: currentAccount,
  });

  useEffect(() => {
    verifyAccount();
  }, [verifyAccount]);

  const supportedImageHostingServices = useFilterImageHostingServices({
    backendServiceType: currentAccount.type,
    imageHostingServices: imageHosting,
    imageHostingServicesMap: imageHostingServicesMeta,
  });

  return (
    <Modal
      visible={visible}
      title={<ModalTitle></ModalTitle>}
      okText={<FormattedMessage id="preference.accountList.confirm" defaultMessage="Confirm" />}
      okType="primary"
      onCancel={onCancel}
      onOk={() => onEdit(currentAccount.id)}
    >
      <Form labelCol={{ span: 7, offset: 0 }} wrapperCol={{ span: 17 }}>
        <Form.Item
          label={<FormattedMessage id="preference.accountList.type" defaultMessage="Type" />}
        >
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
        {serviceForm}
        <Form.Item
          label={
            <FormattedMessage
              id="preference.accountList.defaultRepository"
              defaultMessage="Default Repository"
            />
          }
        >
          {getFieldDecorator('defaultRepositoryId', {
            initialValue: currentAccount.defaultRepositoryId,
          })(
            <Select allowClear disabled={!verified}>
              {repositorySelectOptions(repositories)}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          label={
            <FormattedMessage id="preference.accountList.imageHost" defaultMessage="Image Host" />
          }
        >
          {getFieldDecorator('imageHosting', {
            initialValue: currentAccount.imageHosting,
          })(
            <ImageHostingSelect
              disabled={!verified}
              supportedImageHostingServices={supportedImageHostingServices}
            ></ImageHostingSelect>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Page;
