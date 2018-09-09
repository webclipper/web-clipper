import * as React from 'react';
import { Input, Button, Select, Avatar, Icon, Spin, } from 'antd';
import 'antd-style';
import * as styles from './index.scss';
import YuqueApi from '../../services/api/api';
import store from '../../services/common/store';
import { UserProfile } from '../../services/api/userService';
import { BookSerializer } from '../../services/api/reposService';


const Option = Select.Option;



export interface ClipperToolPorps {
    close(): void;
}

interface ClipperToolState {
    title: string;
    loading: boolean;
    configured: boolean;
    submitting: boolean;
    yuqueApi?: YuqueApi;
    userProfile?: UserProfile;
    defaultBookId?: number;
    selectBookId?: number;
    bookList?: BookSerializer[];
}



class ClipperTool extends React.Component<ClipperToolPorps, ClipperToolState> {

    constructor(props: ClipperToolPorps) {
        super(props);
        this.state = {
            title: document.title,
            submitting: false,
            configured: false,
            loading: true
        };
        this.init().then(() => {
            this.setState({
                loading: false,
                configured: true
            });
        });
    }

    init = async () => {
        const LocaluserConfig = await store.getUserInfo();
        const yuqueApi = new YuqueApi({
            baseURL: LocaluserConfig.baseURL,
            token: LocaluserConfig.token
        });
        const userProfile = await yuqueApi.userService.getUser();
        const bookList = await yuqueApi.reposService.getUserRepos(userProfile.id);
        this.setState({
            bookList: bookList,
            defaultBookId: LocaluserConfig.defualtBookId,
            selectBookId: LocaluserConfig.defualtBookId,
            userProfile: userProfile,
            yuqueApi: yuqueApi
        });
    }

    save = () => {
        this.setState({
            submitting: true
        });
        setTimeout(() => {
            console.log(`save success ${this.state.selectBookId} title ${this.state.title}`);
            this.setState({
                submitting: false
            });
        }, 1000);
    }

    onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            title: e.target.value
        });
    }

    onFilterOption = (select: any, option: React.ReactElement<any>) => {
        const title: string = option.props.children;
        return title.indexOf(select) !== -1;
    }

    onBookSelect = (select: any) => {
        this.setState({
            selectBookId: select
        });
    }

    render() {
        if (!this.state.configured) {
            return (
                <div id={styles.container} >
                    <p>Loading</p>
                </div>);
        }

        return (
            <Spin spinning={this.state.loading}>
                <div id={styles.container} >
                    <div className={styles.closeButton} onClick={this.props.close}>
                        <Icon type="close" />
                    </div>
                    <div style={{ position: 'absolute', top: 0, left: 0, }}>
                        <div className={styles.content}>
                            <section className={styles.section}>
                                <h1 className={styles.sectionTitle}>笔记标题</h1>
                                <Input defaultValue={this.state.title} onChange={this.onTitleChange} ></Input>
                                <Button onClick={this.save} style={{ marginTop: 16 }} size="large" type="primary" block loading={this.state.submitting}>保存内容</Button>
                            </section>
                            <section className={`${styles.sectionLine} ${styles.sectionLine}`}>
                                <h1 className={styles.sectionTitle}>剪藏格式</h1>
                                <Button block className={styles.menuButton}><Icon type="copy" />手动选择</Button>
                            </section>
                            <section className={styles.section}>
                                <h1 className={styles.sectionTitle}>保存的知识库</h1>
                                <Select
                                    onSelect={this.onBookSelect}
                                    style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={this.onFilterOption}
                                    getPopupContainer={() => { return document.getElementById(styles.container)! }}
                                    defaultValue={this.state.defaultBookId}
                                    dropdownMatchSelectWidth={true}
                                >
                                    {this.state.bookList!.map(o => { return <Option key={o.id} value={o.id}>{o.name}</Option> })}
                                </Select>
                            </section>
                            <section className={`${styles.toolbar} ${styles.sectionLine}`}>
                                <Button className={`${styles.toolbarButton} `} ><Icon type="setting" />设置</Button>
                                <Avatar src={this.state.userProfile ? this.state.userProfile.avatar_url : ''}></Avatar>
                            </section>
                        </div>
                    </div>
                </div>
            </Spin >
        );
    }
}

export default ClipperTool;
