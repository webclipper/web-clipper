import React from 'react';

export default ({ status: { edit_url } }: any) => {
  return (
    <div style={{ marginTop: 8 }}>
      <a className="ant-btn-link" type="link" href={edit_url} target="_blank">
        编辑
      </a>
    </div>
  );
};
