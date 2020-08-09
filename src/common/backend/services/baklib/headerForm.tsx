import { Form, Select, TreeSelect, Radio, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
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
      <Form layout="inline">
        <Form.Item label="状态">
          {getFieldDecorator('status', {
            initialValue: 1,
          })(
            <Radio.Group>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>发布</Radio>
            </Radio.Group>
          )}
        </Form.Item>
      </Form>
      <Form.Item>
        {getFieldDecorator('tags', {
          initialValue: [],
        })(
          <Select
            mode="tags"
            maxTagCount={3}
            style={{ width: '100%' }}
            placeholder={locale.format({
              id: 'backend.services.baklib.headerForm.tags',
              defaultMessage: 'Tags',
            })}
          ></Select>
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('description')(
          <Input.TextArea
            placeholder={locale.format({
              id: 'backend.services.baklib.headerForm.description',
              defaultMessage: 'Description',
            })}
          />
        )}
      </Form.Item>
    </Fragment>
  );
};

export default HeaderForm;
