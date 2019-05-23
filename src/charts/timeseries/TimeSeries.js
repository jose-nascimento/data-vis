import React from 'react';
import Chart from '../Chart';
import { min, max, extent } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line, curveNatural } from "d3-shape";
import { mapToDate } from "./helpers";

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
    accX: (d) => d,
    accY: (d) => d,
    fill: 'none',
    stroke: 'black',
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
    strokeWidth: '1',
  };

  constructor(props) {
    super(props);
    const { data, domain, width, height, nice, accX, accY } = props;
    const xDomain = domain ? domain.x : extent(data, accX);
    const yDomain = domain ? domain.y : extent(data, accY);
    let scaler = { x: scaleTime(), y: scaleLinear() };
    scaler.x = scaler.x.domain(xDomain).range([0, width]).clamp(true);
    scaler.y = scaler.y.domain(yDomain).range([height, 0]).clamp(true);
    if (nice) {
      scaler.x = scaler.x.nice();
      scaler.y = scaler.y.nice();
    }

    // let ak = mapToDate(data, (d) => d.t);
    // timeseries.slice(0, 21).forEach(console.log);

    this.scale = { ...scaler };
  }

  getX(d) {
      let x = this.props.accX(d);
      return this.scale.x(x);
  }

  getY(d) {
    let y = this.props.accY(d);
    return this.scale.y(y);
  }

  render() {
    const { width, height, margin, data, fill, stroke, strokeLinejoin, strokeLinecap, strokeWidth, ...props } = this.props;
    const { x, y } = this.scale;

    const l1 = line().curve(curveNatural).x(d => this.getX(d)).y(d => this.getY(d));
    console.log(l1);
    const linePath = l1(data);
    console.log(linePath);
       
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