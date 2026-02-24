export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface CanvasBlock extends Rect {
  id: string;
}

export type Handle = 'se' | 'sw' | 'ne' | 'nw' | 'e' | 'w' | 'n' | 's';
