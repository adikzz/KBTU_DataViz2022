tsne = "./tsne_output.json"
umap = "./umap_output.json"

async function buildPlot(path, e, alg_name) {
    const data = await d3.json(path)

    const xAccessor = d => d.Comp1;
    const yAccessor = d => d.Comp2;

    var dimension = {
        width: window.innerWidth*0.7,
        height: 400,
        margin: {
            top: 25,
            left: 25,
            bottom: 25,
            right: 25
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom

    const wrapper = d3.select(e)
        .html("")
        .append("svg")
        .attr("width", dimension.width)
        .attr("height", dimension.height);

    const bounds = wrapper.append("g")
        .style("translate",`translate(${dimension.margin.left}px,${dimension.margin.top}px)`);

    const xScaler = d3.scaleLinear()
        .domain(d3.extent(data, xAccessor))
        .range([0, dimension.boundedWidth + 10])
        .nice()

    const xAxisGen = d3.axisBottom()
        .scale(xScaler);

    const xAxis = bounds.append("g")
        .call(xAxisGen)
        .attr("transform", `translate(${50},${dimension.boundedHeight} )`);

    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data, yAccessor))
        .range([dimension.boundedHeight, 10])
    
    const yAxisGen = d3.axisLeft()
        .scale(yScaler);

    const yAxis = bounds.append("g")
        .call(yAxisGen)
        .attr("transform", `translate(${50}, 0)`);

    const xLabel = bounds.append("text")
        .attr("x",dimension.boundedWidth - 30)
        .attr("y",dimension.boundedHeight + 30)
        .text("component 2")
        .attr("fill","black")
        .attr("font-size","12px")
        .attr("text-anchor","middle");

    const yLabel = bounds.append("text")
        .attr("x",-50)
        .attr("y",30)
        .attr('transform', 'translate(-5, 90)rotate(-90)')
        .text("component 1")
        .attr("fill","black")
        .attr("font-size","12px")
        .attr("text-anchor","middle");

    const class_0_label = bounds.append("text")
        .attr("x", 1150)
        .attr("y", 100)
        .text("class 0")
        .attr("fill","red")
        .attr("font-size","15px");

    const class_1_label = bounds.append("text")
        .attr("x", 1150)
        .attr("y", 110)
        .text("class 1")
        .attr("fill","green")
        .attr("font-size","15px");

    const class_2_label = bounds.append("text")
        .attr("x", 1150)
        .attr("y", 120)
        .text("class 2")
        .attr("fill","blue")
        .attr("font-size","15px");

    const name = bounds.append("text")
        .attr("x",600)
        .attr("y",20)
        .text(alg_name)
        .attr("fill","black")
        .attr("font-size","25px");

    const linear = bounds.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScaler(d["Comp1"]) - 50; } )
        .attr("cy", function (d) { return yScaler(d["Comp2"]) + 50 - 4; } )
        .attr("r", 4)
        .attr("transform", "translate(" + 100 + "," + -50 + ")")
        .style("fill", function (d) { return d["Label"] == 0 ? "red" : d["Label"] == 1 ? "blue" : "green"; });
}

buildPlot(tsne, "#tsne", "tsne");
buildPlot(umap, "#umap", "umap");