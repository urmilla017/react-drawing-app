import type { ToolTypes } from './model';

export function drawBrush(
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  color: string,
  lineWidth: number
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

export function drawShape(
  ctx: CanvasRenderingContext2D,
  tool: ToolTypes,
  from: { x: number; y: number },
  to: { x: number; y: number },
  color: string,
  brushSize: number
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = brushSize;
  ctx.beginPath();

  if (tool === 'line') {
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
  } else if (tool === 'rectangle') {
    ctx.rect(from.x, from.y, to.x - from.x, to.y - from.y);
  } else if (tool === 'circle') {
    const radius = Math.hypot(to.x - from.x, to.y - from.y);
    ctx.arc(from.x, from.y, radius, 0, Math.PI * 2);
  }
  ctx.stroke();
}

export function fillCanvas(ctx: CanvasRenderingContext2D, color: string, width: number, height: number) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}