"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Numbers() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".number-item", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.4,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%", // start animation when section is 75% in viewport
          toggleActions: "play none none reverse", // replays when scrolled back
        },
      });
    }, sectionRef);

    return () => ctx.revert(); // cleanup on unmount
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#efddd1] py-12 sm:py-16 lg:py-20 flex justify-center items-center font-main"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 lg:gap-20 text-center">
        {/* Item 1 */}
        <div className="number-item">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-orange-500">
            1.2K+
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl lg:text-xl font-medium">
            Is the Number of Partners Who <br className="hidden sm:block" /> Join Us Throughout the Year
          </p>
        </div>

        {/* Item 2 */}
        <div className="number-item">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-orange-500">
            #2
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl lg:text-xl font-medium">
            Popular Donuts With the Highest <br className="hidden sm:block" /> Sales Throughout the Year
          </p>
        </div>

        {/* Item 3 */}
        <div className="number-item">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-orange-500">
            2.2K
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl lg:text-xl font-medium">
            Client Satisfaction: The Key to <br className="hidden sm:block" /> Repeat Business
          </p>
        </div>
      </div>
    </section>
  );
}
