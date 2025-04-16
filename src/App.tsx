import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Github, Twitter, Linkedin, Code2, Sparkles, FileCode, Rocket } from 'lucide-react';

function InteractiveBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Clear existing content
    svg.selectAll("*").remove();

    // Create connected nodes effect
    const numNodes = 30;
    const nodes = Array.from({ length: numNodes }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    }));

    // Create lines between nodes
    const lines = svg.append("g")
      .selectAll("line")
      .data([])
      .join("line")
      .style("stroke", "#2a2a2a")
      .style("stroke-width", 1);

    // Add nodes
    const circles = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 3)
      .style("fill", "#4a4a4a");

    // Animation function
    function animate() {
      // Update node positions
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });

      // Update circles
      circles
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      // Draw lines between nearby nodes
      const connections = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            connections.push({
              source: nodes[i],
              target: nodes[j],
              distance: distance
            });
          }
        }
      }

      // Update lines
      lines.data(connections)
        .join("line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
        .style("opacity", d => 1 - (d.distance / 150));

      requestAnimationFrame(animate);
    }

    animate();

    // Cleanup
    return () => {
      svg.selectAll("*").remove();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute top-0 left-0 w-full h-full -z-10"
      style={{ background: 'linear-gradient(to bottom, #000000, #1a1a1a)' }}
    />
  );
}

function App() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <InteractiveBackground />
      
      {/* Navigation */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Code2 className="w-8 h-8" />
          <span className="text-2xl font-bold">Jay</span>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-gray-300"><Twitter className="w-6 h-6" /></a>
          <a href="#" className="hover:text-gray-300"><Linkedin className="w-6 h-6" /></a>
          <a href="#" className="hover:text-gray-300"><Github className="w-6 h-6" /></a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center bg-white/10 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-sm">AI-Powered Development Assistant</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-6">Code Smarter, Build Faster</h1>
          <p className="text-xl text-gray-400 mb-12">
            Your intelligent coding companion for <span className="text-white">web</span> and <span className="text-white">mobile</span> development.
          </p>

          {/* Command Input */}
          <div className="bg-black/50 rounded-lg p-4 mb-12">
            <div className="flex items-center space-x-4 bg-[#1a1a1a] rounded-lg p-4">
              <FileCode className="w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="What would you like to build today?"
                className="bg-transparent w-full focus:outline-none text-lg"
              />
              <Rocket className="w-6 h-6 text-gray-400" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              'Generate React Components',
              'Debug Your Code',
              'Optimize Performance'
            ].map((action) => (
              <button
                key={action}
                className="bg-white/10 hover:bg-white/20 rounded-full px-6 py-2 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>

          <p className="text-gray-400 mb-8">Let Jay assist you in building your next great project</p>
        </div>
      </main>
    </div>
  );
}

export default App;