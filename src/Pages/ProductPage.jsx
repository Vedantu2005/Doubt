import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import Category from './Category';
import Feautured from './Featured';
import Banner from './Banner';
import LatestProducts from './LatestProducts';
import Banner1 from './Banner1';
import Banner2 from './Banner2';

export default function ProductPage() {
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

    return (
        <div ref={rootRef} className="bg-white pt-20 mt-15">
            <section ref={rootRef} className="max-w-screen-xl mb-20 mx-auto flex flex-col lg:flex-row items-center bg-[#5b392a] rounded-4xl">


                {/* Text Content */}
                <div
                    ref={textRef}
                    className="flex flex-col justify-end flex-1 px-4 sm:px-6 lg:px-8 lg:text-left mt-6 lg:mt-0"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-28 font-main font-bold text-white leading-tight sm:leading-snug">
                        Product Archive
                    </h1>
                </div>


                {/* Donut Image */}
                <div className="w-full lg:w-auto flex justify-center lg:justify-start" ref={imgRef}>
                    <img
                        ref={imgRef}
                        src="/HeroImg.png"
                        alt="Donut"
                        className="w-40 h-40 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-58 lg:h-58 xl:w-72 xl:h-72 object-contain"
                    />
                </div>

            </section>

            <Category />
            <Feautured />
            <Banner1 />
            <LatestProducts />
            <Banner2 />
        </div>
    );
}