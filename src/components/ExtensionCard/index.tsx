import React from 'react';
import { Card } from 'antd';
import { FormattedMessage } from 'react-intl';
import { SerializedExtensionInfo } from '@web-clipper/extensions';
import IconFont from '@/components/IconFont';

interface ExtensionCardProps {
  manifest: SerializedExtensionInfo['manifest'];
  actions?: React.ReactNode[];
  className?: string;
}

const ExtensionCard: React.FC<ExtensionCardProps> = ({ manifest, actions, className }) => {
  return (
    <Card
      className={className}
      actions={actions}
      extra={manifest.version}
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
  );
};

export default ExtensionCard;
