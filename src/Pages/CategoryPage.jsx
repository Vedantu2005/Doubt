import { useLayoutEffect, useRef } from "react";
import ScrollMarquee from "./ScrollMarquee";
import Whychoose from "./Whychoose";
import Faq from "./Faq";
import Banner from "./Banner";
import Numbers from "./Numbers";
import BelowHero from "./BelowHero";
import gsap from "gsap";
import Latest from "./Latest";

export default function CategoryPage() {
    const rootRef = useRef(null);
    const textRef = useRef(null);
    const imgRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                textRef.current,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.1 }
            );
            if (imgRef.current) {
                gsap.to(imgRef.current, {
                    rotate: 360,
                    ease: "none",
                    scrollTrigger: {
                        trigger: imgRef.current,
                        start: "top 80%",
                        end: "bottom top",
                        scrub: true,
                    },
                });
            }
        }, rootRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={rootRef} className="bg-white mt-15 pt-16 sm:pt-20">
            {/* Hero Section */}
            <section className="max-w-screen-xl mb-12 sm:mb-16 lg:mb-20 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center bg-[#5b392a] rounded-2xl sm:rounded-3xl lg:rounded-4xl px-4 sm:px-6 lg:px-8">
                    {/* Text Content */}
                    <div
                        ref={textRef}
                        className="flex flex-col justify-center flex-1 text-center lg:text-left mb-6 lg:mb-0 lg:pr-8"
                    >
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-28 font-main font-bold text-white leading-tight">
                            Category
                        </h1>
                    </div>

                    {/* Donut Image */}
                    <div className="w-full lg:w-auto flex justify-center">
                        <img
                            ref={imgRef}
                            src="/HeroImg.png"
                            alt="Donut"
                            className="w-40 h-40 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-58 lg:h-58 xl:w-72 xl:h-72 object-contain"
                        />
                    </div>
                </div>
            </section>

            <Latest />


        </div>
    );
}