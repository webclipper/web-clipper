import React from 'react';
import { Card, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import { SerializedExtensionInfo } from '@web-clipper/extensions';

interface ExtensionCardProps {
  manifest: SerializedExtensionInfo['manifest'];
  actions?: React.ReactNode[];
  className?: string;
}

const ExtensionCard: React.FC<ExtensionCardProps> = ({ manifest, actions, className }) => {
  return (
    <Card className={className} actions={actions}>
      <Card.Meta
        avatar={<Icon type={manifest.icon} />}
        title={manifest.name}
        description={
          manifest.description || (
            <FormattedMessage
              id="preference.extensions.no.Description"
              defaultMessage="No Description"
            />
          )
        }
      />
    </Card>
  );
};

export default ExtensionCard;
