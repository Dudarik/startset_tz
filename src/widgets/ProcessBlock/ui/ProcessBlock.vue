<template>
  <div
    :class="$style.process"
    :style="{
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}`,
      height: `${height}`,
    }"
  >
    <div :class="$style.label">{{ process.label }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Process } from '@/entities';

const props = defineProps<{ process: Process }>();

const { x, y, width, height } = props.process;
</script>

<style module lang="scss">
.process {
  position: absolute;

  display: flex;
  align-items: center;
  justify-content: center;

  background: var(--color-process-bg);
  border: 2px solid var(--color-process-border);

  border-radius: 0.5rem;

  pointer-events: none;

  user-select: none;

  .label {
    font-size: 0.8rem;
    font-weight: 500;
    max-width: 10rem;
    text-align: center;
    color: var(--color-process-text);
    padding: 0.5rem;
  }
}
</style>
