import React from 'react';
import { brush, brushSelection } from 'd3-brush';
import { select, selectAll } from 'd3-selection';

// function brushed() {
//     let s = event.selection,
//        x0 = s[0][0],
//        y0 = s[0][1],
//        x1 = s[1][0],
//        y1 = s[1][1];
//
//     selectAll('circle')
//         .style("fill", function (d)
//         {
//             if (myApp.xScale(d.cx) >= x0 && myApp.xScale(d.cx) <= x1 &&
//                 myApp.yScale(d.cy) >= y0 && myApp.yScale(d.cy) <= y1)
//             { return "#ec7014"; }
//             else
//             { return "rgb(150,150,190)"; }
//         });
// }

function brusher() {
  console.log('brushed', brushSelection(this));
}

export function onBrush() {
  console.log('brushed', this);
  
  const selection = brushSelection(this);
  console.log(selection);  
}

export function applyBrush(thisArg) {
  return onBrush.bind(thisArg);
}

export const BrushContext = React.createContext(null);

export function brushed(node) {
  const currentNode = select(node);
  const currentBrush = brush();
  return function addBrush(event, name, callback) {
    let typename = event + name? `.${name}` : '';
    currentNode.call(currentBrush.on('end', callback));
  }
}

export function addBrush(node) {
  console.log('added', node);  
  const currentBrush = select(node).call(brush().on('end', onBrush))
  return currentBrush;
  //brush() .on("start brush", brushed);
  // svg.append("g")
  //     .attr("class", "brush")
  //     .call(myApp.brush);
}

export class Brush {

  tsFilter([ [x0, y0], [x1, y1] ]) {
    return (d) => {
      const [ x, y ] = [(+d.getAttribute('cx')), (+d.getAttribute('cy'))];
      if (Math.random() < 0.1) console.log(x, y);      
      return x >= x0 && x <= x1 && y >= y0 && y <= y1;
    };
  }

  tsData(d) {
    return  { ...d.dataset };
  }

  getSelection() {
    return Array.prototype.slice.call(this.node.querySelectorAll(this.selector));
  }

  log() {
    console.log(this.node);    
    const { sx, sy } = this.scale;
    let selection = brushSelection(this.node);
    console.log(selection);    
    let a = this.getSelection()
    console.log(a);
    let b = a.filter(this.filter(selection));
    let c = b.map(this.getData)
    console.log(c);    
    c.map(({x, y}) => console.log(`x: ${x}, y: ${y}`));
  }
  constructor(node, scale) {
    this.selector = '.dots .dot';
    this.filter = this.tsFilter.bind(this);
    this.getData = this.tsData.bind(this);
    this.scale = scale;
    this.node = node;



    console.log(this.scale);    

    this.brush = select(node).call(brush().on('end', this.log.bind(this)));
  }

}