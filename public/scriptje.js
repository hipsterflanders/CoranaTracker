var svg = null;

var width = 450
height = 450
margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin


window.addEventListener('load', (event) => {


    // append the svg object to the div called 'my_dataviz'
    svg = d3.select("#content")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "chart")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



    updateNumbers();
});

const maxIntensive = 1.765;


async function getNumbers() {

    const response = await fetch('/corona');
    const jsonData = await response.json();

    //document.getElementById("infected").textContent = jsonData.geinfecteerd;

    // Create data
    var data = { a: jsonData.belintensive, b: (maxIntensive - jsonData.belintensive) }

    // set the color scale
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(["black", "red"])

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .value(function (d) { return d.value; })
    var data_ready = pie(d3.entries(data))

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function (d) { return (color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "0px")
        .style("opacity", 0.7);
}



function updateNumbers() {
    getNumbers();
    setTimeout(updateNumbers, 5000);
}
