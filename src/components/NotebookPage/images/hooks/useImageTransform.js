import { useCallback, useRef } from 'react';
import { getImageHeightPercent } from '../utils/imageLayout';

const MIN_WIDTH_PERCENT = 8;
const DRAG_THRESHOLD_PX = 3;

function clampWidth(width) {
  return Math.max(MIN_WIDTH_PERCENT, Math.min(width, 100));
}

function attachPointerSession(activeTarget, pointerId, onMove, onEnd) {
  const handleMove = (event) => {
    if (event.pointerId !== pointerId) {
      return;
    }

    event.preventDefault();
    onMove(event);
  };

  const cleanup = () => {
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('pointerup', handleEnd);
    window.removeEventListener('pointercancel', handleEnd);

    try {
      activeTarget.releasePointerCapture(pointerId);
    } catch {
      // Pointer capture may already be released.
    }
  };

  const handleEnd = (event) => {
    if (event.pointerId !== pointerId) {
      return;
    }

    cleanup();
    onEnd(event);
  };

  try {
    activeTarget.setPointerCapture(pointerId);
  } catch {
    // Some browsers reject capture on non-interactive nodes; window listeners still work.
  }

  window.addEventListener('pointermove', handleMove, { passive: false });
  window.addEventListener('pointerup', handleEnd);
  window.addEventListener('pointercancel', handleEnd);
}

export function useImageTransform({ containerRef, onChange }) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const getContainerRect = useCallback(() => {
    return containerRef.current?.getBoundingClientRect() ?? null;
  }, [containerRef]);

  const startDrag = useCallback(
    (event, image) => {
      if (
        event.target.closest(
          '.notebook-page__image-handle, .notebook-page__image-remove',
        )
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const containerRect = getContainerRect();
      if (!containerRect) {
        return;
      }

      const target = event.currentTarget;
      const pointerId = event.pointerId;
      const startX = event.clientX;
      const startY = event.clientY;
      const startImageX = image.x;
      const startImageY = image.y;
      let hasMoved = false;

      attachPointerSession(target, pointerId, (moveEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        if (!hasMoved) {
          if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) {
            return;
          }
          hasMoved = true;
        }

        onChangeRef.current({
          x: startImageX + (dx / containerRect.width) * 100,
          y: startImageY + (dy / containerRect.height) * 100,
        });
      }, () => {});
    },
    [getContainerRect],
  );

  const startResize = useCallback(
    (event, corner, image) => {
      event.preventDefault();
      event.stopPropagation();

      const containerRect = getContainerRect();
      if (!containerRect) {
        return;
      }

      const target = event.currentTarget;
      const pointerId = event.pointerId;
      const startX = event.clientX;
      const startWidth = image.width;
      const startXPos = image.x;
      const startYPos = image.y;
      const startHeightPct = getImageHeightPercent(
        startWidth,
        containerRect,
        image.aspectRatio,
      );

      attachPointerSession(target, pointerId, (moveEvent) => {
        const dxPct =
          ((moveEvent.clientX - startX) / containerRect.width) * 100;

        let nextWidth = startWidth;
        let nextX = startXPos;
        let nextY = startYPos;

        if (corner.includes('e')) {
          nextWidth = clampWidth(startWidth + dxPct);
        } else {
          nextWidth = clampWidth(startWidth - dxPct);
          nextX = startXPos + (startWidth - nextWidth);
        }

        const nextHeightPct = getImageHeightPercent(
          nextWidth,
          containerRect,
          image.aspectRatio,
        );

        if (corner.includes('n')) {
          nextY = startYPos + (startHeightPct - nextHeightPct);
        }

        onChangeRef.current({
          x: nextX,
          y: nextY,
          width: nextWidth,
        });
      }, () => {});
    },
    [getContainerRect],
  );

  return { startDrag, startResize };
}
