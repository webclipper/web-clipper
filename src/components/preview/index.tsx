import ClipperUrlPreiview from './ClipperUrlPreiview';
import * as React from 'react';
import { ClipperPreiviewDataTypeEnum } from '../../enums';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { ClipperUrlPreiviewData, ClipperPreiviewData, ClipperFullPagePreiviewData } from '../../store/ClipperPreview';
import ClipperFullPagePreiview from './ClipperFullPagePreview';

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
      if (this.data instanceof ClipperUrlPreiviewData) {
        return (<ClipperUrlPreiview data={this.data}></ClipperUrlPreiview>);
      }
      if (this.data instanceof ClipperFullPagePreiviewData) {
        return (<ClipperFullPagePreiview data={this.data}></ClipperFullPagePreiview>);
      }
    }
    return (
      <p>你看到我说明你遇到了bug</p>
    );
  }
}

export default PreviewContent;
