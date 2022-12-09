async function build() {
    console.log("Hello world");
    const companies = await d3.csv("Companies.csv");
    const everything = await d3.csv("all.csv");
    const projects = await d3.csv("Projects.csv");


    function adjacencyMatrix(companies, everything, projects) {
        var matrix = [];
        var edgeHash = {};
        everything.forEach(edge => {
            var id = edge.company+"-"+edge.project;
            edgeHash[id] = edge;
        })
        console.log(edgeHash)
        for(let i=0; i<companies.length; i++) {
            for(let j=0; j<projects.length; j++) {
                var uel = companies[i];
                var bel = projects[j];
                var grid = {
                    id: uel.company+"-"+bel.project,
                    project: bel.group,
                    x:j,
                    y:i,
                    weight:0
                }

                if(edgeHash[grid.id]) {
                    grid.weight = parseInt(edgeHash[grid.id].number);
                }
                matrix.push(grid);

            }
        }
        return matrix;
    }

    var dimension = {
        width: window.innerWidth*0.8,
        height: window.innerWidth*0.8,
        margin: {
            top: 500,
            right: 10,
            bottom: 10,
            left: 400
        }
    }

    dimension.boundedWidth = dimension.width - dimension.margin.right - dimension.margin.left;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimension.width)
        .attr("height", dimension.height)

    const bounds = wrapper.append("g")
        .style("transform",`translate(${dimension.margin.left}px,${dimension.margin.top}px)`);
    var data = adjacencyMatrix(companies, everything, projects);

    const pole = bounds
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","grid")
        .attr("width",25)
        .attr("height",25)
        .attr("x", d=>d.x*25)
        .attr("y", d=>d.y*25)
        .style("fill-opacity", d=>d.weight*0.2);

    const namesProject = wrapper
        .append("g")
        .attr("transform","translate(405, 380)")
        .selectAll("text")
        .data(projects)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(projects=>projects.project)
        .style("text-anchor","middle")
        .attr("transform", "rotate(270)");

    const namesGroup = wrapper
        .append("g")
        .attr("transform","translate(405, 180)")
        .selectAll("text")
        .data(projects)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(projects=>projects.group)
        .style("text-anchor","middle")
        .attr("transform", "rotate(270)");

    const namesCompany = wrapper
        .append("g")
        .attr("transform","translate(380, 505)")
        .selectAll("text")
        .data(companies)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(d=>d.company)
        .style("text-anchor","end");

    const namesCountry = wrapper
        .append("g")
        .attr("transform","translate(80, 500)")
        .selectAll("text")
        .data(companies)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(d=>d.country)
        .style("text-anchor","end");

}

build();