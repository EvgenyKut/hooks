import useEventListener from '@mlg/tools/hooks/useEventListener';
import React, { useEffect, useState, useRef } from 'react';

export default function useContainerBlinders(
  element: Element | null | undefined | HTMLElement,
  blinderColor = '#FFF'
): void {
  const [elementScroll, setElementScroll] = useState(0);
  const [isShadowLeft, setIsShadowLeft] = useState(false);
  const [isShadowRight, setIsShadowRight] = useState(false);
  const elementRect = element?.getBoundingClientRect();

  const blindersRef = useRef({ left: false, right: false });

  const elementHeight = elementRect?.height;
  useEventListener('scroll', () => setElementScroll(element?.scrollLeft  0), element);

  useEffect(() => {
    if (element != null && !blindersRef.current.right) {
      const rightBlind = document.createElement('div');
      rightBlind.className = 'blinderStylesRightSlider';
      rightBlind.style.height = `${elementHeight}px`;
      rightBlind.style.background = `linear-gradient(270deg,${blinderColor} 38.46%, rgba(247, 248, 250, 0) 100%)`;
      blindersRef.current = { ...blindersRef.current, right: true };
      element.prepend(rightBlind);
    }
    if (element != null && !blindersRef.current.left) {
      const leftBlind = document.createElement('div');
      leftBlind.className = 'blinderStylesLeftSlider';
      leftBlind.style.height = `${elementHeight}px`;
      leftBlind.style.background = `linear-gradient(90deg,${blinderColor} 38.46%, rgba(247, 248, 250, 0) 100%)`;
      blindersRef.current = { ...blindersRef.current, left: true };
      element.prepend(leftBlind);
    }
  }, [element]);

  useEffect(() => {
    if (elementRect == null) {
      return;
    }
    const subFirstElement = element?.children[2] as HTMLElement;
    const subLastElement = element?.children[element?.children.length - 1] as HTMLElement;
    const subFirstElementRect = subFirstElement?.getBoundingClientRect();
    const subLastElementRect = subLastElement?.getBoundingClientRect();
    setIsShadowLeft(subFirstElementRect?.x < elementRect?.x);
    setIsShadowRight(subLastElementRect?.right - 2 > elementRect?.right);
  }, [elementScroll, elementRect]);

  useEffect(() => {
    const leftBlinder = element?.firstChild as HTMLElement;
    const rightBlinder = element?.children[1] as HTMLElement;
    if (!leftBlinder  !rightBlinder) return;
    leftBlinder.style.display = isShadowLeft ? 'block' : 'none';
    rightBlinder.style.display = isShadowRight ? 'block' : 'none';
  }, [isShadowLeft, isShadowRight]);
}
