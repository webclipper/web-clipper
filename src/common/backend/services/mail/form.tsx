import { Form, Input, Checkbox, Button } from 'antd';
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

const ExtraForm: React.FC<OneNoteProps & FormComponentProps> = props => {
  const {
    form: { getFieldDecorator },
    info,
    verified,
  } = props;

  let initData: Partial<MailBackendServiceConfig> = {};
  if (info) {
    initData = info;
  }
  let editMode = info ? true : false;
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
          <FormattedMessage id="backend.services.mail.form.powerpack" defaultMessage="Powerpack" />
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
                      id: 'backend.services.mail.form.powerpack.is.expired',
                      defaultMessage: 'Powerpack is expired',
                    })
                  );
                }
                cb(
                  i18n.format({
                    id: 'backend.services.mail.form.powerpack.is.required',
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
                id="backend.services.mail.form.buy.powerpack"
                defaultMessage="Buy Powerpack"
              />
            </Button>
          </Checkbox>
        )}
      </Form.Item>
      <Form.Item
        label={
          <FormattedMessage id="backend.services.mail.form.send.to" defaultMessage="Send to" />
        }
      >
        {getFieldDecorator('to', {
          initialValue: initData.to,
          rules: [
            {
              required: true,
              message: i18n.format({
                id: 'backend.services.mail.form.address.is.required',
                defaultMessage: 'Mail Address is required.',
              }),
            },
          ],
        })(<Input disabled={editMode || verified} />)}
      </Form.Item>
      <Form.Item
        label="&nbsp;"
        extra={
          <FormattedMessage
            id="backend.services.mail.form.send.html.or.markdown"
            defaultMessage="Send Html or Markdown."
          />
        }
        colon={false}
      >
        {getFieldDecorator('html', {
          initialValue: initData.html,
          valuePropName: 'checked',
        })(
          <Checkbox>
            <FormattedMessage
              id="backend.services.mail.form.send.html"
              defaultMessage="Send Html"
            />
          </Checkbox>
        )}
      </Form.Item>
      <Form.Item
        label={
          <FormattedMessage id="backend.services.mail.form.homepage" defaultMessage="Homepage" />
        }
      >
        {getFieldDecorator('home', {
          initialValue: initData.home,
          rules: [
            {
              required: true,
              message: i18n.format({
                id: 'backend.services.mail.form.homepage.is.required',
                defaultMessage: 'Homepage is required',
              }),
            },
          ],
        })(
          <Input
            placeholder={i18n.format({
              id: 'backend.services.mail.form.homepage.of.mail',
              defaultMessage: 'Homepage of Mail',
            })}
          />
        )}
      </Form.Item>
    </Fragment>
  );
};

export default ExtraForm;
