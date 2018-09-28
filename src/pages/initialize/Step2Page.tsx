import * as React from 'react';
import { Button, Row, Col, Card } from 'antd';
import { BookSerializer } from '../../services/api/reposService';
import * as styles from './style/step2.scss';

interface Step2PageProps {
    bookList: BookSerializer[];
    submitting: boolean;
    onStepBack(): void;
    onStepNext(state: Step2State): void;
}

export interface Step2State {
    value: number;
}

class Step2Page extends React.Component<Step2PageProps, Step2State> {

    constructor(props: Step2PageProps) {
        super(props);
        this.state = {
            value: -1
        };
    }

    onRadioChange = (bookId: number) => {
        this.setState({
            value: bookId
        });
    }

    onStepNext = (_: any) => {
        this.props.onStepNext(this.state);
    }
    buttonText = () => {
        return this.state.value === -1 ? '自动创建' : '下一步';
    }
    cardStatus = (id: number) => {
        return id === this.state.value ? styles.card__selected : '';
    }

    render() {
        return (
            <div>
                <Row gutter={16}>
                    {this.props.bookList.map(o =>
                        <Col key={o.id} span={8}>
                            <Card bordered={true} onClick={() => { this.onRadioChange(o.id) }}
                                title={o.name} className={`${styles.card} ${this.cardStatus(o.id)}`}>
                                <textarea rows={4} readOnly={true} value={o.description} className={styles.cradTextarea}>
                                </textarea>
                            </Card>
                        </Col>
                    )}
                </Row>
                <Row>
                    <Col offset={8} span={2}>
                        <Button type="primary" onClick={this.props.onStepBack}>上一步</Button>
                    </Col>
                    <Col offset={1} span={2}>
                        <Button type="primary" onClick={this.onStepNext} loading={this.props.submitting}>
                            {this.buttonText()}
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Step2Page;
