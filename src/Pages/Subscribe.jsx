export default function Subscribe() {
    return (
      <section className="bg-[#efddd1] py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-main font-bold text-black mb-6 sm:mb-8">
            Subscribe to Our Newsletter <br className="hidden sm:block" /> and Grab 45% Off!
          </h2>
  
          {/* Input + Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter email here"
              className="w-full sm:w-[300px] lg:w-[400px] px-6 sm:px-8 lg:px-16 py-3 sm:py-4 text-sm sm:text-base bg-white rounded-full outline-none text-black"
            />
            <button className="w-full sm:w-auto px-12 sm:px-16 lg:px-20 py-3 sm:py-4 cursor-pointer bg-[#d8721a] text-white font-medium rounded-full hover:bg-[#b85e14] transition text-sm sm:text-base">
              Send
            </button>
          </div>
        </div>
      </section>
    );
  }
  