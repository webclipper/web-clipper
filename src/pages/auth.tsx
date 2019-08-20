import React from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import { DvaRouterProps, GlobalStore } from '@/common/types';

interface PageQuery {
  access_token: string;
  type: string;
}

const mapStateToProps = ({ extension: { extensions } }: GlobalStore) => {
  return {
    extensions,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & DvaRouterProps;

const page: React.FC<PageProps> = props => {
  const query = parse(props.location.search.slice(1)) as PageQuery;

  const wew = props.extensions.filter(o => o.type === query.type);

  console.log(query, wew);

  return (
    <div>
      {query.access_token} {query.type}
    </div>
  );
};

export default connect(mapStateToProps)(page);
