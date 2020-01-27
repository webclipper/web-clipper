import { Form, Select, Badge } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Fragment } from 'react';
import backend from '../..';
import GithubDocumentService from './service';
import locale from '@/common/locales';
import { useFetch } from '@shihengtech/hooks';

const HeaderForm: React.FC<FormComponentProps & { currentRepository: any }> = ({
  form: { getFieldDecorator },
  currentRepository,
}) => {
  const service = backend.getDocumentService() as GithubDocumentService;

  const labelsResponse = useFetch(
    async () => {
      if (currentRepository) {
        return service.getRepoLabels(currentRepository);
      }
      return [];
    },
    [currentRepository, service],
    {
      initialState: {
        data: [],
      },
    }
  );

  return (
    <Fragment>
      <Form.Item>
        {getFieldDecorator('labels')(
          <Select
            mode="tags"
            maxTagCount={3}
            style={{ width: '100%' }}
            placeholder={locale.format({
              id: 'backend.services.github.headerForm.applyLabels',
              defaultMessage: 'Apply labels',
            })}
            loading={labelsResponse.loading}
          >
            {labelsResponse.data?.map(o => (
              <Select.Option key={o.name} value={o.name} title={o.description}>
                <Badge color={`#${o.color}`} text={o.name} />
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </Fragment>
  );
};

export default HeaderForm;
