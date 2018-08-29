import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './popup.scss';


chrome.tabs.query({ active: true, currentWindow: true }, () => {

  ReactDOM.render(
    <div className='popup' >
      hello world
    </div >,
    document.getElementById('popup'),
  );
});
