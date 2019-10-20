import { Form, Input, Checkbox, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Fragment } from 'react';
import { MailBackendServiceConfig } from './interface';
import { useSelector, useDispatch, routerRedux } from 'dva';
import { GlobalStore } from '@/common/types';

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
      <Form.Item label="Powerpack">
        {getFieldDecorator('powerpack', {
          initialValue: !!userInfo,
          valuePropName: 'checked',
          rules: [
            {
              validator(_r, v, cb) {
                if (v) {
                  cb();
                }
                cb('Powerpack is required.');
              },
            },
          ],
        })(
          <Checkbox disabled={true}>
            <Button type="link" onClick={boughtPowerpack}>
              By Powerpack
            </Button>
          </Checkbox>
        )}
      </Form.Item>
      <Form.Item label="Send to">
        {getFieldDecorator('to', {
          initialValue: initData.to,
          rules: [
            {
              required: true,
              message: 'Address is required.',
            },
          ],
        })(<Input disabled={editMode || verified} />)}
      </Form.Item>
      <Form.Item label="&nbsp;" extra="Send html or markdown." colon={false}>
        {getFieldDecorator('html', {
          initialValue: initData.html,
          valuePropName: 'checked',
        })(<Checkbox>Send Html</Checkbox>)}
      </Form.Item>
      <Form.Item label="Home">
        {getFieldDecorator('home', {
          initialValue: initData.home,
          rules: [
            {
              required: true,
              message: 'Home is required',
            },
          ],
        })(<Input placeholder="Home of mail." />)}
      </Form.Item>
    </Fragment>
  );
};

export default ExtraForm;
