import { Form, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Fragment, useMemo } from 'react';
import backend from '../..';
import useAsync from '@/common/hooks/useAsync';
import JoplinDocumentService from './service';
import locale from '@/common/locales';

const HeaderForm: React.FC<FormComponentProps> = ({ form: { getFieldDecorator } }) => {
  const service = backend.getDocumentService() as JoplinDocumentService;

  const tagResponse = useAsync(async () => {
    return service.getTags();
  }, [service]);

  const tags = useMemo(() => {
    if (Array.isArray(tagResponse.result)) {
      return tagResponse.result;
    }
    return [];
  }, [tagResponse.result]);

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
            {tags.map(o => (
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
