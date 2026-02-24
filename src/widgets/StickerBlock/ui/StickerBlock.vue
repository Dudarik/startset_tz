<script setup lang="ts">
import { ref, nextTick, onMounted, useTemplateRef, computed } from 'vue';
import type { Sticker } from '@/entities/sticker';
import type { Handle } from '@/shared';
import { useAutoFontSize } from '@/features';

const handles: Handle[] = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];

const props = defineProps<{
  sticker: Sticker;
  isDragging: boolean;
}>();

const emit = defineEmits<{
  'sticker:dragStart': [id: string, event: PointerEvent];
  'sticker:resizeStart': [id: string, handle: Handle, event: PointerEvent];
  'sticker:updateText': [id: string, text: string];
  'sticker:delete': [id: string];
}>();

const isEditing = ref(false);
const stickerTextEditorRef = useTemplateRef<HTMLTextAreaElement>(
  'stickerTextEditorRef',
);
const textDisplayRef = useTemplateRef<HTMLDivElement>('textDisplayRef');

const computedW = computed(() => props.sticker.width);
const computedH = computed(() => props.sticker.height);

const { recalculateFontSize } = useAutoFontSize(
  textDisplayRef,
  computedW,
  computedH,
);

const startEditing = async () => {
  isEditing.value = true;

  await nextTick();

  if (!stickerTextEditorRef.value) return;

  stickerTextEditorRef.value.focus();
  stickerTextEditorRef.value.select();
};

const stopEditing = async () => {
  isEditing.value = false;
  await nextTick();
  recalculateFontSize();
};

const onInput = (e: Event) => {
  const { value } = e.target as HTMLTextAreaElement;
  emit('sticker:updateText', props.sticker.id, value);
};

onMounted(() => {
  if (!props.sticker.text) {
    startEditing();
  }
});
</script>

<template>
  <div
    :class="[$style.sticker, isDragging && $style.dragging]"
    :style="{
      left: `${sticker.x}px`,
      top: `${sticker.y}px`,
      width: `${sticker.width}px`,
      height: `${sticker.height}px`,
      zIndex: sticker.zIndex,
    }"
    @dblclick.stop="startEditing"
    @pointerdown.stop="emit('sticker:dragStart', sticker.id, $event)"
  >
    <div v-if="!isEditing" :class="$style.textDisplay" ref="textDisplayRef">
      {{ sticker.text || 'no text' }}
    </div>

    <textarea
      v-else
      ref="stickerTextEditorRef"
      :class="$style.textarea"
      :value="sticker.text"
      @input="onInput"
      @blur="stopEditing"
      @keydown.escape="stopEditing"
      @pointerdown.stop
    />

    <template v-for="handle in handles" :key="handle">
      <div
        :class="[$style.handle, $style[`handle-${handle}`]]"
        @pointerdown.stop="
          emit('sticker:resizeStart', sticker.id, handle, $event)
        "
      />
    </template>

    <button
      :class="$style.deleteBtn"
      @pointerdown.stop
      @click="emit('sticker:delete', sticker.id)"
    >
      &times;
    </button>
  </div>
</template>

<style module lang="scss">
$transition-duration: 150ms;

.sticker {
  cursor: grab;
  position: absolute;

  display: flex;
  flex-direction: column;

  background: var(--color-sticker-bg);

  border: 2px solid var(--color-sticker-border);
  border-radius: 0.5rem;

  box-shadow: var(--box-shadow-light);

  user-select: none;

  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: 3px 6px 18px rgba(0, 0, 0, 0.22);
  }

  &.dragging {
    cursor: grabbing;
    box-shadow: 6px 10px 24px rgba(0, 0, 0, 0.35);
  }

  .textDisplay {
    flex: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    text-align: center;

    padding: 1rem;

    overflow: hidden;
  }

  .textarea {
    flex: 1;

    outline: none;
    resize: none;

    background: transparent;

    font-family: inherit;

    text-align: center;

    padding: 1rem;
  }

  $handle-offset: 5px;
  $handle-size: 10px;

  $handle-positions: (
    nw: (
      top: -$handle-offset,
      left: -$handle-offset,
      cursor: nw-resize,
    ),
    n: (
      top: -$handle-offset,
      left: calc(50% - #{$handle-offset}),
      cursor: n-resize,
    ),
    ne: (
      top: -$handle-offset,
      right: -$handle-offset,
      cursor: ne-resize,
    ),
    w: (
      top: calc(50% - #{$handle-offset}),
      left: -$handle-offset,
      cursor: w-resize,
    ),
    e: (
      top: calc(50% - #{$handle-offset}),
      right: -$handle-offset,
      cursor: e-resize,
    ),
    sw: (
      bottom: -$handle-offset,
      left: -$handle-offset,
      cursor: sw-resize,
    ),
    s: (
      bottom: -$handle-offset,
      left: calc(50% - #{$handle-offset}),
      cursor: s-resize,
    ),
    se: (
      bottom: -$handle-offset,
      right: -$handle-offset,
      cursor: se-resize,
    ),
  );

  .handle {
    position: absolute;

    width: $handle-size;
    height: $handle-size;

    background: #3b82f6;

    border: 1px solid #fff;

    z-index: 100;

    opacity: 0;

    transition:
      opacity $transition-duration,
      color $transition-duration;

    @each $name, $props in $handle-positions {
      &-#{$name} {
        @each $property, $value in $props {
          #{$property}: $value;
        }
      }
    }
  }

  .deleteBtn {
    position: absolute;

    top: 0.2rem;
    right: 0.4rem;

    background: none;
    border: none;

    font-size: 1.5rem;
    color: #94a3b8;

    cursor: pointer;

    line-height: 1;

    opacity: 0.3;
    transition:
      opacity $transition-duration,
      color $transition-duration;

    &:hover {
      color: #d44444;
    }
  }
  &:hover {
    .deleteBtn,
    .handle {
      opacity: 1;
    }
  }
}
</style>
