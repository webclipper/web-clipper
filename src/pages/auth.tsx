import React, { useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import { DvaRouterProps, GlobalStore } from '@/common/types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Modal, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import useVerifiedAccount from '@/common/hooks/useVerifiedAccount';
import ImageHostingSelect from '@/components/ImageHostingSelect';
import useFilterImageHostingServices, {
  ImageHostingWithMeta,
} from '@/common/hooks/useFilterImageHostingServices';
import { asyncAddAccount } from '@/actions/account';
import { isEqual } from 'lodash';
import RepositorySelect from '@/components/RepositorySelect';
import { BUILT_IN_IMAGE_HOSTING_ID } from '@/common/backend/imageHosting/interface';
import Container from 'typedi';
import { ITabService } from '@/service/common/tab';

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

function useDeepCompareMemoize<T>(value: T) {
  const ref = React.useRef<T>();
  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
}

const Page: React.FC<PageProps> = props => {
  const query: PageQuery = parse(props.location.search.slice(1)) as any;
  const tabService = Container.get(ITabService);
  const {
    form: { getFieldDecorator },
    form,
    imageHosting,
    imageHostingServicesMeta,
  } = props;

  const {
    type,
    verifyAccount,
    accountStatus: { repositories, verified, userInfo, id },
    serviceForm,
    verifying,
    okText,
  } = useVerifiedAccount({
    form: props.form,
    services: props.servicesMeta,
    initAccount: query,
  });

  const imageHostingWithBuiltIn = useMemo(() => {
    const res = [...imageHosting];
    const meta = imageHostingServicesMeta[type];
    if (meta?.builtIn) {
      res.push({
        type,
        info: {},
        id: BUILT_IN_IMAGE_HOSTING_ID,
        remark: meta.builtInRemark,
      });
    }
    return res;
  }, [imageHosting, imageHostingServicesMeta, type]);

  const supportedImageHostingServices: ImageHostingWithMeta[] = useFilterImageHostingServices({
    backendServiceType: type,
    imageHostingServices: imageHostingWithBuiltIn,
    imageHostingServicesMap: imageHostingServicesMeta,
  });

  const memoizeQuery = useDeepCompareMemoize(query);

  useEffect(() => {
    verifyAccount(memoizeQuery);
  }, [verifyAccount, memoizeQuery]);

  return (
    <Modal
      visible
      okText={okText}
      onCancel={tabService.closeCurrent}
      okButtonProps={{
        disabled: verifying,
        loading: verifying,
      }}
      title={<FormattedMessage id="auth.modal.title" />}
      onOk={() => {
        form.validateFields((error, values) => {
          if (error) {
            return;
          }
          const { defaultRepositoryId, imageHosting, ...info } = values;
          props.dispatch(
            asyncAddAccount.started({
              id: id!,
              type,
              defaultRepositoryId,
              imageHosting,
              info,
              userInfo: userInfo!,
              callback: tabService.closeCurrent,
            })
          );
        });
      }}
    >
      <Form labelCol={{ span: 7, offset: 0 }} wrapperCol={{ span: 17 }}>
        <Form.Item
          label={<FormattedMessage id="preference.accountList.type" defaultMessage="Type" />}
        >
          {getFieldDecorator('type', {
            initialValue: query.type,
          })(
            <Select disabled>
              {Object.values(props.servicesMeta).map(o => (
                <Select.Option key={o.type} value={o.type}>
                  {o.name}
                </Select.Option>
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
            <FormattedMessage id="preference.accountList.imageHost" defaultMessage="Image Host" />
          }
        >
          {getFieldDecorator('imageHosting')(
            <ImageHostingSelect
              disabled={!verified}
              supportedImageHostingServices={supportedImageHostingServices}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(mapStateToProps)(Form.create<PageProps>()(Page));
