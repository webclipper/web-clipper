import React from 'react';
import { Card, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import { SerializedExtensionInfo } from '@web-clipper/extensions';

interface ExtensionCardProps {
  manifest: SerializedExtensionInfo['manifest'];
  actions?: React.ReactNode[];
  className?: string;
  extra?: React.ReactNode;
}

const ExtensionCard: React.FC<ExtensionCardProps> = ({ manifest, actions, className, extra }) => {
  return (
    <Card
      className={className}
      actions={actions}
      extra={extra}
      title={<Card.Meta avatar={<Icon type={manifest.icon} />} title={manifest.name} />}
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
  );
};

export default ExtensionCard;
