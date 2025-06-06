import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FiRefreshCw, FiMaximize2, FiMinimize2, FiInfo } from 'react-icons/fi';
import './KnowledgeGraph.css';
import { useParams } from 'react-router-dom';

const KnowledgeGraph = () => {
  const svgRef = useRef(null);
  const width = 800;
  const height = 600;
  const [graphData, setGraphData] = useState(null);
  const workspaceId = useParams().workspaceId;

  const fetchGraphData = async () => {
    try {
      const response = await fetch(`https://api.truexplainer.com/graph/workspaceId?workspaceId=${workspaceId}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch graph data');
      }
      
      const data = await response.json();
      setGraphData(data);
      renderGraph(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  };

  const renderGraph = (data) => {
    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create a group for zoom/pan
    const g = svg.append('g');

    // Add zoom/pan behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.edges).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(80));

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(data.edges)
      .enter().append('line')
      .attr('stroke', '#666')
      .attr('stroke-opacity', 0.8)
      .attr('stroke-width', d => Math.sqrt(d.weight) * 3 + 1)  // Increased thickness
      .attr('stroke-linecap', 'round');  // Smoother line ends

    // Create node groups
    const node = g.append('g')
      .selectAll('.node')
      .data(data.nodes)
      .enter().append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles to nodes
    node.append('circle')
      .attr('r', 35)  // Increased from 10 to 15
      .attr('fill', '#69b3a2');

    // Add labels to nodes
    node.append('text')
      .attr('dx', 40)  // Adjusted for larger nodes
      .attr('dy', '.35em')
      .text(d => d.label.split('\n')[0] + '...')
      .style('font-size', '11px')
      .style('font-weight', '600')  // Made text bolder
      .style('fill', '#222')
      .style('pointer-events', 'none')
      .style('text-shadow', '1px 1px 2px rgba(255,255,255,0.8)');  // Better readability

    // Add tooltips
    node.append('title')
      .text(d => d.label);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };
  useEffect(() => {
    // Fetch graph data from the API

    fetchGraphData();
  }, []);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const refreshGraph = () => {
    setIsLoading(true);
    // Trigger a re-render by resetting the data
    setGraphData(null);
    fetchGraphData();
  };

  return (
    <div className="knowledge-graph-container">
      <div className="graph-header">
        <div className="header-left">
          <h2>Knowledge Graph</h2>
          <div className="graph-stats">
            {graphData && (
              <span>{graphData.nodes.length} nodes • {graphData.edges.length} links</span>
            )}
          </div>
        </div>
        <div className="graph-controls">
          <button 
            className="control-btn refresh-btn" 
            onClick={fetchGraphData}
            title="Refresh Graph"
          >
            <FiRefreshCw className={isLoading ? 'spinning' : ''} />
            <span>Refresh</span>
          </button>
          <button 
            className="control-btn fullscreen-btn" 
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
          </button>
          <button 
            className="control-btn info-btn" 
            title="Graph Information"
          >
            <FiInfo />
          </button>
        </div>
      </div>
      <div className="graph-wrapper">
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading graph data...</p>
          </div>
        )}
        <svg className="w-full h-full z-50" ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
