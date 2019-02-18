import * as React from 'react';
import {
  asyncAddAccount,
  asyncVerificationAccessToken,
  cancelCreateAccount,
  updateCreateAccountForm
} from '../../../store/actions/userPreference';
import { backendServices } from '../../../const';
import { bindActionCreators, Dispatch } from 'redux';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { connect } from 'react-redux';
import { FormComponentProps } from 'antd/lib/form';

const Option = Select.Option;

const formItemLayout = {
  labelCol: { span: 6, offset: 0 },
  wrapperCol: { span: 18 }
};

const typeOptions = Object.keys(backendServices).map(key => ({
  ...backendServices[key],
  key
}));
const mapStateToProps = ({
  userPreference: { initializeForm }
}: GlobalStore) => {
  return {
    initializeForm
  };
};
const useActions = {
  updateCreateAccountForm,
  cancelCreateAccount,
  asyncAddAccount: asyncAddAccount.started,
  asyncVerificationAccessToken: asyncVerificationAccessToken.started
};

type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageProps = PageStateProps & PageDispatchProps & FormComponentProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(
    useActions,
    dispatch
  );
class InitializeForm extends React.Component<PageProps> {
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      verified,
      repositories,
      verifying,
      show
    } = this.props.initializeForm;
    const disableOkButton = verified ? false : true;

    return (
      <Modal
        visible={show}
        title='绑定新账号'
        okText='绑定'
        okType={disableOkButton ? 'dashed' : 'primary'}
        onCancel={() => {
          this.props.cancelCreateAccount();
        }}
        onOk={() => {
          if (disableOkButton) {
            return;
          }
          this.props.asyncAddAccount();
        }}
      >
        <Form>
          <Form.Item label={<span>类型</span>} {...formItemLayout}>
            {getFieldDecorator('type')(
              <Select>
                {typeOptions.map(o => (
                  <Select.Option key={o.key}>{o.name}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label='域名' {...formItemLayout}>
            {getFieldDecorator('host', {
              rules: [{ required: true, message: 'host is required!' }]
            })(<Input disabled={verifying} />)}
          </Form.Item>
          <Form.Item label='AccessToken' {...formItemLayout}>
            <Row>
              <Col span={18}>
                {getFieldDecorator('accessToken', {
                  rules: [
                    {
                      required: true,
                      message: 'AccessToken is required!'
                    }
                  ]
                })(<Input />)}
              </Col>
              <Col offset={1} span={4}>
                <Button
                  block
                  type='primary'
                  disabled={verifying || verified}
                  loading={verifying}
                  onClick={() => {
                    this.props.asyncVerificationAccessToken();
                  }}
                >
                  校验
                </Button>
              </Col>
            </Row>
          </Form.Item>
          {
            <Form.Item label='默认知识库' {...formItemLayout}>
              {getFieldDecorator('defaultRepositoryId')(
                <Select loading={verifying} disabled={verifying}>
                  {repositories.map(o => {
                    return (
                      <Option key={o.id.toString()} value={o.id.toString()}>
                        {o.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          }
        </Form>
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create<PageProps>({
  onFieldsChange(props, changedFields) {
    props.updateCreateAccountForm(changedFields as any);
  },
  mapPropsToFields(props: PageProps) {
    const {
      accessToken,
      host,
      type,
      defaultRepositoryId
    } = props.initializeForm;
    return {
      defaultRepositoryId: defaultRepositoryId
        ? Form.createFormField({
          ...defaultRepositoryId
        })
        : null,
      type: type
        ? Form.createFormField({
          ...type
        })
        : null,
      accessToken: accessToken
        ? Form.createFormField({
          ...accessToken
        })
        : null,
      host: host
        ? Form.createFormField({
          ...host
        })
        : null
    };
  }
})(InitializeForm) as React.ComponentType);
