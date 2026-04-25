import { forwardRef, useImperativeHandle } from 'react';
import { useDrawingCanvas } from './useDrawingCanvas';
import type { CanvasProps, DrawingCanvasHandle } from './model';

const DrawingCanvas = forwardRef<DrawingCanvasHandle, CanvasProps>(
  ({ width, height, paintColor, tool, mode, brushSize }, ref) => {
    const {
      canvasRef,
      startPaint,
      paint,
      stopPaint,
      clearCanvasHandler,
      fillCanvasHandler,
      saveCanvasHandler,
      undo,
      redo
    } = useDrawingCanvas({ width, height, paintColor, tool, mode, brushSize });

    useImperativeHandle(ref, () => ({
      clearCanvas: clearCanvasHandler,
      fillCanvas: fillCanvasHandler,
      saveCanvas: saveCanvasHandler,
      undo,
      redo
    }));

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startPaint}
        onMouseMove={paint}
        onMouseUp={stopPaint}
        onMouseLeave={stopPaint}
        className="canvas"
      />
    );
  }
);

export default DrawingCanvas;