import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import {
  WorkflowCanvasNode,
  WorkflowCanvasEdge,
} from '../../types';
import { getNodeIconComponent } from './nodeLibraryData';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Trash2,
  Copy,
  Plus,
  Zap,
  Map,
} from 'lucide-react';

interface WorkflowCanvasProps {
  nodes: WorkflowCanvasNode[];
  edges: WorkflowCanvasEdge[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onUpdateNodes: (nodes: WorkflowCanvasNode[]) => void;
  onUpdateEdges: (edges: WorkflowCanvasEdge[]) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onAddTriggerPrompt?: () => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  onFitView: () => void;
}

export function WorkflowCanvas({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  onUpdateNodes,
  onUpdateEdges,
  onDeleteNode,
  onDuplicateNode,
  onAddTriggerPrompt,
  zoomLevel,
  onZoomChange,
  onFitView,
}: WorkflowCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);
  const [connectingMousePos, setConnectingMousePos] = useState<{ x: number; y: number } | null>(null);
  const [showMinimap, setShowMinimap] = useState(true);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        onDeleteNode(selectedNodeId);
      } else if (e.key === 'Escape') {
        onSelectNode(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, onDeleteNode, onSelectNode]);

  const categoryStyles: Record<
    WorkflowCanvasNode['category'],
    { border: string; headerBg: string; badge: string; iconColor: string }
  > = {
    Triggers: {
      border: 'border-emerald-500/40 hover:border-emerald-500',
      headerBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      badge: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
      iconColor: 'text-emerald-500',
    },
    AI: {
      border: 'border-sky-500/40 hover:border-sky-500',
      headerBg: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
      badge: 'bg-sky-500/20 text-sky-700 dark:text-sky-300',
      iconColor: 'text-sky-500',
    },
    Logic: {
      border: 'border-amber-500/40 hover:border-amber-500',
      headerBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
      badge: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
      iconColor: 'text-amber-500',
    },
    Actions: {
      border: 'border-purple-500/40 hover:border-purple-500',
      headerBg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
      badge: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
      iconColor: 'text-purple-500',
    },
    Utility: {
      border: 'border-neutral-500/40 hover:border-neutral-500',
      headerBg: 'bg-neutral-500/10 text-neutral-700 dark:text-neutral-300',
      badge: 'bg-neutral-500/20 text-neutral-700 dark:text-neutral-300',
      iconColor: 'text-neutral-500',
    },
  };

  const handleNodeMouseDown = (e: MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    const node = nodes.find((n) => n.id === nodeId);
    if (!node || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
    const mouseY = (e.clientY - rect.top - panOffset.y) / zoomLevel;
    setDraggingNodeId(nodeId);
    setDragOffset({
      x: mouseX - node.x,
      y: mouseY - node.y,
    });
    onSelectNode(nodeId);
  };

  const handleCanvasMouseDown = (e: MouseEvent) => {
    if (e.button === 1 || e.button === 0) {
      setIsPanning(true);
      setPanStart({
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y,
      });
      onSelectNode(null);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }
    if (draggingNodeId) {
      const mouseX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
      const mouseY = (e.clientY - rect.top - panOffset.y) / zoomLevel;
      const newX = Math.round(mouseX - dragOffset.x);
      const newY = Math.round(mouseY - dragOffset.y);
      onUpdateNodes(
        nodes.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
      );
      return;
    }
    if (connectingSourceId) {
      const mouseX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
      const mouseY = (e.clientY - rect.top - panOffset.y) / zoomLevel;
      setConnectingMousePos({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
    if (connectingSourceId) {
      setConnectingSourceId(null);
      setConnectingMousePos(null);
    }
  };

  const handleOutputPortMouseDown = (e: MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setConnectingSourceId(nodeId);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setConnectingMousePos({
      x: (e.clientX - rect.left - panOffset.x) / zoomLevel,
      y: (e.clientY - rect.top - panOffset.y) / zoomLevel,
    });
  };

  const handleInputPortMouseUp = (e: MouseEvent, targetNodeId: string) => {
    e.stopPropagation();
    if (connectingSourceId && connectingSourceId !== targetNodeId) {
      const edgeExists = edges.some(
        (ed) => ed.source === connectingSourceId && ed.target === targetNodeId
      );
      if (!edgeExists) {
        const newEdge: WorkflowCanvasEdge = {
          id: `edge_${connectingSourceId}_${targetNodeId}`,
          source: connectingSourceId,
          target: targetNodeId,
        };
        onUpdateEdges([...edges, newEdge]);
      }
    }
    setConnectingSourceId(null);
    setConnectingMousePos(null);
  };

  const handleDeleteEdge = (e: MouseEvent, edgeId: string) => {
    e.stopPropagation();
    onUpdateEdges(edges.filter((ed) => ed.id !== edgeId));
  };

  const NODE_WIDTH = 250;
  const NODE_HEIGHT = 110;

  return (
    <div
      ref={containerRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full h-full overflow-hidden bg-neutral-100/70 dark:bg-neutral-950 text-neutral-400/40 dark:text-neutral-700/60 select-none cursor-crosshair"
      style={{
        backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
        backgroundSize: `${20 * zoomLevel}px ${20 * zoomLevel}px`,
        backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
      }}
    >
      {/* Zoom / Viewport HUD Controls */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 shadow-md backdrop-blur-xs text-xs">
        <button
          onClick={() => onZoomChange(Math.max(0.4, zoomLevel - 0.1))}
          className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="font-mono text-[11px] px-1 text-neutral-600 dark:text-neutral-300 font-semibold min-w-[42px] text-center">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={() => onZoomChange(Math.min(1.8, zoomLevel + 0.1))}
          className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-4 bg-neutral-200 dark:border-neutral-800 mx-0.5" />
        <button
          onClick={onFitView}
          className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Fit to Screen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            onZoomChange(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title="Reset View 100%"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-4 bg-neutral-200 dark:border-neutral-800 mx-0.5" />
        <button
          onClick={() => setShowMinimap(!showMinimap)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            showMinimap
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
          title={showMinimap ? 'Hide Minimap' : 'Show Minimap'}
        >
          <Map className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Empty State Banner if no nodes */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
          <div className="p-8 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm max-w-md text-center space-y-3 pointer-events-auto shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Start building your automation
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Add an initial Trigger node from the library on the left or click below to get started.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onAddTriggerPrompt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Trigger</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SVG Canvas for Edges */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: '0 0',
        }}
      >
        <defs>
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <marker
            id="edgeArrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
          </marker>
        </defs>

        {edges.map((edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          const startX = sourceNode.x + NODE_WIDTH;
          const startY = sourceNode.y + NODE_HEIGHT / 2;
          const endX = targetNode.x;
          const endY = targetNode.y + NODE_HEIGHT / 2;

          const deltaX = Math.abs(endX - startX) * 0.5;
          const cp1X = startX + deltaX;
          const cp1Y = startY;
          const cp2X = endX - deltaX;
          const cp2Y = endY;
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;

          return (
            <g key={edge.id} className="pointer-events-auto group">
              <path
                d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
                fill="none"
                stroke="url(#edgeGradient)"
                strokeWidth="2.5"
                strokeDasharray="5,5"
                markerEnd="url(#edgeArrow)"
              />
              <path
                d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
                fill="none"
                stroke="transparent"
                strokeWidth="16"
                className="cursor-pointer"
                onClick={(e) => handleDeleteEdge(e, edge.id)}
              />
              <circle
                cx={midX}
                cy={midY}
                r="9"
                fill="#ffffff"
                stroke="#e11d48"
                strokeWidth="1.5"
                className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={(e) => handleDeleteEdge(e, edge.id)}
              />
              <text
                x={midX}
                y={midY + 3.5}
                textAnchor="middle"
                fontSize="10"
                fill="#e11d48"
                fontWeight="bold"
                className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none font-mono"
              >
                ✕
              </text>
            </g>
          );
        })}

        {connectingSourceId && connectingMousePos && (() => {
          const sourceNode = nodes.find((n) => n.id === connectingSourceId);
          if (!sourceNode) return null;
          const startX = sourceNode.x + NODE_WIDTH;
          const startY = sourceNode.y + NODE_HEIGHT / 2;
          const endX = connectingMousePos.x;
          const endY = connectingMousePos.y;
          const deltaX = Math.abs(endX - startX) * 0.5;
          return (
            <path
              d={`M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
          );
        })()}
      </svg>

      {/* Transformed Nodes Container */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: '0 0',
        }}
      >
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const style = categoryStyles[node.category] || categoryStyles.Utility;

          return (
            <div
              key={node.id}
              style={{
                transform: `translate(${node.x}px, ${node.y}px)`,
                width: `${NODE_WIDTH}px`,
              }}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              className={`absolute pointer-events-auto rounded-2xl border-2 bg-white dark:bg-neutral-900 shadow-md hover:shadow-xl transition-shadow cursor-grab active:cursor-grabbing group overflow-visible ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
                  : style.border
              }`}
            >
              {/* Input Connector Port */}
              {node.type !== 'trigger' && (
                <div
                  onMouseUp={(e) => handleInputPortMouseUp(e, node.id)}
                  className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-neutral-900 border-2 border-neutral-400 hover:border-emerald-500 hover:scale-125 transition-transform flex items-center justify-center cursor-pointer z-20 shadow-2xs group/port"
                  title="Connect input here"
                >
                  <div className="w-2 h-2 rounded-full bg-neutral-400 group-hover/port:bg-emerald-500" />
                </div>
              )}

              {/* Node Card Header */}
              <div
                className={`px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between rounded-t-xl ${style.headerBg}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`shrink-0 ${style.iconColor}`}>
                    {getNodeIconComponent(node.icon, 'w-4 h-4')}
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider truncate">
                    {node.category}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateNode(node.id);
                    }}
                    className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
                    title="Duplicate node"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNode(node.id);
                    }}
                    className="p-1 rounded hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                    title="Delete node"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Node Card Content */}
              <div className="p-3 space-y-1">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                  {node.title}
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {node.description}
                </p>
                {node.data?.agentName && node.data?.agentName !== 'Select AI Agent' && (
                  <div className="pt-1 flex items-center gap-1 text-[10px] font-mono text-sky-600 dark:text-sky-400 truncate">
                    <span>Agent: {node.data.agentName}</span>
                  </div>
                )}
                {node.data?.rules && (
                  <div className="pt-1 text-[10px] font-mono text-amber-600 dark:text-amber-400 truncate">
                    {node.data.rules.length} rule{node.data.rules.length > 1 ? 's' : ''} configured
                  </div>
                )}
              </div>

              {/* Output Connector Port */}
              <div
                onMouseDown={(e) => handleOutputPortMouseDown(e, node.id)}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-neutral-900 border-2 border-neutral-400 hover:border-sky-500 hover:scale-125 transition-transform flex items-center justify-center cursor-crosshair z-20 shadow-2xs group/port"
                title="Drag output to connect to another node"
              >
                <div className="w-2 h-2 rounded-full bg-neutral-400 group-hover/port:bg-sky-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Minimap */}
      {showMinimap && nodes.length > 0 && (
        <div className="absolute bottom-4 right-4 z-20 p-2 rounded-xl bg-white/95 dark:bg-neutral-900/95 border border-neutral-200 dark:border-neutral-800 shadow-lg backdrop-blur-xs select-none">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-neutral-100 dark:border-neutral-800 text-[10px] font-mono font-semibold text-neutral-500">
            <span>MINIMAP</span>
            <span className="text-neutral-400">{nodes.length} nodes</span>
          </div>
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const clickY = e.clientY - rect.top;
              const minX = Math.min(-100, ...nodes.map((n) => n.x)) - 100;
              const maxX = Math.max(1400, ...nodes.map((n) => n.x + 300)) + 100;
              const minY = Math.min(-100, ...nodes.map((n) => n.y)) - 100;
              const maxY = Math.max(900, ...nodes.map((n) => n.y + 150)) + 100;
              const worldW = maxX - minX;
              const worldH = maxY - minY;
              const worldX = minX + (clickX / 160) * worldW;
              const worldY = minY + (clickY / 95) * worldH;
              const cW = containerRef.current?.clientWidth || 800;
              const cH = containerRef.current?.clientHeight || 600;
              setPanOffset({
                x: cW / 2 - worldX * zoomLevel,
                y: cH / 2 - worldY * zoomLevel,
              });
            }}
            className="w-[160px] h-[95px] rounded-lg bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 relative overflow-hidden cursor-pointer"
          >
            {/* Render Nodes in Minimap */}
            {(() => {
              const minX = Math.min(-100, ...nodes.map((n) => n.x)) - 100;
              const maxX = Math.max(1400, ...nodes.map((n) => n.x + 300)) + 100;
              const minY = Math.min(-100, ...nodes.map((n) => n.y)) - 100;
              const maxY = Math.max(900, ...nodes.map((n) => n.y + 150)) + 100;
              const worldW = maxX - minX;
              const worldH = maxY - minY;

              const getCategoryColor = (cat: string) => {
                switch (cat) {
                  case 'Triggers':
                    return '#10b981';
                  case 'AI':
                    return '#0ea5e9';
                  case 'Logic':
                    return '#f59e0b';
                  case 'Actions':
                    return '#a855f7';
                  default:
                    return '#737373';
                }
              };

              const cW = containerRef.current?.clientWidth || 800;
              const cH = containerRef.current?.clientHeight || 600;
              const viewLeft = (-panOffset.x / zoomLevel - minX) / worldW * 160;
              const viewTop = (-panOffset.y / zoomLevel - minY) / worldH * 95;
              const viewW = (cW / zoomLevel / worldW) * 160;
              const viewH = (cH / zoomLevel / worldH) * 95;

              return (
                <>
                  {nodes.map((n) => {
                    const nx = ((n.x - minX) / worldW) * 160;
                    const ny = ((n.y - minY) / worldH) * 95;
                    const nw = Math.max(6, (250 / worldW) * 160);
                    const nh = Math.max(4, (110 / worldH) * 95);
                    const isSel = n.id === selectedNodeId;

                    return (
                      <div
                        key={n.id}
                        style={{
                          left: `${nx}px`,
                          top: `${ny}px`,
                          width: `${nw}px`,
                          height: `${nh}px`,
                          backgroundColor: getCategoryColor(n.category),
                        }}
                        className={`absolute rounded-[2px] transition-transform ${
                          isSel ? 'ring-1 ring-white shadow-xs' : 'opacity-80'
                        }`}
                      />
                    );
                  })}
                  {/* Viewport Frame */}
                  <div
                    style={{
                      left: `${Math.max(0, viewLeft)}px`,
                      top: `${Math.max(0, viewTop)}px`,
                      width: `${Math.min(160, viewW)}px`,
                      height: `${Math.min(95, viewH)}px`,
                    }}
                    className="absolute border border-emerald-500 bg-emerald-500/10 pointer-events-none rounded-[2px]"
                  />
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
