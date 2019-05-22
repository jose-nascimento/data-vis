import React from 'react';
import Chart from '../Chart';
import { histogram, min, max, extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { Bar } from './helpers';

class Histogram extends Chart {
  static defaultProps = {
    width: 640,
    height: 640,
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
  };

  constructor(props) {
    super(props);
    const { data, count, thresholds, bin, value, domain, width, height, nice } = props;
    const [ minD, maxD ] = domain? domain : extent(data);
    let scaler = scaleLinear().domain([minD, maxD]).range([0, width]);
    const scale = nice? scaler.nice() : scaler;
    if (nice) {
      console.log(
        'nice',
        scaler.domain([minD, maxD]).nice().domain(),
        '>>>',
        scaler.domain([minD, maxD]).range([0, width]).nice().ticks()
      );
    }
    console.log(scaler.ticks());
    
    let hist = histogram();
    if (count) hist = hist.thresholds(scale.ticks(count)); 
    if (thresholds) hist = hist.thresholds(thresholds);
    if (bin) hist = hist.thresholds(data.map((d, i, data) => bin(d, i, data)));
    if (value) hist = hist.value(value);
    if (domain || nice) hist = hist.domain(extent(scale.domain()));
    const bins = hist(props.data);
    const scaleY = scaleLinear().range([height, 0]).domain([0, max(bins, (d) => d.length)]);
    this.state = {histogram: bins, scale: {x: scale, y: scaleY}};
  }
  render() {
    const { width, height, margin, ...props } = this.props;
    console.log('Hist heigth', height);
    return (
      <svg
      viewBox={`-${margin.left} -${margin.top} ${width +
        margin.left + margin.right} ${height + margin.top + margin.bottom}`}
      preserveAspectRatio="xMinYMin meet"
      >
        {this.state.histogram.map((d, i) => {
          return <Bar key={i} d={d} height={height} scale={this.state.scale} />;
        })}
      </svg>
    )
  }
}

export default Histogram;