import { Form, Select, Badge } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { Fragment, useMemo } from 'react';
import backend from '../..';
import useAsync from '@/common/hooks/useAsync';
import GithubDocumentService from './service';
import locale from '@/common/locales';

const HeaderForm: React.FC<FormComponentProps & { currentRepository: any }> = ({
  form: { getFieldDecorator },
  currentRepository,
}) => {
  const service = backend.getDocumentService() as GithubDocumentService;

  const labelsResponse = useAsync(async () => {
    if (currentRepository) {
      return service.getRepoLabels(currentRepository);
    }
    return [];
  }, [currentRepository, service]);

  const labels = useMemo(() => {
    if (labelsResponse.result) {
      return labelsResponse.result;
    }
    return [];
  }, [labelsResponse.result]);

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
            {labels.map(o => (
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
