import React, { Component } from 'react'

class Chart extends Component {
  render() {
    return (
      <svg>
          {this.props.children}
      </svg>
    )
  }
}

export default Chart;