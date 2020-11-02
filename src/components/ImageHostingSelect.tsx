import { ImageHostingWithMeta } from '@/common/hooks/useFilterImageHostingServices';
import Select, { SelectProps } from 'antd/lib/select';
import React, { forwardRef } from 'react';
import ImageHostingSelectOption from '@/components/imageHostingSelectOption';
import styles from './ImageHostingSelect.less';

interface ImageHostingSelectProps extends SelectProps<string> {
  supportedImageHostingServices: ImageHostingWithMeta[];
}

/**
 * TODO
 * fix any
 */
export const ImageHostingSelect: React.ForwardRefRenderFunction<any, ImageHostingSelectProps> = (
  { supportedImageHostingServices, ...props },
  ref
) => (
  <Select allowClear className={styles.imageHostingSelect} {...props} ref={ref}>
    {supportedImageHostingServices.map(({ imageHostingServices: { id, remark }, meta }) => {
      return (
        <Select.Option key={id} value={id}>
          <ImageHostingSelectOption id={id} icon={meta.icon} name={meta.name} remark={remark} />
        </Select.Option>
      );
    })}
  </Select>
);

/**
 * TODO
 * fix any
 */
export default forwardRef<any, ImageHostingSelectProps>(ImageHostingSelect);
