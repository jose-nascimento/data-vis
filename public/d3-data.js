'use strict';

var myApp = {};

myApp.createData = function(n)
{
    var arr = [];
    
    for(var id=0; id<n; id++)
    {
        arr.push(id);
    }
    
    return arr;
}

myApp.createCirclesData = function(n)
{
    var circles = [];
    
    for(var id=0; id<n; id++)
    {
        var x = Math.random()*180 + 10;
        var y = Math.random()*180 + 10;
        var r = Math.random()*9   +  2;

        var c = {'cx': x, 'cy': y, 'r': r};
        
        circles.push(c);
    }
    
    return circles;
}

myApp.appendSvg = function(div, x, y, w, h)
{
    var node = d3.select(div).append("svg")
        .attr('x', x)
        .attr('y', y)
        .attr('width', 'auto')
        .attr('height', '100%')
        .attr('viewBox', '0 0 ' + w + ' ' + h);
    
    return node;
}

myApp.appendCircles = function(node)
{
    var arr = myApp.createCirclesData(10);
    
    var circle = node.selectAll('circle')
        .data(arr)
        .enter()
        .append('circle')
        .attr('cx', function(d){ return d.cx; })
        .attr('cy', function(d){ return d.cy; })
        .attr('r' , function(d){ return d.r;  });
    
    return circle;
}

myApp.randomColor = function() {
    return 'rgb(' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ')';
}

myApp.run = function() {

    console.log('myApp.run');
    
    
    var svg = myApp.appendSvg("#mainDiv", 10, 10, 200, 200);
    var sel = myApp.appendCircles(svg);

    sel.style('fill', function(){ return myApp.randomColor(); });
}

console.log('d3-data.js before');
window.myApp = myApp;
console.log('d3-data.js after');

// window.onload = myApp.run;