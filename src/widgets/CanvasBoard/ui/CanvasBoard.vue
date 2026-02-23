<template>
  <div :class="$style.canvasWrapper">
    <div
      :class="$style.canvas"
      :style="{ width: CANVAS_W + 'px', height: CANVAS_H + 'px' }"
    >
      <ProcessBlock v-for="proc in processes" :key="proc.id" :process="proc" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProcessBlock } from '@/widgets';
import { processes } from '@/shared';

const CANVAS_W = 1200;
const CANVAS_H = 800;
</script>

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
