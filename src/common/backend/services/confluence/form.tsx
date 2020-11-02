import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Input, Select } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { useFetch } from '@shihengtech/hooks';
import { extend } from 'umi-request';
import {
  ConfluenceListResult,
  ConfluenceSpace,
  ConfluenceServiceConfig,
} from '@/common/backend/services/confluence/interface';
import { FormattedMessage } from 'react-intl';
import useOriginForm from '@/hooks/useOriginForm';

interface ConfluenceFormProps extends FormComponentProps {
  info?: ConfluenceServiceConfig;
}

const ConfluenceForm: React.FC<ConfluenceFormProps> = ({ form, info }) => {
  const { verified, handleAuthentication, formRules } = useOriginForm({ form, initStatus: !!info });

  const host = form.getFieldValue('origin');

  const spaces = useFetch(
    async () => {
      if (!verified) {
        return [];
      }
      const request = extend({
        prefix: host,
      });
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
          rules: formRules,
        })(
          <Input.Search
            enterButton={
              <FormattedMessage
                id="backend.services.confluence.form.authentication"
                defaultMessage="Authentication"
              />
            }
            onSearch={handleAuthentication}
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
