import React from 'react';
import Chart, { withAxes } from '../Chart';
import { select, selectAll } from 'd3-selection';
import { line, curveNatural } from 'd3-shape';
import { load } from './helpers';
import { ChartBrush } from '../../components/chart/brush';

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
    this.thisRef = React.createRef();

    const { loaded, datapoints, domain, colorScale } = props;

    if (loaded) {
      this.state = { loaded, datapoints, domain, colorScale };
    } else {
      this.state = { loaded: false };
    }

  }

  componentDidMount() {

    const { name } = this.props;

    if (this.state && !this.state.loaded) {
      let state = load(this.props)
      this.setState({...state, loaded: true});
    }

    const chartBrush = this.context;

    if (chartBrush && this.state && this.state.loaded && this.props.brush) {

      let ctx = this.props.brush;
      ctx.update(this.thisRef.current, name? name : 'timeseries', `${name? ('.name-' + name + ' ') : ''}.dots .dot`);
  
      chartBrush.bindBrush(ctx);
      this.setState({brush: ctx});
    }

    // select(this.thisRef.current).selectAll('.dots .dot').data(this.state.datapoints);
    // this.context('end', 'timeseries', applyBrush(this.thisRef.current));

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
      name,
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
      textStyle,
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
        className={`Timeseries  name-${name}`}
        viewBox={`-${margin.left} -${margin.top} ${width +
          margin.left +
          margin.right} ${height + margin.top + margin.bottom}`}
        preserveAspectRatio='xMinYMax meet'
        x={this.props.x}
        y={this.props.y}
      >
        {this.renderAxis()}
        <g ref={this.thisRef}
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
            <circle className='marker x0-marker y0-marker' cx='0' cy='0' r='1' fill='none' stroke='none' strokeWidth='0' data-x={dx[0]} data-y={dy[0]} />
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
            <circle className='marker x1-marker y1-marker' cx={width} cy={height} r='1' fill='none' stroke='none' strokeWidth='0' data-x={dx[1]} data-y={dy[1]} />
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

TimeSeries.contextType = ChartBrush;

export default withAxes(TimeSeries);