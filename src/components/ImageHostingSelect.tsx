import { ImageHostingWithMeta } from './../common/hooks/useFilterImageHostingServices';
import Select, { SelectProps } from 'antd/lib/select';
import React, { forwardRef } from 'react';
import styles from './ImageHostingSelect.scss';
import ImageHostingSelectOption from 'components/imageHostingSelectOption';

export const ImageHostingSelect: React.FC<
  {
    supportedImageHostingServices: ImageHostingWithMeta[];
  } & SelectProps
> = ({ supportedImageHostingServices, ...props }, ref) => (
  <Select className={styles.imageHostingSelect} {...props} ref={ref}>
    {supportedImageHostingServices.map(({ imageHostingServices: { id, remark }, meta }) => {
      return (
        <Select.Option key={id} value={id}>
          <ImageHostingSelectOption id={id} icon={meta.icon} name={meta.name} remark={remark} />
        </Select.Option>
      );
    })}
  </Select>
);

export default forwardRef(ImageHostingSelect);
