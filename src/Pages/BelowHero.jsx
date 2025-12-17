import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function BelowHero() {
  const rootRef = useRef(null);
  const rightTopRef = useRef(null);
  const rightBottomRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([rightTopRef.current, rightBottomRef.current], {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.15,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="max-w-screen-xl mx-auto bg-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
    >
      {/* Mobile: Vertical stack layout */}
      <div className="flex flex-col lg:hidden gap-4 sm:gap-6">
        {/* Top Block: Pink card with donut collage and 1.2K+ */}
        <div className="relative bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl p-6 shadow-lg">
          {/* Donut collage */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              'h1.png',
              'h2.jpg', 
              'h3.jpg',
              'h4.jpg',
              'h5.jpg',
            ].map((src, i) => (
              <img
                key={i}
                src={src}
                alt="mini donut"
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ))}
          </div>
          
          {/* Text content */}
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-main font-bold text-black mb-1">1.2K+</div>
            <div className="font-main text-sm sm:text-base text-black">Happy Customers</div>
          </div>
        </div>

        {/* Middle Block: White card with 99% */}
        <div
          ref={rightTopRef}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="text-4xl sm:text-5xl font-semibold leading-none font-main text-[#e18126] mb-3">
            99%
          </div>
          <div className="text-gray-800 text-base sm:text-lg font-main font-semibold mb-4">
            Positive Feedback on Product Quality
          </div>
          <a href="#" className="text-gray-800 text-sm sm:text-base font-semibold underline hover:text-orange-400 transition-colors">
            Learn More
          </a>
        </div>

        {/* Bottom Block: Donut image */}
        <div
          ref={rightBottomRef}
          className="rounded-2xl overflow-hidden shadow-lg"
        >
          <img
            src="/BelowRight.png"
            alt="Donut closeup"
            className="w-full h-48 sm:h-56 object-cover"
          />
        </div>
      </div>

      {/* Desktop: Original layout */}
      <div className="hidden lg:grid grid-cols-3 items-start gap-8">
        {/* Left: Big hero image with overlay */}
        <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-md col-span-2">
          <img
            src="/BelowHero.png"
            alt="Pink donuts"
            className="w-full h-full object-cover"
          />

          {/* Bottom overlay card */}
          <div className="absolute w-full left-7 right-auto bottom-8">
            <div className="bg-gradient-to-r from-white via-white/40 to-transparent w-full h-28 rounded-2xl px-6 py-4 flex items-center gap-5">
              <div className="flex -space-x-3">
                {[
                  'h1.png',
                  'h2.jpg',
                  'h3.jpg',
                  'h4.jpg',
                  'h5.jpg',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="mini donut"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="text-3xl font-main font-bold">1.2K+</div>
                <div className="font-main text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Stacked content */}
        <div className="flex flex-col gap-8">
          <div
            ref={rightTopRef}
            className="rounded-[20px] border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="text-5xl font-semibold leading-none font-main text-[#e18126]">
              99%
            </div>
            <div className="text-gray-800 text-2xl font-main font-semibold max-w-[28ch] mt-2">
              Positive Feedback on Product Quality
            </div>
            <a href="#" className="mt-6 text-lg font-semibold inline-block text-gray-800 underline">
              Learn More
            </a>
          </div>

          <div
            ref={rightBottomRef}
            className="rounded-[20px] overflow-hidden shadow-md"
          >
            <img
              src="/BelowRight.png"
              alt="Donut closeup"
              className="w-full h-[260px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
