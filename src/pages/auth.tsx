import React, { useEffect } from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import { DvaRouterProps, GlobalStore } from '@/common/types';
import { Modal, Form, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import { FormComponentProps } from 'antd/lib/form';
import * as browser from '@web-clipper/chrome-promise';
import useVerifiedAccount from '@/common/hooks/useVerifiedAccount';
import ImageHostingSelect from '@/components/ImageHostingSelect';
import repositorySelectOptions from 'components/repositorySelectOptions';
import useFilterImageHostingServices from '@/common/hooks/useFilterImageHostingServices';
import { asyncAddAccount } from '@/actions/account';

interface PageQuery {
  access_token: string;
  type: string;
}

const mapStateToProps = ({
  userPreference: { servicesMeta, imageHosting, imageHostingServicesMeta },
}: GlobalStore) => {
  return {
    servicesMeta,
    imageHosting,
    imageHostingServicesMeta,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & DvaRouterProps & FormComponentProps;

const Page: React.FC<PageProps> = props => {
  const query = parse(props.location.search.slice(1)) as PageQuery;
  const service = props.servicesMeta[query.type];
  const {
    form: { getFieldDecorator },
    form,
    imageHosting,
    imageHostingServicesMeta,
  } = props;

  const {
    type,
    verifyAccount,
    accountStatus: { repositories, verified, userInfo },
    serviceForm,
    verifying,
  } = useVerifiedAccount({
    form: props.form,
    services: props.servicesMeta,
    initAccount: query,
  });

  const supportedImageHostingServices = useFilterImageHostingServices({
    backendServiceType: type,
    imageHostingServices: imageHosting,
    imageHostingServicesMap: imageHostingServicesMeta,
  });

  useEffect(() => {
    verifyAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      visible
      onCancel={async () => {
        const tahId = (await browser.tabs.getCurrent()).id;
        chrome.tabs.remove(tahId!);
      }}
      okButtonProps={{
        disabled: verifying,
        loading: verifying,
      }}
      title={<FormattedMessage id="auth.modal.title" defaultMessage="Account Config" />}
      onOk={() => {
        form.validateFields((error, values) => {
          if (error) {
            return;
          }
          const { defaultRepositoryId, imageHosting, ...info } = values;
          props.dispatch(
            asyncAddAccount.started({
              type,
              defaultRepositoryId,
              imageHosting,
              info,
              userInfo,
              callback: async () => {
                const tahId = (await browser.tabs.getCurrent()).id;
                chrome.tabs.remove(tahId!);
              },
            })
          );
        });
      }}
    >
      <Form labelCol={{ span: 7, offset: 0 }} wrapperCol={{ span: 17 }}>
        <Form.Item label={<FormattedMessage id="auth.form.type" defaultMessage="Type" />}>
          {service.name}
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
          {getFieldDecorator('defaultRepositoryId')(
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
          {getFieldDecorator('imageHosting')(
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

export default connect(mapStateToProps)(Form.create<PageProps>()(Page));
