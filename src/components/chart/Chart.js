import React, { Component } from 'react';
import PropTypes from "prop-types";

const style = {
  textAlign: 'center',
  color: '#EEE',
  backgroundColor: '#fff',
  width: '70vw',
  margin: '0 auto',
  marginTop: '10rem',
};

class Chart extends Component {
  static defaultProps = {
    width: 640,
    height: 640,
    margin: {
        top: 25,
        right: 25,
        bottom: 25,
        left: 25,
    },
    group: (props) => <g>{props.children}</g>,
  };
  render() {
    // const { width, height, margin, group: Group, ...props } = { ...this.defaultProps, ...this.props };
    return (
      <figure style={style}>
          <svg>
              <this.props.group>
                  {this.props.children}
              </this.props.group>
          </svg>
      </figure>
    )
  }
}

export default Chart;