import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import Plugin from './Plugin';
import { pluginRouterCreator } from '../../const';

const mapStateToProps = ({ userPreference: { plugins }}: GlobalStore) => {
  return {
    idList: plugins.filter(o => o.type === 'clipper').map(o => o.id),
  };
};

export default connect(mapStateToProps)(({ idList }: { idList: string[] }) => (
  <Switch>
    {idList.map(id => (
      <Route exact path={pluginRouterCreator(id)} key={id} component={Plugin} />
    ))}
  </Switch>
));
