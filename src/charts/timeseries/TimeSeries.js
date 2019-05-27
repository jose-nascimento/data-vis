import React from 'react';
import Chart, { withAxes } from '../Chart';
import { extent } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line, curveNatural } from 'd3-shape';

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

    this.state = { loaded: false };
  }

  componentDidMount() {
    const { data, domain, width, height, nice, selectX, selectY } = this.props;
    const xDomain = domain ? domain.x : extent(data, selectX);
    const yDomain = domain ? domain.y : extent(data, selectY);
    let { sx, sy } = { sx: scaleTime(), sy: scaleLinear() };
    sx = sx.domain(xDomain).range([0, width]); //.clamp(true);
    sy = sy.domain(yDomain).range([height, 0]); //.clamp(true);

    if (nice) {
      sx = sx.nice();
      sy = sy.nice();
    }

    let datapoints = this.props.data.map(d => ({
      x: sx(selectX(d)),
      y: sy(selectY(d)),
    }));

    this.setState({
      datapoints: datapoints,
      scale: { x: sx, y: sy },
      domain: { x: xDomain, y: yDomain },
      loaded: true,
    });
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