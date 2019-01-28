import * as React from 'react';
import { Form, Input, Select, Button, Tooltip, Icon, Divider } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch,  } from 'redux';
import { updateInitializeForm, asyncPostInitializeForm, changeDefaultRepository } from '../../store/actions/userPreference';

const Option = Select.Option;

const mapStateToProps = ({
  userPreference: {
    accessToken,
    defaultRepositoryId,
    initializeForm: { token, host, uploading }
  },
  userInfo,
  clipper: { repositories }
}: GlobalStore) => {
  return {
    token,
    accessToken,
    defaultRepositoryId,
    uploading,
    userInfo,
    host,
    repositories
  };
};
const useActions = {
  changeDefaultRepository: changeDefaultRepository.started,
  asyncPostInitializeForm: asyncPostInitializeForm.started,
  updateInitializeForm
};

type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageOwnProps = {};
type PageProps = PageStateProps &
  PageDispatchProps &
  PageOwnProps &
  FormComponentProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(
    useActions,
    dispatch
  );

class InitializeForm extends React.Component<PageProps> {

  render() {
    const { getFieldDecorator, getFieldsValue, getFieldsError } = this.props.form;
    const { repositories, accessToken, defaultRepositoryId, uploading } = this.props;

    let repositoryId;
    if (repositories.findIndex((repository: Repository) => (repository.id === defaultRepositoryId)) !== -1) {
      repositoryId = defaultRepositoryId;
    }
    const values = getFieldsValue() as {token: string ;host: string};

    const fieldsError = getFieldsError() as any;
    const enableButton = (values.token || accessToken) && !fieldsError.host && !fieldsError.token;

    return <Form >
      <Form.Item label={(
        <span>
            域名
          <Tooltip title={
            (<span>如果使用的是企业版语雀，需要输入企业的二级域名，例如：https://tmall.yuque.com/api/v2/</span>)
          }>
            <Icon type="question-circle-o" />
          </Tooltip>
        </span>
      )}>
        {getFieldDecorator('host', {
          initialValue: 'https://www.yuque.com/api/v2/',
          rules: [{ required: true, message: 'host is required!' }]
        })(<Input disabled={uploading} />)}
      </Form.Item>
      <Form.Item label={(
        <span>
              AccessToken&nbsp;
          <Tooltip title={
            (<span>在语雀的<a href="https://www.yuque.com/settings/tokens" target="_blank">设置页面</a>可以找到</span>)
          }>
            <Icon type="question-circle-o" />
          </Tooltip>
        </span>
      )}>
        {getFieldDecorator('token', {
          initialValue: accessToken,
          rules: [{ required: true, message: 'AccessToken is required!' }]
        })(<Input.Password disabled={uploading} visibilityToggle />)}
      </Form.Item>
      <div>
        <Button disabled={!enableButton} loading={uploading} type="primary" onClick={() => {
          this.props.asyncPostInitializeForm(); }}>校验</Button>
      </div>
      <Divider style={{ marginTop: '20px' }} />
      {
        repositories && repositories.length > 0 &&
        <Form.Item label="默认知识库">
          <Select
            loading={uploading}
            disabled={uploading}
            value={repositoryId}
            onChange={(select: string) => {
              this.props.changeDefaultRepository({
                defaultRepositoryId: select
              });
            }} >
            {repositories.map(o => {
              return (
                <Option key={o.id.toString()} value={o.id.toString()}>
                  {o.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      }
    </Form>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create<PageProps>({
  onFieldsChange(props, changedFields) {
    props.updateInitializeForm(changedFields as any);
  },
  mapPropsToFields(props: PageProps) {
    const { token, host } = props;
    return {
      token: token ? Form.createFormField({
        ...token
      }) : null,
      host: host ? Form.createFormField({
        ...host
      }) : null
    };
  }
})(InitializeForm) as React.ComponentType);
