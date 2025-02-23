import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const BackIcon = ({ size = 48, color = '#000000', ...props }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
