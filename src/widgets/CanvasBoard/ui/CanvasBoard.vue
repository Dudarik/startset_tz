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
import type { Process } from '@/entities';
import { ProcessBlock } from '@/widgets';

const CANVAS_W = 1200;
const CANVAS_H = 800;

// процессы можно захардкодить согласно ТЗ
const processes: Process[] = [
  {
    id: 'proc-1',
    label: 'Оптимизация процессов, улучшение их показателей',
    x: 80,
    y: 100,
    width: 200,
    height: 120,
  },
  {
    id: 'proc-2',
    label:
      'Оптимизация процессов, улучшение их показателей и повышение эффективности работы',
    x: 400,
    y: 250,
    width: 220,
    height: 130,
  },
  {
    id: 'proc-3',
    label: 'Используйте инструмент для создания блок',
    x: 780,
    y: 120,
    width: 200,
    height: 120,
  },
];
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
