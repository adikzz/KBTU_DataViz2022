async function drawBar(id, type, color) {
  const dataset = await d3.json("./draft.json")

  var grouped_date = d3.rollup(
      dataset, 
      v => v.length, 
      d => d[type]
    )

  const array = [];
  for (const [key, value] of grouped_date) {
    array.push({key, value});
  }

  function sortArrayBy (array, type){
    let sortedArray;
    if(type == 'Bplace' || type == 'reg'){
      sortedArray = array.sort(function(a,b){
        let x = a.key.toLowerCase();
        let y = b.key.toLowerCase();
        if(x>y){return 1;}
        if(x<y){return -1;}
        return 0;
      });
    } else {
      sortedArray = array.sort(function(a,b){
        return a.value - b.value;
      })
    }
    return sortedArray;
  }

  const sortedArray = sortArrayBy(array, type)

  console.log(sortedArray)
  //console.log(grouped_date)
  const width = 700
  let dimensions = {
      width: 700,
      height: 750,
      margin: {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30,
      }
    }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom


  const wrapper = d3.select("#wrapper")
    .html("")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    .append("svg")
    .attr("width", dimensions.width*1.2)
    .attr("height", dimensions.height*1.2)

  const bounds = wrapper.append("g")
    .style("translate",`translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

  const xScaler = d3.scaleBand()
    .domain(array.map(function(d) { return d.key; }))
    .rangeRound([0, dimensions.boundedWidth]).padding(0.1)

  const yScaler = d3.scaleLinear()
    .domain([0, array.map(function(d) { return d.value; })])
    .range([dimensions.boundedHeight, 0])

  const space = 40;
  const barPadding = 1


  const xAxisGen = d3.axisBottom()
    .scale(xScaler);
  const xAxis = bounds.append("g")
    .call(xAxisGen)
    .style("transform",`translate(40px, ${dimensions.boundedHeight}px)`)
    .selectAll("text")	
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("font-size", "10px")
    .attr("transform", function(d) {
        return "rotate(-65)" 
        });

  const yAxisGen = d3.axisLeft()
    .scale(yScaler);
  const yAxis = bounds.append("g")
    .call(yAxisGen)
    .attr("transform", `translate(${space}, 0)`)
    ;
  
  console.log(xScaler)
  console.log(yScaler)
  const xLabel = bounds.append("text")
    .attr("x", dimensions.boundedWidth+70)
    .attr("y", dimensions.boundedHeight - 10)
    .text("Regions")
    .attr("fill", "black")
    .attr("font-size", "12px")
    .attr("text-anchor", "middle");

  const yLabel = bounds.append("text")
    .attr("x", 60)
    .attr("y", 20)
    .text("Count")
    .attr("fill", "black")
    .attr("font-size", "12px")
    .attr("text-anchor", "middle");
  
  wrapper.selectAll(".rect")
    .data(grouped_date)
    .enter()
    .append("rect")
        .attr("class", "bar")
      .attr("x", function(d) { return xScaler(d.key); })
      .attr("y", function(d) { return yScaler(d.value); })
      .attr("width", xScaler.bandwidth())
      .attr("height", function(d) { return dimensions.height - yScaler(d.value); });
    //changing color of a button
    changeButtonColor(id);
}
    
async function changeButtonColor(id){
  const before = document.getElementsByClassName("active");
  before[0].style.backgroundColor = 'buttonface';
  before[0].classList.remove("active");
    
  const after = document.getElementById(id)
  after.classList.add("active");
  after.style.backgroundColor = 'lightgreen'
}

drawBar('region_brate', 'Bplace', 'blue')
