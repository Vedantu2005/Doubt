import { useLayoutEffect, useRef } from "react";
import ScrollMarquee from "./ScrollMarquee";
import Whychoose from "./Whychoose";
import Faq from "./Faq";
import Banner from "./Banner";
import Numbers from "./Numbers";
import BelowHero from "./BelowHero";
import gsap from "gsap";

export default function AboutPage() {
  const rootRef = useRef(null);
  const textRef = useRef(null);
  const imgRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.1 }
      );
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          rotate: 360,
          ease: "none",
          scrollTrigger: {
            trigger: imgRef.current,
            start: "top 80%",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="bg-white mt-15 pt-16 sm:pt-20">
      {/* Hero Section */}
      <section className="max-w-screen-xl mb-12 sm:mb-16 lg:mb-20 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center bg-[#5b392a] rounded-2xl sm:rounded-3xl lg:rounded-4xl px-4 sm:px-6 lg:px-8">
          {/* Text Content */}
          <div
            ref={textRef}
            className="flex flex-col justify-center flex-1 text-center lg:text-left mb-6 lg:mb-0 lg:pr-8"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-28 font-main font-bold text-white leading-tight">
              About Us
            </h1>
          </div>
           
          {/* Donut Image */}
          <div className="w-full lg:w-auto flex justify-center">
            <img
              ref={imgRef}
              src="/HeroImg.png"
              alt="Donut"
              className="w-40 h-40 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-58 lg:h-58 xl:w-72 xl:h-72 object-contain"
            />
          </div>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with both titles */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8 sm:mb-12 space-y-6 lg:space-y-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 font-main leading-tight max-w-none lg:max-w-3xl">
            The Same Taste in Every Bite for Over 20 Years
          </h1>
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-bold font-main text-gray-900 lg:mt-4 lg:ml-8">
            What is Donatsu?
          </h3>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column: Text Content, Features, and Badge */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-5 sm:space-y-6">
              
              {/* --- START: COMPANY DESCRIPTION (FIXED BOLDING) --- */}
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                <strong>Boxcar Donuts</strong> is more than just a donut shop – it’s a passion project created by two proud London locals who wanted to share their love for donuts with the community they call home.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                What sets us apart is our dedication to doing things differently. Every donut is <strong>hand-cut to perfection</strong> – big, fluffy, and made fresh each day using high-quality ingredients. We take pride in our creativity, crafting bold and <strong>inventive flavors that change every single week</strong>. From reimagined classics to completely new creations, there’s always something exciting to discover at Boxcar.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                We believe donuts should be more than a treat – they should be an <strong>experience</strong>. That’s why every bite reflects our passion, our craft, and our love for bringing people together through something truly special. We’re not just baking donuts – we’re creating experiences, one extraordinary donut at a time.
              </p>
              {/* --- END: COMPANY DESCRIPTION --- */}

              {/* Features Grid - Still using placeholder text, needs updating */}
              <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-3 sm:gap-y-4 mt-5 sm:mt-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#e18126] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-main text-gray-900 font-medium text-base sm:text-lg">Consectetur</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#e18126] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
</svg>
                    </div>
                    <span className="font-main text-gray-900 font-medium text-base sm:text-lg">Ullamcorper</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#e18126] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
</svg>
                    </div>
                    <span className="font-main text-gray-900 font-medium text-base sm:text-lg">Dapibus Leo</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#e18126] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
</svg>
                    </div>
                    <span className="font-main text-gray-900 font-medium text-base sm:text-lg">Elit Tellus</span>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#e18126] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
</svg>
                    </div>
                    <span className="font-main text-gray-900 font-medium text-base sm:text-lg">Consectetur</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#e18126] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
</svg>
                    </div>
                    <span className="font-main text-gray-900 font-medium text-base sm:text-lg">Ullamcorper</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#e18126] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
</svg>
                    </div>
                    <span className="font-main text-gray-900 font-medium text-base sm:text-lg">Dapibus Leo</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#e18126] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
</svg>
                    </div>
                    <span className="font-main  text-gray-900 font-medium text-base sm:text-lg">Elit Tellus</span>
                  </div>
                </div>
              </div>

              {/* Experience Badge */}
              <div className="bg-[#5b392a] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white mt-6 w-full sm:w-4/5 lg:w-3/4 font-main">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e18126] mb-2 sm:mb-3">20+</div>
                <div className="text-base sm:text-lg lg:text-xl font-semibold">Years of Experience</div>
              </div>
            </div>
          </div>

          {/* Right Column: Image Content */}
          <div className="relative h-full w-full mt-8 lg:mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 h-full w-full">
              {/* Left Image - Hand holding stacked donuts */}
              <div className="relative h-64 sm:h-80 lg:h-full min-h-[250px]">
                <img 
                  src="https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Hand holding stack of colorful donuts"
                  className="w-full h-full object-cover rounded-2xl sm:rounded-3xl shadow-lg"
                />
              </div>

              {/* Right Image - Plate of donuts */}
              <div className="relative h-64 sm:h-80 lg:h-full min-h-[250px]">
                <img 
                  src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Assorted donuts on wooden plate"
                  className="w-full h-full object-cover rounded-2xl sm:rounded-3xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <BelowHero />
      <ScrollMarquee />
      <Whychoose />
      <Faq />
      <Numbers />
    </div>
  );
}