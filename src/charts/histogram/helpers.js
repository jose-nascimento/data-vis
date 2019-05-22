import React from 'react';

export function Bar(props) {
  const { d, scale, height, ...rest } = props;
  console.log('Bar height', height, height - scale.y(d.length)); 
  console.log(d.x0, d.x1, d.length);
   
  return (
    <g className='bar'>
        <rect
        x={`${scale.x(d.x0)}`}
        y={`${scale.y(d.length)}`}
        width={`${scale.x(d.x1 - d.x0) - 1}`}
        height={`${height - scale.y(d.length)}`}
        {...rest}
        />
    </g>
  );
}

//         fill={fill || ''}
//         stroke={stroke || ''}
//         strokeWidth={strokeWidth || ''}
