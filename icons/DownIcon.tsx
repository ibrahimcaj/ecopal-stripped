import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const DownIcon = ({ size = 48, color = '#000000', ...props }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
