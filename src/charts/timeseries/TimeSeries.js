import React from 'react';
import Chart, { withAxes } from '../Chart';
import { line, curveNatural } from 'd3-shape';
import { load } from './helpers';
import { ChartBrush } from '../../components/chart/brush';

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
      ctx.update(this.thisRef.current, name? name : 'timeseries', `${name? ('.name-' + name + ' ') : ''}.dots .dot`, 'cx', 'cy');
  
      chartBrush.bindBrush(ctx);
      this.setState({brush: ctx});
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
          <circle className='marker x0-marker y0-marker' cx='0' cy='0' r='1' fill='none' stroke='none' strokeWidth='0' data-x={dx[0]} data-y={dy[0]} />
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
          <circle className='marker x1-marker y1-marker' cx={width} cy={height} r='1' fill='none' stroke='none' strokeWidth='0' data-x={dx[1]} data-y={dy[1]} />
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