import React, { Fragment } from 'react';
import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { Input, Select, Tooltip } from 'antd';
import { Form } from '@ant-design/compatible';
import { FormattedMessage } from 'react-intl';
import locale from '@/common/locales';
import IconFont from '@/components/IconFont';
import { GithubClient } from '../../clients/github/client';
import { IBasicRequestService } from '@/service/common/request';
import Container from 'typedi';
import {
  IBranch,
  IGetGithubRepositoryOptions,
  IRepository,
  IListBranchesOptions,
} from '../../clients/github/types';
import { useFetch } from '@shihengtech/hooks';
import { GithubImageHostingOption } from './type';

interface Props extends FormComponentProps {
  info: GithubImageHostingOption;
}

interface IRepositoryState {
  init: boolean;
  repos: IRepository[];
}

async function fetchAllRepos(accessToken?: string): Promise<IRepositoryState> {
  if (!accessToken) {
    return {
      init: false,
      repos: [],
    };
  }
  const githubClient = new GithubClient({
    token: accessToken,
    request: Container.get(IBasicRequestService),
  });
  const repos = await githubClient.queryAll<IGetGithubRepositoryOptions, IRepository>(
    { visibility: 'all' },
    githubClient.getRepos
  );
  return {
    init: true,
    repos: repos,
  };
}

interface IBranchState {
  init: boolean;
  branches: IBranch[];
  default_branch?: string;
}

interface IFetchBranchesOptions {
  accessToken?: string;
  currentRepo?: string;
  repositoryState: IRepositoryState;
}

async function fetchBranches(options: IFetchBranchesOptions): Promise<IBranchState> {
  if (!options.accessToken || !options.repositoryState.init || !options.currentRepo) {
    return {
      init: false,
      branches: [],
    };
  }
  const currentRepository = options.repositoryState.repos?.filter(
    o => o.full_name === options.currentRepo
  )[0];
  const githubClient = new GithubClient({
    token: options.accessToken,
    request: Container.get(IBasicRequestService),
  });
  const branches = await githubClient.queryAll<IListBranchesOptions, IBranch>(
    {
      owner: options.currentRepo.split('/')[0],
      repo: options.currentRepo.split('/')[1],
      protected: false,
    },
    githubClient.listBranch
  );
  return {
    init: true,
    branches,
    default_branch: currentRepository.default_branch,
  };
}

export default ({ form: { getFieldDecorator }, info, form }: Props) => {
  const initInfo: Partial<Props['info']> = info || {};
  const accessToken = form.getFieldValue('accessToken');
  const { data: reposResult, loading } = useFetch(() => fetchAllRepos(accessToken), [accessToken], {
    auto: true,
    initialState: {
      data: { init: false, repos: [] },
    },
    onError: () => {
      return {
        data: { init: false, repos: [] },
      };
    },
  });
  const currentRepo = form.getFieldValue('repo');
  const { data: branchResponse, loading: branchLoading } = useFetch(
    () =>
      fetchBranches({
        accessToken,
        currentRepo,
        repositoryState: reposResult!,
      }),
    [accessToken, currentRepo, reposResult],
    {
      onError: () => {
        return {
          data: {
            init: false,
            branches: [],
          },
        };
      },
      auto: true,
      initialState: {
        data: {
          init: false,
          branches: [],
        },
      },
    }
  );

  return (
    <Fragment>
      <Form.Item label={<FormattedMessage id="backend.imageHosting.github.form.accessToken" />}>
        {getFieldDecorator('accessToken', {
          initialValue: initInfo.accessToken,
          rules: [
            {
              required: true,
              message: (
                <FormattedMessage id="backend.imageHosting.github.form.accessToken.errorMessage" />
              ),
            },
          ],
        })(
          <Input
            onChange={() => form.setFields({ repo: null, branch: null })}
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
      <Form.Item label={<FormattedMessage id="backend.imageHosting.github.form.repo" />}>
        {getFieldDecorator('repo', {
          initialValue: initInfo.repo,
          rules: [
            {
              required: true,
              message: <FormattedMessage id="backend.imageHosting.github.form.repo.errorMessage" />,
            },
          ],
        })(
          <Select
            showSearch
            optionFilterProp="label"
            onChange={() => form.setFields({ branch: null })}
            disabled={loading || !reposResult?.init}
            loading={loading}
            options={reposResult?.repos?.map(o => {
              return {
                value: o.full_name,
                key: o.full_name,
                label: o.full_name,
              };
            })}
          />
        )}
      </Form.Item>
      <Form.Item
        label={
          <FormattedMessage defaultMessage="Branch" id="backend.imageHosting.github.form.branch" />
        }
      >
        {getFieldDecorator('branch', {
          initialValue: initInfo.branch,
        })(
          <Select
            disabled={loading || !reposResult?.init || !branchResponse?.init}
            placeholder={branchResponse?.default_branch}
            loading={branchLoading}
            options={branchResponse?.branches?.map((o: IBranch) => {
              return {
                value: o.name,
                key: o.name,
              };
            })}
          />
        )}
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
