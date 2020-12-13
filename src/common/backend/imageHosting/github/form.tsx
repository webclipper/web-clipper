import React, { Fragment } from 'react';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { Input, Tooltip } from 'antd';
import { Form } from '@ant-design/compatible';
import { FormattedMessage } from 'react-intl';
import locale from '@/common/locales';
import IconFont from '@/components/IconFont';
import { GithubClient } from '../../clients/github/client';

interface Props extends FormComponentProps {
  info: {
    accessToken: string;
    savePath: string;
    repoName: string;
  };
}

export default ({ form: { getFieldDecorator }, info }: Props) => {
  const initInfo: Partial<Props['info']> = info || {};
  return (
    <Fragment>
      <Form.Item
        label={
          <FormattedMessage
            id="backend.imageHosting.github.form.accessToken"
            defaultMessage="AccessToken"
          />
        }
      >
        {getFieldDecorator('accessToken', {
          initialValue: initInfo.accessToken,
          rules: [
            {
              required: true,
              message: (
                <FormattedMessage
                  id="backend.imageHosting.github.form.accessToken.errorMessage"
                  defaultMessage="AccessToken is required."
                />
              ),
            },
          ],
        })(
          <Input
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
                      id: 'backend.imageHosting.github.form.generateNewToken',
                      defaultMessage: 'Generate new token',
                    })}
                  </span>
                }
              >
                <a
                  href={GithubClient.generateNewTokenUrl}
                  target={GithubClient.generateNewTokenUrl}
                >
                  <IconFont type="key" />
                </a>
              </Tooltip>
            }
          />
        )}
      </Form.Item>
      <Form.Item
        label={
          <FormattedMessage
            defaultMessage="Repo Name"
            id="backend.imageHosting.github.form.repoName"
          />
        }
      >
        {getFieldDecorator('repoName', {
          initialValue: initInfo.repoName,
          rules: [
            {
              required: true,
              message: (
                <FormattedMessage
                  id="backend.imageHosting.github.form.repoName.errorMessage"
                  defaultMessage="Repo name is required."
                />
              ),
            },
          ],
        })(<Input />)}
      </Form.Item>
      <Form.Item
        label={
          <FormattedMessage
            id="backend.imageHosting.github.form.savePath"
            defaultMessage="Save Path"
          />
        }
      >
        {getFieldDecorator('savePath', {
          initialValue: initInfo.savePath,
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
