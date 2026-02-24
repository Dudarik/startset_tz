import type { Process } from '@/entities';
import type { Rect } from '../types';

/**
 *
 * @param a - Rect
 * @param b - Rect
 * @returns - Возвращает True если два прямоугольгика пересекаются
 */
export const isRectsIntersect = (a: Rect, b: Rect) =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;

/**
 * Ограничитель положения стикера, при достижении границы canvas/процесса "прилипает" к границе.
 *
 * @param desiredX - Желаемая координата X
 * @param desiredY - Желаемая координата Y
 * @param stickerW - Размер стикера
 * @param stickerH - Размер стикера
 * @param canvasW - Размер canvas
 * @param canvasH - Размер canvas
 * @param processes - Список процессов
 * @param prevX - текущая кордината
 * @param prevY - текущая кордината
 * @returns - возвращает новые координаты стикера. Если есть возможность переместить на желаемы координаты - перемещает, если нет возвращает текущие
 */
export const clampStickerPosition = (
  desiredX: number,
  desiredY: number,
  stickerW: number,
  stickerH: number,
  canvasW: number,
  canvasH: number,
  processes: Process[],
  prevX: number,
  prevY: number,
) => {
  // Прижмем к границам холста
  let x = Math.max(0, Math.min(desiredX, canvasW - stickerW));
  let y = Math.max(0, Math.min(desiredY, canvasH - stickerH));

  // Проверим в цикле все процессы
  for (const proc of processes) {
    const rect: Rect = { x, y, width: stickerW, height: stickerH };
    if (!isRectsIntersect(rect, proc)) continue;

    // Создадим 4 кандидата (попрбоуем сместить стикер к каждой стороне процесса)
    const candidates = [
      { x: proc.x - stickerW, y }, // влево
      { x: proc.x + proc.width, y }, // вправо
      { x, y: proc.y - stickerH }, // вверх
      { x, y: proc.y + proc.height }, // вниз
    ];

    // Фильтруем: должна быть внутри canvas но не перекрывать процесс
    const valid = candidates
      .map((candidate) => ({
        x: Math.max(0, Math.min(candidate.x, canvasW - stickerW)),
        y: Math.max(0, Math.min(candidate.y, canvasH - stickerH)),
      }))
      .filter((candidate) => {
        const rect: Rect = {
          x: candidate.x,
          y: candidate.y,
          width: stickerW,
          height: stickerH,
        };
        return processes.every((proc) => !isRectsIntersect(rect, proc));
      });

    if (valid.length === 0) {
      // Нет возможности переместить - оставляем предыдущие координаты
      x = prevX;
      y = prevY;
    } else {
      // Выберим позицию близкую к желаемой
      const best = valid.reduce((a, b) => {
        const dA = Math.hypot(a.x - desiredX, a.y - desiredY);
        const dB = Math.hypot(b.x - desiredX, b.y - desiredY);
        return dA <= dB ? a : b;
      });
      x = best.x;
      y = best.y;
    }
  }

  return { x, y };
};
