import React from 'react';
import Chart, { withAxes } from '../Chart';
import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
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

class Scatterplots extends Chart {

  static defaultMargin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 8,
  }

  constructor(props) {
    super(props);
    this.thisRef = React.createRef();

    const defaultMargin = Scatterplots.defaultMargin;
    const { children, height, width, margin } = props;

    // const count = React.Children.count(children)
    // const histogramWidth = ((width - margin.left - margin.right) -  defaultMargin.left * count) / count;
    // const histogramHeight = height;
    let plotData = [];
    let xDomains = [];
    let yDomains = [];

    React.Children.map(children, child => {
        let plotProps = load({width: width, height: height, ...child.props});
        
        xDomains.push(plotProps.scale.x.domain());
        yDomains.push(plotProps.scale.y.domain());
        plotData.push(plotProps);
    })
    

    let xMax = max(xDomains, d => d[1]);
    let yMax = max(yDomains, d => d[1]);    

    let xMin = min(xDomains, d => d[0]);
    let yMin = min(yDomains, d => d[0]);

    let xDomain = [xMin, xMax];
    let yDomain = [yMin, yMax];

    let scaleX = scaleLinear().domain(xDomain).range([0, width]);
    let scaleY = scaleLinear().range([height, 0]).domain(yDomain);

    this.state = {scale: {x: scaleX, y: scaleY}, plots: plotData}
  }

  render() {
    const { width, height, margin, axisRight, axisBottom, axisLeft, children, ...props } = this.props;
    
    return (
      <svg
        className='Scatterplots'
        viewBox={`-${margin.left} -${margin.top} ${width +
          margin.left +
          margin.right} ${height + margin.top + margin.bottom}`}
        preserveAspectRatio="xMinYMin meet"
        height={height}
        width={width}
        ref={this.thisRef}
      >
        {this.renderAxis()}
        <g
          className='plot-group'
        >  
        {React.Children.map(children, (child, i) => {
          return (
            <svg className={`plot ${i}`} key={i}>
              {React.cloneElement(child, {loaded: true, ...this.state.plots[i]})}
            </svg>
          );
        })}
        </g>
      </svg>
    );
  }
}

Scatterplots.contextType = ChartBrush;

export default withAxes(Scatterplots);