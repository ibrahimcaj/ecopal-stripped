import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const SearchIconBlack = ({ size = 23, color = '#000000', ...props }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="black"
      {...props}>
      <Path
        d="M17.5 17.5L22 22"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
};
