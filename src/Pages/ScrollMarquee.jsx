import React, { useEffect, useRef } from 'react';

const ScrollMarquee = () => {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (marqueeRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5; // Negative for left movement, adjust speed with multiplier
        marqueeRef.current.style.transform = `translateX(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logos = [
    {  icon: '/l1.png' },
    {  icon: '/l2.png' },
    {  icon: '/l3.png' },
    {  icon: '/l4.png' },
    {  icon: '/l5.png' }
  ];

  return (
    <div className="max-w-6xl mx-auto  py-8 sm:py-12 overflow-hidden relative">
      <div 
        ref={marqueeRef}
        className="flex items-center gap-8 sm:gap-16 whitespace-nowrap transition-transform duration-75"
        style={{ width: 'max-content' }}
      >
        {/* Repeat logos multiple times for seamless scrolling */}
        {Array.from({ length: 10 }).map((_, repeatIndex) => (
          <React.Fragment key={repeatIndex}>
            {logos.map((logo, index) => (
              <div key={`${repeatIndex}-${index}`} className="flex items-center gap-2 sm:gap-3">
                {/* Icon */}
                <div className="w-32 h-24 sm:w-58 sm:h-52 flex items-center">
                 <img src={logo.icon} alt={`Logo ${index + 1}`} className="w-full h-full object-contain"></img>
                </div>
               
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ScrollMarquee;