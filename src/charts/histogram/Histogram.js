import React from 'react';
import Chart, { withAxes } from '../Chart';
import { histogram, max, extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { Bar, bins } from './helpers';

class Histogram extends Chart {

  constructor(props) {
    super(props);

    const { pre, histogram, scale } = props;

    if (pre) {
      this.state = { histogram, scale }  ;
    } else {
      this.state = bins(props);
    }

  }

  render() {
    const { width, height, margin, fill, stroke, strokeLinejoin, strokeLinecap, strokeWidth, pre, nice, axisTop, axisRight, axisBottom, axisLeft, ...props } = this.props;
    
    
    return (
      <svg
        className='Histogram'
        viewBox={`-${margin.left} -${margin.top} ${width +
          margin.left +
          margin.right} ${height + margin.top + margin.bottom}`}
        preserveAspectRatio="xMinYMin meet"
      >
        {this.renderAxis()}
        <g
          fill={fill}
          stroke={stroke}
          strokeLinejoin={strokeLinejoin}
          strokeLinecap={strokeLinecap}
          strokeWidth={strokeWidth}
          {...props}
        >
          {this.state.histogram.map((d, i) => {
            return (
              <Bar key={i} d={d} height={height} scale={this.state.scale} />
            );
          })}
        </g>
      </svg>
    );
  }
}

export default withAxes(Histogram);