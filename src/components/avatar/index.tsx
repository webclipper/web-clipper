import { Avatar } from 'antd';
import React from 'react';
import IconFont from '@/components/IconFont';

interface IconAvatarProps {
  avatar?: string;
  icon: string;
  size: 'large' | 'small' | number;
}

const IconAvatar: React.FC<IconAvatarProps> = ({ avatar, size, icon: _icon }) => {
  const icon = avatar || _icon;
  let fontSize;
  if (typeof size === 'string') {
    fontSize = {
      small: 24,
      large: 40,
    }[size];
  } else {
    fontSize = size;
  }
  if (icon.startsWith('http')) {
    return <Avatar size={fontSize} src={icon} />;
  }
  return <IconFont style={{ fontSize }} type={icon} />;
};

export default IconAvatar;
