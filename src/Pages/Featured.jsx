
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Featured() {
  const sectionRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      ScrollTrigger.batch("[data-animate='card']", {
        start: 'top 85%',
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.12,
            }
          )
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, { y: 60, opacity: 0, duration: 0.4, stagger: 0.08 })
        },
      })

      ScrollTrigger.batch("[data-animate='image']", {
        start: 'top 85%',
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.1,
            }
          )
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, { y: 60, opacity: 0, duration: 0.4, stagger: 0.06 })
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])
  return (
    <section ref={sectionRef} className="py-12 sm:py-16 bg-[#5B392A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
          <h2 className="text-4xl sm:text-5xl lg:text-[64px] leading-none font-main text-white">Featured</h2>
          <a href="/category">
            <button className="rounded-full bg-[#E88B47] text-white px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium hover:opacity-95">
              See All Products
            </button>
          </a>
        </div>

        {/* Top row - responsive layout */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Left large image */}
          <div data-animate="image" className="flex-1 bg-[#D4C5C1] rounded-[20px] sm:rounded-[24px] overflow-hidden">
            <img
              src="/featured1.jpg"
              alt="Colorful sprinkle donuts"
              className="w-full h-[300px] sm:h-[400px] lg:h-[520px] object-cover"
            />
          </div>

          {/* Center column - image + text */}
          <div className="flex-1 relative lg:-top-[6rem] max-w-full lg:max-w-[360px]">
            <div data-animate="image" className="bg-[#D4C5C1] rounded-[20px] sm:rounded-[24px] overflow-hidden mb-4 sm:mb-6">
              <img
                src="/featured2.jpg"
                alt="Stacked colorful donuts"
                className="w-full h-[200px] sm:h-[240px] lg:h-[260px] object-cover"
              />
            </div>
            <div className="pt-2 sm:pt-4">
              <h3 className="font-serif text-lg sm:text-xl lg:text-2xl text-white font-main leading-[1.1] mb-4 sm:mb-6">
                Exploring Different Types of Sprinkles for Donuts
              </h3>
              <p className="text-base sm:text-lg font-secondary text-white leading-[1.6] max-w-full lg:max-w-[320px]">
                I am text block. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>

          {/* Right large image */}
          <div data-animate="image" className="flex-1 bg-[#D4C5C1] rounded-[20px] sm:rounded-[24px] overflow-hidden">
            <img
              src="/featured3.jpg"
              alt="Chocolate drizzled donuts"
              className="w-full h-[300px] sm:h-[400px] lg:h-[520px] object-cover"
            />
          </div>
        </div>

        {/* Products row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: 'Crunchy Nuts',
              price: '$6.00',
              img: '/Product1.jpg',
            },
            {
              title: 'Crunchy Chocolate',
              price: '$5.00',
              old: '$10.00',
              sale: true,
              img: '/product2.jpg',
            },
            {
              title: 'Premium Chocolate',
              price: '$5.00',
              img: '/product3.jpg',
            },
            {
              title: 'Caviar Tiramisu',
              price: '$6.00',
              img: '/product4.jpg',
            },
          ].map((p, i) => (
            <div key={i} data-animate="card" className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 text-center relative">
              {p.sale && (
                <span className="absolute h-12 w-12 sm:h-16 sm:w-16 flex items-center font-secondary justify-center -top-3 -right-3 sm:-top-4 sm:-right-4 rounded-full bg-orange-400 text-white text-sm sm:text-lg px-2 sm:px-3 py-1 font-medium">
                  Sale!
                </span>
              )}
              <div data-animate="image" className="flex items-center justify-center h-60 sm:h-80 mb-3 sm:mb-4">
                <img src={p.img} alt={p.title} className="h-full object-cover rounded-full" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-semibold font-main mb-2">{p.title}</div>
                <div className="mb-3 sm:mb-4 text-[#2d2a26]">
                  {p.old && (
                    <span className="text-base sm:text-lg text-gray-400 line-through mr-2">{p.old}</span>
                  )}
                  <span className="font-bold text-base sm:text-lg">{p.price}</span>
                </div>
                <button className="inline-block cursor-pointer rounded-full bg-orange-400 font-secondary text-white text-sm sm:text-base px-6 sm:px-10 py-2 sm:py-3 font-medium hover:opacity-90 ">
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



