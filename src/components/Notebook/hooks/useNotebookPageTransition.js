import { useCallback, useRef } from 'react';
import gsap from 'gsap';

const TRANSITION_DURATION = 0.35;

export function useNotebookPageTransition({ pageRefs, viewportRef, onPageChange }) {
  const isAnimatingRef = useRef(false);

  const transitionToPage = useCallback(
    (targetIndex, currentIndex, { onComplete } = {}) => {
      if (targetIndex === currentIndex || isAnimatingRef.current) {
        return;
      }

      const outgoing = pageRefs.current[currentIndex];
      const incoming = pageRefs.current[targetIndex];
      const viewport = viewportRef.current;

      if (!outgoing || !incoming || !viewport) {
        if (onComplete) {
          onComplete();
        } else {
          onPageChange(targetIndex);
        }
        return;
      }

      isAnimatingRef.current = true;
      const direction = targetIndex > currentIndex ? 1 : -1;

      gsap.set(viewport, { height: outgoing.offsetHeight });
      gsap.set(outgoing, { display: 'block', position: 'absolute', top: 0, left: 0, width: '100%' });
      gsap.set(incoming, {
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        xPercent: direction * 100,
      });

      gsap
        .timeline({
          onComplete: () => {
            gsap.set(outgoing, { display: 'none', clearProps: 'transform,position,top,left,width' });
            gsap.set(incoming, { clearProps: 'transform,position,top,left,width' });
            gsap.set(viewport, { clearProps: 'height' });

            if (onComplete) {
              onComplete();
            } else {
              onPageChange(targetIndex);
            }

            isAnimatingRef.current = false;
          },
        })
        .to(outgoing, { xPercent: direction * -100, duration: TRANSITION_DURATION, ease: 'power2.inOut' }, 0)
        .to(incoming, { xPercent: 0, duration: TRANSITION_DURATION, ease: 'power2.inOut' }, 0);
    },
    [onPageChange, pageRefs, viewportRef],
  );

  return { transitionToPage, isAnimatingRef };
}
