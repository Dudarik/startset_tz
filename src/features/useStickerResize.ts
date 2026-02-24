import { ref } from 'vue';
import { type Process, useStickerStore } from '@/entities';
import {
  type Handle,
  type Rect,
  isRectsIntersect,
  useConfigApp,
} from '@/shared';

const { CANVAS_H, CANVAS_W } = useConfigApp();

const MIN_SIZE = 80;
/** Вычислить rect стикера по handle, фиксированным краям и размерам */
function makeRect(
  handle: Handle,
  rightEdge: number,
  bottomEdge: number,
  startX: number,
  startY: number,
  w: number,
  h: number,
): Rect {
  return {
    x: handle.includes('w') ? rightEdge - w : startX,
    y: handle.includes('n') ? bottomEdge - h : startY,
    width: w,
    height: h,
  };
}

/** Проверить, что rect не выходит за холст и не пересекает процессы */
function isValid(rect: Rect, processes: Process[]): boolean {
  if (rect.x < 0 || rect.y < 0) return false;
  if (rect.x + rect.width > CANVAS_W) return false;
  if (rect.y + rect.height > CANVAS_H) return false;
  return processes.every((p) => !isRectsIntersect(rect, p));
}

export function useStickerResize(
  processes: Process[],
  canvasEl: { value: HTMLElement | null },
) {
  const stickerStore = useStickerStore();
  const resizingId = ref<string | null>(null);

  let startPointerX = 0;
  let startPointerY = 0;
  let startX = 0;
  let startY = 0;
  let startW = 0;
  let startH = 0;
  let handle: Handle = 'se';

  // Зафиксированные края — не меняются в течение всего resize
  let rightEdge = 0;
  let bottomEdge = 0;

  // Последний валидный размер — стикер не может стать меньше него при движении к препятствию
  let currentW = 0;
  let currentH = 0;

  function getCanvasRect() {
    return (
      canvasEl.value?.getBoundingClientRect() ?? {
        left: 0,
        top: 0,
        right: CANVAS_W,
        bottom: CANVAS_H,
      }
    );
  }

  function startResize(stickerId: string, h: Handle, event: PointerEvent) {
    event.stopPropagation();
    const sticker = stickerStore.getStickerById(stickerId);
    if (!sticker) return;

    resizingId.value = stickerId;
    handle = h;
    startPointerX = event.clientX;
    startPointerY = event.clientY;
    startX = sticker.x;
    startY = sticker.y;
    startW = sticker.width;
    startH = sticker.height;
    rightEdge = startX + startW;
    bottomEdge = startY + startH;
    currentW = startW;
    currentH = startH;

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopResize, { once: true });
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent) {
    if (!resizingId.value) return;

    const cr = getCanvasRect();

    // Клампим курсор к границам холста
    const cx = Math.max(cr.left, Math.min(event.clientX, cr.right));
    const cy = Math.max(cr.top, Math.min(event.clientY, cr.bottom));

    const dx = cx - startPointerX;
    const dy = cy - startPointerY;

    // Желаемые размеры от начальной точки
    const rawW = handle.includes('e')
      ? startW + dx
      : handle.includes('w')
        ? startW - dx
        : currentW;
    const rawH = handle.includes('s')
      ? startH + dy
      : handle.includes('n')
        ? startH - dy
        : currentH;

    // Clamp к минимуму
    const desiredW = Math.max(MIN_SIZE, rawW);
    const desiredH = Math.max(MIN_SIZE, rawH);

    // Проверяем желаемый размер целиком
    const desiredRect = makeRect(
      handle,
      rightEdge,
      bottomEdge,
      startX,
      startY,
      desiredW,
      desiredH,
    );

    if (isValid(desiredRect, processes)) {
      // Желаемый размер валиден — принимаем полностью
      currentW = desiredW;
      currentH = desiredH;
      stickerStore.updateSticker(resizingId.value, {
        x: desiredRect.x,
        y: desiredRect.y,
        width: desiredW,
        height: desiredH,
      });
      return;
    }

    // Желаемый размер невалиден.
    // Ищем максимально допустимый размер бинарным поиском между
    // текущим валидным и желаемым по каждой оси отдельно,
    // чтобы пропускать уменьшение (курсор назад) и блокировать рост в препятствие.

    const changesW = handle.includes('e') || handle.includes('w');
    const changesH = handle.includes('n') || handle.includes('s');

    let bestW = currentW;
    let bestH = currentH;

    if (changesW && changesH) {
      // Угловой handle: бинарный поиск по обеим осям одновременно (пропорционально)
      // от currentW/H до desiredW/H
      let lo = 0;
      let hi = 100;
      let best = 0;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const t = mid / 100;
        const tw = Math.round(currentW + (desiredW - currentW) * t);
        const th = Math.round(currentH + (desiredH - currentH) * t);
        const rect = makeRect(
          handle,
          rightEdge,
          bottomEdge,
          startX,
          startY,
          tw,
          th,
        );
        if (isValid(rect, processes)) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }

      const t = best / 100;
      bestW = Math.round(currentW + (desiredW - currentW) * t);
      bestH = Math.round(currentH + (desiredH - currentH) * t);
    } else if (changesW) {
      // Только ширина: бинарный поиск между currentW и desiredW
      let lo = Math.min(currentW, desiredW);
      let hi = Math.max(currentW, desiredW);
      let best = currentW;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const rect = makeRect(
          handle,
          rightEdge,
          bottomEdge,
          startX,
          startY,
          mid,
          currentH,
        );
        if (isValid(rect, processes)) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      bestW = best;
    } else if (changesH) {
      // Только высота
      let lo = Math.min(currentH, desiredH);
      let hi = Math.max(currentH, desiredH);
      let best = currentH;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const rect = makeRect(
          handle,
          rightEdge,
          bottomEdge,
          startX,
          startY,
          currentW,
          mid,
        );
        if (isValid(rect, processes)) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      bestH = best;
    }

    currentW = bestW;
    currentH = bestH;
    const finalRect = makeRect(
      handle,
      rightEdge,
      bottomEdge,
      startX,
      startY,
      bestW,
      bestH,
    );
    stickerStore.updateSticker(resizingId.value, {
      x: finalRect.x,
      y: finalRect.y,
      width: bestW,
      height: bestH,
    });
  }

  function stopResize() {
    resizingId.value = null;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', stopResize);
  }

  return { resizingId, startResize };
}
