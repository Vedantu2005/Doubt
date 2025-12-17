import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Banner1() {
  const sectionRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )

      ScrollTrigger.batch("[data-anim='banner-card']", {
        start: 'top 90%',
        onEnter: (els) => gsap.fromTo(els, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', stagger: 0.12 }),
        onLeaveBack: (els) => gsap.to(els, { y: 60, opacity: 0, duration: 0.4, stagger: 0.06 })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Promo Bundling */}
        <div data-anim='banner-card' className="relative rounded-2xl sm:rounded-3xl bg-[#ead6ca] px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10 overflow-hidden flex items-center min-h-[200px] sm:min-h-[250px]">
          <div className="z-10">
            <div className="text-black font-semibold text-xs sm:text-sm md:text-base font-main mb-2">Get 20% Off</div>
            <h3 className="text-lg sm:text-xl md:text-3xl font-semibold font-main text-[#2d2a26] mb-4 sm:mb-5">Promo Bundling</h3>
            <button className="rounded-full cursor-pointer bg-[#E88B47] text-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-sm font-semibold">Grab Now</button>
          </div>
          <img
            src="banner1.png"
            alt="Donut"
            className="absolute -right-20 sm:-right-32 top-1/2 -translate-y-1/2 w-[120px] sm:w-[180px] md:w-[240px] pointer-events-none select-none"
            loading="lazy"
          />
        </div>

        {/* Buy 1 Get 1 */}
        <div data-anim='banner-card' className="relative rounded-2xl sm:rounded-3xl bg-[#e18126] px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10 overflow-hidden flex items-center min-h-[160px] sm:min-h-[180px]">
          <div className="z-10 text-white">
            <div className="opacity-90 text-xs sm:text-sm font-semibold md:text-lg font-main mb-2">Special Day</div>
            <h3 className="text-lg sm:text-xl md:text-4xl font-semibold font-main mb-4 sm:mb-5">Buy 1 Get 1</h3>
            <button className="rounded-full cursor-pointer bg-white text-[#2d2a26] px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-sm font-semibold">Shop Now</button>
          </div>
          <img
            src="banner2.png"
            alt="Donut"
            className="absolute -right-20 sm:-right-32 top-1/2 -translate-y-1/2 w-[120px] sm:w-[180px] md:w-[240px] pointer-events-none select-none"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}