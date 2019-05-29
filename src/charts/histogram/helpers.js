import React from 'react';
import { histogram, max, extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';

export function Bar(props) {
  const { d, scale, height, label, style, ...rest } = props;
   
  return (
    <g className='bar'>
        {label && 
          <text y={scale.y(d.length + 3)} x={scale.x(d.x0)} style={style}>
            {label(d)}
          </text>
        }
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

export function bins(histProps) {
    const { data, count, thresholds, bin, value, domain, width, height, nice } = histProps;
    const [ minD, maxD ] = domain? domain : extent(data);
    let scaler = scaleLinear().domain([minD, maxD]).range([0, width]);
    const scale = nice? scaler.nice() : scaler;
    
    let hist = histogram();
    if (count) hist = hist.thresholds(scale.ticks(count)); 
    if (thresholds) hist = hist.thresholds(thresholds);
    if (bin) hist = hist.thresholds(data.map((d, i, data) => bin(d, i, data)));
    if (value) hist = hist.value(value);
    if (domain || nice) hist = hist.domain(scale.domain());
    const hst = hist(data);
    const scaleY = scaleLinear().range([height, 0]).domain([0, max(hst, (d) => d.length)]);

    return {histogram: hst,
      scale: {x: scale, y: scaleY},
    };
}
