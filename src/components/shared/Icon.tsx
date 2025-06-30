import React from 'react';
import { IconType, IconBaseProps } from 'react-icons';

interface IconWrapperProps extends IconBaseProps {
  icon: IconType;
}

export const IconWrapper = ({ icon: Icon, ...props }: IconWrapperProps): React.ReactElement => {
  // Use type assertion to handle the IconType as a function component
  const IconComponent = Icon as React.FC<IconBaseProps>;
  return <IconComponent {...props} />;
};
