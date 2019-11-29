import { Form, Input, Checkbox, Button, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Fragment } from 'react';
import { MailBackendServiceConfig } from './interface';
import { useSelector, useDispatch, routerRedux } from 'dva';
import { GlobalStore } from '@/common/types';
import { FormattedMessage } from 'react-intl';
import i18n from '@/common/locales';
import { checkBill } from '@/common/powerpack';

interface OneNoteProps {
  verified?: boolean;
  info?: MailBackendServiceConfig;
}

const DomainList = ['@kindle.cn', '@kindle.com', '@free.kindle.com'];

const DomainSelect = (
  <Select style={{ width: 150 }}>
    {DomainList.map(o => (
      <Select.Option key={o} value={o}>
        {o}
      </Select.Option>
    ))}
  </Select>
);

const ExtraForm: React.FC<OneNoteProps & FormComponentProps> = props => {
  const {
    form: { getFieldDecorator },
    info,
  } = props;

  let initData: Partial<MailBackendServiceConfig> = {};
  if (info) {
    initData = info;
  }
  const userInfo = useSelector((g: GlobalStore) => {
    return g.userPreference.userInfo;
  });
  const dispatch = useDispatch();
  const boughtPowerpack = () => {
    dispatch(routerRedux.push('/preference/powerpack'));
  };
  return (
    <Fragment>
      <Form.Item
        label={
          <FormattedMessage
            id="backend.services.kindle.form.powerpack"
            defaultMessage="Powerpack"
          />
        }
      >
        {getFieldDecorator('powerpack', {
          initialValue: !!userInfo,
          valuePropName: 'checked',
          rules: [
            {
              validator(_r, v, cb) {
                if (v && userInfo) {
                  if (checkBill(userInfo.expire_date)) {
                    cb();
                    return;
                  }
                  cb(
                    i18n.format({
                      id: 'backend.services.kindle.form.powerpack.is.expired',
                      defaultMessage: 'Powerpack is expired',
                    })
                  );
                }
                cb(
                  i18n.format({
                    id: 'backend.services.kindle.form.powerpack.is.required',
                    defaultMessage: 'Powerpack is required.',
                  })
                );
              },
            },
          ],
        })(
          <Checkbox disabled={true}>
            <Button type="link" onClick={boughtPowerpack}>
              <FormattedMessage
                id="backend.services.kindle.form.buy.powerpack"
                defaultMessage="Buy Powerpack"
              />
            </Button>
          </Checkbox>
        )}
      </Form.Item>
      <Form.Item
        label={
          <FormattedMessage id="backend.services.kindle.form.send.to" defaultMessage="Send to" />
        }
      >
        {getFieldDecorator('to', {
          initialValue: initData.to,
          rules: [
            {
              required: true,
              message: i18n.format({
                id: 'backend.services.kindle.form.address.is.required',
                defaultMessage: 'Mail Address is required.',
              }),
            },
          ],
        })(
          <Input
            addonAfter={getFieldDecorator('domain', {
              initialValue: initData.domain || '@kindle.com',
            })(DomainSelect)}
          />
        )}
        <p style={{ lineHeight: '30px' }}>
          <FormattedMessage
            id="backend.services.kindle.form.alert"
            defaultMessage="You must tell Amazon allow {mail} send email to your kindle."
            values={{
              mail: (
                <span style={{ fontWeight: 500, display: 'block' }}>
                  send_to_kindle@push.clipper.website
                </span>
              ),
            }}
          />
        </p>
      </Form.Item>
    </Fragment>
  );
};

export default ExtraForm;
