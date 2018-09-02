import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './style/index.scss';
import { testStorageInChrome } from '../../services/common/store/test';

testStorageInChrome().then((_) => {
    console.log('storage is ok in content');
}).catch((err: Error) => {
    console.log(err.message);
});

chrome.tabs.query({ active: true, currentWindow: true }, async () => {
    ReactDOM.render(
        <div className="popup">
            Hello World
        </div>,
        document.getElementById('popup')
    );
});
