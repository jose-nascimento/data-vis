// set the dimensions and margins of the graph

// append the svg object to the body of the page

const dats =  [75, 104, 369, 300, 92, 64, 265, 35, 287, 69, 52, 23, 287, 87, 114, 114, 98, 137, 87, 90, 63, 69, 80, 113, 58, 115, 30, 35, 92, 460, 74, 72, 63, 115, 60, 75, 31, 277, 52, 218, 132, 316, 127, 87, 449, 46, 345, 48, 184, 149, 345, 92, 93, 138, 48, 87, 103, 32, 93, 57, 109, 127, 149, 78, 162, 173, 87, 184, 288, 460, 150, 127, 92, 84, 115, 218, 404, 52, 85, 66, 52, 201, 287, 69, 114, 379, 115, 161, 91, 231, 230, 115, 80, 58, 207, 171, 156, 91, 138, 104, 74, 87, 63, 333, 125, 196, 57, 92, 127, 136, 129, 66, 80, 115, 87, 57, 172, 184, 230, 153, 162, 104, 165, 69, 196, 38, 92, 162, 105, 69, 29, 102, 87, 345, 58, 56, 35, 49, 92, 156, 58, 104, 167, 115, 87, 87, 322, 65, 149, 34, 69, 69, 391, 58, 58, 207, 61, 253, 109, 69, 57, 56, 114, 58, 80, 149, 287, 57, 138, 92, 87, 103, 230, 57, 50, 92, 79, 92, 45, 196, 29, 69, 253, 173, 438, 173, 218, 115, 58, 92, 115, 230, 87, 287, 53, 80, 92, 89, 173, 96, 80, 115, 104, 138, 92, 48, 98, 231, 127, 114, 91, 115, 80, 403, 253, 75, 63, 69, 92, 171, 58, 104, 47, 53, 80, 213, 104, 125, 127, 58, 432, 90, 52, 69, 173, 75, 69, 139, 127, 45, 87, 138, 92, 58, 208, 52, 149, 60, 89, 119, 287, 74, 138, 171, 391, 104, 35, 92, 90, 92, 103, 69, 345, 115, 87, 107, 93, 92, 247, 172, 58, 34, 99, 104, 57, 80, 345, 461, 330, 80, 75, 94, 104, 218, 58, 115, 79, 108, 184, 115, 60, 101, 40, 92, 102, 126, 92, 225, 107, 288, 63, 62, 80, 69, 115, 46, 102, 60, 40, 345, 63, 114, 74, 80, 144, 56, 127, 98, 104, 71, 98, 104, 92, 208, 287, 93, 230, 196, 290, 164, 91, 115, 40, 92, 127, 231, 104, 58, 225, 183, 98, 81, 115, 97, 438, 111, 173, 346, 80, 172, 126, 126, 317, 59, 52, 197, 80, 58, 127, 214, 71, 32, 127, 115, 64, 149, 80, 98, 92, 58, 278, 45, 69, 215, 69, 92, 172, 75, 58, 101, 80, 137, 149, 92, 93, 125, 63, 231, 115, 70, 115, 80, 127, 98, 127, 113, 69, 61, 23, 69, 58, 104, 196, 137, 93, 145, 58, 103, 69, 123, 53, 173, 230, 63, 403, 93, 115, 87, 74, 90, 93, 160, 201, 131, 460, 287, 61, 98, 64, 46, 138, 149, 74, 56, 80, 92, 67, 133, 403, 160, 138, 63, 69, 69, 331, 92, 368, 103, 92, 180, 114, 58, 115, 144, 345, 172, 98, 76, 67, 68, 80, 345, 490, 62, 190, 46, 91, 231, 93, 79, 83, 115, 58, 139, 162, 46, 144, 104, 83, 305, 76, 23, 230, 184, 104, 138, 106, 85, 287, 58, 167, 213, 225, 58, 57, 231, 87, 87, 156, 63, 104, 196, 345, 207, 345, 114, 403, 87, 80, 69, 68, 173, 253, 103, 138, 168, 167, 98, 58, 171, 53, 49, 80, 64, 92, 75, 92, 69, 71, 58, 121, 104, 40, 253, 69, 149, 104, 41, 230, 41, 132, 231, 58, 127, 58, 69, 149, 91, 374, 46, 115, 52, 37, 173, 149, 167, 58, 173, 69, 52, 426, 46, 167, 85, 66, 230, 46, 60, 71, 119, 103, 85, 58, 65, 67, 33, 346, 58, 49, 98, 214, 403, 58, 104, 115, 109, 87, 68, 115, 114, 102, 138, 92, 171, 69];

function init(id) {

    console.log('init?');
    console.log(d3);
    
    const margin = {top: 10, right: 30, bottom: 30, left: 40};
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const svg = d3.select(id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

    console.log('svg created');
    


    return { svg, margin, width, height };
}

function builder({ svg, margin, width, height }) {
    console.log('builder');
    
    console.log(width, height);
    
    return function build(data) {
        console.log('buildou', JSON.stringify(data));
        console.log(margin, width, height);
        
        // X axis: scale and draw:
        //let k = d3.max(data, function(d) { return +d.price });
        //console.log(k);
        
        var x = d3.scaleLinear()
            .domain([0, d3.max(data)])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        
        // set the parameters for the histogram
        // console.log('ticks', x.ticks(16));
        
        var histogram = d3.histogram()
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(11)); // then the numbers of bins

        console.info(histogram)
        
        
        // And apply this function to data to get the bins
        var bins = histogram(data);
        console.log('bins', bins);
        // console.info(bins);
        console.log(x.ticks(bins.length));
        
        
        // Y axis: scale and draw:
        var y = d3.scaleLinear()
            .range([height, 0]);
            y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
        svg.append("g")
            .call(d3.axisLeft(y));
        
        // append the bar rectangles to the svg element
        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
              .attr("x", 1)
              .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
              .attr("width", function(d) { return x(d.x1 - d.x0) - 10; })
              .attr("height", function(d) { return height - y(d.length); })
              .style("fill", "#69b3a2");
        console.info(svg);
        // .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
    }
}

// get the data

function run2() {
    console.log('d3-hist run');
    
    let params = init('#hist');
    console.log('params', params);
    
    const build = builder(params);
    console.log('até aqui?');
    
    build(dats);

    console.log('exit com exito');
    console.log('stay!');
    

    // return 0;
}

// window.onload = run;