import React, { useState } from 'react';
import { Form, Input, Select } from 'antd';
import Container from 'typedi';
import { IPermissionsService } from '@/service/common/permissions';
import { FormComponentProps } from 'antd/lib/form';
import { useFetch } from '@shihengtech/hooks';
import { extend } from 'umi-request';
import {
  ConfluenceListResult,
  ConfluenceSpace,
  ConfluenceServiceConfig,
} from '@/common/backend/services/confluence/interface';

interface ConfluenceFormProps extends FormComponentProps {
  info?: ConfluenceServiceConfig;
}

const ConfluenceForm: React.FC<ConfluenceFormProps> = ({ form, info }) => {
  const [verified, setVerified] = useState(!!info);
  const permissionsService = Container.get(IPermissionsService);
  const host = form.getFieldValue('origin');
  const handle = () => {
    form.validateFields(['origin'], async (err, value) => {
      if (err) {
        return;
      }
      const result = await permissionsService.request({
        origins: [`${new URL(value.origin).origin}/*`],
      });
      if (result) {
        setVerified(true);
      }
    });
  };

  const request = extend({
    prefix: host,
  });

  const spaces = useFetch(
    async () => {
      if (!verified) {
        return [];
      }
      const spaceList = await request.get<ConfluenceListResult<ConfluenceSpace>>(`/rest/api/space`);
      return spaceList.results;
    },
    [host, verified],
    {
      initialState: {
        data: [],
      },
    }
  );

  return (
    <React.Fragment>
      <Form.Item label="Origin">
        {form.getFieldDecorator('origin', {
          initialValue: info?.origin,
          rules: [
            {
              required: true,
            },
            {
              validator(_r, value, callback) {
                try {
                  const _url = new URL(value);
                  if (_url.origin !== value) {
                    form.setFieldsValue({
                      origin: _url.origin,
                    });
                    callback();
                  }
                  callback();
                } catch (_error) {
                  return callback('2');
                }
              },
            },
          ],
        })(<Input.Search enterButton="验证" onSearch={handle} disabled={verified}></Input.Search>)}
      </Form.Item>
      {verified && (
        <Form.Item label="Space">
          {form.getFieldDecorator('spaceId', {
            initialValue: info?.spaceId,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select loading={spaces.loading}>
              {spaces
                .data!.filter(o => !!o._expandable.homepage)
                .map(o => {
                  const spaceHomePage = o._expandable.homepage!.split('/');
                  return (
                    <Select.Option key={o.id} value={`${spaceHomePage[spaceHomePage.length - 1]}`}>
                      {o.name}
                    </Select.Option>
                  );
                })}
            </Select>
          )}
        </Form.Item>
      )}
    </React.Fragment>
  );
};

export default ConfluenceForm;
