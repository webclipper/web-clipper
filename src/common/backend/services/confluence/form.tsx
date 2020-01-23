import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import Container from 'typedi';
import { IPermissionsService } from '@/service/common/permissions';
import { FormComponentProps } from 'antd/lib/form';
import { useFetch } from '@shihengtech/hooks';
import { extend } from 'umi-request';

interface FetchSpaceResponse {
  results: {
    id: number;
    name: string;
    type: string;
  }[];
}

const ConfluenceForm: React.FC<FormComponentProps> = ({ form }) => {
  const [verified, setVerified] = useState(false);
  const permissionsService = Container.get(IPermissionsService);
  const host = form.getFieldValue('host');
  const handle = () => {
    form.validateFields(['host'], async (err, value) => {
      if (err) {
        return;
      }
      const result = await permissionsService.request({
        origins: [`${new URL(value.host).origin}/*`],
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
      const spaceList = await request.get<FetchSpaceResponse>(`/rest/api/space`);
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
        {form.getFieldDecorator('host', {
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
                      host: _url.origin,
                    });
                    callback();
                  }
                  callback();
                } catch (_error) {
                  return callback('we');
                }
              },
            },
          ],
        })(<Input.Search enterButton="验证" onSearch={handle} disabled={verified}></Input.Search>)}
      </Form.Item>
      {verified && (
        <Form.Item label="Space">
          {form.getFieldDecorator('spaceId', {
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select loading={spaces.loading}>
              {spaces.data!.map(o => (
                <Select.Option key={o.id} value={o.id}>
                  {o.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      )}
      <Button onClick={() => setVerified(false)}>cler</Button>
    </React.Fragment>
  );
};

export default ConfluenceForm;
