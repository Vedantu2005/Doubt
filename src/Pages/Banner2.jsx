import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Banner2() {
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
      {/* Big banner */}
      <div data-anim='banner-card' className="rounded-2xl sm:rounded-3xl bg-[#4a2f25] text-white overflow-hidden">
        <div className="flex flex-col lg:flex-row items-stretch">
          <div className="px-4 sm:px-6 md:px-12 py-8 sm:py-10 md:py-14 flex-1">
            <h3 className="font-main text-xl sm:text-2xl md:text-[40px] leading-[1.1] mb-4 sm:mb-6">Delicious Variations of Coffee Donuts You Must Try</h3>
            <p className="text-white/90 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 max-w-full lg:max-w-[58ch]">
              I am text block. Click edit button to change this text. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.
            </p>
            <button className="rounded-full cursor-pointer bg-[#E88B47] text-white px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-semibold">Shop Now</button>
          </div>
          <div className="relative h-64 sm:h-80 lg:h-[27rem] w-full lg:w-[35%]">
            <div className="h-full rounded-t-2xl sm:rounded-t-3xl overflow-hidden bg-white/5 lg:mr-10">
              <img
                src="banner3.jpg"
                alt="Coffee donut"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}