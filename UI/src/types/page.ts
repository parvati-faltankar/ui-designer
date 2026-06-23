export interface CanvasNode {
  id: string; // Unique ID (uuid)
  type: string; // e.g. 'Box', 'Typography', 'Button', 'Card', 'Grid'
  props: Record<string, any>; // Component props (e.g. { variant: 'contained', children: 'Hello' })
  children?: CanvasNode[]; // For nested components
}

export interface Page {
  _id: string;
  projectId: string;
  name: string;
  route: string;
  layoutTree: CanvasNode[];
  createdAt: string;
  updatedAt: string;
}
