import React from 'react';
import { Card, Modal, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import { SerializedExtensionInfo } from '@/extensions/common';
import IconFont from '@/components/IconFont';
import { SettingOutlined } from '@ant-design/icons';
import { Form, FormItem, Input as FormInput } from '@formily/antd';
import { createForm, onFormValuesChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { toJS } from 'mobx';
import Container from 'typedi';
import { IExtensionContainer, IExtensionService } from '@/service/common/extension';
import useFilterExtensions from '@/common/hooks/useFilterExtensions';
import './index.less';

interface ExtensionCardProps {
  manifest: SerializedExtensionInfo['manifest'];
  actions?: React.ReactNode[];
  className?: string;
}

const ExtensionSelect: React.FC<{ value: string; onChange: any }> = ({ value, onChange }) => {
  const extensionContainer = Container.get(IExtensionContainer);
  const [_toolExtensions, clipExtensions] = useFilterExtensions(extensionContainer.extensions);

  return (
    <Select
      mode="multiple"
      value={value}
      onChange={onChange}
      options={clipExtensions.map(o => ({
        title: o.manifest.name,
        value: o.id,
        key: o.id,
      }))}
    ></Select>
  );
};

const SchemaField = createSchemaField({
  components: {
    FormItem,
    textarea: FormInput.TextArea!,
    clipExtensionsSelect: ExtensionSelect,
  },
});

const ReachableContext = React.createContext<{
  manifest: SerializedExtensionInfo['manifest'] | null;
  // eslint-disable-next-line no-undefined
}>({ manifest: null });

const config = () => {
  return {
    width: 800,
    content: (
      <>
        <ReachableContext.Consumer>
          {({ manifest }) => {
            const config = manifest!.config;
            const extensionId: string = manifest!.extensionId as string;
            const defaultValue =
              Container.get(IExtensionService).getExtensionConfig(extensionId) ||
              toJS(config?.default);
            const normalForm = createForm({
              validateFirst: true,
              initialValues: defaultValue as any,
              effects: () => {
                onFormValuesChange(form => {
                  if (form.mounted) {
                    Container.get(IExtensionService).setExtensionConfig(extensionId, form.values);
                  }
                });
              },
            });
            return (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '600px' }}>
                  <Form form={normalForm} layout="vertical">
                    <SchemaField schema={config!.scheme} />
                  </Form>
                </div>
              </div>
            );
          }}
        </ReachableContext.Consumer>
      </>
    ),
  };
};

const ExtensionCard: React.FC<ExtensionCardProps> = ({ manifest, actions, className }) => {
  const extra: React.ReactNode[] = [manifest.version];
  const [modal, contextHolder] = Modal.useModal();

  if (manifest.config) {
    extra.push(
      <SettingOutlined
        style={{ marginLeft: 8 }}
        key="setting"
        onClick={() => {
          modal.info(config());
        }}
      />
    );
  }
  return (
    <React.Fragment>
      <ReachableContext.Provider value={{ manifest: manifest }}>
        {contextHolder}
      </ReachableContext.Provider>
      <Card
        className={className}
        actions={actions}
        extra={[extra]}
        title={<Card.Meta avatar={<IconFont type={manifest.icon} />} title={manifest.name} />}
      >
        <div style={{ height: 30 }}>
          {manifest.description || (
            <FormattedMessage
              id="preference.extensions.no.Description"
              defaultMessage="No Description"
            />
          )}
        </div>
      </Card>
    </React.Fragment>
  );
};

export default ExtensionCard;
