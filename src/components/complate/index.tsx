import * as React from 'react';
import { Button } from 'antd';
import 'antd-style';
import * as styles from './index.scss';

interface ComplateProps {
    href: string;
}


const Complate = (props: ComplateProps) => {
    return (<div id={styles.mainTool}>
        <section className={styles.section}>
            <h1 className={styles.sectionTitle}>保存成功</h1>
            <a href={props.href} target="_blank"><Button style={{ marginTop: 16 }} size="large" type="primary" block >前往语雀查看</Button></a>
        </section>
    </div>);
};
export default Complate;
