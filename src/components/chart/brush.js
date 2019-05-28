import React from 'react';
import { brush, brushSelection } from 'd3-brush';
import { select } from 'd3-selection';

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
  console.log('brushed');
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

export function addBrush(node, startPoint, area) {

    const currentBrush = select(node).call(brush().on('end', onBrush));
    return currentBrush;
    //brush() .on("start brush", brushed);

    // svg.append("g")
    //     .attr("class", "brush")
    //     .call(myApp.brush);
}
