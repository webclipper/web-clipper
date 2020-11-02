import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { Select } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import React, { Fragment } from 'react';
import backend from '../..';
import { useFetch } from '@shihengtech/hooks';
import WizNoteDocumentService from './service';
import locale from '@/common/locales';

const HeaderForm: React.FC<FormComponentProps> = ({ form: { getFieldDecorator } }) => {
  const service = backend.getDocumentService() as WizNoteDocumentService;

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
              id: 'backend.services.wiznote.headerForm.tags',
              defaultMessage: 'Tags',
            })}
            loading={tagResponse.loading}
          >
            {tagResponse.data?.map(o => (
              <Select.Option key={o.id} value={o.name} title={o.name}>
                {o.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </Fragment>
  );
};

export default HeaderForm;
