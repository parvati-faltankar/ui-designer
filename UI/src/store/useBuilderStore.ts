import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { CanvasNode } from '../types/page';
import { Registry } from '../registry';

export interface HoverState {
  overId: string;
  position: 'top' | 'bottom' | 'inside';
}

interface BuilderState {
  nodes: CanvasNode[];
  selectedNodeId: string | null;
  hoverState: HoverState | null;
  isPreviewMode: boolean;
  projectTheme: string;
  
  // Actions
  setNodes: (nodes: CanvasNode[]) => void;
  addNode: (type: string, parentId?: string, index?: number) => void;
  updateNodeProps: (id: string, newProps: Record<string, any>) => void;
  removeNode: (id: string) => void;
  moveNode: (activeId: string, parentId?: string, index?: number) => void;
  setSelectedNodeId: (id: string | null) => void;
  setHoverState: (state: HoverState | null) => void;
  setPreviewMode: (val: boolean) => void;
  setProjectTheme: (theme: string) => void;
  clear: () => void;
}

const canHaveChildren = (type: string) => {
  return Registry[type]?.canHaveChildren || false;
};

const getDefaultPropsForType = (type: string) => {
  return Registry[type]?.defaultProps || {};
};

// --- Tree Helpers ---

// Finds a node in the tree
export const findNode = (nodes: CanvasNode[], id: string): CanvasNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Removes a node from the tree and returns the [newTree, removedNode]
const removeNodeFromTree = (nodes: CanvasNode[], id: string): { tree: CanvasNode[], removed: CanvasNode | null } => {
  let removed: CanvasNode | null = null;

  const filterTree = (list: CanvasNode[]): CanvasNode[] => {
    return list.filter(node => {
      if (node.id === id) {
        removed = node;
        return false;
      }
      return true;
    }).map(node => ({
      ...node,
      children: node.children ? filterTree(node.children) : undefined
    }));
  };

  const tree = filterTree(nodes);
  return { tree, removed };
};

// Inserts a node into the tree at a specific parent and index
const insertNodeIntoTree = (nodes: CanvasNode[], nodeToInsert: CanvasNode, parentId?: string, index?: number): CanvasNode[] => {
  if (!parentId || parentId === 'canvas-root') {
    const newNodes = [...nodes];
    if (typeof index === 'number') {
      newNodes.splice(index, 0, nodeToInsert);
    } else {
      newNodes.push(nodeToInsert);
    }
    return newNodes;
  }

  return nodes.map(node => {
    if (node.id === parentId) {
      const children = node.children ? [...node.children] : [];
      if (typeof index === 'number') {
        children.splice(index, 0, nodeToInsert);
      } else {
        children.push(nodeToInsert);
      }
      return { ...node, children };
    }
    if (node.children) {
      return { ...node, children: insertNodeIntoTree(node.children, nodeToInsert, parentId, index) };
    }
    return node;
  });
};

const updateNodeTree = (nodes: CanvasNode[], id: string, updater: (node: CanvasNode) => CanvasNode): CanvasNode[] => {
  return nodes.map(node => {
    if (node.id === id) return updater(node);
    if (node.children) return { ...node, children: updateNodeTree(node.children, id, updater) };
    return node;
  });
};

export const useBuilderStore = create<BuilderState>((set) => ({
  nodes: [],
  selectedNodeId: null,
  hoverState: null,
  isPreviewMode: false,
  projectTheme: 'enterprise-blue',

  setNodes: (nodes) => set({ nodes }),

  addNode: (type, parentId, index) => set((state) => {
    const newNode: CanvasNode = {
      id: uuidv4(),
      type,
      props: getDefaultPropsForType(type),
      children: canHaveChildren(type) ? [] : undefined,
    };
    return { nodes: insertNodeIntoTree(state.nodes, newNode, parentId, index) };
  }),

  updateNodeProps: (id, newProps) => set((state) => ({
    nodes: updateNodeTree(state.nodes, id, (node) => ({
      ...node,
      props: { ...node.props, ...newProps }
    }))
  })),

  removeNode: (id) => set((state) => {
    const { tree } = removeNodeFromTree(state.nodes, id);
    return { 
      nodes: tree,
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId
    };
  }),

  moveNode: (activeId, parentId, index) => set((state) => {
    // Avoid moving a node into itself or its own children
    const activeNode = findNode(state.nodes, activeId);
    if (!activeNode) return state;

    // Check if parentId is a descendant of activeId
    if (parentId && parentId !== 'canvas-root') {
      let isDescendant = false;
      const checkDescendant = (node: CanvasNode) => {
        if (node.id === parentId) isDescendant = true;
        if (node.children) node.children.forEach(checkDescendant);
      };
      checkDescendant(activeNode);
      if (isDescendant) return state; // Invalid move
    }

    const { tree, removed } = removeNodeFromTree(state.nodes, activeId);
    if (!removed) return state;

    return { nodes: insertNodeIntoTree(tree, removed, parentId, index) };
  }),

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setHoverState: (hoverState) => set({ hoverState }),
  setPreviewMode: (isPreviewMode) => set({ isPreviewMode }),
  setProjectTheme: (projectTheme) => set({ projectTheme }),
  clear: () => set({ nodes: [], selectedNodeId: null, hoverState: null, isPreviewMode: false, projectTheme: 'enterprise-blue' }),
}));
