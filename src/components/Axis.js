import React, { Component } from 'react';
import { axisTop, axisRight, axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { ZoomContext } from './chart/brush';

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

    this.state = {};

  }

  componentDidUpdate() {
    let transform = this.context;
    console.log('mudou', transform);

    if (transform) {
      let axisFn = this.state.axisFn;
      console.log('prev scale', axisFn().range())
      if (this.props.axis === 'x') {
        // axisFn = transform.rescaleX(axisFn);
        console.log('new scale', axisFn().range())
        // this.setState({ axisFn });
      } else {
        // axisFn = transform.rescaleY(axisFn);
        console.log('new scale', axisFn.range())
        // this.setState({ axisFn });
      }

    }
  }



renderAxis(ref, axis) {

    return function() {
        select(ref.current).call(axis);
    };

}



componentDidMount() {

  const { axis: axisScale, ticks, tickFormat } = this.props;
  const scale = (axisScale === 'x')? this.props.scale.x : this.props.scale.y;
  const { axis } = Axis.positionalProps[this.props.position];
  let axisFn = axis(scale);
  this.setState({ axisFn });

  if (ticks) axisFn.ticks(ticks);
  if (tickFormat) axisFn.tickFormat(tickFormat);


  let renderer = this.renderAxis(this.axisRef, axisFn)
  setTimeout(() => window.requestAnimationFrame(renderer), 0);
  }

  render() {
    const { axis, position, height, width, offset, scale, ticks, tickFormat, ...props } = this.props;
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

Axis.contextType = ZoomContext;

export default Axis;
