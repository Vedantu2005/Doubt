import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Search } from 'lucide-react';
import gsap from 'gsap';
import { useParams, Link } from 'react-router-dom';

// 🚨 FIREBASE IMPORTS 🚨
import { db } from '../firebase'; 
import { collection, query, where, getDocs, doc, onSnapshot, addDoc, orderBy } from "firebase/firestore"; 
import { checkIsStoreOpen } from "../utils/storeStatus"; 

// --- Configuration ---
const COLLECTION_NAME = 'yralfoods'; 

const getUserId = () => {
    try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser).uid : null;
    } catch (e) { return null; }
};

const formatProductFromFirestore = (doc) => {
    const data = doc.data();
    const price = parseFloat(data.price) || 0;
    const salePrice = parseFloat(data.salePrice || data.saleprice) || 0; 
    const isSale = salePrice > 0 && salePrice < price;
    const currentPrice = isSale ? salePrice : price;
    const oldPrice = isSale ? price : null;
    let imageUrl = '/default.jpg';
    const rawImage = data.image || data.gallery?.image || ''; 

    if (typeof rawImage === 'string' && rawImage.length > 100 && !rawImage.startsWith('http')) {
        imageUrl = rawImage.startsWith('data:image') ? rawImage : `data:image/jpeg;base64,${rawImage}`;
    } else if (rawImage) { imageUrl = rawImage; }
    
    const title = data.title || 'Unknown Product';
    const docSlug = data.slug || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

    return {
        id: doc.id,
        title: title,
        price: `$${currentPrice.toFixed(2)}`, 
        originalPrice: oldPrice ? `$${oldPrice.toFixed(2)}` : null,
        sale: isSale,
        img: imageUrl,
        description: data.description || 'No description provided.',
        category: data.category_id || 'Uncategorized',
        slug: docSlug,
        sku: data.sku || doc.id,
    };
};

const ProductList = () => {
    const { slug } = useParams(); 
    const userId = getUserId(); 
    
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isStoreOpen, setIsStoreOpen] = useState(true);
    const [reviews, setReviews] = useState([]); // 🌟 State for actual reviews

    // --- UI States ---
    const [quantity, setQuantity] = useState(1); 
    const [isImageHovered, setIsImageHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showFullImage, setShowFullImage] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewForm, setReviewForm] = useState({ review: '', name: '', email: '', saveInfo: false });

    const rootRef = useRef(null);
    const textRef = useRef(null);
    const imgRef = useRef(null);

    // ===================================
    // === STORE STATUS LISTENER ===
    // ===================================
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "businessWorkHours", "workHours"), (docSnap) => {
            if (docSnap.exists()) {
                setIsStoreOpen(checkIsStoreOpen(docSnap.data().workHours));
            }
        });
        return () => unsub();
    }, []);

    // ===================================
    // === FETCH APPROVED REVIEWS ===
    // ===================================
    useEffect(() => {
        if (!product?.id) return;
        
        // Listen for reviews that are 'approved' for this specific product
        const q = query(
            collection(db, "reviews"), 
            where("productId", "==", product.id),
            where("status", "==", "approved")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReviews(list);
        });

        return () => unsub();
    }, [product?.id]);

    // ===================================
    // === CART HANDLER ===
    // ===================================
    const handleAddToCart = async () => {
        if (!product || !isStoreOpen) return;
        const itemCore = { id: product.id, sku: product.sku, title: product.title, price: product.price, quantity: quantity, timestamp: new Date().toISOString() };
        if (userId) {
            try {
                await addDoc(collection(db, 'users', userId, 'cart'), itemCore); 
                alert(`${itemCore.quantity} x ${product.title} added!`);
            } catch (error) { alert("Failed to update cart."); }
        } else {
            let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            const idx = guestCart.findIndex(c => c.id === itemCore.id);
            if (idx > -1) guestCart[idx].quantity += quantity; else guestCart.push({ ...itemCore, image: product.img });
            localStorage.setItem('guestCart', JSON.stringify(guestCart));
            alert("Added to guest cart!");
        }
    };

    // ===================================
    // === REVIEW SUBMIT HANDLER ===
    // ===================================
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return alert("Please select a rating");

        try {
            await addDoc(collection(db, "reviews"), {
                productId: product.id,
                productTitle: title,
                rating,
                review: reviewForm.review,
                name: reviewForm.name,
                email: reviewForm.email,
                status: "pending", // 👈 Requires Admin Approval
                createdAt: new Date().toISOString()
            });
            alert("Review submitted! It will appear after admin approval.");
            setReviewForm({ review: '', name: '', email: '', saveInfo: false });
            setRating(0);
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    // ===================================
    // === PRODUCT FETCHING EFFECT ===
    // ===================================
    useEffect(() => {
        const fetchProductBySlug = async () => {
            if (!slug) { setIsLoading(false); return; }
            setIsLoading(true);
            try {
                const q = query(collection(db, COLLECTION_NAME), where("slug", "==", slug));
                const snap = await getDocs(q);
                if (!snap.empty) setProduct(formatProductFromFirestore(snap.docs[0]));
                else setProduct(null);
            } catch (error) { console.error(error); } finally { setIsLoading(false); }
        };
        fetchProductBySlug();
    }, [slug]); 

    // --- UI Handlers ---
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({ 
            x: e.clientX - rect.left, y: e.clientY - rect.top, 
            xPercent: ((e.clientX - rect.left) / rect.width) * 100, 
            yPercent: ((e.clientY - rect.top) / rect.height) * 100 
        });
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(textRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 });
            if (imgRef.current) gsap.to(imgRef.current, { rotate: 360, ease: 'none', scrollTrigger: { trigger: imgRef.current, start: 'top 80%', end: 'bottom top', scrub: true } });
        }, rootRef);
        return () => ctx.revert();
    }, []);

    const relatedProducts = [
        { id: 1, name: 'Caramel Chocolate', price: 5.00, image: '/Product1.jpg' },
        { id: 2, name: 'Caramel Peanuts', price: 6.00, image: '/product2.jpg' }
    ];

    if (isLoading) return <div className="min-h-screen pt-40 text-center text-xl text-gray-600">Loading...</div>;
    if (!product) return <div className="min-h-screen pt-40 text-center text-xl text-red-600">Product Not Found</div>;
    
    const { title, description, originalPrice, price: currentPrice, sale, img, category } = product;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-screen-xl mx-auto px-4 py-8">
                <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
                    <div className="flex flex-col lg:flex-row items-center bg-[#5b392a] rounded-2xl px-4 sm:px-6 lg:px-8 py-6">
                        <div ref={textRef} className="flex flex-col justify-center flex-1 text-center lg:text-left mb-6 lg:mb-0 lg:pr-8">
                            <h1 className="text-2xl font-main mt-1 lg:mt-40 sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white">{title}</h1>
                        </div>
                        <div className="w-64 sm:w-72 md:w-80 lg:w-auto flex justify-center items-center">
                            <img ref={imgRef} src={img || "/HeroImg.png"} alt={title} className="w-40 h-40 sm:w-64 lg:w-72 object-contain" />
                        </div>
                    </div>
                </section>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <nav className="text-sm mb-6 text-gray-500 flex flex-wrap gap-1 sm:gap-2">
                        <Link to="/">Home</Link> / <Link to="/products" className='capitalize'>{category}</Link> / <span className='font-semibold text-gray-700'>{title}</span>
                    </nav>
            
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        <div>
                            <h1 className="text-3xl font-main sm:text-4xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{title}</h1>
                            <div className="text-gray-500 text-sm sm:text-base mb-6 product-description-html" dangerouslySetInnerHTML={{ __html: description }} />
                            <div className="flex items-center gap-3 mb-6">
                                {sale && originalPrice && <span className="text-gray-400 line-through text-xl sm:text-2xl">{originalPrice}</span>}
                                <span className="text-black font-bold text-2xl sm:text-3xl">{currentPrice}</span>
                            </div>
            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <input type="number" value={quantity} disabled={!isStoreOpen} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} min="1" className="w-20 sm:w-24 px-4 py-3 border border-gray-300 rounded-xl text-center disabled:bg-gray-100" />
                                <button onClick={handleAddToCart} disabled={!isStoreOpen} className={`px-6 sm:px-10 py-3 rounded-xl font-semibold transition-colors text-white ${isStoreOpen ? "bg-orange-400 hover:bg-orange-500" : "bg-gray-400 cursor-not-allowed opacity-70"}`}>
                                    {isStoreOpen ? "Add to cart" : "Store Closed"}
                                </button>
                            </div>
                        </div>
            
                        <div className="relative w-full lg:w-auto">
                            {sale && <div className="absolute -top-5 -left-5 z-20 bg-[#958e09] text-white px-3 py-2 rounded-full font-semibold text-sm shadow-lg">Sale!</div>}
                            <div className="absolute top-4 right-4 z-20 cursor-pointer bg-white hover:bg-opacity-20 p-2 sm:p-3 rounded-full" onClick={() => setShowFullImage(true)}><Search className="w-5 h-5 text-gray-700" /></div>
                            <div className="relative overflow-hidden rounded-lg h-96 sm:h-[30rem] bg-white shadow-lg cursor-none" onMouseEnter={() => setIsImageHovered(true)} onMouseLeave={() => setIsImageHovered(false)} onMouseMove={handleMouseMove}>
                                <img src={img} alt={title} className="w-full h-full object-cover" />
                                {isImageHovered && <div className="absolute w-64 sm:w-80 h-64 border rounded-full shadow-2xl pointer-events-none z-10" style={{ left: mousePosition.x - 80, top: mousePosition.y - 80, backgroundImage: `url(${img})`, backgroundSize: '600% 600%', backgroundPosition: `${mousePosition.xPercent}% ${mousePosition.yPercent}%` }} />}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
                    <div>
                        <div className="border-b border-gray-300 mb-8">
                            <button className="px-6 py-3 border-b-2 border-gray-800 font-medium text-gray-800">
                                Reviews ({reviews.length})
                            </button>
                        </div>
                        <div className="mb-8">
                            <h2 className="text-3xl font-main font-bold text-gray-900 mb-6">Customer Reviews</h2>
                            
                            {/* 🌟 DISPLAY APPROVED REVIEWS 🌟 */}
                            {reviews.length === 0 ? (
                                <p className="text-gray-600 mb-6">There are no approved reviews yet.</p>
                            ) : (
                                <div className="space-y-6 mb-10 max-h-96 overflow-y-auto pr-4">
                                    {reviews.map((rev) => (
                                        <div key={rev.id} className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                            <div className="flex text-yellow-500 mb-2">
                                                {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                                            </div>
                                            <p className="font-bold text-gray-800">{rev.name}</p>
                                            <p className="text-gray-600 text-sm italic">"{rev.review}"</p>
                                            <p className="text-[10px] text-gray-400 mt-2">{new Date(rev.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold mb-4">Leave a Review</h3>
                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2">Your rating <span className="text-red-500">*</span></label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="text-2xl transition-colors">
                                                <span className={`${(hoverRating || rating) >= star ? 'text-orange-400' : 'text-gray-300'}`}>★</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-6"><label className="block text-gray-700 mb-2">Your review <span className="text-red-500">*</span></label><textarea value={reviewForm.review} onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-2xl min-h-24" required /></div>
                                <div className="mb-6"><label className="block text-gray-700 mb-2">Name <span className="text-red-500">*</span></label><input type="text" value={reviewForm.name} onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-full" required /></div>
                                <div className="mb-6"><label className="block text-gray-700 mb-2">Email <span className="text-red-500">*</span></label><input type="email" value={reviewForm.email} onChange={(e) => setReviewForm({...reviewForm, email: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-full" required /></div>
                                <button type="submit" className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-full hover:bg-black transition-colors">Submit Review</button>
                            </form>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-4xl font-bold font-main text-gray-900 mb-8">Related products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 px-10">
                            {relatedProducts.map((p) => (
                                <div key={p.id} className="bg-[#fbf3f0] rounded-lg p-6 text-center">
                                    <div className="mb-4 rounded-full overflow-hidden"><img src={p.image} alt={p.name} className="w-full h-48 object-cover" /></div>
                                    <h3 className="text-base font-main font-semibold text-gray-900 mb-2">{p.name}</h3>
                                    <p className="text-base font-main font-bold text-gray-900 mb-4">${p.price.toFixed(2)}</p>
                                    <button disabled={!isStoreOpen} className={`text-sm text-white px-5 py-1.5 rounded-full font-semibold transition-colors ${isStoreOpen ? "bg-orange-400 hover:bg-orange-500" : "bg-gray-400 cursor-not-allowed"}`}>Add to cart</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {showFullImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={() => setShowFullImage(false)}>
                        <div className="relative max-w-5xl max-h-full"><img src={img} alt={title} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} /><button className="absolute top-4 right-4 text-white text-3xl font-bold bg-black bg-opacity-60 w-10 h-10 rounded-full flex items-center justify-center" onClick={() => setShowFullImage(false)}>×</button></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;