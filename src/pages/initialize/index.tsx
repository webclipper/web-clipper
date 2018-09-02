import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Layout, Steps } from 'antd';
const { Header, Content, Footer } = Layout;
import './style/index.scss';

const Step = Steps.Step;

chrome.tabs.query({ active: true, currentWindow: true }, async () => {
    ReactDOM.render(
        <Layout>
            <Header className="Header">
                <p>语雀 剪藏 保存精彩网页</p>
            </Header>
            <Content className="content">
                <div className="initializeForm" >
                    <Steps>
                        <Step title="第一步" />
                        <Step title="第二步" />
                        <Step title="第三步" />
                    </Steps>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                语雀 剪藏 ©2018 Created by <a href="https://github.com/DiamondYuan">DiamondYuan</a>
            </Footer>
        </Layout >,
        document.getElementById('initializeWindow')
    );
});

