import React from 'react';
import { brush, brushSelection } from 'd3-brush';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';

/*  Copyright (C) 2019 Jose Licio

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

export const ChartBrush = React.createContext(null);
export const ZoomContext = React.createContext(null);
export class useBrush {

  constructor(callback = 'set', color = 'black') {
    this.color = color;
    switch(typeof callback) {
      case('string'):
        this.callbackName = callback;
      case('object'):
        this.callback = Array.isArray(callback)? callback : null;
        break;
      default:
        throw `Invalid argument for callback, must be string or array, got ${typeof callback}`;
    }
  }

  update(node, name, selector, x, y, getData = null) {
    this.node = node;
    this.name = name;
    this.selector = selector;
    this.x = x;
    this.y = y;
    if (getData) this.getData = getData;
  }

}

export class Brush {

  constructor(node) {

    this.getSelection = this.getSelection.bind(this);
    this.getDataset = this.getDataset.bind(this);
    this.getNodes = this.getNodes.bind(this);
    this.logger = this.logger.bind(this);
    this.colorer = this.colorer.bind(this);
    this.bindBrush = this.bindBrush.bind(this);

    this.xFilter = this.xFilter.bind(this);
    this.yFilter = this.yFilter.bind(this);
    this.xyFilter = this.xyFilter.bind(this);

    this.node = node;
    this.brush = brush();
    this.brushSelection = this.brush(select(node));

    this.initParentScale();

  }

  bindBrush(context) {

    context.parent = this;
    context.parentNode = this.node;
    context.start = context.node.querySelector('.marker.x0-marker');
    context.end = context.node.querySelector('.marker.x1-marker');
    context.getData = context.getData? context.getData : this.getDatum;

    this.initDataScale(context);

    context.filter = this.xyFilter(this.xFilter(context), this.yFilter(context));

    let name = context.name;

    if (context.callback) {
      let callback = context.callback;
      this.brush.on(`${callback[0]}.${name}_${callback[2]? callback[2] : 'default'}`, callback[1]);
    }

    if (context.callbackName) {
      switch (context.callbackName) {
        case 'log':
          this.brush.on(`end.${name}_log`, this.logger(context));
          break;
        case 'color':
          this.brush.on(`end.${name}_color`, this.colorer(context));
          break;
        case 'set':
          this.brush.on(`end.${name}_color`, this.setter(context));
        default:
          break;
      }
    }
  }

  setter(context) {
    return () => {
      context.data = context.parent.getDataset();
    };
  }

  xFilter(context) {
    const thisArg = this;
    const { dataScale } = context;
    return function(selection) {
      let [ [x0], [x1] ] = selection || [[0, 0], [0, 0]];
      thisArg.rescale(context);
      [x0, x1] = [ thisArg.parentScale.x(x0), thisArg.parentScale.x(x1) ];
      let sx = dataScale.x;
      return (d) => {
        const x = sx(+d.getAttribute(context.x));
        return x >= x0 && x <= x1;
      };
    };
  }

  yFilter(context) {
    const thisArg = this;
    const { dataScale } = context;
    return function(selection) {
      let [ [, y0], [, y1] ] = selection || [[0, 0], [0, 0]];
      thisArg.rescale(context);
      [y0, y1] = [ thisArg.parentScale.y(y0), thisArg.parentScale.y(y1) ];
      let sy = dataScale.y;
      return (d) => {
        const y = sy(+d.getAttribute(context.y));
        return y >= y0 && y <= y1;
      };
    };
  }

  xyFilter(xFilter, yFilter) {
    return function (selection) {
      const [ xf, yf ] = [ xFilter(selection), yFilter(selection) ];
      return(d) => {
        return xf(d) && yf(d);
      }
    };
  }

  getDatum(d) {
    return  { ...d.dataset };
  }

  getSelection(context) {
    const { node, selector } = context;
    return Array.prototype.slice.call(node.querySelectorAll(selector));
  }

  getNodes(context) {
    const { parentNode, filter } = context;
    return this.getSelection(context).filter(filter(brushSelection(parentNode)));
  }

  getDataset(context) {
    const { getData } = context;
    return this.getNodes(context).map(getData).flat();
  }

  logger(context) {
    return () => this.getDataset(context).map((d) => console.log(d));
  }

  colorer(context) {
    const { color } = context;
    return () => this.getNodes(context).map(d => d.setAttribute('fill', color))
  }

  dataScaleX(context) {
    const { start, end } = context;
    let [x0, x1] = [ (+start.getAttribute(context.x)), (+end.getAttribute(context.x)) ];

    let { left } = start.getBoundingClientRect();
    let { right } = end.getBoundingClientRect();

    context.dataScale.x.domain([x0, x1]).range([left, right]);
  }

  dataScaleY(context) {
    const { start, end } = context;
    let [y0, y1] = [ (+start.getAttribute(context.y)), (+end.getAttribute(context.y)) ];

    let { top } = start.getBoundingClientRect();
    let { bottom } = end.getBoundingClientRect();

    context.dataScale.y.domain([y0, y1]).range([top, bottom]);
  }

  initDataScale(context) {

    let sx = scaleLinear();
    let sy = scaleLinear();

    context.dataScale = {x: sx, y: sy};

    this.dataScaleX(context);
    this.dataScaleY(context);

  }

  parentScaleX() {
    let [ [x0], [x1] ] = this.node.__brush.extent;;

    let { left, right } = this.node.getBoundingClientRect();

    this.parentScale.x.domain([x0, x1]).range([left, right]);
  }

  parentScaleY() {
    let [ [, y0], [, y1] ] = this.node.__brush.extent;;

    let { top, bottom } = this.node.getBoundingClientRect();

    this.parentScale.y.domain([y0, y1]).range([top, bottom]);
  }


  initParentScale() {

    let sx = scaleLinear();
    let sy = scaleLinear();

    this.parentScale = {x: sx, y: sy};

    this.parentScaleX();
    this.parentScaleY();

  }

  rescale(context) {
    this.initDataScale(context);
    this.initParentScale();
  }

}
