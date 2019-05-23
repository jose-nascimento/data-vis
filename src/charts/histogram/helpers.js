import React from 'react';

export function Bar(props) {
  const { d, scale, height, ...rest } = props;
   
  return (
    <g className='bar'>
        <rect
        x={`${scale.x(d.x0)}`}
        y={`${scale.y(d.length)}`}
        width={`${scale.x(d.x1) - scale.x(d.x0) - 1}`}
        height={`${height - scale.y(d.length)}`}
        {...rest}
        />
    </g>
  );
}
