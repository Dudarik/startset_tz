import { watch, nextTick, type Ref } from 'vue';

const MIN_FONT = 2;
const MAX_FONT = 120;

export const useAutoFontSize = (
  containerRef: Ref<HTMLElement | null>,
  width: Ref<number>,
  height: Ref<number>,
) => {
  async function recalculateFontSize() {
    const el = containerRef.value;
    if (!el) return;

    await nextTick();

    let lo = MIN_FONT;
    let hi = MAX_FONT;
    let best = MIN_FONT;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      el.style.fontSize = `${mid}px`;

      const fits =
        el.scrollHeight <= el.clientHeight && el.scrollWidth <= el.clientWidth;

      if (fits) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    el.style.fontSize = `${best}px`;
  }

  watch([width, height], recalculateFontSize);

  return { recalculateFontSize };
};
