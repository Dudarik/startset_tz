import { useStickerStore } from '@/entities';

const DEFAULT_X = 580;
const DEFAULT_Y = 400;

export function useStickerCreate() {
  const stickerStore = useStickerStore();

  const createSticker = (x = DEFAULT_X, y = DEFAULT_Y) =>
    stickerStore.addSticker(x, y);

  return { createSticker };
}
