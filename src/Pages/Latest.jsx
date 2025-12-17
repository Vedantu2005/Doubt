import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 🚨 FIREBASE IMPORTS 🚨
import { db } from '../firebase';
import {
    collection,
    getDocs,
    query,
    limit,
    startAfter,
    doc,
    updateDoc,
    arrayUnion,
    orderBy,
    addDoc // 👈 Added for sub-collection creation
} from "firebase/firestore";

// --- Configuration ---
const PRODUCTS_PER_LOAD = 8;
const ORDER_FIELD = 'title';
const COLLECTION_NAME = 'yralfoods';

// ===================================
// === HELPER FUNCTIONS ===
// ===================================

const getUserId = () => {
    try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser).uid : null;
    } catch (e) {
        return null;
    }
};

const formatProductFromFirestore = (doc) => {
    const data = doc.data();

    const regularPrice = parseFloat(data.price) || 0;
    const salePrice = parseFloat(data.salePrice) || 0; 
    
    const isSale = salePrice > 0 && salePrice < regularPrice;
    const currentPrice = isSale ? salePrice : regularPrice; 
    const oldPriceForDisplay = isSale ? regularPrice : null; 
    
    let imageUrl = '/default.jpg';
    const rawImage = data.image || data.gallery?.image || ''; 

    if (typeof rawImage === 'string' && rawImage.length > 100 && !rawImage.startsWith('http')) {
        imageUrl = rawImage.startsWith('data:image') 
                   ? rawImage 
                   : `data:image/jpeg;base64,${rawImage}`;
    } else if (rawImage) {
        imageUrl = rawImage;
    }

    const title = data.title || 'Unknown Product';
    
    return {
        id: doc.id,
        title: title,
        price: `$${currentPrice.toFixed(2)}`,
        sale: isSale,
        img: imageUrl,
        sku: data.sku,
        originalPrice: oldPriceForDisplay ? `$${oldPriceForDisplay.toFixed(2)}` : null,
        slug: data.slug 
    };
};


export default function Latest() {
    const sectionRef = useRef(null);

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastVisible, setLastVisible] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const userId = getUserId();

    // ===================================
    // === FIREBASE FETCHING LOGIC (Unchanged) ===
    // ===================================

    const fetchProducts = async (isInitialLoad) => {
        setIsLoading(true);
        try {
            const productsRef = collection(db, COLLECTION_NAME);
            let q;

            if (isInitialLoad) {
                q = query(productsRef, orderBy(ORDER_FIELD), limit(PRODUCTS_PER_LOAD));
            } else {
                if (!lastVisible) return;
                q = query(productsRef, orderBy(ORDER_FIELD), startAfter(lastVisible), limit(PRODUCTS_PER_LOAD));
            }

            const querySnapshot = await getDocs(q);
            const snapshotDocs = querySnapshot.docs;
            const newProducts = snapshotDocs.map(formatProductFromFirestore);

            setLastVisible(snapshotDocs[snapshotDocs.length - 1]);
            setHasMore(snapshotDocs.length === PRODUCTS_PER_LOAD);

            setProducts(prevProducts => isInitialLoad ? newProducts : [...prevProducts, ...newProducts]);

        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ===================================
    // === CART & USER LOGIC (FIXED FOR SUB-COLLECTION) ===
    // ===================================

    const handleAddToCart = async (product) => {
        // 1. Define the item structure (NO BASE64 IMAGE FOR FIREBASE!)
        const itemCore = {
            id: product.id,
            sku: product.sku || '',
            title: product.title,
            price: product.price, // Formatted price string ($X.XX)
            quantity: 1, 
            timestamp: new Date().toISOString()
        };

        if (userId) {
            // 🚀 AUTHENTICATED USER: SAVE TO SUB-COLLECTION 'cart'
            try {
                // Get reference to the sub-collection: users/{userId}/cart
                const cartCollectionRef = collection(db, 'users', userId, 'cart');
                
                // Create a new document for the item (using itemCore - NO IMAGE)
                await addDoc(cartCollectionRef, itemCore); 
                
                alert(`${product.title} added to your Firestore sub-collection cart!`);
            } catch (error) {
                // This now catches errors like "User document does not exist" or index issues.
                console.error("Error adding to Firestore sub-collection cart:", error);
                alert(`Failed to add item. Error: ${error.message}`);
            }
        } else {
            // Guest User: Local Storage Cart (This logic remains the same)
            const itemLocal = { ...itemCore, image: product.img }; // Add image back for LS
            
            let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            
            const existingItemIndex = guestCart.findIndex(cartItem => cartItem.id === itemLocal.id);
            
            if (existingItemIndex > -1) {
                guestCart[existingItemIndex].quantity += 1; 
            } else {
                guestCart.push(itemLocal);
            }

            localStorage.setItem('guestCart', JSON.stringify(guestCart));
            alert(`${product.title} added to your guest cart (Local Storage)!`);
        }
    };

    // ===================================
    // === EFFECTS & RENDERING ===
    // ===================================

    // Initial fetch on mount
    useEffect(() => {
        fetchProducts(true);
    }, []); 

    // GSAP Animation Logic
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            gsap.fromTo(
                sectionRef.current,
                { y: 80, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
            );

            ScrollTrigger.batch("[data-animate='product']", {
                start: 'top 90%',
                onEnter: (els) => {
                    gsap.fromTo(
                        els,
                        { y: 70, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12, overwrite: 'auto' }
                    );
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [products]); 

    return (
        <section ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-10">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {products.map((p) => (
                    <a
                        key={p.id}
                        data-animate="product"
                        href={`/product/${p.slug}`} 
                        className="bg-[#faf4f0] rounded-[20px] sm:rounded-[28px] shadow-sm p-4 sm:p-6 relative block hover:shadow-lg transition-shadow"
                    >
                        {p.sale && (
                            <span className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#E88B47] text-white grid place-items-center font-semibold text-sm pointer-events-none">
                                Sale!
                            </span>
                        )}

                        <div className="flex items-center justify-center h-[200px] sm:h-[260px] md:h-[300px] mb-4 sm:mb-6">
                            <img
                                src={p.img}
                                alt={p.title}
                                className="max-h-full w-auto object-contain"
                                loading="lazy"
                            />
                        </div>

                        <div className="text-center">
                            <div className="text-base sm:text-lg font-main font-semibold mb-2 text-black">{p.title}</div>
                            
                            <div className="mb-4 sm:mb-5 text-black font-main flex justify-center items-end gap-2">
                                {p.sale && p.originalPrice && (
                                    <span className="text-sm sm:text-base text-gray-400 line-through mr-2">
                                        {p.originalPrice}
                                    </span>
                                )}
                                <span className="text-sm sm:text-base md:text-xl font-bold">
                                    {p.price}
                                </span>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    handleAddToCart(p);
                                }}
                                className="rounded-full bg-[#E88B47] text-white px-4 sm:px-6 py-2 text-xs sm:text-sm md:text-base font-medium hover:opacity-95 pointer-events-auto"
                            >
                                Add to cart
                            </button>
                        </div>
                    </a>
                ))}
            </div>

            {/* Conditional Loading and Load More */}
            {hasMore && (
                <div className="flex justify-center mt-10">
                    <button
                        onClick={() => fetchProducts(false)}
                        disabled={isLoading}
                        className={`px-8 py-3 rounded-full text-white font-semibold transition-colors
                                   ${isLoading ? 'bg-gray-400' : 'bg-[#E88B47] hover:bg-[#c6793c]'}`}
                    >
                        {isLoading ? 'Loading...' : 'Load More Products'}
                    </button>
                </div>
            )}

            {/* End of List Message */}
            {!hasMore && products.length > 0 && (
                <p className="text-center text-gray-500 mt-10">You've reached the end of the product list!</p>
            )}

            {/* Initial Loading or No Data Message */}
            {products.length === 0 && !isLoading && (
                 <p className="text-center text-gray-500 mt-10">
                    No products found. Please ensure your Firebase setup and security rules are configured correctly.
                 </p>
            )}
        </section>
    );
}