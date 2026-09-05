// src/components/ui/component.tsx

import React from 'react';
import { DefaultNode, Graph } from '@visx/network';

interface CustomNodeData {
  id: string;
  x: number;
  y: number;
  color?: string;
}

interface CustomLinkData {
  source: CustomNodeData;
  target: CustomNodeData;
  dashed?: boolean;
}

interface GraphData {
  nodes: CustomNodeData[];
  links: CustomLinkData[];
}

const defaultNodes: CustomNodeData[] = [
  { id: 'node-1', x: 50, y: 20 },
  { id: 'node-2', x: 200, y: 250 },
  { id: 'node-3', x: 300, y: 40, color: '#26deb0' },
];

const defaultLinks: CustomLinkData[] = [
  { source: defaultNodes[0], target: defaultNodes[1] },
  { source: defaultNodes[1], target: defaultNodes[2] },
  { source: defaultNodes[2], target: defaultNodes[0], dashed: true },
];

const defaultGraphData: GraphData = {
  nodes: defaultNodes,
  links: defaultLinks,
};

const defaultBackgroundColor = '#272b4d';

export interface ComponentProps {
  width: number;
  height: number;
  graphData?: GraphData;
  backgroundColor?: string;
  offsetTop?: number;
  offsetLeft?: number;
}

const CustomNodeComponent: React.FC<{ node: CustomNodeData }> = ({ node }) => {
  return node.color ? <DefaultNode fill={node.color} /> : <DefaultNode />;
};

const CustomLinkComponent: React.FC<{ link: CustomLinkData }> = ({ link }) => {
  return (
    <line
      x1={link.source.x}
      y1={link.source.y}
      x2={link.target.x}
      y2={link.target.y}
      strokeWidth={2}
      stroke="#999"
      strokeOpacity={0.6}
      strokeDasharray={link.dashed ? '8,4' : undefined}
    />
  );
};


export const Component: React.FC<ComponentProps> = ({
  width,
  height,
  graphData = defaultGraphData,
  backgroundColor = defaultBackgroundColor,
  offsetTop = 0,
  offsetLeft = 0, 
}) => {
  if (width < 10 || height < 10) return null;

  return (
    <svg width={width} height={height}>
      <rect width={width} height={height} rx={14} fill={backgroundColor} />
      <Graph<CustomLinkData, CustomNodeData>
        graph={graphData}
        top={offsetTop}
        left={offsetLeft}
        nodeComponent={CustomNodeComponent}
        linkComponent={CustomLinkComponent}
      />
    </svg>
  );
};