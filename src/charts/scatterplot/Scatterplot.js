import React from 'react';
import Chart, { withAxes } from '../Chart';
import { load } from "./helpers";
import { ChartBrush } from '../../components/chart/brush';

/*  Copyright (C) 2019 Jose Licio

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

class Scatterplot extends Chart {
  static defaultProps = {
    ...super.defaultProps,
    selectX: d => d,
    selectY: d => d,
    stroke: 'none',
    r: 4,
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
    
    if (this.state && !this.state.loaded) {
      
      let state = load(this.props)
      this.setState({...state, loaded: true});
    }

    const { name } = this.props;

    const chartBrush = this.context;

    if (chartBrush && this.state && this.state.loaded && this.props.brush) {

      let ctx = this.props.brush;
      ctx.update(this.thisRef.current, name? name : 'scatterplot', `${name? ('.name-' + name + ' ') : ''}.points .point`, 'cx', 'cy');
  
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

  getColor(d) {
    return this.state.colorScale(this.props.selectColor(d));
  }

  renderChart() {
    const {
      width,
      height,
      margin,
      data,
      name,
      r,
      fill,
      stroke,
      strokeLinejoin,
      strokeLinecap,
      strokeWidth,
      selectX,
      selectY,
      selectColor,
      axisTop,
      axisRight,
      axisBottom,
      axisLeft, 
      loaded,
      datapoints: plot,
      domain,
      colorScale: cs,
      label,
      textStyle,
      brush,
      scale,
      ...props
    } = this.props;
    const datapoints = this.state.datapoints;
    const { x: dx, y: dy } = this.state.domain;
    const { colorScale } = this.state;
    // const { x: rx, y: ry } = this.state.range;
    return (
      <svg
        className={`Scatterplot name-${name}`}
        viewBox={`-${margin.left} -${margin.top} ${width +
          margin.left +
          margin.right} ${height + margin.top + margin.bottom}`}
        preserveAspectRatio='xMinYMax meet'
        x={this.props.x}
        y={this.props.y}
      >
        {this.renderAxis()}
        <g
          className='points'
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
          ref={this.thisRef}
        >
          <circle className='marker x0-marker y0-marker' cx='0' cy='0' r='1' fill='none' stroke='none' strokeWidth='0' data-x={dx[0]} data-y={dy[0]} />
          {data.map((d, i) => {
            let fillColor = colorScale? this.getColor(d) : undefined;
            return (
              <g key={i}>
              {label && 
                <text y={datapoints[i].y - 5} x={datapoints[i].x - 5} style={textStyle}>
                  {label(d)}
                </text>
              }
              <circle
                className='point'
                cx={datapoints[i].x}
                cy={datapoints[i].y}
                r={r}
                fill={fillColor}
                data-x={selectX(d)}
                data-y={selectY(d)}
              />
              </g>
            );
          })}
          <circle className='marker x1-marker y1-marker' cx={width} cy={height} r='1' fill='none' stroke='none' strokeWidth='0' data-x={dx[1]} data-y={dy[1]} />
        </g>
      </svg>
    );
  }
}

Scatterplot.contextType = ChartBrush;

export default withAxes(Scatterplot);
