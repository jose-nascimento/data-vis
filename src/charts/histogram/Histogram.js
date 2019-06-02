import React from 'react';
import Chart, { withAxes } from '../Chart';
import { Bar, bins } from './helpers';
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

class Histogram extends Chart {

  static defaultTextProps = {
    fontSize: 10,
    color: 'black',
  }

  constructor(props) {
    super(props);
    this.thisRef = React.createRef();

    const { pre, histogram, scale } = props;

    if (pre) {
      this.state = { histogram, scale, loaded: true }  ;
    } else {
      this.state = { ...bins(props), loaded: true };
    }

  }

  componentDidMount() {

    const { name, brush } = this.props;
    const chartBrush = this.context;
    

    if (chartBrush && brush) {

      let ctx = brush;
      ctx.update(this.thisRef.current, name? name : 'histogram', `${name? ('.name-' + name + ' ') : ''}.bins .bin`, 'x', 'y', d => d.dataset.values.split(' '));
  
      chartBrush.bindBrush(ctx);
      this.setState({brush: ctx});
    }

  }

  renderChart() {
    const {
      width,
      height,
      margin,
      name,
      label,
      fill,
      stroke,
      strokeLinejoin,
      strokeLinecap,
      strokeWidth,
      pre,
      nice,
      axisTop,
      axisRight,
      axisBottom,
      axisLeft,
      textStyle,
      scale,
      data,
      histogram,
      brush,
      ...props
    } = this.props;
    
    
    return (
      <svg
        className={`Histogram name-${name}`}
        viewBox={`-${margin.left} -${margin.top} ${width +
          margin.left +
          margin.right} ${height + margin.top + margin.bottom}`}
        preserveAspectRatio="xMinYMin meet"
        height={height}
      >
        {this.renderAxis()}
        <g
          className='bins'
          fill={fill}
          stroke={stroke}
          strokeLinejoin={strokeLinejoin}
          strokeLinecap={strokeLinecap}
          strokeWidth={strokeWidth}
          {...props}
          ref={this.thisRef}
        >
          <circle className='marker x0-marker y0-marker' cx='0' cy='0' r='1' fill='none' stroke='none' strokeWidth='0' />
          {this.state.histogram.map((d, i) => {
            return (
              <Bar
                key={i}
                i={i}
                d={d}
                height={height}
                label={label}
                scale={this.state.scale}
                style={textStyle}
                data-x0={d.x0}
                data-x1={d.x1}
                data-length={d.length}
              />
            );
          })}
          <circle className='marker x1-marker y1-marker' cx={width} cy={height} r='1' fill='none' stroke='none' strokeWidth='0' />
        </g>
      </svg>
    );
  }
}

Histogram.contextType = ChartBrush;

export default withAxes(Histogram);