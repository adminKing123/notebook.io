import { useCallback, useEffect, useState } from 'react';
import { LINE_CHAR_ALLOWED } from '../constants';
import { calculateTypographyScale } from '../utils/calculateTypographyScale';

export function useTypographyScale(pageContainerRef, pageRowRef) {
  const [typography, setTypography] = useState({ fontSize: 16, lineHeight: 28 });

  const updateScale = useCallback(() => {
    const row = pageRowRef.current;
    if (!row) return;

    const style = window.getComputedStyle(row);
    const paddingLeft = parseFloat(style.paddingLeft);
    const paddingRight = parseFloat(style.paddingRight);
    const availableWidth = row.clientWidth - paddingLeft - paddingRight;

    setTypography(calculateTypographyScale(availableWidth, LINE_CHAR_ALLOWED));
  }, [pageRowRef]);

  useEffect(() => {
    const container = pageContainerRef.current;
    if (!container) return;

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);

    return () => observer.disconnect();
  }, [pageContainerRef, updateScale]);

  return typography;
}
