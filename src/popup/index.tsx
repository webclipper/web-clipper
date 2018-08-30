import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './popup.scss';

chrome.tabs.query({ active: true, currentWindow: true }, async () => {
    ReactDOM.render(
        <div className="popup">
            Hello World
        </div>,
        document.getElementById('popup')
    );
});
