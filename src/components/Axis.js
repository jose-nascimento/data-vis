import React, { Component } from 'react';
import { axisTop, axisRight, axisBottom, axisLeft} from 'd3-axis';
import { select } from "d3-selection";

class Axis extends Component {

  static lengthEnum = {
    width: 0,
    height: 1,
  }

  static positionalProps = {
    top: {
      axis: axisTop,
      transform: (length, offset) => `translate(0, ${offset})`,
      length: Axis.lengthEnum['height'],
      direction: -1,
    },
    right: {
      axis: axisRight,
      transform: (length, offset) => `translate(${length + offset}, 0)`,
      length: Axis.lengthEnum['width'],
      direction: 1,
    },
    bottom: {
      axis: axisBottom,
      transform: (length, offset) => `translate(0, ${length + offset})`,
      length: Axis.lengthEnum['height'],
      direction: 1,
    },
    left: {
      axis: axisLeft,
      transform: (length, offset) => `translate(${offset}, 0)`,
      length: Axis.lengthEnum['width'],
      direction: -1,
    },
  }

  constructor(props) {
    super(props);

    this.axisRef = React.createRef();
  }

renderAxis(ref, axis, scale) {

    return function() {
        select(ref.current).call(axis(scale));
    };

}

componentDidMount() {
    let { axis } = Axis.positionalProps[this.props.position];
    //let thisAxis = axisBottom(this.props.scale);
    let renderer = this.renderAxis(this.axisRef, axis, this.props.scale)
    //select(this.axisRef.current).call(thisAxis(this.props.scale));
    //select('g .Axis').call(thisAxis(this.props.scale));
    setTimeout(() => window.requestAnimationFrame(renderer), 0);
  }
  render() {
    const { axis, position, height, width, offset, scale, ...props } = this.props;
    const { transform, length, direction } = Axis.positionalProps[position];
    const lengthUnit = length? height : width;
    const relOffset = (offset? offset : 1) * direction;
    
    return (
      <g
        className={`Axis ${axis}-axis`}
        transform={transform(lengthUnit, relOffset)}
        ref={this.axisRef}
        {...props}
      />
    );
  }
}

export default Axis;