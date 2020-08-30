import React, { Fragment } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Input, Tooltip, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import { stringify } from 'qs';
import locale from '@/common/locales';


interface Props extends FormComponentProps {
  info: {
    accessToken: string;
    relativePath: string;
    repositoryName: string;
  };
}

export default ({ form: { getFieldDecorator }, info }: Props) => {
  const initInfo: Partial<Props['info']> = info || {};
  const GenerateNewTokenUrl = `https://github.com/settings/tokens/new?${stringify({
    scopes: 'repo',
    description: 'Web Clipper',
  })}`;
    
  return (
    <Fragment>
      <Form.Item label={
        <FormattedMessage
          id = "backend.imageHosting.github.form.accessToken"
          defaultMessage = "AccessToken"
        />
      }>
        {getFieldDecorator('accessToken', {
          initialValue: initInfo.accessToken,
          rules: [
            {
              required: true,
              message:<FormattedMessage 
                      id = "backend.imageHosting.github.form.accessToken.errorMessage" 
                      defaultMessage = "AccessToken is required"/>,
            },
          ],
        })(<Input 
              placeholder=""             
              suffix={
              <Tooltip
                title={
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {locale.format({
                      id: 'backend.imageHosting.github.form.GenerateNewToken',
                      defaultMessage: 'Generate new token',
                    })}
                  </span>
                }
              >
                <a href={GenerateNewTokenUrl} target={GenerateNewTokenUrl}>
                  <Icon type="key" />
                </a>
              </Tooltip>
        }/>)}
      </Form.Item>
      <Form.Item label={
        <FormattedMessage
        defaultMessage = 'Repo Name'
        id = "backend.imageHosting.github.form.ReopName"
        />
      }>
        {getFieldDecorator('repositoryName', {
          initialValue: initInfo.repositoryName,
          rules: [
            {
              required: true,
              message:<FormattedMessage 
              id = "backend.imageHosting.github.form.repositoryName.errorMessage" 
              defaultMessage = "repository name is required"/>,
            },
          ],
        })(<Input/>)}
      </Form.Item>
      <Form.Item label={
        <FormattedMessage
          id = "backend.imageHosting.github.form.storageLocation.code.savePath"
          defaultMessage = "Save Path"
        />
      }>
        {getFieldDecorator('relativePath', {
          initialValue: initInfo.relativePath,
          rules: [
            {
              required: false,
            },
          ],
        })(<Input />)}
      </Form.Item>
    </Fragment>
  );
};
