import React, { useEffect, useRef } from 'react';
import { FaUtensilSpoon } from 'react-icons/fa';
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const Whychoose = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current, { y: 80, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      })

      ScrollTrigger.batch("[data-anim='wc-block']", {
        start: 'top 85%',
        onEnter: (els) => gsap.fromTo(els, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12 }),
        onLeaveBack: (els) => gsap.to(els, { y: 60, opacity: 0, duration: 0.4, stagger: 0.08 })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])
  return (
    <div ref={sectionRef} className="bg-gray-50 min-h-screen py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Section */}
          <div className="space-y-8 sm:space-y-12">
            {/* Title - Large serif font, very bold */}
            <h1 data-anim='wc-block' className="text-4xl sm:text-3xl lg:text-5xl xl:text-5xl font-semibold text-gray-900 leading-tight font-main tracking-tight">
              Why Choose Our<br />
              Products
            </h1>
            
            {/* Product Images Container */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              {/* Left Image - Stacked Donuts in rounded rectangle */}
              <div className="relative h-full w-full sm:w-1/2">
                <div data-anim='wc-block' className="w-full h-64 sm:h-80 lg:h-96 bg-purple-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
                  <img 
                    src="/Why1.png" 
                    alt="Stacked colorful donuts"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Right Image - Single black donut with dripping glaze */}
              <div data-anim='wc-block' className="relative w-full sm:w-1/2 flex flex-col">
                <img 
                  src="why2.png" 
                  alt="Black glazed donut with dripping chocolate"
                  className="w-full h-48 sm:h-64 lg:h-80 object-contain filter drop-shadow-2xl"
                />
                {/* Features List with exact styling */}
                <div data-anim='wc-block' className="space-y-3 sm:space-y-4 font-main mt-3">
                  {['Delicious and Soft', 'Hygienic Products', 'Without Preservatives'].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white font-bold" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm sm:text-base text-gray-800 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Section */}
          <div className="space-y-5 sm:space-y-5">
            {/* Top Text Block - exact styling */}
            <div data-anim='wc-block' className="bg-white p-4 sm:p-6 rounded-lg">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-2 sm:mb-2">
                I am text block. Click edit button to change this text. Lorem ipsum 
                dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec 
                ullamcorper mattis, pulvinar dapibus leo.
              </p>
              <button className="bg-orange-400 hover:bg-orange-500 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                Learn More
              </button>
            </div>
            
            {/* Benefits Cards - exact beige color and layout */}
            <div data-anim='wc-block' className="grid bg-[#EFDDD1] mb-4 rounded-2xl sm:rounded-3xl grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
              {/* Premium Material Card */}
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#5b392a] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-main font-bold text-gray-900 mb-2">
                  Premium Material
                </h3>
                <p className="text-gray-800 font-secondary text-sm sm:text-lg font-light">
                  Lorem ipsum dolor sit amet, consectetur.
                </p>
              </div>
              
              {/* Interesting Taste Card */}
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#5b392a] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg sm:text-xl text-white"><FaUtensilSpoon/></span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 font-main">
                  Interesting Taste
                </h3>
                <p className="text-gray-800 font-secondary text-sm sm:text-lg font-light">
                  Lorem ipsum dolor sit amet, consectetur.
                </p>
              </div>
            </div>
            
            {/* Process Section */}
            <div data-anim='wc-block' className="space-y-4 sm:space-y-5">
              <h2 className="text-lg sm:text-xl text-gray-900 leading-tight font-main">
                How Do We Make It Perfect?
              </h2>
    
              {/* Process Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 font-main">
                {/* Quality Materials */}
                <div className="relative h-28 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105">
                  <img 
                    src="why3.jpg" 
                    alt="Quality ingredients and materials"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-55"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-xl text-center leading-tight">
                      Quality<br />Materials
                    </span>
                  </div>
                </div>
                
                {/* Experienced Chef */}
                <div className="relative h-28 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105">
                  <img 
                    src="why4.jpg" 
                    alt="Professional experienced chef"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-55"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-xl text-center leading-tight">
                      Experienced<br />Chef
                    </span>
                  </div>
                </div>
                
                {/* Everyone's Trusted */}
                <div className="relative h-28 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105">
                  <img 
                    src="why5.jpg" 
                    alt="Trusted by everyone, happy customers"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-55"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-xl text-center leading-tight">
                      Everyone's<br />Trusted
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whychoose;