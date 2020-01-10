import { Avatar } from 'antd';
import React from 'react';
import IconFont from '@/components/IconFont';

interface IconAvatarProps {
  avatar?: string;
  icon: string;
  size: 'large' | 'small';
}

const IconAvatar: React.FC<IconAvatarProps> = ({ avatar, size, icon: _icon }) => {
  const icon = avatar || _icon;
  let fontSize = {
    small: 24,
    large: 40,
  }[size];
  if (icon.startsWith('http')) {
    return <Avatar size={size} src={icon} />;
  }
  return <Avatar size={size} icon={<IconFont style={{ fontSize }} type={icon} />}></Avatar>;
};

export default IconAvatar;
