'use client';

import { useRef } from 'react';

type PlansCarouselProps = {
  children: React.ReactNode;
};

export default function PlansCarousel({ children }: PlansCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const showNextPlans = () => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    track.scrollBy({ left: 272, behavior: 'smooth' });
  };

  return (
    <div className="plans-carousel">
      <button className="plans-next" type="button" aria-label="Next plans" onClick={showNextPlans}>
        ›
      </button>
      <div className="plans-grid" ref={trackRef}>
        {children}
      </div>
    </div>
  );
}
