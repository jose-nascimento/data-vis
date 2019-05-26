import React from 'react';
import Chart from '../Chart';
import { extent } from 'd3-array';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import schemes from '../../schemes/categorical';

class Scatterplot extends Chart {
  static defaultProps = {
    width: 640,
    height: 640,
    margin: {
      top: 20,
      right: 30,
      bottom: 20,
      left: 30,
    },
    selectX: d => d,
    selectY: d => d,
    fill: 'black',
    stroke: 'none',
    strokeWidth: 0,
    r: 4,
  };

  constructor(props) {
    super(props);

    this.state = { loaded: false };
  }

  componentDidMount() {
    const { data, domain, width, height, scheme, nice, selectX, selectY, selectColor } = this.props;
    const xDomain = domain ? domain.x : extent(data, selectX);
    const yDomain = domain ? domain.y : extent(data, selectY);
    let { sx, sy } = { sx: scaleLinear(), sy: scaleLinear() };
    sx = sx.domain(xDomain).range([0, width]); //.clamp(true);
    sy = sy.domain(yDomain).range([height, 0]); //.clamp(true);
    
    let colorScale;
    if (selectColor) {
      let colorScheme = scheme? schemes[scheme] : schemes.Category10;
      colorScale = scaleOrdinal(colorScheme).domain(extent(data, selectColor));
    } else {
      colorScale = undefined;
    }

    if (nice) {
      sx = sx.nice();
      sy = sy.nice();
    }

    let datapoints = this.props.data.map(d => ({
      x: sx(selectX(d)),
      y: sy(selectY(d)),
    }));

    this.setState({
      datapoints,
      scale: { x: sx, y: sy },
      domain: { x: xDomain, y: yDomain },
      colorScale,
      loaded: true,
    });
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

  render() {
    if (this.state.loaded) {
      return this.renderChart();
    } else {
      return null; //TODO: Loading component
    }
  }
}

export default Scatterplot;
