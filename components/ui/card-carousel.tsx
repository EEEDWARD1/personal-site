"use client";

import { Children, ReactNode, useRef, useState } from "react";

export default function CardCarousel({
  children,
  className = "",
  label = "Cards",
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  const items = Children.toArray(children);
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  const scrollToItem = (index: number) => {
    const nextIndex = Math.min(Math.max(index, 0), items.length - 1);
    const track = trackRef.current;
    const item = itemRefs.current[nextIndex];

    if (!track || !item) return;

    track.scrollTo({
      left: item.offsetLeft - (track.clientWidth - item.clientWidth) / 2,
      behavior: "smooth",
    });
    setCurrentIndex(nextIndex);
  };

  const updateIndexFromScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    const closestIndex = itemRefs.current.reduce((closest, item, index) => {
      if (!item) return closest;

      const itemCenter = item.offsetLeft + item.clientWidth / 2;
      const currentDistance = Math.abs(itemCenter - trackCenter);
      const closestItem = itemRefs.current[closest];
      const closestDistance = closestItem
        ? Math.abs(closestItem.offsetLeft + closestItem.clientWidth / 2 - trackCenter)
        : Number.POSITIVE_INFINITY;

      return currentDistance < closestDistance ? index : closest;
    }, 0);

    setCurrentIndex(closestIndex);
  };

  return (
    <div className="grid gap-3" aria-label={label}>
      <div
        ref={trackRef}
        className={`card-carousel-track ${className}`}
        onScroll={updateIndexFromScroll}
      >
        {items.map((item, index) => (
          <div
            key={index}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className="snap-center md:snap-align-none"
          >
            {item}
          </div>
        ))}
      </div>

      {items.length > 1 ? (
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            className="h-9 w-9 p-0"
            aria-label={`Previous ${label.toLowerCase()} item`}
            disabled={currentIndex === 0}
            onClick={() => scrollToItem(currentIndex - 1)}
          >
            &larr;
          </button>
          <span
            className="min-w-12 text-center text-sm font-semibold text-slate-600"
            aria-live="polite"
          >
            {currentIndex + 1}/{items.length}
          </span>
          <button
            type="button"
            className="h-9 w-9 p-0"
            aria-label={`Next ${label.toLowerCase()} item`}
            disabled={currentIndex === items.length - 1}
            onClick={() => scrollToItem(currentIndex + 1)}
          >
            &rarr;
          </button>
        </div>
      ) : null}
    </div>
  );
}
