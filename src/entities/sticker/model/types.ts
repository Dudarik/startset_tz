import type { CanvasBlock } from '@/shared';

export interface Sticker extends CanvasBlock {
  text: string;
  zIndex: number;
}
