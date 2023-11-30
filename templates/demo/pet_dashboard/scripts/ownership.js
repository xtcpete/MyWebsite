d3.csv("../data/households.csv").then(function (data) {
    const margin = { top: 10, right: 170, bottom: 30, left: 100 }
    
    var width = document.getElementById('households').clientWidth - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#households")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const sumstat = d3.group(data, d => d.pet);

    console.log(sumstat);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return d.year; }))
        .range([0, width]);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .style("font-size", "12px")
        .call(d3.axisBottom(x).ticks(8).tickFormat(d3.format('.0f')));

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.household; })])
        .range([height, 0]);

    svg.append("g")
        .style("font-size", "12px")
        .call(d3.axisLeft(y));

    const color = d3.scaleOrdinal(d3.schemeSet1);

    svg.selectAll(".line")
        .data(sumstat)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", function (d) { return color(d[0]) })
        .attr("stroke-width", 2)
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) { return x(d.year); })
                .y(function (d) { return y(+d.household); })
                (d[1])
        })
        .attr("class", "line")
        .attr("opacity", 1)

    svg.selectAll("legend_lines")
        .data(sumstat.keys())
        .enter()
        .append("line")
        .attr("x1", width + 10)
        .attr("y1", function (d, i) { return 5 + i * 30 })
        .attr("x2", width + 40)
        .attr("y2", function (d, i) { return 5 + i * 30 })
        .style("stroke", function (d) { return color(d) })
        .attr("stroke-width", 2)

    svg.selectAll("legend_labels")
        .data(sumstat.keys())
        .enter()
        .append("text")
        .attr("x", width + 50)
        .attr("y", function (d, i) { return 5 + i * 30 })
        .style("fill", function (d) { return color(d) })
        .text(function (d) { return d })
        .style("font-size", "15px")
        .attr("alignment-baseline", "middle")
        .on("mouseover", function (event, d) {
            var selectedCategory = d;
            svg.selectAll(".line")
            .transition()
            .delay(100)
            .attr("opacity", function(d) {
                return (d[0] === selectedCategory) ? 1 : 0
            });
        })
        .on("mouseout", function(){
            svg.selectAll(".line")
            .transition()
            .delay(100)
            .attr("opacity", 1);
        })

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height + 25)
        .text("Year")
        .style("font-size", "15px")
        .attr("alignment-baseline", "middle")

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -80)
        .text("No. of U.S. households(millions)")
        .style("font-size", "15px")
        .attr("alignment-baseline", "middle")
})

d3.json("../data/sources.json").then(function (data) {

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
        
    var width = document.getElementById('sources').clientWidth - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#sources")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);

    const root = d3.hierarchy(data).sum(function (d) { return d.value })

    d3.treemap()
        .size([width, height])
        .paddingTop(28)
        .paddingRight(7)
        .paddingInner(3)
        (root)

    const format = d3.format(".2f");

    const color = d3.scaleOrdinal(d3.schemeSet1);

    const scale = d3.scaleLinear()
        .domain([0, 40])
        .range([5, 25]);

    const opacity = d3.scaleLinear()
        .domain([0, 40])
        .range([.5, 1])

    svg
        .selectAll("rect")
        .data(root.leaves())
        .join("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", function (d) { return color(d.parent.data.name) })
        .style("opacity", function (d) { return opacity(d.data.value) })

    svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function (d) { return d.x0 + 3 })
        .attr("y", function (d) { return d.y0 + 20 })
        .text(function (d) { return d.data.name })
        .attr("font-size", d => scale(d.data.value) + "px")
        .attr("fill", "white")

    svg
        .selectAll("vals")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function (d) { return d.x0 + 3 })
        .attr("y", function (d) { return d.y0 + 35 })
        .text(function (d) { return format(d.data.value) })
        .attr("font-size", "11px")
        .attr("fill", "white")

    svg
        .selectAll("titles")
        .data(root.descendants().filter(function (d) { return d.depth == 1 }))
        .enter()
        .append("text")
        .attr("x", function (d) { return d.x0 })
        .attr("y", function (d) { return d.y0 })
        .text(function (d) { return d.data.name })
        .attr("font-size", "19px")
        .attr("fill", function (d) { return color(d.data.name) })
})
