import React from 'react';
import Chart from '../Chart';
import { extent } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line, curveNatural } from "d3-shape";

class TimeSeries extends Chart {
  static defaultProps = {
    width: 640,
    height: 640,
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
    selectX: (d) => d,
    selectY: (d) => d,
    fill: 'none',
    stroke: 'black',
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
    strokeWidth: '1',
  };

  constructor(props) {
    super(props);
    const { data, domain, width, height, nice, selectX, selectY } = props;    
    const xDomain = domain ? domain.x : extent(data, selectX);
    const yDomain = domain ? domain.y : extent(data, selectY);
    let scaler = { x: scaleTime(), y: scaleLinear() };
    scaler.x = scaler.x.domain(xDomain).range([0, width]);//.clamp(true);
    scaler.y = scaler.y.domain(yDomain).range([height, 0]);//.clamp(true);
    if (nice) {
      scaler.x = scaler.x.nice();
      scaler.y = scaler.y.nice();
    }

    this.scale = { ...scaler };
  }

  getX(d) {
      let x = this.props.selectX(d);
      return this.scale.x(x);
  }

  getY(d) {
    let y = this.props.selectY(d);
    return this.scale.y(y);
  }

  render() {
    const { width, height, margin, data, fill, stroke, strokeLinejoin, strokeLinecap, strokeWidth, ...props } = this.props;
    const { x, y } = this.scale;

    const l1 = line().curve(curveNatural).x(d => this.getX(d)).y(d => this.getY(d));
    const linePath = l1(data);
       
    return (
      <svg
        viewBox={`-${margin.left} -${margin.top} ${width +
          margin.left +
          margin.right} ${height + margin.top + margin.bottom}`}
        preserveAspectRatio='xMinYMin meet'
        x={this.props.x}
        y={this.props.y}
      >
        <g
          className='path'
          fill={fill}
          stroke={stroke}
          strokeLinejoin={strokeLinejoin}
          strokeLinecap={strokeLinecap}
          strokeWidth={strokeWidth}
        >
          <path d={linePath} />
        </g>
      </svg>
    );
  }
}

export default TimeSeries;