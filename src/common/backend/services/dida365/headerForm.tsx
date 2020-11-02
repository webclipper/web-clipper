import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Select } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import React, { Fragment } from 'react';
import backend from '../..';
import Dida365DocumentService from './service';
import locale from '@/common/locales';
import { useFetch } from '@shihengtech/hooks';

const HeaderForm: React.FC<FormComponentProps> = ({ form: { getFieldDecorator } }) => {
  const service = backend.getDocumentService() as Dida365DocumentService;
  const tagsResponse = useFetch(async () => service.getTags(), [service], {
    initialState: {
      data: [],
    },
  });

  return (
    <Fragment>
      <Form.Item>
        {getFieldDecorator('tags', {
          initialValue: [],
        })(
          <Select
            mode="tags"
            maxTagCount={3}
            style={{ width: '100%' }}
            placeholder={locale.format({
              id: 'backend.services.dida365.headerForm.applyTags',
              defaultMessage: 'Apply tags',
            })}
            loading={tagsResponse.loading}
          >
            {tagsResponse.data?.map(o => (
              <Select.Option key={o} value={o} title={o}>
                {o}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </Fragment>
  );
};

export default HeaderForm;
