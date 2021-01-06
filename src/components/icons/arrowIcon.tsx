import React from 'react';
import { IconProps } from './icon.interface';

const ArrowIcon: React.FC<IconProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      enableBackground="new 0 0 443.52 443.52"
      version="1.1"
      viewBox="0 0 443.52 443.52"
      xmlSpace="preserve"
      {...props}
    >
      <path d="M336.226 209.591l-204.8-204.8c-6.78-6.548-17.584-6.36-24.132.42-6.388 6.614-6.388 17.099 0 23.712l192.734 192.734-192.734 192.734c-6.663 6.664-6.663 17.468 0 24.132 6.665 6.663 17.468 6.663 24.132 0l204.8-204.8c6.663-6.665 6.663-17.468 0-24.132z" />
    </svg>
  );
};

export default ArrowIcon;
