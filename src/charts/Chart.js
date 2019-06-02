import React, { Component } from 'react'
import { addScale } from './helpers';

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

export function withAxes(WrappedChart) {
  return class extends Component {

    constructor(props) {
      super(props);

      const { width, height, axisTop, axisRight, axisBottom, axisLeft } = props;
      
      const newAxisTop = axisTop? React.cloneElement(axisTop, {
        width,
        height,
        position: 'top',
      }) : axisTop;

      const newAxisRight = axisRight? React.cloneElement(axisRight, {
        width,
        height,
        position: 'rigth',
      }) : axisRight;

      const newAxisBottom = axisBottom? React.cloneElement(axisBottom, {
        width,
        height,
        position: 'bottom',
      }) : axisBottom;

      const newAxisLeft = axisLeft? React.cloneElement(axisLeft, {
        width,
        height,
        position: 'left',
      }) : axisLeft;

      this.state = {
        axes: {
          axisTop: newAxisTop,
          axisRight: newAxisRight,
          axisBottom: newAxisBottom,
          axisLeft: newAxisLeft,
        },
      };
    }

    render() {
      const { axisTop, axisRight, axisBottom, axisLeft, ...props } = this.props;

      return (
        <WrappedChart { ...props } { ...this.state.axes } />
      );
    }
  };
}

class Chart extends Component {
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
    textStyle: {
      fontSize: 9,
      color: 'black',
      fill: 'black',
    },
  };

  renderAxis() {
    const { axisTop, axisRight, axisBottom, axisLeft } = this.props;
    return (
      <g className='axes'>
        {[axisTop, axisRight, axisBottom, axisLeft]
          .map(axis => addScale(axis, this.state.scale))
          .map((Axis, i) => {
            return Axis ? (
              <g key={i} className='axis'>
                {Axis}
              </g>
            ) : null;
          })}
      </g>
    );
  }

  renderChart() {
    return null;
  }

  render() {
    if (this.state && this.state.loaded) {
      return this.renderChart();
    } else {
      return null; //TODO: Loading component
    }
  }
}

export default Chart;