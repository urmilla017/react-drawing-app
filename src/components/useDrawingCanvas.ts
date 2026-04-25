import { useRef, useState, useCallback, useEffect } from 'react';
import { drawBrush, drawShape, fillCanvas } from './drawingUtils';
import type { CanvasProps } from './model';

export function useDrawingCanvas({ width, height, paintColor, tool, mode, brushSize }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);

  const getBackgroundColor = (): string => (mode === 'dark' ? '#333333' : '#ffffff');

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;

    fillCanvas(ctx, getBackgroundColor(), canvas.width, canvas.height);
    undoStack.current = [canvas.toDataURL()];
    redoStack.current = [];
  }, [mode, width, height]);

  const saveState = useCallback(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL();
    const lastState = undoStack.current[undoStack.current.length - 1];

    if (data !== lastState) {
      undoStack.current.push(data);
      redoStack.current = [];
    }
  }, []);

  const getCursorPos = (mouseEvent: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (mouseEvent.clientX - rect.left) * scaleX, y: (mouseEvent.clientY - rect.top) * scaleY };
  };

  const startPaint = useCallback((mouseEvent: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPainting(true);
    const cursorPosition = getCursorPos(mouseEvent);
    setLastPos(cursorPosition);
    saveState();
  }, [saveState]);

  const paint = useCallback((mouseEvent: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isPainting || !lastPos) return;
      const canvas: HTMLCanvasElement | null = canvasRef.current;
      if (!canvas) return;
      const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
      if (!ctx) return;

      const cursorPosition = getCursorPos(mouseEvent);

      if (tool === 'brush') {
        drawBrush(ctx, lastPos, cursorPosition, paintColor, brushSize);
        setLastPos(cursorPosition);
      } else {
        const snapshot = new Image();
        snapshot.src = undoStack.current[undoStack.current.length - 1] || '';
        snapshot.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          fillCanvas(ctx, getBackgroundColor(), canvas.width, canvas.height);
          if (snapshot.src) ctx.drawImage(snapshot, 0, 0, canvas.width, canvas.height);
          drawShape(ctx, tool, lastPos, cursorPosition, paintColor, brushSize);
        };
      }
    }, [isPainting, lastPos, paintColor, tool, mode, brushSize]);

  const stopPaint = useCallback(() => {
    setIsPainting(false);
    setLastPos(null);
    saveState();
  }, [saveState]);

  const clearCanvasHandler = useCallback(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;

    saveState();
    fillCanvas(ctx, getBackgroundColor(), canvas.width, canvas.height);

  }, [mode, saveState]);

  const fillCanvasHandler = useCallback(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;

    saveState();
    fillCanvas(ctx, paintColor, canvas.width, canvas.height);

  }, [paintColor, saveState]);

  const saveCanvasHandler = useCallback(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL();
    a.download = 'drawing.png';
    a.click();
  }, []);

  const undo = useCallback(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas || undoStack.current.length <= 1) return;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;

    redoStack.current.push(undoStack.current.pop()!);

    const lastState = undoStack.current[undoStack.current.length - 1];
    if (!lastState) return;

    const img = new Image();
    img.src = lastState;
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, []);

  const redo = useCallback(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas || !redoStack.current.length) return;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;

    const nextState = redoStack.current.pop()!;
    const img = new Image();
    img.src = nextState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      undoStack.current.push(nextState);
    };
  }, []);

  return {
    canvasRef,
    startPaint,
    paint,
    stopPaint,
    clearCanvasHandler,
    fillCanvasHandler,
    saveCanvasHandler,
    undo,
    redo,
  };
}