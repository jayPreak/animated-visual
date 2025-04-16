"use client"

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { timeSeriesData } from '@/lib/sample-data';

export function MultiLineChart() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svg.node()?.parentElement?.clientWidth ?? 800;
    const height = svg.node()?.parentElement?.clientHeight ?? 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(timeSeriesData[0].values, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(timeSeriesData, series => 
        d3.max(series.values, d => d.value)
      ) ?? 0])
      .range([innerHeight, 0]);

    const line = d3.line<{ date: Date; value: number }>()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    const colors = d3.schemeCategory10;

    // Add clip path
    svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight);

    // Add lines
    timeSeriesData.forEach((series, i) => {
      g.append("path")
        .datum(series.values)
        .attr("class", "line")
        .attr("clip-path", "url(#clip)")
        .attr("fill", "none")
        .attr("stroke", colors[i])
        .attr("stroke-width", 2)
        .attr("d", line);
    });

    // Add axes
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 5])
      .extent([[0, 0], [innerWidth, innerHeight]])
      .on("zoom", (event) => {
        const newX = event.transform.rescaleX(x);
        g.selectAll(".line")
          .attr("d", (d: any) => {
            const newLine = d3.line<{ date: Date; value: number }>()
              .x(d => newX(d.date))
              .y(d => y(d.value))
              .curve(d3.curveMonotoneX);
            return newLine(d);
          });
           // @ts-ignore
        g.select(".x-axis").call(d3.axisBottom(newX));
      });

    svg.call(zoom);

  }, []);

  return (
    <div className="chart-container">
      <svg
        ref={svgRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}