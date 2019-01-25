import * as React from 'react';
import { Form, Input, Select, Button, Tooltip, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { updateInitializeForm, asyncPostInitializeForm } from '../../store/actions/userPreference';

const Option = Select.Option;

const mapStateToProps = ({
  userPreference: {
    accessToken,
    initializeForm: { token, defaultRepository, host }
  },
  clipper: { repositories }
}: GlobalStore) => {
  return {
    token,
    accessToken,
    defaultRepository,
    host,
    repositories
  };
};
const useActions = {
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
    const { getFieldDecorator } = this.props.form;
    const { repositories, accessToken } = this.props;
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
          rules: [{ required: true, message: 'host is required!' }]
        })(<Input addonAfter="/api/v2/" />)}
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
        })(<Input.Password visibilityToggle />)}
      </Form.Item>
      {
        repositories && repositories.length > 0 &&
          <Form.Item label="默认知识库">
            {getFieldDecorator('defaultRepository')(<Select >
              {repositories.map(o => {
                return (
                  <Option key={o.id.toString()} value={o.id}>
                    {o.name}
                  </Option>
                );
              })}
            </Select>)}
          </Form.Item>
      }
      <Button onClick={() => { this.props.asyncPostInitializeForm() }}>校验</Button>
    </Form>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create<PageProps>({
  onFieldsChange(props, changedFields) {
    props.updateInitializeForm(changedFields);
  },
  mapPropsToFields(props: PageProps) {
    const { token, host, defaultRepository } = props;
    return {
      token: token ? Form.createFormField({
        ...token
      }) : null,
      host: Form.createFormField({
        ...host
      }),
      defaultRepository: Form.createFormField({
        ...defaultRepository
      })
    };
  }
})(InitializeForm) as React.ComponentType);
