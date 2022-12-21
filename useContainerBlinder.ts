// This hook has been created for task, where we had long horizintal tab-group. Sometimes, part of the tabs were hidden and user should drag and
// scroll to the left/rigth to see it. But part of the users can't recognise that thwy can do it.
// I decided to add semi-trancparency blinders. Hook checks container and childrens positions, and add blinders in 3 cases: left/righ/both.

import React, { useEffect, useState, useRef } from 'react';


function useEventListener(
  eventType: string,
  callback: (e: Event) => void,
  element: Element | Window | null = window
): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (element == null) return;
    const handler = (e: Event) => callbackRef.current(e);
    element.addEventListener(eventType, handler);
    return () => element.removeEventListener(eventType, handler);
  }, [eventType, element]);
}

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
