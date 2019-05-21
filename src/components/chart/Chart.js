import React, { Component } from 'react';
import PropTypes from "prop-types";

const style = {
  textAlign: 'center',
  color: '#EEE',
  backgroundColor: '#fff',
  width: '640px',
  height: '640px',
  margin: '0 auto',
  height: 'auto',
};

class Chart extends Component {
  static defaultProps = {
    width: 640,
    height: 640,
    margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
    },
    group: (props) => <g>{props.children}</g>,
  };
  render() {
    const { width, height, margin, group: Group, ...props } = { ...this.props };
    return (
      <figure style={style}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox={`${-margin.left} ${-margin.top} ${width -
            margin.left - margin.right} ${height - margin.top - margin.bottom}`}
          width='100%'
          height='auto'
        >
          <svg x="320" y="320">
            <circle cx="64" cy="64" r="64" fill="#000" />
          </svg>
        </svg>
      </figure>
    );
  }
}
//{`${width}`}
//{`${height}`}
export default Chart;