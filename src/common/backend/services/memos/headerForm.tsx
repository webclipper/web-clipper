import { Input, Tooltip, Select } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.less';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import React, { Fragment } from 'react';
import locales from '@/common/locales';
import { VisibilityType } from './interface';

const { Option } = Select;

const HeaderForm: React.FC<FormComponentProps> = ({ form: { getFieldDecorator } }) => {

  return (
    <Fragment>
      <Form.Item>
        <Tooltip
          trigger={['focus']}
          title={locales.format({
            id: 'backend.services.memos.headerForm.tag',
            defaultMessage: 'Input tags (eg. tag1, tag2...)'
          })}
          placement="topLeft"
          overlayClassName="numeric-input"
        >
          {getFieldDecorator('tags', {
            rules: [
              {
                pattern: /^(?! )[^\u4e00-\u9fa5~`!@#$%^&*()_+={}\[\]:;"'<>.?\/\\|]*[^\s.,;:!?"'()]*$/,
                message: locales.format({
                  id: 'backend.services.memos.headerForm.tag_error',
                }),
              },
            ],
          })(
            <Input
              autoComplete="off"
              placeholder={locales.format({
                id: 'backend.services.memos.headerForm.tag',
                defaultMessage: 'Input tags (eg. tag1, tag2...)'
              })}
            />
          )}
        </Tooltip>
      </Form.Item>

      <Form.Item label={locales.format({
              id: 'backend.services.memos.headerForm.visibility',
              defaultMessage: 'visibility'
					  })}>
        {getFieldDecorator('visibility', {
          initialValue: VisibilityType[0].value,
        })(
          <Select style={{ width: '100%' }}>
            {VisibilityType.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label()}
              </Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </Fragment>
  );
};

export default HeaderForm;
