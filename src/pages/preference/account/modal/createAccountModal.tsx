import React, { useEffect } from 'react';
import { Form, Modal, Select, Icon, Divider } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as styles from './index.scss';
import { ImageHostingServiceMeta } from 'common/backend';
import { UserPreferenceStore, ImageHosting } from '@/common/types';
import { FormattedMessage } from 'react-intl';
import useVerifiedAccount from '@/common/hooks/useVerifiedAccount';
import useFilterImageHostingServices from '@/common/hooks/useFilterImageHostingServices';
import ImageHostingSelect from '@/components/ImageHostingSelect';
import RepositorySelect from '@/components/RepositorySelect';

type PageOwnProps = {
  imageHostingServicesMeta: {
    [type: string]: ImageHostingServiceMeta;
  };
  servicesMeta: UserPreferenceStore['servicesMeta'];
  imageHosting: ImageHosting[];
  visible: boolean;
  onCancel(): void;
  onAdd(id: string, userInfo: any): void;
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
  imageHostingServicesMeta,
  servicesMeta,
  onCancel,
  form,
  form: { getFieldDecorator },
  onAdd,
  visible,
}) => {
  const {
    type,
    accountStatus: { verified, repositories, userInfo, id },
    loadAccount,
    verifying,
    changeType,
    serviceForm,
    okText,
    oauthLink,
  } = useVerifiedAccount({ form, services: servicesMeta });

  const supportedImageHostingServices = useFilterImageHostingServices({
    backendServiceType: type,
    imageHostingServices: imageHosting,
    imageHostingServicesMap: imageHostingServicesMeta,
  });

  const handleOk = () => {
    if (oauthLink) {
      onCancel();
    } else if (verified && id) {
      onAdd(id, userInfo);
    } else {
      loadAccount();
    }
  };

  const permission = servicesMeta[type]?.permission;
  useEffect(() => {
    if (permission) {
      chrome.permissions.contains(permission, r => {
        if (!r) {
          chrome.permissions.request(permission, g => {
            if (!g) {
              onCancel();
            }
          });
        }
      });
    }
  }, [onCancel, permission]);

  return (
    <Modal
      visible={visible}
      okType="primary"
      onCancel={onCancel}
      okText={oauthLink ? oauthLink : okText}
      okButtonProps={{
        loading: verifying,
        disabled: verifying,
      }}
      onOk={handleOk}
      title={<ModalTitle />}
    >
      <Form labelCol={{ span: 7, offset: 0 }} wrapperCol={{ span: 17 }}>
        <Form.Item
          label={<FormattedMessage id="preference.accountList.type" defaultMessage="Type" />}
        >
          {getFieldDecorator('type', {
            initialValue: type,
          })(
            <Select disabled={verified} onChange={changeType}>
              {Object.values(servicesMeta).map(o => (
                <Select.Option key={o.type}>{o.name}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {!oauthLink && serviceForm}
        {!oauthLink && (
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
                <RepositorySelect
                  disabled={!verified}
                  loading={verifying}
                  repositories={repositories}
                />
              )}
            </Form.Item>
            <Form.Item
              label={
                <FormattedMessage
                  id="preference.accountList.imageHost"
                  defaultMessage="Image Host"
                />
              }
            >
              {getFieldDecorator('imageHosting')(
                <ImageHostingSelect
                  loading={verifying}
                  disabled={!verified}
                  supportedImageHostingServices={supportedImageHostingServices}
                />
              )}
            </Form.Item>
          </React.Fragment>
        )}
      </Form>
    </Modal>
  );
};

export default Page;
