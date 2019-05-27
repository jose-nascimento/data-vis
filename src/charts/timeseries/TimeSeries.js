import React from 'react';
import Chart, { withAxes } from '../Chart';
import { extent } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line, curveNatural } from 'd3-shape';
import { load } from './helpers';

class TimeSeries extends Chart {
  static defaultProps = {
    ...super.defaultProps,
    selectX: d => d,
    selectY: d => d,
    fill: 'none',
    stroke: 'black',
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
    strokeWidth: '1',
    dotProps: {
      r: 1,
      fill: 'none',
      stroke: 'none',
      strokeWidth: 0,
    },
    dots: {},
  };

  constructor(props) {
    super(props);

    const { loaded, datapoints, domain, colorScale } = props;

    if (loaded) {
      this.state = { loaded, datapoints, domain, colorScale };
    } else {
      this.state = { loaded: false };
    }

  }

  componentDidMount() {

    if (this.state && !this.state.loaded) {
      let state = load(this.props)
      this.setState({...state, loaded: true});
    }

  }

  getX(d) {
    let x = this.props.selectX(d);
    return this.state.scale.x(x);
  }

  getY(d) {
    let y = this.props.selectY(d);
    return this.state.scale.y(y);
  }

  renderChart() {
    const {
      width,
      height,
      margin,
      data,
      fill,
      stroke,
      strokeLinejoin,
      strokeLinecap,
      strokeWidth,
      selectX,
      selectY,
      dotProps,
      dots,
      axisTop,
      axisRight,
      axisBottom,
      axisLeft,
      loaded,
      datapoints: plot,
      domain,
      ...props
    } = this.props;
    const datapoints = this.state.datapoints;
    const { x: dx, y: dy } = this.state.domain;
    const { r, ...dotStyle } = { ...dotProps, ...dots };
    // const { x: rx, y: ry } = this.state.range;
    

    const l1 = line()
      .curve(curveNatural)
      .x(d => d.x)
      .y(d => d.y);
    const linePath = l1(datapoints);

    return (
      <svg
        className='Timeseries'
        viewBox={`-${margin.left} -${margin.top} ${width +
          margin.left +
          margin.right} ${height + margin.top + margin.bottom}`}
        preserveAspectRatio='xMinYMax meet'
        x={this.props.x}
        y={this.props.y}
      >
        {this.renderAxis()}
        <g
          className='path'
          fill={fill}
          stroke={stroke}
          strokeLinejoin={strokeLinejoin}
          strokeLinecap={strokeLinecap}
          strokeWidth={strokeWidth}
          data-x-domain-from={dx[0]}
          data-x-domain-to={dx[1]}
          data-y-domain-from={dy[0]}
          data-y-domain-to={dy[1]}
          {...props}
        >
          <path d={linePath} />
          <g className='dots' {...dotStyle}>
            {data.map((d, i) => {
              return (
                <circle
                  key={i}
                  className='dot'
                  cx={datapoints[i].x}
                  cy={datapoints[i].y}
                  data-x={selectX(d)}
                  data-y={selectY(d)}
                  r={r}
                />
              );
            })}
          </g>
        </g>
      </svg>
    );
  }

  // render() {
  //   if (this.state.loaded) {
  //     return this.renderChart();
  //   } else {
  //     return null; //TODO: Loading component
  //   }
  //   // data-x-range-from={rx[0]}
  //   // data-x-range-to={rx[1]}
  //   // data-y-range-from={ry[0]}
  //   // data-y-range-to={ry[1]}
  // }
}

export default withAxes(TimeSeries);