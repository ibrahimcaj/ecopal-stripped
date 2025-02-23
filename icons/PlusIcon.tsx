import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const PlusIcon = ({ size = 48, color = '#000000', ...props }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M12 4V20M20 12H4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
