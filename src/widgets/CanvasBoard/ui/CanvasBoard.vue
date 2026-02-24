<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { processes, useConfigApp } from '@/shared';
import { useStickerStore } from '@/entities';
import { useStickerDrag, useStickerResize } from '@/features';
import { ProcessBlock, StickerBlock } from '@/widgets';

const { CANVAS_H, CANVAS_W } = useConfigApp();

const canvasRef = useTemplateRef<HTMLDivElement>('canvasRef');

const stickersStore = useStickerStore();
const { updateStickerText, removeSticker } = stickersStore;
const { draggingId, startDrag } = useStickerDrag(processes, canvasRef);
const { startResize } = useStickerResize(processes, canvasRef);
</script>

<template>
  <div :class="$style.canvasWrapper">
    <div
      :class="$style.canvas"
      :style="{ width: `${CANVAS_W}px`, height: `${CANVAS_H}px` }"
      ref="canvasRef"
    >
      <ProcessBlock v-for="proc in processes" :key="proc.id" :process="proc" />
      <StickerBlock
        v-for="sticker in stickersStore.stickers"
        :key="sticker.id"
        :sticker="sticker"
        :isDragging="draggingId === sticker.id"
        @sticker:updateText="updateStickerText"
        @sticker:delete="removeSticker"
        @sticker:resizeStart="startResize"
        @sticker:dragStart="startDrag"
      />
    </div>
  </div>
</template>

<style module lang="scss">
.canvasWrapper {
  overflow: auto;

  display: flex;
  justify-content: center;
  align-items: flex-start;

  padding: 1rem;

  .canvas {
    position: relative;

    background-color: var(--color-canvas);
    background-image:
      linear-gradient(to right, var(--color-canvas-grid) 1px, transparent 1px),
      linear-gradient(to bottom, var(--color-canvas-grid) 1px, transparent 1px);

    background-size: 1.5rem 1.5rem;

    box-shadow: 0 0.25rem 1.5rem rgba(0, 0, 0, 0.12);

    border-radius: var(--border-radius);

    overflow: hidden;
  }
}
</style>
