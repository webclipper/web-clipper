import ClipperUrlPreiview from './ClipperUrlPreiview';
import * as React from 'react';
import { ClipperPreiviewDataTypeEnum } from '../../enums';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { ClipperUrlPreiviewData, ClipperPreiviewData } from '../../store/ClipperPreview';



interface PreviewContentProps {
    map: { [key: string]: ClipperPreiviewData };
    type: ClipperPreiviewDataTypeEnum;
}



@observer
class PreviewContent extends React.Component<PreviewContentProps> {


    @computed get data(): ClipperPreiviewData | null {
        if (this.props.type && this.props.map) {

            return this.props.map[this.props.type];
        }
        return null;
    }


    render() {

        if (this.props.type && this.props.map) {
            console.log('data', this.data);
            console.log(this.data instanceof ClipperUrlPreiviewData);
            if (this.data instanceof ClipperUrlPreiviewData) {
                return (<ClipperUrlPreiview data={this.data}></ClipperUrlPreiview>);
            }
        }
        console.log('map', this.props.map);
        console.log('url', this.props.type);
        return (
            <p>你看到我说明你遇到了bug</p>
        );
    }
}

export default PreviewContent;
