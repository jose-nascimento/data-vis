import React from 'react';
import Chart, { withAxes } from '../Chart';
import { extent } from 'd3-array';
import { load } from "./helpers";

class Scatterplot extends Chart {
  static defaultProps = {
    ...super.defaultProps,
    selectX: d => d,
    selectY: d => d,
    stroke: 'none',
    r: 4,
  };

  constructor(props) {
    super(props);

    const { loaded, datapoints, domain, colorScale } = props;

    if (loaded) {
      this.state = { loaded, datapoints, domain, colorScale };
    } else {
      this.state = { loaded: false };
    }

  }

  componentDidMount() {
    
    if (this.state && !this.state.loaded) {
      
      let state = load(this.props)
      this.setState({...state, loaded: true});
    }

  }

  getX(d) {
    let x = this.props.selectX(d);
    return this.state.scale.x(x);
  }

  getY(d) {
    let y = this.props.selectY(d);
    return this.state.scale.y(y);
  }

  getColor(d) {
    return this.state.colorScale(this.props.selectColor(d));
  }

  renderChart() {
    const {
      width,
      height,
      margin,
      data,
      r,
      fill,
      stroke,
      strokeLinejoin,
      strokeLinecap,
      strokeWidth,
      selectX,
      selectY,
      selectColor,
      axisTop,
      axisRight,
      axisBottom,
      axisLeft, 
      loaded,
      datapoints: plot,
      domain,
      colorScale: cs,
      ...props
    } = this.props;
    const datapoints = this.state.datapoints;
    const { x: dx, y: dy } = this.state.domain;
    const { colorScale } = this.state;
    // const { x: rx, y: ry } = this.state.range;
    return (
      <svg
        className='Scatterplot'
        viewBox={`-${margin.left} -${margin.top} ${width +
          margin.left +
          margin.right} ${height + margin.top + margin.bottom}`}
        preserveAspectRatio='xMinYMax meet'
        x={this.props.x}
        y={this.props.y}
      >
        {this.renderAxis()}
        <g
          className='points'
          fill={fill}
          stroke={stroke}
          strokeLinejoin={strokeLinejoin}
          strokeLinecap={strokeLinecap}
          strokeWidth={strokeWidth}
          data-x-domain-from={dx[0]}
          data-x-domain-to={dx[1]}
          data-y-domain-from={dy[0]}
          data-y-domain-to={dy[1]}
          {...props}
        >
          {data.map((d, i) => {
            let fillColor = colorScale? this.getColor(d) : undefined;
            return (
              <circle
                key={i}
                className='point'
                cx={datapoints[i].x}
                cy={datapoints[i].y}
                r={r}
                fill={fillColor}
                data-x={selectX(d)}
                data-y={selectY(d)}
              />
            );
          })}
        </g>
      </svg>
    );
  }
}

export default withAxes(Scatterplot);
