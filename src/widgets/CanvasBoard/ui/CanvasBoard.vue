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
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;

  .canvas {
    position: relative;
    background: #ffffff;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    flex-shrink: 0;
    overflow: hidden;
  }
}
</style>
