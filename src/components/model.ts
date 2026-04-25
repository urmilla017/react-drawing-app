import type { JSX } from "react";

export interface CanvasProps {
  width: number;
  height: number;
  paintColor: string;
  tool: 'brush' | 'line' | 'rectangle' | 'circle';
  mode: 'light' | 'dark';
  brushSize: number;
}

export interface DrawingCanvasHandle {
  clearCanvas: () => void;
  fillCanvas: () => void;
  saveCanvas: () => void;
  undo: () => void;
  redo: () => void;
}

export type ToolTypes = 'brush' | 'line' | 'rectangle' | 'circle';

export type ColorOption = { 
    color: string; 
    label: string; 
    colorCode: string; 
};

export type ButtonOption = { 
    name: "SETDEFAULTS" | "ERASE" | "SAVE" | "CLEAR" | "FILL" | "UNDO" | "REDO"; 
    label: string; 
    icon: JSX.Element; 
};
