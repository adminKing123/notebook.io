import { useCallback, useRef, useState } from 'react';
import {
  DEFAULT_ZOOM,
  ZOOM_MAX,
  ZOOM_MIN,
  ZOOM_STEP,
} from '../constants';
import { useZoomContentHeight } from './useZoomContentHeight';

export function useNotebookZoom() {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const zoomContentRef = useRef(null);
  const contentHeight = useZoomContentHeight(zoomContentRef);

  const zoomIn = useCallback(() => {
    setZoom((previousZoom) =>
      Math.min(ZOOM_MAX, Number((previousZoom + ZOOM_STEP).toFixed(2))),
    );
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((previousZoom) =>
      Math.max(ZOOM_MIN, Number((previousZoom - ZOOM_STEP).toFixed(2))),
    );
  }, []);

  return {
    zoom,
    zoomContentRef,
    contentHeight,
    zoomIn,
    zoomOut,
    canZoomIn: zoom < ZOOM_MAX,
    canZoomOut: zoom > ZOOM_MIN,
    shellHeight: contentHeight > 0 ? contentHeight * zoom : undefined,
  };
}
