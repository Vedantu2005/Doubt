import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const CATEGORIES = [
  {
    title: 'Gourmet Donut',
    img: '/browse1.jpg',
  },
  {
    title: 'Sprinkle Donut',
    img: '/browse2.jpg',
  },
  {
    title: 'Filled Donut',
    img: '/browse3.jpg',
  },
  {
    title: 'Jelly Donut',
    img: '/browse4.jpg',
  },
]

export default function Browse() {
  const sectionRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )

      ScrollTrigger.batch("[data-animate='browse-card']", {
        start: 'top 90%',
        onEnter: (els) => gsap.fromTo(els, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', stagger: 0.12 }),
        onLeaveBack: (els) => gsap.to(els, { y: 60, opacity: 0, duration: 0.4, stagger: 0.06 }),
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 sm:mb-8 md:mb-10 gap-4">
        <h2 className="bg-[#e18126] px-4 sm:px-6 lg:px-10 py-2 sm:py-3 font-semibold text-2xl sm:text-3xl leading-[1.05] font-main text-black">
          Browse By Category
        </h2>
        <a href="#" className="text-black underline text-lg sm:text-xl hover:text-orange-600">
          See All Category
        </a>
      </div>

      {/* Categories row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {CATEGORIES.map((c, i) => (
          <div key={i} data-animate="browse-card" className="group">
            <div className="rounded-[16px] sm:rounded-[20px] overflow-hidden shadow-sm bg-white">
              <img src={c.img} alt={c.title} className="w-full h-[180px] sm:h-[200px] md:h-[220px] object-cover" loading="lazy" />
            </div>
            <div className="mt-2 sm:mt-3">
              <div className="bg-[#e18126] cursor-pointer text-black font-semibold text-center px-3 sm:px-4 py-2 sm:py-3 font-main text-sm sm:text-base md:text-lg">
                {c.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}


