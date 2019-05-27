import React from 'react';
import Chart, { withAxes } from '../Chart';
import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { load } from './helpers';

class Scatterplots extends Chart {

  static defaultMargin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 8,
  }

  constructor(props) {
    super(props);

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

    // const x = 0;
    // const y = margin.top + margin.bottom;
    
    // const transforms = { 
    //   transform: `translate(${x}px, ${y}px)`
    // };
    
    
    return (
      <svg
        className='Scatterplots'
        viewBox={`-${margin.left} -${margin.top} ${width +
          margin.left +
          margin.right} ${height + margin.top + margin.bottom}`}
        preserveAspectRatio="xMinYMin meet"
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

export default withAxes(Scatterplots);