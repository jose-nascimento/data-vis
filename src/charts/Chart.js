import React, { Component } from 'react'
import { addScale } from './helpers';

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
      fontSize: 10,
      color: 'black',
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