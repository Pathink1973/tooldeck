import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { getIconComponent, getIconGradient } from '../../lib/iconMap';

interface CardIconBadgeProps {
  iconKey: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { container: 'w-7 h-7', icon: 14 },
  md: { container: 'w-9 h-9', icon: 18 },
  lg: { container: 'w-full h-full', icon: 48 },
};

export const CardIconBadge: React.FC<CardIconBadgeProps> = ({ iconKey, size = 'md' }) => {
  const icon = getIconComponent(iconKey);
  const gradient = getIconGradient(iconKey);
  const { container, icon: iconSize } = sizeMap[size];

  if (size === 'lg') {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: gradient }}
      >
        <HugeiconsIcon
          icon={icon}
          size={iconSize}
          color="white"
          strokeWidth={1.5}
        />
      </div>
    );
  }

  return (
    <div
      className={`${container} rounded-lg flex items-center justify-center shadow-lg shrink-0`}
      style={{ background: gradient }}
    >
      <HugeiconsIcon
        icon={icon}
        size={iconSize}
        color="white"
        strokeWidth={1.5}
      />
    </div>
  );
};
