import React from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import { DvaRouterProps, GlobalStore } from '@/common/types';
import { Modal, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import { FormComponentProps } from 'antd/lib/form';
import * as browser from '@web-clipper/chrome-promise';
import { asyncAddAccount } from '@/actions/userPreference';

interface PageQuery {
  access_token: string;
  type: string;
}

const mapStateToProps = ({ userPreference: { servicesMeta } }: GlobalStore) => {
  return {
    servicesMeta,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & DvaRouterProps & FormComponentProps;

const page: React.FC<PageProps> = props => {
  const query = parse(props.location.search.slice(1)) as PageQuery;
  const service = props.servicesMeta[query.type];

  return (
    <Modal
      onCancel={async () => {
        const tahId = (await browser.tabs.getCurrent()).id;
        chrome.tabs.remove(tahId!);
      }}
      onOk={async () => {
        props.dispatch(
          asyncAddAccount.started({
            type: query.type,
            info: {
              accessToken: query.access_token,
            },
            callback: async () => {
              const tahId = (await browser.tabs.getCurrent()).id;
              chrome.tabs.remove(tahId!);
            },
          })
        );
      }}
      visible
      title={<FormattedMessage id="auth.modal.title" defaultMessage="Account Config" />}
    >
      <Form labelCol={{ span: 7, offset: 0 }} wrapperCol={{ span: 17 }}>
        <Form.Item label={<FormattedMessage id="auth.form.type" defaultMessage="Type" />}>
          {service.name}
        </Form.Item>
      </Form>
      <Form labelCol={{ span: 7, offset: 0 }} wrapperCol={{ span: 17 }}>
        <Form.Item label={<FormattedMessage id="auth.form.token" defaultMessage="Token" />}>
          {query.access_token}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(mapStateToProps)(Form.create<PageProps>()(page));
