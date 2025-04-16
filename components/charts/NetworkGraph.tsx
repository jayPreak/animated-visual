"use client"

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { networkData } from '@/lib/sample-data';

export function NetworkGraph() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svg.node()?.parentElement?.clientWidth ?? 800;
    const height = svg.node()?.parentElement?.clientHeight ?? 400;

    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(networkData.nodes as any)
      .force("link", d3.forceLink(networkData.links).id((d: any) => d.id))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    const g = svg.append("g");

    const link = g.append("g")
      .selectAll("line")
      .data(networkData.links)
      .join("line")
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", d => Math.sqrt(d.value) * 2);

    const node = g.append("g")
      .selectAll("g")
      .data(networkData.nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("circle")
      .attr("r", 10)
      .attr("fill", (d: any) => d3.schemeCategory10[d.group])
      .attr("stroke", "white")
      .attr("stroke-width", 1.5);

    node.append("title")
      .text((d: any) => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    return () => {
      simulation.stop();
    };
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