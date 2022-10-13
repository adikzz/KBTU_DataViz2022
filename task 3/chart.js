async function buildPlot() {
    //I decided to make a plot with squares and circles
    const n = 100;
    //declaring number of elements
    let data1 = [];
    let data2 = [];
    //here we are going to keep data about two figures
    var radius = (d) => d.radius;
    var height = (d) => d.height;
    var width = (d) => d.width;
    //to calculate parameters of figures

    var dimension = {
        width: window.innerWidth*0.4,
        height: window.innerWidth*0.4,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    for(let i = 0; i < n; i++) {
        data1.push({
            radius: 3,
            x: Math.random()*(dimension.boundedWidth - 10) + 5,
            y: Math.random()*(dimension.boundedWidth - 10) + 5,
            color: "blue"
        })

        data2.push({
            width: 5,
            height: 5,
            x: Math.random()*(dimension.boundedWidth - 10) + 5,
            y: Math.random()*(dimension.boundedWidth - 10) + 5,
            color: "red"
        })
    };
    //here we're pushing data 

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg");
    svg.attr("height", dimension.height);
    svg.attr("width", dimension.width);
    
    const circles = svg.append("g");
    circles.style("transform",`translate(${dimension.margin.left + 10}px, ${dimension.margin.top - 10}px)`);

    const squares = svg.append("g");
    squares.style("transform",`translate(${dimension.margin.left + 10}px,${dimension.margin.top - 10}px)`);

    const yScaler = d3.scaleLinear()
        .domain([0, 50])
        .range([dimension.boundedHeight, 0]);

    const xScaler = d3.scaleLinear()
        .domain([0, 50])
        .range([0, dimension.boundedWidth]);

    const yAxisGenerator = d3.axisLeft()
        .scale(yScaler);

    const xAxisGenerator = d3.axisBottom()
        .scale(xScaler);
    
    const yAxis = circles.append("g")
        .call(yAxisGenerator);

    const xAxis = circles.append("g")
        .call(xAxisGenerator)
        .style("transform",`translateY(${dimension.boundedHeight}px)`);
    
    circles.selectAll("circle")
        .data(data1)
        .enter()
        .append("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr('r', radius)
        .attr("fill", (d) => d.color);
    //drawing circles

    squares.selectAll("rect")
        .data(data2)
        .enter()
        .append("rect")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr('width', height)
        .attr('height', width)
        .attr("fill", (d) => d.color);
    //drawing squares
}

async function clean() {
    d3.select("#wrapper svg").remove();
}

buildPlot()