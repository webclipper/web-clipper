import React, { useMemo } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Modal, Select, Divider } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import styles from './index.less';
import { ImageHostingServiceMeta, BUILT_IN_IMAGE_HOSTING_ID } from 'common/backend';
import { UserPreferenceStore, ImageHosting } from '@/common/types';
import { FormattedMessage } from 'react-intl';
import useVerifiedAccount from '@/common/hooks/useVerifiedAccount';
import useFilterImageHostingServices from '@/common/hooks/useFilterImageHostingServices';
import ImageHostingSelect from '@/components/ImageHostingSelect';
import RepositorySelect from '@/components/RepositorySelect';
import Container from 'typedi';
import { IPermissionsService } from '@/service/common/permissions';
import { ITabService } from '@/service/common/tab';

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
      <QuestionCircleOutlined />
    </a>
  </div>
);

const Page: React.FC<PageProps> = ({
  imageHosting,
  imageHostingServicesMeta,
  servicesMeta,
  onCancel,
  form,
  form: { getFieldDecorator, getFieldValue },
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

  const imageHostingWithBuiltIn = useMemo(() => {
    const res = [...imageHosting];
    const meta = imageHostingServicesMeta[type];
    if (meta?.builtIn) {
      res.push({ type, info: {}, id: BUILT_IN_IMAGE_HOSTING_ID, remark: meta.builtInRemark });
    }
    return res;
  }, [imageHosting, imageHostingServicesMeta, type]);

  const supportedImageHostingServices = useFilterImageHostingServices({
    backendServiceType: type,
    imageHostingServices: imageHostingWithBuiltIn,
    imageHostingServicesMap: imageHostingServicesMeta,
  });

  const handleOk = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const type = getFieldValue('type');
    const permission = servicesMeta[type]?.permission;
    if (permission) {
      const result = await Container.get(IPermissionsService).request(permission);
      if (!result) {
        return;
      }
    }
    if (oauthLink) {
      Container.get(ITabService).create({
        url: oauthLink.props.href,
      });
      onCancel();
    } else if (verified && id) {
      onAdd(id, userInfo);
    } else {
      loadAccount();
    }
  };

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
            <Select showSearch disabled={verified} onChange={changeType}>
              {Object.values(servicesMeta).map(o => (
                <Select.Option key={o.type} label={o.name}>
                  {o.name}
                </Select.Option>
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
