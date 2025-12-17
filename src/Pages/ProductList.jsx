import React, { useState, useRef, useLayoutEffect } from 'react';
import { Search } from 'lucide-react';
import gsap from 'gsap';

const ProductList = () => {
  const [quantity, setQuantity] = useState(1);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showFullImage, setShowFullImage] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    review: '',
    name: '',
    email: '',
    saveInfo: false
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    setMousePosition({ 
      x: x, 
      y: y, 
      xPercent: xPercent, 
      yPercent: yPercent 
    });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    console.log('Review submitted:', { ...reviewForm, rating });
  };
  const rootRef = useRef(null);
  const textRef = useRef(null);
  const imgRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
      );

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

  const relatedProducts = [
    {
      id: 1,
      name: 'Caramel Chocolate',
      price: 5.00,
      image: '/Product1.jpg'
    },
    {
      id: 2,
      name: 'Caramel Peanuts',
      price: 6.00,
      image: '/product2.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        {/* <nav className="text-sm text-gray-500 mb-8">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>Uncategorized</span>
          <span className="mx-2">/</span>
          <span>Sesame Filling</span>
        </nav> */}

        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
                <div className="flex flex-col lg:flex-row items-center bg-[#5b392a] rounded-2xl px-4 sm:px-6 lg:px-8 py-6">
                  {/* Text */}
                  <div
                    ref={textRef}
                    className="flex flex-col justify-center flex-1 text-center lg:text-left mb-6 lg:mb-0 lg:pr-8"
                  >
                    <h1 className="text-2xl font-main mt-1 lg:mt-40 sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
                      Product Details
                    </h1>
                  </div>
        
                  {/* Image */}
                  <div className="w-64 sm:w-72 md:w-80 lg:w-auto flex justify-center items-center">
                    <img
                      ref={imgRef}
                      src="/HeroImg.png"
                      alt="Donut"
                      className="w-40 h-40 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-58 lg:h-58 xl:w-72 xl:h-72 object-contain"
                    />
                  </div>
                </div>
              </section>
        
              {/* Product Section */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="text-sm mb-6 text-gray-500 flex flex-wrap gap-1 sm:gap-2">
                  <span>Home</span> / <span>Uncategorized</span> / <span>Sesame Filling</span>
                </nav>
        
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  {/* Left - Info */}
                  <div>
                    <h1 className="text-3xl font-main sm:text-4xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                      Sesame Filling
                    </h1>
                    <p className="text-gray-500 text-sm sm:text-base mb-6">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec
                      ullamcorper mattis, pulvinar dapibus leo.
                    </p>
        
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-gray-400 line-through text-xl sm:text-2xl">$11.00</span>
                      <span className="text-black font-bold text-2xl sm:text-3xl">$6.00</span>
                    </div>
        
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-20 sm:w-24 px-4 py-3 border border-gray-300 rounded-xl text-center"
                      />
                      <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 sm:px-10 py-3 rounded-xl font-semibold transition-colors">
                        Add to cart
                      </button>
                    </div>
                  </div>
        
                  {/* Right - Image */}
                  <div className="relative w-full lg:w-auto">
                    <div className="absolute -top-5 -left-5 z-20 bg-[#958e09] text-white px-3 py-2 rounded-full font-semibold text-sm shadow-lg">
                      Sale!
                    </div>
        
                    <div
                      className="absolute top-4 right-4 z-20 cursor-pointer bg-white hover:bg-opacity-20 p-2 sm:p-3 rounded-full transition-all"
                      onClick={() => setShowFullImage(true)}
                    >
                      <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 hover:text-gray-900" />
                    </div>
        
                    <div
                      className="relative overflow-hidden rounded-lg h-96 sm:h-[30rem] bg-white shadow-lg cursor-none"
                      onMouseEnter={() => setIsImageHovered(true)}
                      onMouseLeave={() => setIsImageHovered(false)}
                      onMouseMove={handleMouseMove}
                    >
                      <img
                        src="/Product1.jpg"
                        alt="Sesame Filling Donut"
                        className="w-full h-full object-cover"
                      />
        
                      {/* Zoom overlay */}
                      {isImageHovered && (
                        <div
                          className="absolute w-64 sm:w-80 h-64 sm:h-80 border rounded-full shadow-2xl pointer-events-none z-10"
                          style={{
                            left: mousePosition.x - 80,
                            top: mousePosition.y - 80,
                            backgroundImage: "url('/Product1.jpg')",
                            backgroundSize: '600% 600%',
                            backgroundPosition: `${mousePosition.xPercent}% ${mousePosition.yPercent}%`,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
        
                {/* Full Image Modal */}
                {showFullImage && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowFullImage(false)}
                  >
                    <div className="relative max-w-full max-h-full">
                      <img
                        src="/Product1.jpg"
                        alt="Full Size"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        className="absolute top-4 right-4 text-white text-2xl font-bold bg-black bg-opacity-60 hover:bg-opacity-80 w-10 h-10 rounded-full flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFullImage(false);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>

        {/* Reviews and Related Products Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          {/* Left side - Reviews */}
          <div>
            {/* Reviews Tab */}
            <div className="border-b border-gray-300 mb-8">
              <button className="px-6 py-3 border-b-2 border-gray-800 font-medium text-gray-800">
                Reviews (0)
              </button>
            </div>

            {/* Reviews Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-main font-bold text-gray-900 mb-6">Reviews</h2>
              <p className="text-gray-600 mb-6">There are no reviews yet.</p>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-2">Be the first to review "Sugar Ice"</p>
                <p className="text-sm text-gray-600 mb-1">
                  Your email address will not be published. Required fields are marked <span className="text-red-500">*</span>
                </p>
              </div>

              {/* Review Form */}
              <form onSubmit={handleReviewSubmit}>
                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Your rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-2xl focus:outline-none transition-colors"
                      >
                        <span className={`${(hoverRating || rating) >= star ? 'text-gray-800' : 'text-gray-300'}`}>
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Your review <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reviewForm.review}
                    onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-24"
                    required
                  />
                </div>

                {/* Name */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    className="w-full px-4 py-4 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={reviewForm.email}
                    onChange={(e) => setReviewForm({...reviewForm, email: e.target.value})}
                    className="w-full px-4 py-4 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                </div>

                {/* Save Info Checkbox */}
                <div className="mb-6">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reviewForm.saveInfo}
                      onChange={(e) => setReviewForm({...reviewForm, saveInfo: e.target.checked})}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-600">
                      Save my name, email, and website in this browser for the next time I comment.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded transition-colors"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>

          {/* Right side - Related Products */}
          <div>
            <h2 className="text-4xl font-bold font-main text-gray-900 mb-8">Related products</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 px-10">
              {relatedProducts.map((product) => (
                <div key={product.id} className="bg-[#fbf3f0] rounded-lg p-6 text-center">
                  {/* Product Image */}
                  <div className="mb-4  rounded-full overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  {/* Product Name */}
                  <h3 className="text-base font-main font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  
                  {/* Product Price */}
                  <p className="text-base font-main font-bold text-gray-900 mb-4">
                    ${product.price.toFixed(2)}
                  </p>
                  
                  {/* Add to Cart Button */}
                  <button className="bg-orange-400 text-sm hover:bg-orange-500 text-white px-5 py-1.5 rounded-full font-semibold transition-colors">
                    Add to cart 
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Image Modal */}
        {showFullImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFullImage(false)}
          >
            <div className="relative max-w-5xl max-h-full">
              <img
                src='/Product1.jpg'
                alt="Sesame Filling Donut - Full Size"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-bold bg-black bg-opacity-60 hover:bg-opacity-80 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullImage(false);
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;