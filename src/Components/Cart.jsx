import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Calendar, X } from 'lucide-react';
import { doc, updateDoc, deleteDoc, collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { db } from '../firebase'; 
import { checkIsStoreOpen } from "../utils/storeStatus"; // Helper to validate hours

// --- Configuration ---
const PRODUCTS_COLLECTION = 'yralfoods'; 
const USERS_COLLECTION = 'users'; 
const CART_SUBCOLLECTION = 'cart';

const getUserId = () => {
    try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser).uid : null;
    } catch (e) {
        return null;
    }
};

const formatProductDetails = (data) => {
    let imageUrl = data.image || data.gallery?.image || '/default.jpg';
    const rawImage = data.image || data.gallery?.image || '';
    if (typeof rawImage === 'string' && rawImage.length > 100 && !rawImage.startsWith('http')) {
        imageUrl = rawImage.startsWith('data:image') ? rawImage : `data:image/jpeg;base64,${rawImage}`;
    } else if (rawImage) {
        imageUrl = rawImage;
    }
    return {
        detailImage: imageUrl,
        detailTitle: data.title,
    };
};

const handleRemove = async (itemToRemove, userId, setCartItems, fetchCartData) => {
    if (!window.confirm(`Are you sure you want to remove ${itemToRemove.name} from your cart?`)) return;
    if (userId) {
        try {
            const itemDocRef = doc(db, USERS_COLLECTION, userId, CART_SUBCOLLECTION, itemToRemove.docId);
            await deleteDoc(itemDocRef); 
            alert("Item removed from Firestore cart!");
            fetchCartData();
        } catch (error) {
            console.error("Error removing from Firestore:", error);
            alert("Failed to remove item.");
        }
    } else {
        let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const updatedCart = guestCart.filter(item => item.id !== itemToRemove.id);
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        alert("Item removed from guest cart!");
    }
};

const updateQuantityLogic = (id, newQuantity, setCartItems) => {
    const quantityValue = parseInt(newQuantity);
    if (quantityValue < 1 || isNaN(quantityValue)) return;
    setCartItems(prevItems => prevItems.map(item => 
        item.id === id ? { ...item, quantity: quantityValue } : item
    ));
};

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isStoreOpen, setIsStoreOpen] = useState(true);

    const userId = getUserId();
    const textRef = useRef(null);
    const imgRef = useRef(null);
    
    // Listen for Real-time Store Status
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "businessWorkHours", "workHours"), (docSnap) => {
            if (docSnap.exists()) {
                setIsStoreOpen(checkIsStoreOpen(docSnap.data().workHours));
            }
        });
        return () => unsub();
    }, []);

    const fetchCartData = async () => {
        setIsLoading(true);
        let rawCartItems = [];
        try {
            if (userId) {
                const cartCollectionRef = collection(db, USERS_COLLECTION, userId, CART_SUBCOLLECTION);
                const cartSnapshot = await getDocs(cartCollectionRef);
                rawCartItems = cartSnapshot.docs.map(docSnap => ({
                    docId: docSnap.id, 
                    ...docSnap.data()
                }));
            } else {
                rawCartItems = JSON.parse(localStorage.getItem('guestCart') || '[]');
            }
            if (rawCartItems.length === 0) {
                setCartItems([]);
                return;
            }
            const productIds = rawCartItems.map(item => item.id).filter(id => id && userId);
            let productDetails = {};
            if (productIds.length > 0) {
                const productsRef = collection(db, PRODUCTS_COLLECTION);
                const detailsQuery = query(productsRef, where("__name__", "in", productIds)); 
                const detailsSnapshot = await getDocs(detailsQuery);
                detailsSnapshot.docs.forEach(docSnap => {
                    productDetails[docSnap.id] = formatProductDetails(docSnap.data());
                });
            }
            const mergedCart = rawCartItems.map(item => {
                const details = productDetails[item.id] || {};
                return {
                    id: item.id,
                    docId: item.docId,
                    name: item.title || item.name || details.detailTitle || 'Unknown Product',
                    quantity: item.quantity || 1,
                    priceNumber: parseFloat(item.price?.replace('$', '')) || 0, 
                    priceString: item.price, 
                    image: userId ? details.detailImage : item.image,
                    sku: item.sku,
                    timestamp: item.timestamp, 
                };
            });
            setCartItems(mergedCart);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCartData();
        window.addEventListener('storage', fetchCartData);
        return () => window.removeEventListener('storage', fetchCartData);
    }, [userId]); 

    const subtotal = cartItems.reduce((total, item) => total + (item.priceNumber * item.quantity), 0);

    const handleUpdateCart = async () => {
        const cartItemsForDB = cartItems.map(({priceNumber, ...rest}) => ({
            ...rest,
            title: rest.name, 
        }));
        if (userId) {
            try {
                await Promise.all(cartItemsForDB.map(item => {
                    const itemDocRef = doc(db, USERS_COLLECTION, userId, CART_SUBCOLLECTION, item.docId);
                    return updateDoc(itemDocRef, { quantity: item.quantity });
                }));
                alert("✅ Cart quantities updated!");
            } catch (error) {
                alert("❌ Failed to update quantities.");
            }
        } else {
            localStorage.setItem('guestCart', JSON.stringify(cartItemsForDB));
            alert("✅ Cart updated locally!");
        }
    };

    const renderCartContent = () => {
        if (isLoading) return <div className="text-center py-10 text-xl text-orange-600">Loading cart...</div>;
        if (cartItems.length === 0) {
            return (
                <div className="mb-8">
                    <div className="border-t-4 border-orange-400 bg-[#f6f5f8] p-4">
                        <div className="flex items-start gap-3">
                            <div className="text-orange-500 text-xl mt-0.5"><Calendar/></div>
                            <p className="text-gray-700 text-base">Your cart is currently empty.</p>
                        </div>
                    </div>
                    <button className="mt-6 px-6 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold rounded">Return to shop</button>
                </div>
            );
        }

        return (
            <>
                <div className="bg-[#efddd1] rounded-3xl p-4 sm:p-6 mb-6 overflow-x-auto">
                    <div className="hidden md:flex items-center mb-6 border-b pb-3 border-[#d4c4b4]">
                        <div className="flex-1 font-bold text-black text-base lg:text-lg ml-0 lg:ml-[9rem]">Product</div>
                        <div className="w-24 lg:w-32 text-center font-bold text-black text-base lg:text-lg">Price</div>
                        <div className="w-24 lg:w-32 text-center font-bold text-black text-base lg:text-lg">Quantity</div>
                        <div className="w-24 lg:w-32 text-right font-bold text-black text-base lg:text-lg">Subtotal</div>
                    </div>

                    {cartItems.map((item, index) => (
                        /* 🛠️ FIXED KEY: Using docId or index to prevent React key collision error */
                        <div key={item.docId || `${item.id}-${index}`} className="flex flex-col md:flex-row md:items-center py-4 border-b border-[#d4c4b4] last:border-b-0 gap-4 md:gap-0">
                            <div className="flex flex-1 items-center gap-4 lg:gap-6">
                                <button onClick={() => handleRemove(item, userId, setCartItems, fetchCartData)} className="text-black hover:text-red-600 font-bold p-1"><X size={18} /></button>
                                <div className="bg-white p-1 rounded"><img src={item.image} alt={item.name} className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded"/></div>
                                <span className="font-normal text-black text-sm lg:text-base">{item.name}</span>
                            </div>
                            <div className="hidden md:block w-24 lg:w-32 text-center text-black text-sm">{item.priceString}</div>
                            <div className="flex w-full md:w-24 lg:w-32 justify-between md:justify-center pr-12 md:pr-0">
                                <span className="md:hidden font-bold text-sm">Quantity:</span>
                                <input 
                                    type="number" 
                                    value={item.quantity} 
                                    min="1" 
                                    disabled={!isStoreOpen}
                                    onChange={(e) => updateQuantityLogic(item.id, e.target.value, setCartItems)} 
                                    className="w-20 px-2 py-1 border border-gray-400 rounded text-center text-sm disabled:bg-gray-100" 
                                />
                            </div>
                            <div className="hidden md:block w-24 lg:w-32 text-right text-black font-medium">${(item.priceNumber * item.quantity).toFixed(2)}</div>
                            <div className="md:hidden flex justify-between items-center w-full px-4 py-2 border-t border-[#d4c4b4] bg-white rounded-md">
                                <span className="font-bold text-sm">Item Total:</span>
                                <span className="font-medium text-base">${(item.priceNumber * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                    <div className="mt-6 pt-4 border-t border-[#d4c4b4] flex justify-end">
                        <button onClick={handleUpdateCart} className="w-full sm:w-auto px-8 py-3 bg-[#e18126] hover:bg-[#c4814c] text-white font-medium rounded-full">Update Cart</button>
                    </div>
                </div>

                <div className="bg-[#efddd1] rounded-3xl p-4 sm:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <input type="text" placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="flex-1 px-4 py-3 rounded-full bg-white border-none text-gray-500" />
                        <button className="px-10 py-3 bg-[#e18126] hover:bg-[#c4814c] text-white font-medium rounded-full">Apply coupon</button>
                    </div>
                </div>

                <div className="bg-[#efddd1] rounded-3xl p-6 sm:p-8 max-w-lg ml-auto">
                    <h2 className="text-base sm:text-lg font-bold mb-6 text-black">Cart Totals</h2>
                    <div className="space-y-4 border-b border-[#d4c4b4] pb-4 mb-6">
                        <div className="flex justify-between items-center"><span className="text-gray-600 text-sm">Subtotal</span><span className="text-gray-600 text-sm">${subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between items-center font-bold"><span className="text-black">Total</span><span className="text-black">${subtotal.toFixed(2)}</span></div>
                    </div>

                    <Link 
                        to={isStoreOpen ? "/checkout" : "#"} 
                        onClick={(e) => !isStoreOpen && e.preventDefault()}
                    >
                        <button 
                            disabled={!isStoreOpen}
                            className={`w-full py-3 text-white font-medium rounded-full transition-all ${
                                isStoreOpen ? "bg-[#e18126] hover:bg-[#c4814c]" : "bg-gray-400 cursor-not-allowed opacity-75"
                            }`}
                        >
                            {isStoreOpen ? "Proceed to Checkout" : "Checkout Disabled (Store Closed)"}
                        </button>
                    </Link>
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-16"> 
            <div className="max-w-screen-xl mx-auto px-4 py-8">
                <section className="max-w-screen-xl mx-auto px-4 mb-12 lg:mb-20">
                    <div className="flex flex-col lg:flex-row items-center bg-[#5b392a] rounded-2xl px-4 py-6">
                        <div ref={textRef} className="flex flex-col justify-center flex-1 text-center lg:text-left mb-6 lg:mb-0 lg:pr-8">
                            <h1 className="text-2xl font-main mt-10 sm:text-3xl lg:text-5xl font-bold text-white">Cart</h1>
                        </div>
                        <div className="w-64 sm:w-72 lg:w-auto flex justify-center items-center">
                            <img ref={imgRef} src="/HeroImg.png" alt="Donut" className="w-40 h-40 sm:w-64 lg:w-72 object-contain" />
                        </div>
                    </div>
                </section>
                {renderCartContent()}
            </div>
        </div>
    );
}