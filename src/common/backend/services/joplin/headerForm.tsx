import { Form, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Fragment } from 'react';
import backend from '../..';
import { useFetch } from '@shihengtech/hooks';
import JoplinDocumentService from './service';
import locale from '@/common/locales';

const HeaderForm: React.FC<FormComponentProps> = ({ form: { getFieldDecorator } }) => {
  const service = backend.getDocumentService() as JoplinDocumentService;
  const tagResponse = useFetch(async () => service.getTags(), [service], {
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
              id: 'backend.services.joplin.headerForm.tags',
              defaultMessage: 'Tags',
            })}
            loading={tagResponse.loading}
          >
            {tagResponse.data?.map(o => (
              <Select.Option key={o.id} value={o.title} title={o.title}>
                {o.title}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </Fragment>
  );
};

export default HeaderForm;
