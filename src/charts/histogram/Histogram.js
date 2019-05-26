import React from 'react';
import Chart from '../Chart';
import { histogram, max, extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { Bar } from './helpers';
import Axis from "../../components/Axis";

class Histogram extends Chart {
  static defaultProps = {
    width: 640,
    height: 640,
    margin: {
      top: 20,
      right: 30,
      bottom: 20,
      left: 30,
    },
    fill: 'black',
    stroke: 'black',
    strokeLinejoin: 'miter',
    strokeLinecap: 'butt',
    strokeWidth: '0',
  };

  constructor(props) {
    super(props);
    const { data, count, thresholds, bin, value, domain, width, height, nice } = props;
    const [ minD, maxD ] = domain? domain : extent(data);
    let scaler = scaleLinear().domain([minD, maxD]).range([0, width]);
    const scale = nice? scaler.nice() : scaler;
    
    let hist = histogram();
    if (count) hist = hist.thresholds(scale.ticks(count)); 
    if (thresholds) hist = hist.thresholds(thresholds);
    if (bin) hist = hist.thresholds(data.map((d, i, data) => bin(d, i, data)));
    if (value) hist = hist.value(value);
    if (domain || nice) hist = hist.domain(scale.domain());
    const bins = hist(props.data);
    const scaleY = scaleLinear().range([height, 0]).domain([0, max(bins, (d) => d.length)]);
    this.state = {histogram: bins, scale: {x: scale, y: scaleY}};
  }
  render() {
    const { width, height, margin, fill, stroke, strokeLinejoin, strokeLinecap, strokeWidth, nice ,...props } = this.props;
    
    return (
      <svg
        className='Histogram'
        viewBox={`-${margin.left} -${margin.top} ${width +
          margin.left +
          margin.right} ${height + margin.top + margin.bottom}`}
        preserveAspectRatio="xMinYMin meet"
      >
        <Axis axis='x' position='bottom' height={height} scale={this.state.scale.x} color='black' />
        <Axis axis='y' position='left' width={width} scale={this.state.scale.y} offset='2' color='palevioletred' />
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

export default Histogram;