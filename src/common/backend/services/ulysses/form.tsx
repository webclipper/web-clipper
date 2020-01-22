import React from 'react';
import { FormattedMessage } from 'react-intl';

export default () => (
  <div style={{ textAlign: 'right' }}>
    <FormattedMessage
      id="backend.services.ulysses.form.confirm"
      defaultMessage="Please confirm that the Ulysses client is installed."
    />
  </div>
);
