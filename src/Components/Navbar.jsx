import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ShoppingCart, ChevronDown, User, LogIn } from "lucide-react"; 
import { Link, useLocation, useNavigate } from "react-router-dom";
// 🚨 FIREBASE IMPORTS
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";

// --- Configuration / Helper Functions ---

const getUserId = () => {
    try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser).uid : null;
    } catch (e) {
        return null;
    }
};

const calculateCartTotals = (cartItems) => {
    let count = 0;
    let total = 0;

    cartItems.forEach(item => {
        const priceValue = parseFloat(item.price?.replace('$', '')) || 0;
        const quantity = item.quantity || 0;

        count += quantity;
        total += priceValue * quantity;
    });

    return {
        itemCount: count,
        totalPrice: total.toFixed(2),
    };
};

const saveSelectedStore = async (storeId, userId) => {
    if (userId) {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { selectedStoreId: storeId });
        } catch (error) {
            console.error("Error saving selected store to Firestore:", error);
        }
    }
    localStorage.setItem('guestSelectedStoreId', storeId);
};


// ---------------------------------------------------------------------------------

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

    const [cartTotals, setCartTotals] = useState({ itemCount: 0, totalPrice: '0.00' });

    // 🌟 NEW STATE for Store Logic
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);

    // ✅ DESTRUCTURE LOCATION: We need the full location object or pathname to trigger updates
    const location = useLocation(); 
    const { pathname } = location;
    
    const userId = getUserId();

    const userDropdownRef = useRef(null);
    const profileRef = useRef(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    // ✅ Logic to check login status
    const [username, setUsername] = useState(null);
    
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setIsMobileMoreOpen(false);
    };

    const handleMobileLinkClick = () => {
        setIsMenuOpen(false);
        setIsMobileMoreOpen(false);
    };

    const handleStoreSelect = async (store) => {
        if (selectedStore?.id === store.id) {
            setIsUserDropdownOpen(false);
            setIsMobileMoreOpen(false);
            return;
        }

        setSelectedStore(store);
        await saveSelectedStore(store.id, userId);

        setIsUserDropdownOpen(false);
        setIsMobileMoreOpen(false);

        window.location.reload();
    }


    // ===================================
    // 🏪 STORE FETCHING EFFECT
    // ===================================
    useEffect(() => {
        const fetchStoreData = async () => {
            const storesCollectionRef = collection(db, 'stores');
            const storesSnapshot = await getDocs(storesCollectionRef);
            const allStores = storesSnapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data(),
                storeName: docSnap.data().storeName || docSnap.id
            }));
            setStores(allStores);

            let currentStoreId = null;

            if (userId) {
                try {
                    const userDocRef = doc(db, 'users', userId);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        currentStoreId = userDocSnap.data().selectedStoreId;
                    }
                } catch (error) {
                    console.warn("Could not fetch user's selected store:", error.message);
                }
            }

            if (!currentStoreId) {
                currentStoreId = localStorage.getItem('guestSelectedStoreId');
            }

            let initialStore = allStores.find(s => s.id === currentStoreId);
            if (!initialStore && allStores.length > 0) {
                initialStore = allStores[0];
                await saveSelectedStore(initialStore.id, userId);
            }
            setSelectedStore(initialStore);
        };

        fetchStoreData();
    }, [userId]);

    // =======================================================
    // ✅ CRITICAL FIX: RE-CHECK USER ON EVERY ROUTE CHANGE
    // =======================================================
    useEffect(() => {
        const checkUserStatus = () => {
            try {
                const stored = localStorage.getItem('user');
                if (stored) {
                    const u = JSON.parse(stored);
                    if (u && (u.username || u.email || u.uid)) {
                        setUsername(u.username || "User");
                    } else {
                        setUsername(null);
                    }
                } else {
                    setUsername(null);
                }
            } catch (e) {
                console.error('Error reading user from localStorage:', e);
                setUsername(null);
            }
        };

        // Run immediately
        checkUserStatus();

        // Also listen for a custom event 'user-login' if you want to trigger it manually
        window.addEventListener('user-login', checkUserStatus);
        
        return () => window.removeEventListener('user-login', checkUserStatus);
        
    // 👇 DEPENDENCY: This runs checkUserStatus whenever the URL path changes
    }, [pathname]); 


    // ===================================
    // 🛒 CART FETCHING EFFECT
    // ===================================
    useEffect(() => {
        const fetchCartData = async () => {
            let cartData = [];
            const isUserLoggedIn = !!userId;

            if (isUserLoggedIn) {
                try {
                    const cartCollectionRef = collection(db, 'users', userId, 'cart');
                    const cartSnapshot = await getDocs(cartCollectionRef);
                    cartData = cartSnapshot.docs.map(docSnap => docSnap.data());
                } catch (error) {
                    console.warn("Could not fetch Firestore sub-collection cart:", error.message);
                }
            } else {
                cartData = JSON.parse(localStorage.getItem('guestCart') || '[]');
            }

            setCartTotals(calculateCartTotals(cartData));
        };

        fetchCartData();

        const handleStorageChange = () => fetchCartData();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);

    }, [userId, pathname]); // Added pathname here too just in case cart updates on route change

    // --- EFFECT to handle click outside ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("guestSelectedStoreId"); 
        setUsername(null);
        navigate("/");
        // We don't need window.reload() usually if state is handled correctly, 
        // but keeping it if you prefer hard refresh:
        // window.location.reload(); 
    };

    const getDesktopLinkClasses = (path) => {
        const baseClasses = "text-base lg:text-xl font-medium transition-colors duration-200";
        const activeClasses = "text-orange-400 hover:text-orange-500";
        const inactiveClasses = "text-gray-800 hover:text-orange-400";
        const isActive = pathname === path;
        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    };

    const getMobileLinkClasses = (path) => {
        const baseClasses = "block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-50 transition-colors duration-200";
        const activeClasses = "text-orange-400";
        const inactiveClasses = "text-gray-800 hover:text-orange-400";
        const isActive = pathname === path;
        return `${isActive ? activeClasses : inactiveClasses} ${baseClasses}`;
    };

    return (
        <nav className="bg-white fixed w-full top-0 z-50 shadow-sm">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
                    {/* Brand */}
                    <div className="flex items-center">
                        <Link to="/">
                            <img
                                src="/Logo.png"
                                alt="Donatsu"
                                className="h-22 w-24 sm:h-26 sm:w-32 lg:h-30 lg:w-40 object-contain"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
                        <Link to="/" className={getDesktopLinkClasses("/")}>Home</Link>
                        <Link to="/products" className={getDesktopLinkClasses("/products")}>Products</Link>
                        <Link to="/about" className={getDesktopLinkClasses("/about")}>About</Link>
                        <Link to="/blog" className={getDesktopLinkClasses("/blog")}>Pages</Link>
                        <Link to="/contact" className={getDesktopLinkClasses("/contact")}>Contact</Link>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">

                        {/* Desktop Right Section */}
                        <div className="hidden sm:flex items-center space-x-3">

                            {/* Store Dropdown */}
                            <div className="relative" ref={userDropdownRef}>
                                <button
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    className={`flex items-center cursor-pointer space-x-1 px-3 py-2 rounded-md text-base lg:text-lg font-medium transition-colors duration-200 ${isUserDropdownOpen ? 'bg-gray-100 text-orange-400' : 'text-gray-600 hover:text-orange-400 hover:bg-gray-100'}`}
                                >
                                    <span>{selectedStore ? selectedStore.storeName : 'Select Store'}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Dropdown Panel */}
                                {isUserDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10 border border-gray-100 py-1">
                                        {stores.map(store => (
                                            <Link
                                                key={store.id}
                                                to="#"
                                                className={`block px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-400 transition-colors ${selectedStore?.id === store.id ? 'bg-gray-100 font-bold text-orange-400' : ''}`}
                                                onClick={() => handleStoreSelect(store)}
                                            >
                                                {store.storeName || `Store ${store.id}`}
                                            </Link>
                                        ))}
                                        {stores.length === 0 && <span className="block px-4 py-2 text-sm text-gray-400">Loading stores...</span>}
                                    </div>
                                )}
                            </div>


                            {/* ✅ CONDITIONAL RENDERING: LOGIN BUTTON OR USER PROFILE */}
                            {username ? (
                                // --- LOGGED IN ---
                                <div className="relative ml-3" ref={profileRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className={`flex items-center cursor-pointer space-x-2 px-3 py-2 rounded-md text-base lg:text-lg font-medium transition-colors duration-200 ${isProfileOpen ? 'bg-gray-100 text-orange-400' : 'text-gray-600 hover:text-orange-400 hover:bg-gray-100'}`}
                                    >
                                        <div className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center font-semibold border border-orange-200">
                                            {username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="hidden lg:block text-sm">{username}</span>
                                        <ChevronDown size={14} className={`ml-1 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-44 bg-white shadow-lg rounded-md z-10 border border-gray-100 py-2">
                                            <div className="px-4 py-2">
                                                <p className="text-xs text-gray-500">Signed in as</p>
                                                <p className="text-sm font-medium text-gray-800 truncate">{username}</p>
                                            </div>
                                            <div className="border-t border-gray-100"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // --- NOT LOGGED IN (Link to /account now) ---
                                <Link
                                    to="/account" 
                                    className="ml-3 px-5 py-2 rounded-full bg-orange-400 text-white text-sm lg:text-base font-medium hover:bg-orange-500 transition-colors duration-200 shadow-sm flex items-center gap-2"
                                >
                                    <LogIn size={18} />
                                    Login
                                </Link>
                            )}
                            
                            <Link to="/cart" className="relative cursor-pointer ml-2">
                                <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600 hover:text-orange-400 transition-colors duration-200" />
                                <span className="absolute -top-2 -right-2 bg-orange-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                    {cartTotals.itemCount}
                                </span>
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-orange-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-400 transition-colors duration-200">
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
                            {/* Links */}
                            <Link to="/" className={getMobileLinkClasses("/")} onClick={handleMobileLinkClick}>Home</Link>
                            <Link to="/products" className={getMobileLinkClasses("/products")} onClick={handleMobileLinkClick}>Products</Link>
                            <Link to="/about" className={getMobileLinkClasses("/about")} onClick={handleMobileLinkClick}>About</Link>
                            <Link to="/blog" className={getMobileLinkClasses("/blog")} onClick={handleMobileLinkClick}>Pages</Link>
                            <Link to="/contact" className={getMobileLinkClasses("/contact")} onClick={handleMobileLinkClick}>Contact</Link>

                            {/* Mobile Store Dropdown */}
                            <div>
                                <button
                                    onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-base font-medium rounded-md hover:bg-gray-50 transition-colors duration-200 ${isMobileMoreOpen ? 'text-orange-400' : 'text-gray-800 hover:text-orange-400'}`}
                                >
                                    <span>{selectedStore ? selectedStore.storeName : 'Select Store'}</span>
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-200 ${isMobileMoreOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {isMobileMoreOpen && (
                                    <div className="pl-6 pr-3 mt-1 space-y-1">
                                        {stores.map(store => (
                                            <Link
                                                key={store.id}
                                                to="#"
                                                className={`block px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors duration-200 ${selectedStore?.id === store.id ? 'text-orange-400 font-bold' : 'text-gray-700 hover:text-orange-400'}`}
                                                onClick={() => handleStoreSelect(store)}
                                            >
                                                {store.storeName || `Store ${store.id}`}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Mobile cart info */}
                            <div className="flex items-center justify-between px-3 py-2 mt-2">
                                <Link to="/cart" className="relative cursor-pointer flex items-center gap-2 text-gray-800" onClick={handleMobileLinkClick}>
                                    <ShoppingCart className="h-5 w-5 text-gray-600" />
                                    <span>Cart ({cartTotals.itemCount})</span>
                                </Link>
                            </div>

                            {/* ✅ MOBILE LOGIN/LOGOUT SECTION */}
                            <div className="border-t border-gray-100 mt-2 pt-2">
                                {username ? (
                                    <>
                                        <div className="px-3 py-2 flex items-center gap-2 text-gray-800 font-medium">
                                            <div className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center font-bold text-sm">
                                                {username.charAt(0).toUpperCase()}
                                            </div>
                                            <span>{username}</span>
                                        </div>
                                        <button
                                            onClick={() => { handleLogout(); handleMobileLinkClick(); }}
                                            className="w-full text-left block px-3 py-2 text-base font-medium text-red-500 hover:bg-red-50 rounded-md"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/account" 
                                        onClick={handleMobileLinkClick}
                                        className="w-full block px-3 py-2 text-center text-base font-medium bg-orange-400 text-white rounded-md hover:bg-orange-500"
                                    >
                                        Login / Sign Up
                                    </Link>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;