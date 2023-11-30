// Get a reference to the year selector element
var yearSelector = document.getElementById("yearSelect");
var filterSelector = document.getElementById("filterSelect");

var selectedYear = yearSelector.value;

const SortMode = {
    'Total GDP': 'GDP_total',
    'GDP per capita': 'GDP_per_capita',
    'GDP Growth': 'GDP_growth'
};

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var DATA;
var filteredData;
var initalData;
var ascending_status = false;
var descending_status = false;
var colorScale
var intake_data
var outcome_data

format = d3.format(",");

d3.csv("../data/intake_outcome_data.csv").then(function (data) {
    DATA = data

    filteredData = DATA.filter(function (d) {
        return d.Year === selectedYear;
    });

    colorScale = d3.scaleDiverging()
        .domain([-20000, 0, 200000])
        .interpolator(d3.interpolatePuOr)
        .range(["red", "white", "green"]);

    initalData = filteredData;
    drawChoMap(filteredData);
    var national_net = 0
    for (var i = 0; i < filteredData.length; i++) {
        national_net += Number(filteredData[i].net_outcome)
    }
    if (national_net > 0) {
        document.getElementById("KPI").style.color = "green";
        document.getElementById("KPI").innerHTML = '&darr; ' + format(Math.abs(national_net))
    }
    else{
        document.getElementById("KPI").style.color = "red";
        document.getElementById("KPI").innerHTML = '&uarr; ' + format(Math.abs(national_net))
    }
    var national_net_dog = 0
    for (var i = 0; i < filteredData.length; i++) {
        national_net_dog += Number(filteredData[i].outcome_canine) - Number(filteredData[i].intake_canine)
    }

    var national_net_cat = 0
    for (var i = 0; i < filteredData.length; i++) {
        national_net_cat += Number(filteredData[i].outcome_feline) - Number(filteredData[i].intake_feline)
    }

    if (national_net_dog > 0) {
        document.getElementById("KPI-dog").style.color = "green";
        document.getElementById("KPI-dog").innerHTML = "&darr; "+ format(Math.abs(national_net_dog))
    }
    else{
        document.getElementById("KPI-dog").style.color = "red";
        document.getElementById("KPI-dog").innerHTML = "&uarr; " + format(Math.abs(national_net_dog))
    }

    if (national_net_cat > 0) {
        document.getElementById("KPI-cat").style.color = "green";
        document.getElementById("KPI-cat").innerHTML = "&darr; " + format(Math.abs(national_net_cat))
    }
    else{
        document.getElementById("KPI-cat").style.color = "red";
        document.getElementById("KPI-cat").innerHTML = "&uarr; " + format(Math.abs(national_net_cat))
    }

})


d3.csv("../data/intake_data.csv").then(function (data) {
    intake_data = data
    var filteredData_intake = intake_data.slice(0,4).filter(function (d) {
        return d.Year === selectedYear;
    });
    createPieChart(filteredData_intake[0], 'intake')
})

d3.csv("../data/outcome_data.csv").then(function (data) {
    outcome_data = data
    var filteredData_outcome = outcome_data.slice(0,4).filter(function (d) {
        return d.Year === selectedYear;
    });
    createPieChart(filteredData_outcome[0], 'outcome')
})

// Event listener for changes to the year selector
yearSelector.addEventListener("change", function (event) {
    var selectedYear = event.target.value;
    var filteredOn = filterSelector.value;
    var filteredData = DATA.filter(function (d) {
        return Number(d.Year) === Number(selectedYear);
    });
    document.getElementById("filterOn").innerHTML = filteredOn

    if (filteredOn === "All") {
        var filteredData_intake = intake_data.slice(0,4).filter(function (d) {
            return d.Year === selectedYear;
        });
        drawChoMap(filteredData);
        var filteredData_outcome = outcome_data.slice(0,4).filter(function (d) {
            return d.Year === selectedYear;
        });
        createPieChart(filteredData_outcome[0], 'outcome')
        createPieChart(filteredData_intake[0], 'intake')

    }
    else if (filteredOn === "Cats") {
        const cat_data =  structuredClone(filteredData)
        cat_data.map(function (d) {
            d.net_outcome = Number(d.outcome_feline) - Number(d.intake_feline);
            d.total_outcome = Number(d.outcome_feline);
            d.total_intake = Number(d.intake_feline);
        })
        drawChoMap(cat_data)
    }
    else if (filteredOn === "Dogs") {
        const dog_data = structuredClone(filteredData)
        dog_data.map(function (d) {
            d.net_outcome = Number(d.outcome_canine) - Number(d.intake_canine);
            d.total_outcome = Number(d.outcome_canine);
            d.total_intake = Number(d.intake_canine);
        })
        drawChoMap(dog_data)
    }

    var national_net = 0
    for (var i = 0; i < filteredData.length; i++) {
        national_net += Number(filteredData[i].net_outcome)
    }
    document.getElementById("KPI").innerHTML = format(national_net)

    var national_net_dog = 0
    for (var i = 0; i < filteredData.length; i++) {
        national_net_dog += Number(filteredData[i].outcome_canine) - Number(filteredData[i].intake_canine)
    }

    var national_net_cat = 0
    for (var i = 0; i < filteredData.length; i++) {
        national_net_cat += Number(filteredData[i].outcome_feline) - Number(filteredData[i].intake_feline)
    }

    if (national_net > 0) {
        document.getElementById("KPI").style.color = "green";
        document.getElementById("KPI").innerHTML = '&darr; ' + format(Math.abs(national_net))
    }
    else{
        document.getElementById("KPI").style.color = "red";
        document.getElementById("KPI").innerHTML = '&uarr; ' + format(Math.abs(national_net))
    }

    document.getElementById("KPI-dog").innerHTML = format(Math.abs(national_net_dog))
    document.getElementById("KPI-cat").innerHTML = format(Math.abs(national_net_cat))

    if (national_net_dog > 0) {
        document.getElementById("KPI-dog").style.color = "green";
        document.getElementById("KPI-dog").innerHTML = "&darr; "+ format(Math.abs(national_net_dog))
    }
    else{
        document.getElementById("KPI-dog").style.color = "red";
        document.getElementById("KPI-dog").innerHTML = "&uarr; " + format(Math.abs(national_net_dog))
    }

    if (national_net_cat > 0) {
        document.getElementById("KPI-cat").style.color = "green";
        document.getElementById("KPI-cat").innerHTML = "&darr; " + format(Math.abs(national_net_cat))
    }
    else{
        document.getElementById("KPI-cat").style.color = "red";
        document.getElementById("KPI-cat").innerHTML = "&uarr; " + format(Math.abs(national_net_cat))
    }

});


filterSelector.addEventListener("change", function (event) {
    var selectedYear = yearSelector.value;
    var filteredOn = event.target.value;
    document.getElementById('state1').innerHTML = 'National'
    document.getElementById('filterOn').innerHTML = filteredOn
    var filteredData = DATA.filter(function (d) {
        return Number(d.Year) === Number(selectedYear);
    });
    document.getElementById("filterOn").innerHTML = filteredOn
    if (filteredOn === "All") {
        drawChoMap(filteredData);
        var filteredData_intake = intake_data.slice(0,4).filter(function (d) {
            return d.Year === selectedYear;
        });
        drawChoMap(filteredData);
        var filteredData_outcome = outcome_data.slice(0,4).filter(function (d) {
            return d.Year === selectedYear;
        });
        createPieChart(filteredData_outcome[0], 'outcome')
        createPieChart(filteredData_intake[0], 'intake')
    }
    else if (filteredOn === "Cats") {
        var cat_data = structuredClone(filteredData)
        cat_data.map(function (d) {
            d.net_outcome = Number(d.outcome_feline) - Number(d.intake_feline);
            d.total_outcome = Number(d.outcome_feline);
            d.total_intake = Number(d.intake_feline);
        })
        var filteredData_intake = intake_data.slice(4,8).filter(function (d) {
            return d.Year === selectedYear;
        });
        var filteredData_outcome = outcome_data.slice(4,8).filter(function (d) {
            return d.Year === selectedYear;
        });
        createPieChart(filteredData_outcome[0], 'outcome')
        createPieChart(filteredData_intake[0], 'intake')

        drawChoMap(cat_data)
    }
    else if (filteredOn === "Dogs") {
        var dog_data = structuredClone(filteredData)
        dog_data.map(function (d) {
            d.net_outcome = Number(d.outcome_canine) - Number(d.intake_canine);
            d.total_outcome = Number(d.outcome_canine);
            d.total_intake = Number(d.intake_canine);
        })
        var filteredData_intake = intake_data.slice(209,213).filter(function (d) {
            return d.Year === selectedYear;
        });
        var filteredData_outcome = outcome_data.slice(209,213).filter(function (d) {
            return d.Year === selectedYear;
        });
        createPieChart(filteredData_outcome[0], 'outcome')
        createPieChart(filteredData_intake[0], 'intake')

        drawChoMap(dog_data)
    }
    document.getElementById("filterOn").innerHTML = filteredOn
});

function drawChoMap(filteredData) {
    d3.json("../data/us-states.json").then(function (worldData) {

        // Select the container element
        var svgContainer = d3.select("#choMap");
        svgContainer.selectAll("*").remove();
        // Set the width and height of the SVG container
        var width = document.getElementById("cho-map-div").clientWidth;
        var height = svgContainer.node().getBoundingClientRect().height;
        var margin = { top: 10, right: 10, bottom: 30, left: 10 };

        // Create an SVG element within the container
        var svg = svgContainer.append("svg")
            .attr("width", width - margin.left - margin.right)
            .attr("height", height- margin.top - margin.bottom);

        // Define a projection for the map (e.g., Mercator projection)
        var projection = d3.geoAlbersUsa()
            .translate([width / 2, height / 2 - 20])    // translate to center of screen
            .scale([750]);          // scale things down so see entire US

        // Create a path generator
        var path = d3.geoPath().projection(projection);

        // Append map data with colors
        svg.selectAll("path")
            .data(worldData.features)
            .enter().append("path")
            .attr("d", path)
            .attr("stroke", "black") // set the stroke color
            .attr("stroke-width", "0.5") // set the stroke width
            .style("fill", function (d) {
                var stateName = d.properties.name;
                var stateData = filteredData.find(item => item.State === stateName);
                if (stateData) {
                    return colorScale(Number(stateData.net_outcome));
                }
                return "gray";
            })
            .on("mouseover", function (event, d) {
                var stateName = d.properties.name;
                var stateData = filteredData.find(item => item.State === stateName);
                if (stateData) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0.9);
                    var change = stateData.net_outcome>0? 'Decrease':'Increase'
                    tooltip.html(stateName + "<br/>" + "Anual" + ' ' + change + ': ' + format(stateData.net_outcome) + "<br/>" + "Total Intake: " + format(stateData.total_intake) + "<br/>" + "Total Outcome: " + format(stateData.total_outcome))
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                    
                }
            })
            .on("mouseout", function () {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", function (event, d) {
                if (d3.select(this).style("stroke-width") === "5") {
                    d3.select(this)
                        .style("stroke-width", "0.5")
                        .style("stroke", "black")
                        .style("opacity", 1);
                    
                    svg.selectAll("text").remove();
                    
                    var selectedYear = yearSelector.value;
                    var filteredOn = filterSelector.value;
                    document.getElementById("state1").innerText = 'National'
                    if (filteredOn === "All") {
                        var filteredData_intake = intake_data.slice(0,4).filter(function (d) {
                            return d.Year === selectedYear;
                        });
                        var filteredData_outcome = outcome_data.slice(0,4).filter(function (d) {
                            return d.Year === selectedYear;
                        });
                        
                        createPieChart(filteredData_outcome[0], 'outcome')
                        createPieChart(filteredData_intake[0], 'intake')
                    }
                    else if (filteredOn === "Cats") {
                        var filteredData_intake = intake_data.slice(4,8).filter(function (d) {
                            return d.Year === selectedYear;
                        });
                        var filteredData_outcome = outcome_data.slice(4,8).filter(function (d) {
                            return d.Year === selectedYear;
                        });
                        createPieChart(filteredData_outcome[0], 'outcome')
                        createPieChart(filteredData_intake[0], 'intake')
                    }
                    else if (filteredOn === "Dogs") {
                        var filteredData_intake = intake_data.slice(209,213).filter(function (d) {
                            return d.Year === selectedYear;
                        });
                        var filteredData_outcome = outcome_data.slice(209,213).filter(function (d) {
                            return d.Year === selectedYear;
                        });
                        createPieChart(filteredData_outcome[0], 'outcome')
                        createPieChart(filteredData_intake[0], 'intake')
                    }
                } else {
                    
                    svg.selectAll("text").remove();
                    svg.selectAll("path")
                        .style("stroke-width", "0.5")
                        .style("stroke", "black")
                        .style("opacity", 1);
                    d3.select(this)
                        .style("stroke-width", "5")
                        .style("stroke", "black")
                        .style("opacity", 1);

                    // find the selected state
                    var stateName = d.properties.name;
                    var stateData = filteredData.find(item => item.State === stateName);
                    document.getElementById("state1").innerText = stateName

                    var selectedYear = yearSelector.value;
                    var filterOn = filterSelector.value;
                    var filteredData_intake = intake_data.filter(function (d) {
                            return d.Year === selectedYear && d.State === stateName;
                    });
                    
                    var filteredData_outcome = outcome_data.filter(function (d) {
                            return d.Year === selectedYear && d.State === stateName;
                    });

                    if (filterOn === "Cats") {
                        createPieChart(filteredData_intake[0], 'intake')
                        createPieChart(filteredData_outcome[0], 'outcome')
                    }
                    else if (filterOn === "Dogs") {
                        createPieChart(filteredData_outcome[1], 'outcome')
                        createPieChart(filteredData_intake[1], 'intake')
                    }
                    else if (filterOn === "All") {
                        var outcome_all_data = structuredClone(filteredData_outcome[0])
                        var intake_all_data = structuredClone(filteredData_intake[0])

                        outcome_all_data['Adoption Total'] = Number(outcome_all_data['Adoption Total']) + Number(filteredData_outcome[1]['Adoption Total'])
                        outcome_all_data['Returned To Owner Total'] = Number(outcome_all_data['Returned To Owner Total']) + Number(filteredData_outcome[1]['Returned To Owner Total'])
                        outcome_all_data['Transferred Out Total'] = Number(outcome_all_data['Transferred Out Total']) + Number(filteredData_outcome[1]['Transferred Out Total'])
                        outcome_all_data['Returned To Field Total'] = Number(outcome_all_data['Returned To Field Total']) + Number(filteredData_outcome[1]['Returned To Field Total'])
                        outcome_all_data['Other Live Outcome Total'] = Number(outcome_all_data['Other Live Outcome Total']) + Number(filteredData_outcome[1]['Other Live Outcome Total'])
                        outcome_all_data['Others'] = Number(outcome_all_data['Others']) + Number(filteredData_outcome[1]['Others'])

                        intake_all_data['Relinquished By Owner Total'] = Number(intake_all_data['Relinquished By Owner Total']) + Number(filteredData_intake[1]['Relinquished By Owner Total'])
                        intake_all_data['Stray At Large Total'] = Number(intake_all_data['Stray At Large Total']) + Number(filteredData_intake[1]['Stray At Large Total'])
                        intake_all_data['Transferred In Total'] = Number(intake_all_data['Transferred In Total']) + Number(filteredData_intake[1]['Transferred In Total'])
                        intake_all_data['Owner Intended Euthanasia Total'] = Number(intake_all_data['Owner Intended Euthanasia Total']) + Number(filteredData_intake[1]['Owner Intended Euthanasia Total'])
                        intake_all_data['Other Intakes Total'] = Number(intake_all_data['Other Intakes Total']) + Number(filteredData_intake[1]['Other Intakes Total'])

                        createPieChart(outcome_all_data, 'outcome')
                        createPieChart(intake_all_data, 'intake')
                    }
                }
            });

        // Create a legend
        var legendWidth = 300;
        var legendHeight = height;
        var legendSvg = svgContainer.append("svg")
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .attr("class", "legend");

        // Create a linear gradient for the legend
        var defs = legendSvg.append("defs")
        
        var linearGradient = defs.append("linearGradient")
            .attr("id", "legendGradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "50%")
            .attr("y2", "0%");

        // Add color stops to the gradient based on your color scale
        linearGradient.selectAll("stop")
            .data(colorScale.range())
            .enter().append("stop")
            .attr("offset", function (d, i) {
                return i / (colorScale.range().length - 1);
            })
            .attr("stop-color", function (d) {
                return d;
            });

        // Create a rectangle filled with the gradient as the legend
        legendSvg.append("rect")
            .attr("width", legendWidth)
            .attr("height", 20)
            .style("fill", "url(#legendGradient)")
            .attr("transform", "translate(" + 10 + "," + 410 + ")");

        legendSvg.append("text")
            .attr("x", 10)
            .attr("y", 450)
            .text("Annual Decrease")
            .style("fill", "black");

        // Add text ticks to the legend based on color scale domain
        var tickText = legendSvg.selectAll(".tick")
            .data(colorScale.domain())
            .enter().append("g")
            .attr("class", "tick")
            .attr("transform", function (d) {
                return "translate(" + 10 + "," + 410 + ")";
            });

        // Add text elements completely outside the legend
        tickText.append("text")
            .text(function (d) {
                return d3.format(",.2~s")(d);

            })
            .attr("x", function (d, i) {
                if (i === 1) {
                    return -100;
                }
                else{
                    return i*(legendWidth/(colorScale.domain().length - 1) - 5);
                }
            
            })
            .attr("y", 15)
            .style("text-anchor", function (d, i) {
                return i === colorScale.domain().length - 1 ? "end" : "start";
            })
            .style('fill', 'white');
    });
}

function createPieChart(data, id='intake') {
    if (id === 'intake') {
        div_id = 'chart2-div'
        plot_id = 'pie_chart1'
        var total = Number(data['Relinquished By Owner Total']) + Number(data['Stray At Large Total']) + Number(data['Transferred In Total']) + Number(data['Owner Intended Euthanasia Total']) + Number(data['Other Intakes Total'])
        // reshape to long format
        data = [
            { name: 'Relinquished By Owner', value: Number(data['Relinquished By Owner Total']) },
            { name: 'Stray At Large', value: Number(data['Stray At Large Total']) },
            { name: 'Transferred In', value: Number(data['Transferred In Total']) },
            { name: 'Owner Intended Euthanasia', value: Number(data['Owner Intended Euthanasia Total']) },
            { name: 'Other Intake', value: Number(data['Other Intakes Total']) }
        ]
    }
    else {
        div_id = 'chart3-div'
        plot_id = 'pie_chart2'
        
        var total = Number(data['Adoption Total']) + Number(data['Returned To Owner Total']) + Number(data['Transferred Out Total']) + Number(data['Returned To Field Total']) + Number(data['Other Live Outcome Total']) + Number(data['Others'])
        // reshape to long format
        data = [
            { name: 'Adopted', value: Number(data['Adoption Total']) },
            { name: 'Returned To Owner', value: Number(data['Returned To Owner Total']) },
            { name: 'Transferred Out', value: Number(data['Transferred Out Total']) },
            { name: 'Returned To Field', value: Number(data['Returned To Field Total']) },
            { name: 'Other Live Outcome', value: Number(data['Other Live Outcome Total']) },
            { name: 'Died Outcome', value: Number(data['Others']) }
        ]
    }
    var width = document.getElementById(div_id).clientWidth;
    var height = 600;
    const legendRectSize = 15;
    const legendSpacing = 4;
    var margin = { top: 10, right: 20, bottom: 120, left: 20 };
    var width = width - margin.left - margin.right;
    var height = height - margin.top - margin.bottom;

    const radius = Math.min(width, height) / 2.5;

    if (id === 'intake') {
        var color = d3.scaleOrdinal(d3.schemeCategory10);
    }
    else {
        var color = d3.scaleOrdinal(d3.schemePaired );
    }

    //clear the pie chart
    document.getElementById(plot_id).innerHTML = "";

    const svg = d3.select("#" + plot_id)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2.5+ ")");

    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    const data_ready = pie(Object.values(data));

    const arc = d3.arc()
        .innerRadius(radius/1.8)
        .outerRadius(radius);

    svg.append('text')
        .attr('class', id + '-donut-label')
        .attr('text-anchor', 'middle') // Center the text
        .style('font-size', 16) // Adjust font size
        .attr('dy', 0)
        .selectAll('tspan')
        .data(['Total:', d3.format('~s')(total)]) // Array with two lines of text
        .enter()
        .append('tspan')
        .text(d => d)
        .attr('x', 0)
        .attr('dy', (d, i) => i * 20); 

    const path = svg.selectAll('path')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (_, i) => color(data[i].name))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        .on("mouseover", function (event, d) {
        // Enlarge the path and display percentage
        d3.select(this)
            .transition()
            .duration(200)
            .attr("d", d3.arc().innerRadius(radius / 1.8).outerRadius(radius * 1.1)) // Enlarge
            .style("opacity", 1); // Make it more visible

        var percentage = d.data.value / total * 100;
        
        svg.select('.'+ id + '-donut-label').remove();

        svg.append('text')
            .attr('class', id + '-donut-label')
            .attr('text-anchor', 'middle') // Center the text
            .style('font-size', 16) // Adjust font size
            .attr('dy', 0)
            .selectAll('tspan')
            .data(['Percentage:', d3.format(",.2~f")(percentage) + '%']) // Array with two lines of text
            .enter()
            .append('tspan')
            .text(d => d)
            .attr('x', 0)
            .attr('dy', (d, i) => i * 20)
    })
    .on("mouseout", function () {
        svg.select('.'+ id + '-donut-label').remove();

        svg.append('text')
            .attr('class', id + '-donut-label')
            .attr('text-anchor', 'middle') // Center the text
            .style('font-size', 16) // Adjust font size
            .attr('dy', 0)
            .selectAll('tspan')
            .data(['Total:', d3.format('~s')(total)]) // Array with two lines of text
            .enter()
            .append('tspan')
            .text(d => d)
            .attr('x', 0)
            .attr('dy', (d, i) => i * 20)

        // Return the path to normal and remove the percentage label
        d3.select(this)
            .transition()
            .duration(200)
            .attr("d", arc)
            .style("opacity", 0.7);

    });

    // Adding legend
    const legend = svg.selectAll('.legend')
        .data(data.map(d => d.name))
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => {
            const legWidth = 250;
            const legHeight = 18;
            const colNum = 1;
            const col = i % colNum;
            const row = Math.floor(i / colNum);
            const horz = col * legWidth - width / 2 + 50;
            const vert = row * legHeight + height / 2 - 80;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', (_, i) => color(data[i].name))
        .style('stroke', color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(d => d)
        .style('font-size', 15);
}