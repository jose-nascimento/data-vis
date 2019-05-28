import React from 'react';
import Chart, { withAxes } from '../Chart';
import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { bins } from './helpers';

class Histograms extends Chart {

  static defaultMargin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 8,
  }

  static defaultProps = {
    ...super.defaultProps,
    margin: {
      ...super.defaultProps.margin,
      left: 42,
    }
  }

  constructor(props) {
    super(props);

    const defaultMargin = Histograms.defaultMargin;
    const { children, height, width, margin } = props;

    const count = React.Children.count(children)
    const histogramWidth = ((width - margin.left - margin.right) -  defaultMargin.left * count) / count;
    // const histogramHeight = height - margin.top - margin.bottom;
    
    let histData = [];
    let xDomains = [];
    let yDomains = [];

    React.Children.map(children, child => {
        let histProps = bins({height, ...child.props, margin: defaultMargin, width: histogramWidth});
        
        xDomains.push(histProps.scale.x.domain());
        yDomains.push(histProps.scale.y.domain());
        histData.push({...histProps, width: histogramWidth});
    })
    

    let xMax = max(xDomains, d => d[1]);
    let yMax = max(yDomains, d => d[1]);    

    let xMin = min(xDomains, d => d[0]);
    let yMin = min(yDomains, d => d[0]);

    let xDomain = [xMin, xMax];
    let yDomain = [yMin, yMax];

    let scaleX = scaleLinear().domain(xDomain).range([0, width]);
    let scaleY = scaleLinear().range([height, 0]).domain(yDomain);

    this.state = {histogramWidth, scale: {x: scaleX, y: scaleY}, histograms: histData}
    

  }

  render() {
    const { width, height, margin, axisRight, axisBottom, axisLeft, children, ...props } = this.props;

    const x = 0;
    const y = margin.top + margin.bottom;
    
    const transforms = { 
      transform: `translate(${x}px, ${y}px)`
    };
    
    
    return (
      <svg
        className='Histograms'
        viewBox={`-${margin.left} -${margin.top} ${width +
          margin.left +
          margin.right} ${height + margin.top + margin.bottom}`}
        preserveAspectRatio="xMinYMin meet"
        height={height}
        width={width}
      >
        {this.renderAxis()}
        <g
          className='hist-group'
          
        >  
        {React.Children.map(children, (child, i) => {
          return (
            <svg className={`hist ${i}`} key={i}
            x={(this.state.histogramWidth+Histograms.defaultMargin.left)*i}
            y={margin.top + margin.bottom}
            height={height - margin.top - margin.bottom}
            >
              {React.cloneElement(child, {pre: true, margin: Histograms.defaultMargin,...this.state.histograms[i]})}
            </svg>
          );
        })}
        </g>
      </svg>
    );
  }
}

// y={margin.top + margin.bottom}
// height={height - margin.top - margin.bottom}
// width={this.state.histogramWidth}

export default withAxes(Histograms);