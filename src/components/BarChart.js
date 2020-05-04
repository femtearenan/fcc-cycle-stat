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
            const originalData = this.props.cycleData;
            const data = originalData.map(d => {
                return {
                    name: d.Name,
                    year: new Date(d.Year, 0, 1, 0, 0, 0),
                    seconds: d.Seconds,
                    minutes: new Date(1970, 0, 1, 0, (Math.floor(d.Seconds / 60)), d.Seconds % 60),
                    time: d.Time,
                    doping: d.doping
                }
            })
            console.log(originalData);
            const height = 400;
            const width = 800;
            const padding = 40;
            const barWidth = 5;

            const svg = d3.select(`#chart-${this.props.id}`)
                .append("svg")
                .attr("id", () => "scatterplot-" + this.props.id)
                .attr("class", () => "barchart")
                .attr("width", width)
                .attr("height", height);


            const minYear = d3.min( data, (d) => (d.year) );
            const xScale = d3.scaleTime()
            .domain([new Date(minYear.getFullYear() - 1, 1), d3.max(data, (d) => (d.year)) ])
            .range([padding, width - padding]);

            
            const yScale = d3.scaleTime()
                    .domain([d3.min(data, (d) => d.minutes), d3.max(data, (d) => d.minutes)])
                    .range([padding, height - padding]);

            let rectId = 0;

            let tooltip = d3.select(".barchart-container").append("div")
                .attr("id", "tooltip")
                .style("opacity", 0);

            let overlay = d3.select('.visHolder').append('div')
                .attr('class', 'overlay')
                .style('opacity', 0);

            //height - yScale(d.runs.length)
            svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("id", () => "rect-" + rectId++ )
                .attr("cx", (d, i) => xScale(d.year))
                .attr("cy", (d, i) => height - (height - yScale(d.minutes)))
                .attr("r", barWidth)
                .attr("data-xvalue", (d) => d.year)
                .attr("data-yvalue", (d) => d.minutes)
                .attr("class", "dot")
                .on("mouseover", (d, i) => {
                    tooltip.html('<br>' + d.name + " " + d.year.getFullYear() + 
                                '<br>Time: ' + d.time)
                        .attr('data-year', d.year)
                        .style('left', (i * barWidth) + 30 + 'px')
                        .style('top', height - 100 + 'px')
                        .style('opacity', '1')
                        .style('transform', 'translateX(60px)');
                })
                .on("mouseout", () => {
                    tooltip.style('opacity', '0');
                });
                

            svg.selectAll("text.bar-text")
                .data(data)
                .enter()
                .append("text")
                .text((d) =>  (d.name))
                .attr("class", "bar-text")
                .attr("x", (d, i) => i * 75)
                .attr("y", (d) => -10);
            
            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

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