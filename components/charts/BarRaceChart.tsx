"use client"

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { barRaceData } from '@/lib/sample-data';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function BarRaceChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const animationRef = useRef<number>();

  const updateChart = (step: number) => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svg.node()?.parentElement?.clientWidth ?? 800;
    const height = svg.node()?.parentElement?.clientHeight ?? 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const data = barRaceData[step].sort((a, b) => b.value - a.value);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) ?? 0])
      .range([0, innerWidth]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, innerHeight])
      .padding(0.1);

    const g = svg.select<SVGGElement>('.chart-group');

    const bars = g.selectAll<SVGRectElement, typeof data[0]>('rect')
      .data(data, d => d.category);

    bars.enter()
      .append('rect')
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('y', d => y(d.category) ?? 0)
      .attr('fill', 'hsl(var(--primary))')
      .attr('opacity', 0.8)
      .merge(bars)
      .transition()
      .duration(500)
      .attr('width', d => x(d.value))
      .attr('y', d => y(d.category) ?? 0);

    bars.exit().remove();

    const labels = g.selectAll<SVGTextElement, typeof data[0]>('text')
      .data(data, d => d.category);

    labels.enter()
      .append('text')
      .attr('x', d => x(d.value) + 5)
      .attr('y', d => (y(d.category) ?? 0) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('fill', 'currentColor')
      .merge(labels)
      .transition()
      .duration(500)
      .attr('x', d => x(d.value) + 5)
      .text(d => d.category + ': ' + d.value.toFixed(1));

    labels.exit().remove();

    g.select('.x-axis')
      .transition()
      .duration(500)
      // @ts-ignore
      .call(d3.axisBottom(x));

    g.select('.y-axis')
      .transition()
      .duration(500)
      // @ts-ignore
      .call(d3.axisLeft(y));
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svg.node()?.parentElement?.clientWidth ?? 800;
    const height = svg.node()?.parentElement?.clientHeight ?? 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 100 };

    svg.selectAll('*').remove();

    svg.append('g')
      .attr('class', 'chart-group')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    updateChart(currentStep);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setCurrentStep(prev => {
          const next = (prev + 1) % barRaceData.length;
          updateChart(next);
          return next;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    updateChart(0);
  };

  return (
    <div className="chart-container">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={reset}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <svg
        ref={svgRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}