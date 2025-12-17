import React from 'react';

// 1. Your list of images. 
// Make sure these are in your /public folder or imported correctly.
const images = [
  '/latest1.jpg',
  '/latest2.jpg',
  '/latest3.jpg',
  '/latest4.jpg',
  '/latest5.jpg',
  '/latest6.jpg',
  '/latest7.jpg',
  '/latest8.jpg',
];

// 2. We duplicate the images array to create the seamless loop
const doubledImages = [...images, ...images];

// 3. Define the CSS animation rules as a string.
// These will be injected into the page by the <style> tag below.
const animationStyles = `
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  
  .animate-scroll {
    animation: scroll 10s linear infinite;
  }
`;

const LatestAlbum = () => {
  return (
    <>
      {/* This <style> tag adds the animation rules to the page 
        only when this component is rendered.
      */}
      <style>{animationStyles}</style>

      <section className="bg-gray-50 w-full py-16 md:py-10 overflow-hidden">
        <div className="container mx-auto flex flex-col md:flex-row max-w-7xl">
          
          {/* === Heading Section (Left) === */}
          <div className="w-full md:w-1/4 flex-shrink-0 px-6 md:px-8 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Our Latest
            </h2>
            <p className="text-gray-600 text-lg">
              A continuous look at our most recent work and moments.
            </p>
          </div>

          {/* === Scroller Section (Right) === */}
          <div className="w-full md:w-3/4 relative overflow-hidden">
            
            {/* Gradient Fades for seamless edges */}
            <div className="absolute top-0 left-0 z-10 h-full w-16 bg-gradient-to-r from-gray-50 to-transparent" />
            <div className="absolute top-0 right-0 z-10 h-full w-16 bg-gradient-to-l from-gray-50 to-transparent" />

            {/* Scroller Track
              We apply the 'animate-scroll' class defined in the <style> tag.
            */}
            <div className="flex w-max animate-scroll">
              {doubledImages.map((src, index) => (
                <div key={index} className="flex-shrink-0 mx-4">
                  <img
                    src={src}
                    alt={`Latest work ${index % images.length + 1}`}
                    className="h-72 w-auto rounded-xl shadow-lg object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default LatestAlbum;