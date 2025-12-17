import { useEffect, useRef, useState } from 'react'; // 🚨 Import useState
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 🚨 FIREBASE IMPORTS 🚨
// NOTE: Ensure your '../firebase' path is correct and accessible relative to this component.
import { db } from '../firebase'; 
import { collection, getDocs, query } from "firebase/firestore";


export default function Category() { // Renamed from Browse for consistency
    const sectionRef = useRef(null);
    // 🌟 NEW STATE: To store the fetched categories
    const [categories, setCategories] = useState([]);
    
    // 🌟 NEW FUNCTION: Fetch ALL categories from Firestore
    const fetchCategories = async () => {
        try {
            const categoriesRef = collection(db, 'categories');
            // Fetch all documents. If you have thousands of categories, you should add pagination/caching.
            const q = query(categoriesRef); 
            
            const querySnapshot = await getDocs(q);
            
            const fetchedCategories = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title || 'No Title', 
                    img: data.c_image || '/default-category.jpg', // Assuming you have an image field named 'c_image'
                };
            });

            setCategories(fetchedCategories);

        } catch (error) {
            console.error("Error fetching all categories:", error);
            // Fallback to empty array
            setCategories([]);
        }
    };
    
    // 🌟 NEW EFFECT: Run the fetch function on component mount
    useEffect(() => {
        fetchCategories();
    }, []); 

    // --- GSAP Animation Logic (Unchanged) ---
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
            gsap.fromTo(
                sectionRef.current,
                { y: 80, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
            );

            // Animate category cards after they are loaded
            if (categories.length > 0) {
                ScrollTrigger.batch("[data-animate='browse-card']", {
                    start: 'top 90%',
                    onEnter: (els) => gsap.fromTo(els, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', stagger: 0.12 }),
                    onLeaveBack: (els) => gsap.to(els, { y: 60, opacity: 0, duration: 0.4, stagger: 0.06 }),
                });
            }
        }, sectionRef);
        return () => ctx.revert();
    // Re-run animation logic when categories load
    }, [categories]); 
    // ----------------------------------------


    // --- Rendering ---
    return (
        <section ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 sm:mb-8 md:mb-10 gap-4">
                <h2 className="bg-[#e18126] px-4 sm:px-6 lg:px-10 py-2 sm:py-3 font-semibold text-2xl sm:text-3xl leading-[1.05] font-main text-black">
                    Browse By Category
                </h2>
                <a href="/category" className="text-black underline text-lg sm:text-xl hover:text-orange-600">
                    See All Category
                </a>
            </div>

            {/* Categories row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {categories.length > 0 ? (
                    categories.map((c, i) => (
                        <a 
                            key={c.id} 
                            data-animate="browse-card" 
                            className="group cursor-pointer"
                            // Create a URL slug from the category title
                            href={`/category/${c.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                            <div className="rounded-[16px] sm:rounded-[20px] overflow-hidden shadow-sm bg-white">
                                {/* Use image URL fetched from Firestore */}
                                <img 
                                    src={c.img} 
                                    alt={c.title} 
                                    className="w-full h-[180px] sm:h-[200px] md:h-[220px] object-cover transition-transform duration-300 group-hover:scale-105" 
                                    loading="lazy" 
                                />
                            </div>
                            <div className="mt-2 sm:mt-3">
                                <div className="bg-[#e18126] text-black font-semibold text-center px-3 sm:px-4 py-2 sm:py-3 font-main text-sm sm:text-base md:text-lg">
                                    {c.title}
                                </div>
                            </div>
                        </a>
                    ))
                ) : (
                    // Display loading or fallback state
                    <p className="col-span-full text-center text-gray-500">
                        {categories.length === 0 ? "No categories found." : "Loading categories..."}
                    </p>
                )}
            </div>
        </section>
    );
}