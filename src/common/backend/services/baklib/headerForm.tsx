import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { TreeSelect } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import React, { Fragment, useEffect } from 'react';
import locale from '@/common/locales';
import { Repository } from '../interface';
import { useFetch } from '@shihengtech/hooks';
import backend from '../..';
import BaklibDocumentService from './service';

const HeaderForm: React.FC<FormComponentProps & { currentRepository: Repository }> = ({
  form: { getFieldDecorator, setFieldsValue, getFieldValue },
  currentRepository,
}) => {
  const service = backend.getDocumentService() as BaklibDocumentService;
  const channals = useFetch(() => {
    if (currentRepository) {
      return service.getTentChannel(currentRepository.id);
    }
    return [];
  }, [currentRepository]);

  useEffect(() => {
    setFieldsValue({
      channel: null,
    });
  }, [currentRepository, setFieldsValue]);

  useEffect(() => {
    if (Array.isArray(channals.data) && channals.data.length > 0 && !getFieldValue('channel')) {
      setFieldsValue({
        channel: channals.data[0].value,
      });
    }
  }, [channals.data, getFieldValue, setFieldsValue]);
  return (
    <Fragment>
      <Form.Item>
        {getFieldDecorator('channel', {
          rules: [],
        })(
          <TreeSelect
            disabled={channals.loading}
            loading={channals.loading}
            allowClear
            treeData={channals.data}
            style={{ width: '100%' }}
            placeholder={locale.format({
              id: 'backend.services.baklib.headerForm.channel',
              defaultMessage: 'Channel',
            })}
          />
        )}
      </Form.Item>
    </Fragment>
  );
};

export default HeaderForm;
