import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const rootRef = useRef(null);
  const textRef = useRef(null);
  const imgRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Enter animation from bottom on initial load
      gsap.fromTo(
        textRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
      );

      // Rotate donut image on scroll
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          rotate: 360,
          ease: 'none',
          scrollTrigger: {
            trigger: imgRef.current,
            start: 'top 80%',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="max-w-screen-xl mt-15 mx-auto flex flex-col lg:flex-row items-center bg-white py-8 sm:py-12 lg:py-16">
      {/* Donut Image */}
      <div className="w-full lg:w-auto flex justify-center lg:justify-start">
        <img
          ref={imgRef}
          src="/HeroImg.png"
          alt="Donut"
          className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 object-contain"
        />
      </div>

      {/* Text Content */}
      <div ref={textRef} className="flex-1 px-4 sm:px-6 lg:px-8 text-center lg:text-left mt-6 lg:mt-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-main font-bold text-gray-900 leading-tight sm:leading-snug">
          Get Your Favorite Sweet <br className="hidden sm:block" /> Donuts and You Deserve It
        </h1>
        <button className="mt-4 sm:mt-6 bg-[#e18126] cursor-pointer text-base sm:text-lg hover:bg-orange-300 hover:text-black text-white font-semibold px-6 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-lg transition duration-300">
          Shop Now
        </button>
      </div>
     
    </section>
    
  );
}
  