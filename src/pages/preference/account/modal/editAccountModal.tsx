import React, { useMemo, useEffect } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Modal, Select } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import styles from './index.less';
import { ImageHostingServiceMeta } from 'common/backend';
import { AccountPreference, UserPreferenceStore, ImageHosting } from '@/common/types';
import { FormattedMessage } from 'react-intl';
import ImageHostingSelect from '@/components/ImageHostingSelect';
import useFilterImageHostingServices from '@/common/hooks/useFilterImageHostingServices';
import useVerifiedAccount from '@/common/hooks/useVerifiedAccount';
import RepositorySelect from '@/components/RepositorySelect';
import { BUILT_IN_IMAGE_HOSTING_ID } from '@/common/backend/imageHosting/interface';

type PageOwnProps = {
  imageHostingServicesMeta: {
    [type: string]: ImageHostingServiceMeta;
  };
  servicesMeta: UserPreferenceStore['servicesMeta'];
  imageHosting: ImageHosting[];
  currentAccount: AccountPreference;
  visible: boolean;
  onCancel(): void;
  onEdit(oldId: string, userInfo: any, newId: string): void;
};
type PageProps = PageOwnProps & FormComponentProps;

const ModalTitle = () => (
  <div className={styles.modalTitle}>
    <FormattedMessage id="preference.accountList.addAccount" defaultMessage="Add Account" />
    <a href={'https://www.yuque.com/yuqueclipper/help_cn/bind_account'} target="_blank">
      <QuestionCircleOutlined />
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
    type,
    accountStatus: { verified, repositories, userInfo, id },
    verifyAccount,
    serviceForm,
    verifying,
  } = useVerifiedAccount({
    form,
    services: servicesMeta,
    initAccount: currentAccount,
  });

  useEffect(() => {
    verifyAccount(currentAccount);
  }, [currentAccount, verifyAccount]);

  const imageHostingWithBuiltIn = useMemo(() => {
    const res = [...imageHosting];
    const meta = imageHostingServicesMeta[type];
    if (meta?.builtIn) {
      res.push({ type, info: {}, id: BUILT_IN_IMAGE_HOSTING_ID, remark: meta.builtInRemark });
    }
    return res;
  }, [imageHosting, imageHostingServicesMeta, type]);

  const supportedImageHostingServices = useFilterImageHostingServices({
    backendServiceType: currentAccount.type,
    imageHostingServices: imageHostingWithBuiltIn,
    imageHostingServicesMap: imageHostingServicesMeta,
  });

  const okText = verifying ? (
    <FormattedMessage id="preference.accountList.verifying" defaultMessage="Verifying" />
  ) : (
    <FormattedMessage id="preference.accountList.confirm" defaultMessage="Confirm" />
  );

  return (
    <Modal
      visible={visible}
      title={<ModalTitle />}
      okText={okText}
      okType="primary"
      okButtonProps={{
        loading: verifying,
        disabled: !verified,
      }}
      onCancel={onCancel}
      onOk={() => onEdit(currentAccount.id, userInfo, id!)}
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
            <RepositorySelect
              disabled={!verified || verifying}
              loading={verifying}
              repositories={repositories}
            />
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
