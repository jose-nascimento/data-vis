import React from 'react';
import { histogram, max, extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';

/*  Copyright (C) 2019 Jose Licio

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

export function Bar(props) {
  const { d, scale, height, label, style, i, ...rest } = props;
   
  return (
    <g className='bar'>
        {label && 
          <text y={scale.y(d.length + 1)} x={scale.x(d.x0)} style={style}>
            {label(d, i)}
          </text>
        }
        <rect
        className='bin'
        x={`${scale.x(d.x0)}`}
        y={`${scale.y(d.length)}`}
        width={`${scale.x(d.x1) - scale.x(d.x0) - 1}`}
        height={`${height - scale.y(d.length)}`}
        data-values={d.map(di => `${di}`).join(' ')}
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
