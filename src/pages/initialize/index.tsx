import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Layout, Steps, message, Spin } from 'antd';
import YuqueApi from '../../services/api/api';
import store from '../../services/common/store';
import Step1Page, { Step1PageValue } from './Step1Page';
import Step2Page, { Step2State } from './Step2Page';
import { RepoType, RepoPublicType } from '../../enums';
import { BookSerializer } from '../../services/api/reposService';
import { UserProfile } from '../../services/api/userService';
import Step3Page from './Step3Page';
import * as dayjs from 'dayjs';
import './style/index.scss';
import { UUID } from '../../services/utils/uuid';

const { Header, Content, Footer } = Layout;
const Step = Steps.Step;

let yuqueApi: YuqueApi;



interface AppState {
    //当前步骤
    current: number;
    //整体是否在加载
    contentLoading: boolean;
    //Step1是否在提交
    step1Submitting: boolean;
    //Step1是否在提交
    step2Submitting: boolean;
    //用户的知识库列表
    bookList: BookSerializer[];
    defualtBook?: BookSerializer;
    //用户信息
    userInfo?: UserProfile;
}

class App extends React.Component<{}, AppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            current: 0,
            contentLoading: true,
            step1Submitting: false,
            step2Submitting: false,
            bookList: [],
        };
        this.init().then(() => {
            this.setState({
                contentLoading: false,
            });
        }).catch(() => {
            this.setState({
                contentLoading: false,
                current: 0,
            });
        });
    }

    init = async () => {
        const localUserInfo = await store.getUserInfo();
        yuqueApi = new YuqueApi({
            baseURL: localUserInfo.baseURL,
            token: localUserInfo.token
        });
        const userInfo = await yuqueApi.userService.getUser();
        this.setState({
            userInfo: userInfo,
        });
        const bookList = await yuqueApi.reposService.getUserRepos(userInfo.id);
        const defualtBookArray = bookList.filter(o => { return o.id === localUserInfo.defualtBookId });
        if (localUserInfo.defualtBookId && defualtBookArray.length > 0) {
            this.setState({
                defualtBook: defualtBookArray[0],
                bookList: bookList,
                current: 2,
            });
            return;
        }
        this.setState({
            bookList: bookList,
            current: 1,
        });
    }


    steps = () => {
        return [
            {
                title: '设置 Token',
                content: (<Step1Page onStep1Next={this.onStep1Next} submitting={this.state.step1Submitting} />),
            }, {
                title: '配置默认知识库',
                content: (<Step2Page submitting={this.state.step2Submitting} bookList={this.state.bookList} onStepNext={this.onStep2Next} onStepBack={this.onStepBack} />),
            }, {
                title: '完成',
                content: (<Step3Page onStepGoBack={this.onStepBack} userInfo={this.state.userInfo!} defaultRepos={this.state.defualtBook!} />),
            }];
    }

    onStepBack = async () => {
        this.setState({
            current: this.state.current - 1
        });
    }


    onStep1Next = async (form: Step1PageValue) => {
        this.setState({
            step1Submitting: true
        });
        const { apiHost, token } = form;
        const baseURL = `https://${apiHost}/api/v2/`;
        yuqueApi = new YuqueApi({
            baseURL,
            token
        });

        yuqueApi.userService.getUser()
            .then(user => {
                store.saveUserInfo({
                    baseURL: baseURL,
                    token: token,
                });
                this.setState({
                    userInfo: user
                });
                return yuqueApi.reposService.getUserRepos(user.id);
            }).then(bookList => {
                this.setState({
                    bookList: bookList
                });
            }).then(_ => {
                this.setState({
                    current: 1,
                    step1Submitting: false
                });
            })
            .catch(_ => {
                message.error('无法访问到用户信息，AccessToken或者域名有错误。');
                this.setState({
                    step1Submitting: false
                });
                return;
            });
    }

    onStep2Next = async (step2State: Step2State) => {

        this.setState({
            step2Submitting: true
        });
        let finalValue = step2State.value;
        if (finalValue === -1) {
            try {
                const createResult = await yuqueApi.reposService.createUsersRepos({
                    userid: this.state.userInfo!.id,
                    repoConfig: {
                        name: '语雀剪藏默认仓库',
                        public: RepoPublicType.PRIVATE,
                        slug: UUID.UUID(),
                        description: `语雀剪藏自动创建的仓库。\n创建于 ${dayjs().format('YYYY年MM月DD日HH时mm分ss秒')}`,
                        type: RepoType.BOOK
                    }
                });
                finalValue = createResult.id;
                const bookList = await yuqueApi.reposService.getUserRepos(this.state.userInfo!.id);
                this.setState({
                    bookList
                });
            } catch (error) {
                message.error('创建默认仓库失败请重试');
                this.setState({
                    step2Submitting: false,
                });
            }
        }
        const localUserInfo = await store.getUserInfo();
        localUserInfo.defualtBookId = finalValue;
        await store.saveUserInfo(localUserInfo);
        this.setState((pre) => {
            this.setState({
                defualtBook: pre.bookList.filter(o => o.id === finalValue)[0],
                step2Submitting: false,
                current: 2
            });
        });
    }
    render() {
        const { current } = this.state;
        return (
            <Layout>
                <Header className="Header">
                    <p>语雀 剪藏 保存精彩网页</p>
                </Header>
                <Content>
                    <Spin spinning={this.state.contentLoading}>
                        <div className="form" >
                            <Steps current={current}>
                                {this.steps().map(item => <Step key={item.title} title={item.title} />)}
                            </Steps>
                            <div className="form__main">
                                {this.steps()[current].content}
                            </div>
                        </div>
                    </Spin>
                </Content>
                <Footer className="Footer">
                    语雀 剪藏 ©2018 Created by <a href="https://github.com/DiamondYuan" target="_blank">DiamondYuan</a>
                </Footer>
            </Layout >
        );
    }
}



chrome.tabs.query({ active: true, currentWindow: true }, async () => {
    ReactDOM.render(<App />,
        document.getElementById('initializeWindow')
    );
});

