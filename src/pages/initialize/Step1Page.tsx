import * as React from 'react';
import { Form, Input, Tooltip, Icon, Button, Checkbox } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

const FormItem = Form.Item;

interface Step1PageProps extends FormComponentProps {
    submitting: boolean;
    onStep1Next(item: Step1PageValue): void;
}

export interface Step1PageValue {
    apiHost: string;
    token: string;
}

const formItemLayout = {
    labelCol: {
        sm: { span: 8 },
    },
    wrapperCol: {
        sm: { span: 8 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        sm: {
            span: 8,
            offset: 8,
        },
    },
};

class Step1Page extends React.Component<Step1PageProps & FormComponentProps> {

    render() {
        const { getFieldDecorator } = this.props.form;
        const next = () => {
            this.props.form.validateFields((err, value) => {
                if (err) {
                    return;
                }
                this.props.onStep1Next(value);
            });
        };

        return (<Form>
            <FormItem
                {...formItemLayout}
                label={(
                    <span>
                        语雀域名&nbsp;
                        <Tooltip title={
                            (<span>如果使用的是企业版语雀，需要输入企业的二级域名，例如：https://tmall.yuque.com/api/v2/</span>)
                        }>
                            <Icon type="question-circle-o" />
                        </Tooltip>
                    </span>
                )}>
                {getFieldDecorator('apiHost', {
                    initialValue: 'www.yuque.com',
                    rules: [{
                        required: true, message: '请输入语雀的域名',
                    }],
                })(
                    <Input addonBefore="https://" addonAfter="/api/v2/" />
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label={(
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
                    rules: [{
                        required: true, message: '没有填写 access token',
                    }],
                })(
                    <Input />
                )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
                {getFieldDecorator('agreement', {
                    initialValue: true,
                    rules: [{
                        validator: (_, value, cb) => (value === true ? cb() : cb(false)),
                        required: true, message: '需要同意协议才能进行下一步',
                    }],
                    valuePropName: 'checked',
                })(
                    <Checkbox>我已阅读并同意<a href="https://www.yuque.com/yuqueclipper/av5y68/yla89a" target="_blank">用户协议</a></Checkbox>
                )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" onClick={next} loading={this.props.submitting}>下一步</Button>
            </FormItem>

        </Form>);
    }
}

export default Form.create<Step1PageProps>()(Step1Page);
