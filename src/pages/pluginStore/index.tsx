import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as styles from './style/index.scss';

class App extends React.Component<{}, {}> {
  render() {
    return <div>plugin</div>;
  }
}

chrome.tabs.query({ active: true, currentWindow: true }, async () => {
  if (document.getElementById('initializeWindow') == null) {
    const element = document.createElement('div');
    element.setAttribute('id', 'initializeWindow');
    document.body.appendChild(element);
    element.className = styles.initializeWindow;
  }
  ReactDOM.render(<App />, document.getElementById('initializeWindow'));
});
