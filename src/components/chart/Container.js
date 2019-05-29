import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Histogram from '../../charts/histogram/Histogram';
import Histograms from '../../charts/histogram/Histograms';
import TimeSeries from '../../charts/timeseries/TimeSeries';
import { dsv } from 'd3-fetch';
import { mapToDate } from '../../charts/timeseries/helpers';
import Scatterplot from '../../charts/scatterplot/Scatterplot';
import Axis from "../Axis";
import Scatterplots from '../../charts/scatterplot/Scatterplots';
import TimeSeriesCollection from '../../charts/timeseries/TimeSeriesCollection';
import { Brush, ChartBrush, useBrush } from './brush';
import { zoom, zoomTransform } from 'd3-zoom';
import { select } from 'd3-selection';

const style = {
  color: '#EEE',
  backgroundColor: '#fff',
  height: 'auto',
  margin: '0 auto',
  fontSize: 0,
  display: 'block',
};

const data =  [75, 104, 369, 300, 92, 64, 265, 35, 287, 69, 52, 23, 287, 87, 114, 114, 98, 137, 87, 90, 63, 69, 80, 113, 58, 115, 30, 35, 92, 460, 74, 72, 63, 115, 60, 75, 31, 277, 52, 218, 132, 316, 127, 87, 449, 46, 345, 48, 184, 149, 345, 92, 93, 138, 48, 87, 103, 32, 93, 57, 109, 127, 149, 78, 162, 173, 87, 184, 288, 460, 150, 127, 92, 84, 115, 218, 404, 52, 85, 66, 52, 201, 287, 69, 114, 379, 115, 161, 91, 231, 230, 115, 80, 58, 207, 171, 156, 91, 138, 104, 74, 87, 63, 333, 125, 196, 57, 92, 127, 136, 129, 66, 80, 115, 87, 57, 172, 184, 230, 153, 162, 104, 165, 69, 196, 38, 92, 162, 105, 69, 29, 102, 87, 345, 58, 56, 35, 49, 92, 156, 58, 104, 167, 115, 87, 87, 322, 65, 149, 34, 69, 69, 391, 58, 58, 207, 61, 253, 109, 69, 57, 56, 114, 58, 80, 149, 287, 57, 138, 92, 87, 103, 230, 57, 50, 92, 79, 92, 45, 196, 29, 69, 253, 173, 438, 173, 218, 115, 58, 92, 115, 230, 87, 287, 53, 80, 92, 89, 173, 96, 80, 115, 104, 138, 92, 48, 98, 231, 127, 114, 91, 115, 80, 403, 253, 75, 63, 69, 92, 171, 58, 104, 47, 53, 80, 213, 104, 125, 127, 58, 432, 90, 52, 69, 173, 75, 69, 139, 127, 45, 87, 138, 92, 58, 208, 52, 149, 60, 89, 119, 287, 74, 138, 171, 391, 104, 35, 92, 90, 92, 103, 69, 345, 115, 87, 107, 93, 92, 247, 172, 58, 34, 99, 104, 57, 80, 345, 461, 330, 80, 75, 94, 104, 218, 58, 115, 79, 108, 184, 115, 60, 101, 40, 92, 102, 126, 92, 225, 107, 288, 63, 62, 80, 69, 115, 46, 102, 60, 40, 345, 63, 114, 74, 80, 144, 56, 127, 98, 104, 71, 98, 104, 92, 208, 287, 93, 230, 196, 290, 164, 91, 115, 40, 92, 127, 231, 104, 58, 225, 183, 98, 81, 115, 97, 438, 111, 173, 346, 80, 172, 126, 126, 317, 59, 52, 197, 80, 58, 127, 214, 71, 32, 127, 115, 64, 149, 80, 98, 92, 58, 278, 45, 69, 215, 69, 92, 172, 75, 58, 101, 80, 137, 149, 92, 93, 125, 63, 231, 115, 70, 115, 80, 127, 98, 127, 113, 69, 61, 23, 69, 58, 104, 196, 137, 93, 145, 58, 103, 69, 123, 53, 173, 230, 63, 403, 93, 115, 87, 74, 90, 93, 160, 201, 131, 460, 287, 61, 98, 64, 46, 138, 149, 74, 56, 80, 92, 67, 133, 403, 160, 138, 63, 69, 69, 331, 92, 368, 103, 92, 180, 114, 58, 115, 144, 345, 172, 98, 76, 67, 68, 80, 345, 490, 62, 190, 46, 91, 231, 93, 79, 83, 115, 58, 139, 162, 46, 144, 104, 83, 305, 76, 23, 230, 184, 104, 138, 106, 85, 287, 58, 167, 213, 225, 58, 57, 231, 87, 87, 156, 63, 104, 196, 345, 207, 345, 114, 403, 87, 80, 69, 68, 173, 253, 103, 138, 168, 167, 98, 58, 171, 53, 49, 80, 64, 92, 75, 92, 69, 71, 58, 121, 104, 40, 253, 69, 149, 104, 41, 230, 41, 132, 231, 58, 127, 58, 69, 149, 91, 374, 46, 115, 52, 37, 173, 149, 167, 58, 173, 69, 52, 426, 46, 167, 85, 66, 230, 46, 60, 71, 119, 103, 85, 58, 65, 67, 33, 346, 58, 49, 98, 214, 403, 58, 104, 115, 109, 87, 68, 115, 114, 102, 138, 92, 171, 69];

class Container extends Component {
  static defaultProps = {
    width: 640,
    height: 640,
    margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    group: (props) => <g>{props.children}</g>,
  };

  constructor(props) {
    super(props);

    this.groupRef = React.createRef();

    this.state = {loaded: false, brush: null};
  }

  componentDidMount() {
    dsv(' ', '/public/timeseries.csv', d => d).then(data => {
      const timeseries = mapToDate(data.slice(0, 100), (d) => d.t).map((d, i) => ({t: d, x: +data[i].x}));
      const timeseries2 = mapToDate(data.slice(0, 100), (d) => d.t).map((d, i) => ({t: d, x: +data[i].y}));
      const timeseries3 = mapToDate(data.slice(0, 100), (d) => d.t).map((d, i) => ({t: d, x: +data[i].z}));
      const scatterplot = data.slice(0, 100).map((d, i) => ({x: +d.y, y: +d.z, c: +d.x, label: d.t}));
      const scatterplot2 = data.slice(0, 100).map((d, i) => ({x: +d.x, y: +d.y, c: +d.z}));
      const scatterplot3 = data.slice(0, 100).map((d, i) => ({x: +d.z, y: +d.x, c: +d.y}));

      if (!this.brush) this.brush =  new Brush(this.groupRef.current);

      let z = zoom().on('zoom', this.zoomed);
      select(this.groupRef.current).call(z);

      this.setState({brush: this.brush, cdata: timeseries, cdata2: timeseries2, cdata3: timeseries3, sdata: scatterplot, sdata2: scatterplot2, sdata3: scatterplot3, loaded: true});
    })
  }

  zoomed() {
    let t = zoomTransform(this);    
    select(this).attr('transform', `translate(${t.x}, ${t.y}) scale(${t.k})`);
  }

  render() {
    const { width, height, margin, group: Group, ...props } = { ...this.props };
    const hxAxis = <Axis axis='x' color='black' ticks={4} />;
    const hyAxis = <Axis axis='y' color='palevioletred' offset='2' tickFormat={t => `${t*(-1)}k`} />;
    let tsBrush = new useBrush('color', '#dd0000');
    let spBrush = new useBrush('color', '#00dd00');
    return (
      <figure className='chart-container' id='chart1' style={style}>
        <ChartBrush.Provider value={this.state.brush}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          viewBox={`-${margin.left} -${margin.top} ${width +
            margin.left +
            margin.right} ${height + margin.top + margin.bottom}`}
          preserveAspectRatio='xMinYMax meet'
          style={{ maxHeight: '75vh', fontSize: '0' }}
        >
          <g className='chart-groups' ref={this.groupRef}>
            {this.state.loaded ? (
              <TimeSeriesCollection
                width={600}
                height={600}
              >
                <TimeSeries
                  data={this.state.cdata}
                  name='blue'
                  brush={tsBrush}
                  selectX={d => d.t}
                  selectY={d => d.x}
                  strokeWidth={4}
                  strokeDasharray={5}
                  stroke='#29b6f6'
                  dots={{ fill: '#5b6bc0', r: 3 }}
                />
                <TimeSeries
                  data={this.state.cdata2}
                  selectX={d => d.t}
                  selectY={d => d.x}
                  strokeWidth={4}
                  strokeDasharray={5}
                  stroke='#ff7c43'
                  dots={{ fill: '#ffa600', r: 3 }}
                />
                <TimeSeries
                  data={this.state.cdata3}
                  selectX={d => d.t}
                  selectY={d => d.x}
                  strokeWidth={4}
                  strokeDasharray={5}
                  stroke='#d45087'
                  dots={{ fill: '#f95d6a', r: 3 }}
                />
              </TimeSeriesCollection>
            ) : null}

            <Histograms width={600} height={600}>
              <Histogram data={data} label={d => `${d.length}`} nice />
              <Histogram data={data} nice />
              <Histogram data={data} nice />
              <Histogram data={data} nice />
              <Histogram data={data} nice />
            </Histograms>

            {this.state.loaded ? (
              <Scatterplots
                margin={{ top: 20, right: 42, bottom: 20, left: 30 }}
                width={600}
                height={600}
                axisBottom={hxAxis}
                axisLeft={hyAxis}
              >
                <Scatterplot
                  data={this.state.sdata}
                  label={d => `${d.label}`}
                  name='green'
                  brush={spBrush}
                  selectX={d => d.x}
                  selectY={d => d.y}
                  selectColor={d => d.c}
                  fill='#ffa600'
                  scheme='Dark2'
                />
                <Scatterplot
                  data={this.state.sdata2}
                  selectX={d => d.x}
                  selectY={d => d.y}
                  selectColor={d => d.c}
                  fill='#ff4500'
                  scheme='Set1'
                />
                <Scatterplot
                  data={this.state.sdata3}
                  selectX={d => d.x}
                  selectY={d => d.y}
                  selectColor={d => d.c}
                  fill='#palevioletred'
                  scheme='Accent'
                />
              </Scatterplots>
            ) : null}
          </g>
        </svg>
        </ChartBrush.Provider>
      </figure>
    );
  }
}

export default Container;
