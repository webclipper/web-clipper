import React from 'react';
import { Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { useFetch } from '@shihengtech/hooks';
import { extend } from 'umi-request';
import {
  ConfluenceListResult,
  ConfluenceSpace,
  ConfluenceServiceConfig,
} from '@/common/backend/services/confluence/interface';
import useOriginPermission from '@/common/hooks/useOriginPermission';
import { FormattedMessage } from 'react-intl';

interface ConfluenceFormProps extends FormComponentProps {
  info?: ConfluenceServiceConfig;
}

const ConfluenceForm: React.FC<ConfluenceFormProps> = ({ form, info }) => {
  const [verified, requestOriginPermission] = useOriginPermission(!!info);
  const host = form.getFieldValue('origin');
  const handle = () => {
    form.validateFields(['origin'], async (err, value) => {
      if (err) {
        return;
      }
      requestOriginPermission(value.origin);
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
      <Form.Item
        label={
          <FormattedMessage id="backend.services.confluence.form.origin" defaultMessage="Origin" />
        }
      >
        {form.getFieldDecorator('origin', {
          initialValue: info?.origin,
          rules: [
            {
              required: true,
              message: (
                <FormattedMessage
                  id="backend.services.confluence.form.origin.message"
                  defaultMessage={`Wrong format,Examples https://developer.mozilla.org`}
                />
              ),
            },
            {
              validator(_r, value, callback) {
                if (!value) {
                  return callback();
                }
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
                  return callback(
                    <FormattedMessage
                      id="backend.services.confluence.form.origin.message"
                      defaultMessage={`Wrong format,Examples https://developer.mozilla.org`}
                    />
                  );
                }
              },
            },
          ],
        })(
          <Input.Search
            enterButton={
              <FormattedMessage
                id="backend.services.confluence.form.authentication"
                defaultMessage="Authentication"
              />
            }
            onSearch={handle}
            disabled={verified}
          />
        )}
      </Form.Item>
      {verified && (
        <Form.Item
          label={
            <FormattedMessage id="backend.services.confluence.form.space" defaultMessage="Space" />
          }
        >
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
