import * as React from 'react';
import { Row, Col, Avatar, Button } from 'antd';
import { BookSerializer } from '../../services/api/reposService';
import { UserProfile } from '../../services/api/userService';

interface Step3PageProps {
  defaultRepos: BookSerializer;
  userInfo: UserProfile;
  onStepGoBack(): void;
}

class Step3Page extends React.Component<Step3PageProps> {

  onStepGoBack = () => {
    this.props.onStepGoBack();
  }

  render() {
    return (
      <div>
        <Row type="flex" justify="center">
          <Col><Avatar size="large" src={this.props.userInfo.avatar_url} /></Col>
        </Row >
        <Row type="flex" justify="center">
          <Col><p>昵称 {this.props.userInfo.name} </p></Col>
        </Row >
        <Row type="flex" justify="center">
          <Col><p>笔记默认的知识库 <a target="_blank" href={`https://www.yuque.com/${this.props.defaultRepos.namespace}`}>{this.props.defaultRepos.name}</a> </p></Col>
        </Row >
        <Row type="flex" justify="center">
          <Col><p><a href="https://www.yuque.com/yuqueclipper/av5y68/qdwrc4" target="_blank">请开发者喝杯咖啡</a></p></Col>
        </Row >
        <Row type="flex" justify="center">
          <Button type="primary" onClick={this.onStepGoBack} >上一步</Button>
        </Row >
      </div>
    );
  }
}

export default Step3Page;
