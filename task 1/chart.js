async function buildPlot() {
    console.log("Hello world");
    const data = await d3.json("my_weather_data.json");
    //загрузка данных

    //console.table(data);
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yAccessor = (d) => d.temperatureMin;
    const yAccessor_2 = (d) => d.temperatureHigh;
    //my new variable
    
    const xAccessor = (d) => dateParser(d.date);
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 25,
            left: 0,
            bottom: 25,
            right: 25
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data, yAccessor))
        .range([dimension.boundedHeight, 0]);

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data, xAccessor))
        .range([0, dimension.boundedWidth]);
    
    var minTempGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yAccessor(d)));
    
    bounded.append("path")
        .attr("d", minTempGenerator(data))
        .attr("fill", "none")
        .attr("stroke", "black")

    const yScaler_2 = d3.scaleLinear()
        .domain(d3.extent(data, yAccessor_2))
        .range([dimension.boundedHeight, 0]);
    
    var maxTempGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler_2(yAccessor_2(d)))

    bounded.append("path")
        .attr("d", maxTempGenerator(data))
        .attr("fill", "none")
        .attr("stroke", "red")

    const xAxis = d3.axisBottom(xScaler);
    const yAxis = d3.axisRight(yScaler);
    //setting the axis 
    
    bounded.append("g")
      .attr("transform", `translate(0, ${dimension.boundedHeight})`)
      .call(xAxis);

    bounded.append("g")
      .attr("transform", `translate(0, 0)`)
      .call(yAxis)
      .call(g => g.append("text")
      .attr("x", -(dimension.margin.left - 10))
      .attr("y", 15)
      .attr("fill", "currentColor")
      .text('Temperature'));
    //drawing the axis
}

buildPlot();