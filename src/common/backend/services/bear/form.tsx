import React from 'react';
import { FormattedMessage } from 'react-intl';

export default () => (
  <div style={{ textAlign: 'right' }}>
    <FormattedMessage
      id="backend.services.bear.form.confirm"
      defaultMessage="Please confirm that the Bear client is installed."
    />
  </div>
);
