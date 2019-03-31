import * as React from 'react';
import {
  asyncAddAccount,
  asyncVerificationAccessToken,
  cancelCreateAccount,
  updateCreateAccountForm,
} from '../../../store/actions/userPreference';

import { bindActionCreators, Dispatch } from 'redux';
import { Button, Form, Modal, Select, Col, Row } from 'antd';
import { connect } from 'react-redux';
import { FormComponentProps } from 'antd/lib/form';
import { services } from '../../../common/backend';

const mapStateToProps = ({
  userPreference: { initializeForm },
}: GlobalStore) => {
  return {
    initializeForm,
  };
};
const useActions = {
  updateCreateAccountForm,
  cancelCreateAccount,
  asyncAddAccount: asyncAddAccount.started,
  asyncVerificationAccessToken: asyncVerificationAccessToken.started,
};

type PageOwnProps = {};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageProps = PageOwnProps &
  PageStateProps &
  PageDispatchProps &
  FormComponentProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(
    useActions,
    dispatch
  );
class InitializeForm extends React.Component<PageProps> {
  handleVerificationAccount = () => {
    this.props.form.validateFields(error => {
      if (error) {
        return;
      }
      const {
        type,
        defaultRepositoryId,
        ...info
      } = this.props.form.getFieldsValue();
      this.props.asyncVerificationAccessToken({
        type,
        info,
      });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      verified,
      repositories,
      verifying,
      visible,
    } = this.props.initializeForm;

    const disableOkButton = verified ? false : true;

    const form = this.props.form.getFieldValue('type');

    const service = services.find(o => o.type === form);

    return (
      <Modal
        visible={visible}
        title="绑定新账号"
        okText="绑定"
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
        <Form labelCol={{ span: 6, offset: 0 }} wrapperCol={{ span: 18 }}>
          <Form.Item label="类型">
            {getFieldDecorator('type', {
              initialValue: 'yuque',
            })(
              <Select>
                {services.map(o => (
                  <Select.Option key={o.type}>{o.name}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {service && service.form && <service.form form={this.props.form} />}
          {
            <Form.Item label="默认知识库">
              <Row gutter={16} type="flex">
                <Col span={18}>
                  {getFieldDecorator('defaultRepositoryId')(
                    <Select
                      loading={verifying}
                      disabled={verifying || !verified}
                    >
                      {repositories.map(o => {
                        return (
                          <Select.Option
                            key={o.id.toString()}
                            value={o.id.toString()}
                          >
                            {o.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </Col>
                <Col span={6}>
                  <Button
                    block
                    type="primary"
                    disabled={verifying || verified}
                    loading={verifying}
                    onClick={this.handleVerificationAccount}
                  >
                    校验
                  </Button>
                </Col>
              </Row>
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
)(
  Form.create<PageProps>({
    onValuesChange(props, fields: any, allValues) {
      console.log(props, fields, allValues);
      if (fields.type) {
        props.form.resetFields(
          Object.keys(allValues).filter(o => o !== 'type')
        );
        props.updateCreateAccountForm({
          type: fields.type,
        });
        return;
      }
      const { type, defaultRepositoryId, ...info } = allValues;
      props.updateCreateAccountForm({
        type,
        defaultRepositoryId,
        info,
      });
    },
  })(InitializeForm)
);
