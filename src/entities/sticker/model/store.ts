import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Sticker } from './types';

let zIndexCounter = 10;
const DEFAULT_STICKER_SIZE = 160;

export const useStickerStore = defineStore('sticker', () => {
  const stickers = ref<Sticker[]>([]);

  function addSticker(x: number, y: number): Sticker {
    const sticker: Sticker = {
      id: crypto.randomUUID(),
      text: '',
      x,
      y,
      width: DEFAULT_STICKER_SIZE,
      height: DEFAULT_STICKER_SIZE,
      zIndex: ++zIndexCounter,
    };
    stickers.value.push(sticker);
    return sticker;
  }

  function updateSticker(id: string, patch: Partial<Sticker>) {
    const sid = stickers.value.findIndex((s) => s.id === id);
    if (sid === -1) return;

    stickers.value[sid] = { ...stickers.value[sid], ...patch } as Sticker;
  }

  function updateStickerText(id: string, text: string) {
    updateSticker(id, { text });
  }

  function bringToFront(id: string) {
    updateSticker(id, { zIndex: ++zIndexCounter });
  }

  function removeSticker(id: string) {
    stickers.value = stickers.value.filter((s) => s.id !== id);
  }

  const getStickerById = computed(
    () => (stickerId: string) => stickers.value.find((s) => s.id === stickerId),
  );

  return {
    stickers,
    getStickerById,
    addSticker,
    updateSticker,
    bringToFront,
    removeSticker,
    updateStickerText,
  };
});
