import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

class BarChart extends React.Component {
    constructor(props) {
        super(props);
        this.drawChart = this.drawChart.bind(this);
    }

    drawChart() {
        if (this.props.isOK) {
            const gdpData = this.props.GDPData;

            const height = 300;
            const width = 800;
            const padding = 40;
            const barWidth = (width - padding) / gdpData.data.length;

            const svg = d3.select(`#chart-${this.props.id}`)
                .append("svg")
                .attr("id", () => "barchart-" + this.props.id)
                .attr("class", () => "barchart")
                .attr("width", width)
                .attr("height", height);

            console.log(gdpData);


            const xScale = d3.scaleTime()
            .domain([d3.min(gdpData.data, (d) => new Date(d[0])), d3.max(gdpData.data, (d) => new Date(d[0])) ])
            .range([padding, width - padding]);

            // scaleLinear()
            //         .domain([0, d3.max(gdpData.data, (d) => {
            //             console.log(d[0]);
            //             return d[0];
            //         })])
            //         .range([padding, width - padding]);
            const yScale = d3.scaleLinear()
                    .domain([d3.max(gdpData.data, (d) => d[1]), 0])
                    .range([padding, height - padding]);

            let rectId = 0;

            let tooltip = d3.select(".barchart-container").append("div")
                .attr("id", "tooltip")
                .style("opacity", 0);

            let overlay = d3.select('.visHolder').append('div')
                .attr('class', 'overlay')
                .style('opacity', 0);

            //height - yScale(d.runs.length)
            svg.selectAll("rect")
                .data(gdpData.data)
                .enter()
                .append("rect")
                .attr("id", () => "rect-" + rectId++ )
                .attr("x", (d, i) => xScale(new Date(d[0])))
                .attr("y", (d, i) => height - (height - yScale(d[1])))
                .attr("width", barWidth)
                .attr("height", (d, i) => height - yScale(d[1]) - padding)
                .attr("data-date", (d) => d[0])
                .attr("data-gdp", (d) => d[1])
                .attr("class", "bar")
                .on("mouseover", (d, i) => {
                    tooltip.html(d[0] + '<br>' + '$' + d[1].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
                        .attr('data-date', d[0])
                        .style('left', (i * barWidth) + 30 + 'px')
                        .style('top', height - 100 + 'px')
                        .style('opacity', '1')
                        .style('transform', 'translateX(60px)');
                })
                .on("mouseout", () => {
                    tooltip.style('opacity', '0');
                });
                

            svg.selectAll("text.bar-text")
                .data(gdpData)
                .enter()
                .append("text")
                .text((d) =>  (d.name))
                .attr("class", "bar-text")
                .attr("x", (d, i) => i * 75)
                .attr("y", (d) => -10);
            
            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale);

            svg.append("g")
                .attr("transform", "translate(0," + (height - padding) + ")")
                .attr("id", "x-axis")
                .call(xAxis);
            svg.append("g")
                .attr("transform", "translate(" + padding+ ", 0)")
                .attr("id", "y-axis")
                .call(yAxis);

        }

    }

    

    render() {
        if (this.props.isOK) {
            return (
                <div id={"chart-" + this.props.id} className="barchart-container" >
                    <h2>Number of runs on record</h2>
                    {this.drawChart()}
                    <p>Normal runs are classic distance runs. Interval runs are any of hill runs, fartlek or intervals. <br/>(Source: <a href="https://femtearenan.se">femtearenan.se</a>)</p>

                </div>
            )

        } else {
            return (
                <div id={"chart-" + this.props.id} className="barchart-container">
                    <h2>Loading chart data</h2>
                </div>
            );
        }
    }
}

const mapStateToProps = state => ({
    ...state
});

export default connect(mapStateToProps)(BarChart);