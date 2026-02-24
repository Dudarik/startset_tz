import { ref } from 'vue';
import { type Process, useStickerStore } from '@/entities';
import { clampStickerPosition, useConfigApp } from '@/shared';

const { CANVAS_H, CANVAS_W } = useConfigApp();

export const useStickerDrag = (
  processes: Process[],
  canvasEl: { value: HTMLDivElement | null },
) => {
  const stickerStore = useStickerStore();
  const draggingId = ref<string | null>(null);

  const { getStickerById } = stickerStore;

  // Смещение указателя относительно верхнего левого угла стикера, вначале перетаскивания
  let offsetX = 0;
  let offsetY = 0;

  const getCanvasRect = () =>
    canvasEl.value?.getBoundingClientRect() ?? { left: 0, top: 0 };

  const onPointerMove = (event: PointerEvent) => {
    if (!draggingId.value) return;

    const sticker = getStickerById(draggingId.value);

    if (!sticker) return;

    const cr = getCanvasRect();
    const desiredX = event.clientX - cr.left - offsetX;
    const desiredY = event.clientY - cr.top - offsetY;

    const { x, y } = clampStickerPosition(
      desiredX,
      desiredY,
      sticker.width,
      sticker.height,
      CANVAS_W,
      CANVAS_H,
      processes,
      sticker.x,
      sticker.y,
    );

    stickerStore.updateSticker(sticker.id, { x, y });
  };

  const stopDrag = () => {
    draggingId.value = null;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', stopDrag);
  };

  const startDrag = (stickerId: string, event: PointerEvent) => {
    const sticker = getStickerById(stickerId);

    if (!sticker) return;

    draggingId.value = stickerId;

    stickerStore.bringToFront(stickerId);

    const cr = getCanvasRect();
    // Смещение = положение указателя относительно холста минус положение стикера.
    offsetX = event.clientX - cr.left - sticker.x;
    offsetY = event.clientY - cr.top - sticker.y;

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopDrag, { once: true });

    // Привяжем указатель к перемещаемому элементу
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  };

  return { draggingId, startDrag };
};
