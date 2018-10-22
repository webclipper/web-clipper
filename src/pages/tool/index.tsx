import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'antd-style';
import * as styles from './index.scss';
import ClipperToolContainer from '../clippertool';
import { ToolStore } from '../../store/ClipperTool';
import { ContentScriptToolImpl } from '../../services/common/contentScripttool';

const appState = new ToolStore(new ContentScriptToolImpl());
appState.init().catch(err => {
  console.log(err);
  chrome.tabs.create({ url: chrome.extension.getURL('initialize.html') });
});

export default class App extends React.Component<{}, any> {

  public render() {
    return (
      <ClipperToolContainer toolState={appState}></ClipperToolContainer>
    );
  }
}

if (document.getElementById(styles.app) == null) {
  const element = document.createElement('div');
  element.setAttribute('id', styles.app);
  document.body.appendChild(element);
  element.className = styles.app;
}
ReactDOM.render(<App />,
  document.getElementById(styles.app)
);

