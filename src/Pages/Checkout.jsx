import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    doc,
    getDoc,
    collection,
    getDocs,
    updateDoc,
    arrayUnion,
    query,
    where,
    addDoc,
    serverTimestamp,
    deleteDoc, 
} from "firebase/firestore";
import { db } from "../firebase";

// Currency Symbol
const currencySymbol = "C$";

const SQUARE_APP_ID = "sandbox-sq0idb-xFYf3D4fTXyCTNJ3wEMgYA";
const SQUARE_LOCATION_ID = "LY5YKJGGDKYN7";

// --- SDK Loader ---
const loadSquareSdk = () => {
    return new Promise((resolve, reject) => {
        if (window.Square) return resolve(window.Square);
        const script = document.createElement("script");
        script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
        script.onload = () => resolve(window.Square);
        script.onerror = reject;
        document.body.appendChild(script);
    });
};

// --- Helpers ---

const getUserId = () => {
    try {
        const storedUser = localStorage.getItem('user'); // Changed from 'userId'
        return storedUser ? JSON.parse(storedUser).uid : null;
    } catch (e) {
        return null;
    }
};

const generateOrderId = () => Math.floor(100000 + Math.random() * 900000);

const formatProductDetails = (data) => {
    let imageUrl = data.image || data.gallery?.image || "/default.jpg";
    const rawImage = data.image || data.gallery?.image || "";

    if (
        typeof rawImage === "string" && rawImage.length > 100 && !rawImage.startsWith("http")
    ) {
        imageUrl = rawImage.startsWith("data:image")
            ? rawImage
            : `data:image/jpeg;base64,${rawImage}`;
    } else if (rawImage) {
        imageUrl = rawImage;
    }

    return {
        detailImage: imageUrl,
        detailTitle: data.title || data.name || "",
    };
};

const parsePriceToNumber = (price) => {
    if (price == null) return 0;
    if (typeof price === "number") return price;
    const cleaned = String(price).replace(/[^\d.-]+/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
};

// --- Add Address Form Component (Unchanged) ---
const AddAddressForm = ({ newAddress, handleChange, onCancel, onSave }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="space-y-4">
            <input type="text" name="type" placeholder="Address Type (Home/Office)" value={newAddress.type} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            <input type="text" name="details" placeholder="Address Details" value={newAddress.details} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            <input type="text" name="pin" placeholder="Pin Code" value={newAddress.pin} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            <input type="text" name="phone" placeholder="Phone" value={newAddress.phone} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            <input type="text" name="country" placeholder="Country" value={newAddress.country} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            <input type="email" name="email" placeholder="Email" value={newAddress.email || ""} onChange={handleChange} className="w-full border border-gray-300 rounded p-2" />
            <div className="flex justify-end space-x-2">
                <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
                <button onClick={onSave} className="px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-500">Save</button>
            </div>
        </div>
    </div>
);

// ----------------- Main Component -----------------
const CheckoutPage = () => {
    const [shippingAddresses, setShippingAddresses] = useState([]);
    const [billingAddresses, setBillingAddresses] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddShipping, setShowAddShipping] = useState(false);
    const [showAddBilling, setShowAddBilling] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState("");
    const [formType, setFormType] = useState("");
    const [selectedPayment, setSelectedPayment] = useState("");
    const [newAddress, setNewAddress] = useState({
        type: "", details: "", pin: "", phone: "", country: "", email: "", isDefault: false,
    });

    const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
    const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
    const [shippingRules, setShippingRules] = useState([]);
    const [deliveryType, setDeliveryType] = useState("");
    const [shippingCost, setShippingCost] = useState(0);

    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponMessage, setCouponMessage] = useState("");

    // 🌟 START: ADDED STORE STATE AND HELPERS 🌟
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null); 
    
    const saveSelectedStore = async (storeId, uid) => {
        if (uid) {
            try {
                await updateDoc(doc(db, 'users', uid), { selectedStoreId: storeId });
            } catch (e) {
                console.warn("Failed to save selected store to user profile:", e);
            }
        } else {
            localStorage.setItem('guestSelectedStoreId', storeId);
        }
    };
    // 🌟 END: ADDED STORE STATE AND HELPERS 🌟


    const navigate = useNavigate();

    // ----------------- STORE FETCHING EFFECT -----------------
    useEffect(() => {
        const fetchStoreData = async (uid) => {
            // 1. Fetch ALL Stores (for selection)
            const storesCollectionRef = collection(db, 'stores');
            const storesSnapshot = await getDocs(storesCollectionRef);
            const allStores = storesSnapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data(),
                storeName: docSnap.data().storeName || docSnap.id
            }));
            setStores(allStores); 

            let currentStoreId = null;

            if (uid) {
                // 2. Logged-in User: Get selected store ID from 'users/{userId}'
                try {
                    const userDocRef = doc(db, 'users', uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        currentStoreId = userDocSnap.data().selectedStoreId;
                    }
                } catch (error) {
                    console.warn("Could not fetch user's selected store:", error.message);
                }
            }
            
            // 3. Guest/Fallback: Get selected store ID from Local Storage
            if (!currentStoreId) {
                currentStoreId = localStorage.getItem('guestSelectedStoreId');
            }

            // 4. Set the initial selected store (default to the first if none saved)
            let initialStore = allStores.find(s => s.id === currentStoreId);
            if (!initialStore && allStores.length > 0) {
                initialStore = allStores[0];
                // Save this default selection for consistency
                await saveSelectedStore(initialStore.id, uid);
            }
            setSelectedStore(initialStore);
        };

        if (userId) fetchStoreData(userId);
    }, [userId]);


    // ----------------- Fetch User + Cart -----------------
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            const uid = getUserId();
            setUserId(uid);

            if (!uid) {
                setError("Please log in to continue checkout.");
                setLoading(false);
                return;
            }

            try {
                // Load user profile
                const userDocRef = doc(db, "users", uid);
                const userDocSnap = await getDoc(userDocRef);
                // ... (address and user email loading logic) ...
                let shipping = [];
                let billing = [];

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    shipping = userData.shippingAddresses || [];
                    billing = userData.billingAddresses || [];

                    setUserEmail(userData.email || "");
                    setShippingAddresses(shipping);
                    setBillingAddresses(billing);

                    if (shipping.length && !selectedShippingAddress)
                        setSelectedShippingAddress(shipping[0]);
                    if (billing.length && !selectedBillingAddress)
                        setSelectedBillingAddress(billing[0]);
                }
                
                // Load cart
                const cartRef = collection(db, "users", uid, "cart");
                const cartSnap = await getDocs(cartRef);

                const rawItems = [];
                cartSnap.forEach((docSnap) => {
                    rawItems.push({
                        ...docSnap.data(),
                        _cartDocId: docSnap.id,
                        id: docSnap.data().id || docSnap.id,
                    });
                });

                if (rawItems.length === 0) {
                    setCartItems([]);
                    setLoading(false);
                    return;
                }
                
                // ... (product details fetching and normalization logic) ...
                const productIds = rawItems.map((it) => it.id).filter(Boolean);
                const uniqueIds = [...new Set(productIds)];
                const productDetails = {};

                if (uniqueIds.length > 0) {
                    const productsRef = collection(db, "yralfoods");
                    for (let i = 0; i < uniqueIds.length; i += 10) {
                        const batch = uniqueIds.slice(i, i + 10);
                        const q = query(productsRef, where("__name__", "in", batch));
                        const snap = await getDocs(q);
                        snap.forEach((pDoc) => {
                            productDetails[pDoc.id] = formatProductDetails(pDoc.data());
                        });
                    }
                }

                const normalizedItems = rawItems.map((item) => {
                    const details = productDetails[item.id] || {};
                    const finalImage =
                        item.image || item.imageUrl || details.detailImage || "/default.jpg";
                    const finalName = item.name || item.title || details.detailTitle || "Product";
                    const priceNumber = parsePriceToNumber(
                        item.price ?? item.salePrice ?? item.priceString
                    );

                    return {
                        cartDocId: item._cartDocId, 
                        id: item.id,
                        name: finalName,
                        price: priceNumber,
                        salePrice: item.salePrice
                            ? parsePriceToNumber(item.salePrice)
                            : null,
                        quantity: item.quantity || 1,
                        image: finalImage,
                    };
                });

                setCartItems(normalizedItems);

            } catch (err) {
                console.error("Fetch Error", err);
                setError(err.message);
            }

            setLoading(false);
        };

        fetchAllData();
    }, []);

    // ----------------- Shipping Rules and Address Save (Unchanged) -----------------
    useEffect(() => {
        const fetchRules = async () => {
            if (!selectedShippingAddress || !selectedShippingAddress.country) {
                setShippingRules([]);
                setDeliveryType("");
                setShippingCost(0);
                return;
            }

            try {
                const c = selectedShippingAddress.country;
                const rulesRef = collection(db, "shippingCountries", c, "rules");
                const snap = await getDocs(rulesRef);

                const rules = [];
                snap.forEach((docSnap) => {
                    const d = docSnap.data();
                    rules.push({
                        id: docSnap.id,
                        shippingType: d.shippingType || d.name,
                        amount: Number(d.amount) || 0,
                    });
                });

                setShippingRules(rules);
                if (rules.length > 0) setDeliveryType(rules[0].shippingType);
            } catch (err) {
                console.error("Shipping rule error", err);
            }
        };

        fetchRules();
    }, [selectedShippingAddress]);

    useEffect(() => {
        const rule = shippingRules.find((r) => r.shippingType === deliveryType);
        setShippingCost(rule ? Number(rule.amount) : 0);
    }, [deliveryType, shippingRules]);

    const handleAddNewAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({ ...prev, [name]: value }));
    };

    const saveNewAddress = async () => {
        if (!userId) return alert("Missing user ID");

        const required = [
            "type", "details", "pin", "phone", "country",
        ];

        for (const field of required) {
            if (!newAddress[field].trim()) return alert("All fields required");
        }

        const userDocRef = doc(db, "users", userId);

        const addr = {
            ...newAddress,
            email: newAddress.email || userEmail,
            addressId: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };

        try {
            if (formType === "shipping") {
                await updateDoc(userDocRef, { shippingAddresses: arrayUnion(addr) });
                setShippingAddresses((prev) => [...prev, addr]);
                setSelectedShippingAddress(addr);
                setShowAddShipping(false);
            }
            if (formType === "billing") {
                await updateDoc(userDocRef, { billingAddresses: arrayUnion(addr) });
                setBillingAddresses((prev) => [...prev, addr]);
                setSelectedBillingAddress(addr);
                setShowAddBilling(false);
            }
            alert("Address saved!");
        } catch (err) {
            alert("Failed to save address");
        }
    };

    // ----------------- Totals -----------------
    const subTotal = cartItems.reduce((acc, item) => {
        const price = item.salePrice ? item.salePrice : item.price;
        return acc + price * item.quantity;
    }, 0);

    const tax = subTotal * 0.05;
    const total = subTotal + tax + shippingCost - discount;

    // ----------------- Coupon -----------------
    const handleApplyCoupon = () => {
        if (!couponCode) return;
        if (couponCode.toUpperCase() === "SAVE20") {
            const disc = subTotal * 0.2;
            setDiscount(disc);
            setAppliedCoupon({ code: "SAVE20", value: disc });
            setCouponMessage("Coupon Applied: 20% off");
        } else {
            setDiscount(0);
            setCouponMessage("Invalid Coupon");
        }
    };

    // ----------------- FIRESTORE WRITE FIX: saveOrder Function -----------------

    const getBaseOrderData = (paymentMethod) => ({
        userId,
        orderId: generateOrderId(),
        
        // 🌟 START: ADDED STORE DETAILS 🌟
        storeId: selectedStore?.id || "N/A", 
        storeName: selectedStore?.storeName || "N/A",
        // 🌟 END: ADDED STORE DETAILS 🌟

        subTotal: parseFloat(subTotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        shippingCost: parseFloat(shippingCost.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        itemCount: cartItems.length,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        paymentMethod: paymentMethod,
        createdAt: serverTimestamp(),
        shippingAddress: selectedShippingAddress,
        billingAddress: selectedBillingAddress,
        deliveryType,
        email: userEmail,
        status: "Pending",
    });

    const saveOrder = async (orderData, token = null) => {
        if (cartItems.length === 0) throw new Error("Cart is empty.");
        if (!selectedStore) throw new Error("Store location not selected."); // Added safety check

        try {
            const finalOrderData = { ...orderData, paymentToken: token };

            // 1. Create the main (small) order document
            const orderRef = await addDoc(collection(db, "orders"), finalOrderData);

            // 2. Create the items subcollection and add items individually
            const itemsCollectionRef = collection(orderRef, "items");
            
            const itemWrites = cartItems.map(item => {
                const { cartDocId, ...itemData } = item; 
                // Ensure items saved in the subcollection also contain store context for filtering/queries
                return addDoc(itemsCollectionRef, { ...itemData, storeId: selectedStore.id });
            });

            await Promise.all(itemWrites);

            // 3. Recommended: Clear the user's cart
            const cartCleanupPromises = cartItems.map(item => 
              deleteDoc(doc(db, "users", userId, "cart", item.cartDocId))
            );
            await Promise.all(cartCleanupPromises);

            return orderRef.id;
            
        } catch (err) {
            console.error("Order Save and Splitting Failed: ", err);
            throw new Error(`Order saving failed: ${err.message}`); 
        }
    };


    // ----------------- Square Payment Handler -----------------
    useEffect(() => {
        if (selectedPayment !== "SQUARE") return;

        let paymentsObj;
        let cardObj;

        (async () => {
            try {
                const Square = await loadSquareSdk();
                paymentsObj = Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);

                cardObj = await paymentsObj.card();
                await cardObj.attach("#card-container");

                const btn = document.getElementById("card-button");
                if (btn) {
                    btn.onclick = async () => {
                        try {
                            const result = await cardObj.tokenize();
                            if (result.status === "OK") {
                                await handleSquarePayment(result.token);
                            } else {
                                alert("Card tokenization failed: " + result.errors?.[0]?.message || "Unknown error");
                            }
                        } catch (tokenErr) {
                             alert("Payment tokenization error: " + tokenErr.message);
                        }
                    };
                }
            } catch (err) {
                console.error("Square Initialization Error", err);
                alert("Failed to load payment form. Check console.");
            }
        })();

        return () => {
            const cardContainer = document.getElementById("card-container");
            if (cardContainer) cardContainer.innerHTML = "";
        };
    }, [selectedPayment, total]);

    const handleSquarePayment = async (token) => {
        try {
            const orderData = getBaseOrderData("SQUARE");
            const orderId = await saveOrder(orderData, token); 

            alert(`Payment Successful! Order ID: ${orderId}.`);
            navigate("/account");
        } catch (err) {
            alert("Payment failed: " + err.message);
        }
    };

    // ----------------- Place Order (COD) Handler -----------------
    const handlePlaceOrder = () => {
        if (!selectedShippingAddress) return alert("Select shipping address");
        if (!selectedBillingAddress) return alert("Select billing address");
        if (!deliveryType) return alert("Select delivery type");
        if (!selectedPayment) return alert("Select payment method");
        if (!selectedStore) return alert("Please select a store location."); // Added store check

        if (selectedPayment === "SQUARE") {
            return; 
        }

        if (selectedPayment === "COD") {
            (async () => {
                try {
                    const orderData = getBaseOrderData("COD");
                    const orderId = await saveOrder(orderData); 
                    
                    alert(`Order placed successfully! Order ID: ${orderId}`);
                    navigate("/account");
                } catch (err) {
                    alert("Error saving COD order: " + err.message);
                }
            })();
        }
    };

    // ----------------- UI Rendering -----------------
    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

    // Helper to handle store selection change in the UI
    const handleStoreSelection = async (e) => {
        const newStoreId = e.target.value;
        const newStore = stores.find(s => s.id === newStoreId);
        setSelectedStore(newStore);
        await saveSelectedStore(newStoreId, userId);
    };

    return (
        <div className="bg-white min-h-screen">
            <main className="max-w-8xl mx-auto pt-40 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* 🌟 NEW: STORE SELECTION UI 🌟 */}
                        <section className="p-6 border bg-orange-50 rounded-lg">
                            <h2 className="text-xl font-bold mb-4 text-[#5b392a]">
                                1. Select Store Location
                            </h2>
                            <div className="flex items-center space-x-4">
                                <select 
                                    className="p-2 border border-gray-300 rounded-lg shadow-sm w-full md:w-auto"
                                    value={selectedStore?.id || ""}
                                    onChange={handleStoreSelection}
                                    disabled={stores.length === 0}
                                >
                                    <option value="" disabled>
                                        {stores.length > 0 ? "Choose a store" : "Loading stores..."}
                                    </option>
                                    {stores.map(store => (
                                        <option key={store.id} value={store.id}>
                                            {store.storeName}
                                        </option>
                                    ))}
                                </select>
                                {selectedStore && (
                                    <p className="text-sm text-gray-600">
                                        Current Store: <span className="font-medium">{selectedStore.storeName}</span>
                                    </p>
                                )}
                            </div>
                            {!selectedStore && stores.length > 0 && (
                                <p className="mt-2 text-red-500 text-sm font-medium">Please select a store location to proceed with checkout.</p>
                            )}
                        </section>
                        {/* 🌟 END: STORE SELECTION UI 🌟 */}


                        <section className="p-6 border bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Shipping Address</h2>
                                {!showAddShipping && (
                                    <button onClick={() => { setFormType("shipping"); setShowAddShipping(true); }} className="text-sm text-[#5b392a]"> + Add New </button>
                                )}
                            </div>
                            {showAddShipping ? (
                                <AddAddressForm newAddress={newAddress} handleChange={handleAddNewAddressChange} onCancel={() => setShowAddShipping(false)} onSave={saveNewAddress} />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {shippingAddresses.map((address) => (
                                        <label key={address.addressId} className={`p-4 bg-white border rounded-lg cursor-pointer ${selectedShippingAddress?.addressId === address.addressId ? "border-[#5b392a] ring-2 ring-[#5b392a]" : "" }`}>
                                            <input type="radio" name="shipping" checked={selectedShippingAddress?.addressId === address.addressId} onChange={() => setSelectedShippingAddress(address)} />
                                            <div className="ml-3 text-sm">
                                                <p>{address.type}</p><p>{address.details}</p><p>Pincode: {address.pin}</p><p>Phone: {address.phone}</p><p>Country: {address.country}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="p-6 border bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Billing Address</h2>
                                {!showAddBilling && (
                                    <button onClick={() => { setFormType("billing"); setShowAddBilling(true); }} className="text-sm text-[#5b392a]"> + Add New </button>
                                )}
                            </div>
                            {showAddBilling ? (
                                <AddAddressForm newAddress={newAddress} handleChange={handleAddNewAddressChange} onCancel={() => setShowAddBilling(false)} onSave={saveNewAddress} />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {billingAddresses.map((address) => (
                                        <label key={address.addressId} className={`p-4 bg-white border rounded-lg cursor-pointer ${selectedBillingAddress?.addressId === address.addressId ? "border-[#5b392a] ring-2 ring-[#5b392a]" : "" }`}>
                                            <input type="radio" name="billing" checked={selectedBillingAddress?.addressId === address.addressId} onChange={() => setSelectedBillingAddress(address)} />
                                            <div className="ml-3 text-sm">
                                                <p>{address.type}</p><p>{address.details}</p><p>Pincode: {address.pin}</p><p>Phone: {address.phone}</p><p>Country: {address.country}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </section>
                        
                        <section className="p-6 border bg-gray-50 rounded-lg">
                            <h2 className="text-xl font-bold mb-4">Delivery Type</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {shippingRules.map((rule) => (
                                    <label key={rule.id} className={`flex items-center p-4 bg-white border rounded-lg cursor-pointer ${deliveryType === rule.shippingType ? "border-[#5b392a] ring-2 ring-[#5b392a]" : "" }`}>
                                        <input type="radio" value={rule.shippingType} checked={deliveryType === rule.shippingType} onChange={() => setDeliveryType(rule.shippingType)} />
                                        <span className="ml-3">{rule.shippingType} ({currencySymbol} {rule.amount.toFixed(2)})</span>
                                    </label>
                                ))}
                            </div>
                        </section>


                        {/* PAYMENT METHOD */}
                        <section className="p-6 border bg-gray-50 rounded-lg">
                            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* COD */}
                                <label className={`flex items-center p-4 bg-white border rounded-lg cursor-pointer ${selectedPayment === "COD" ? "border-[#5b392a] ring-2 ring-[#5b392a]" : "" }`}>
                                    <input type="radio" name="paymentMethod" value="COD" checked={selectedPayment === "COD"} onChange={() => setSelectedPayment("COD")} />
                                    <span className="ml-3">Cash On Delivery</span>
                                </label>
                                {/* SQUARE */}
                                <label className={`flex items-center p-4 bg-white border rounded-lg cursor-pointer ${selectedPayment === "SQUARE" ? "border-[#5b392a] ring-2 ring-[#5b392a]" : "" }`}>
                                    <input type="radio" name="paymentMethod" value="SQUARE" checked={selectedPayment === "SQUARE"} onChange={() => setSelectedPayment("SQUARE")} />
                                    <span className="ml-3">Credit / Debit Card</span>
                                </label>
                            </div>

                            {/* Square Card UI */}
                            <div id="card-container" className={`${selectedPayment === "SQUARE" ? "block" : "hidden"} mt-4`}></div>
                            <button id="card-button" type="button" className={`${selectedPayment === "SQUARE" ? "block" : "hidden"} bg-[#5b392a] text-white mt-4 px-4 py-2 rounded-lg`}>
                                Pay with Card
                            </button>
                        </section>
                    </div>

                    {/* ORDER SUMMARY */}
                    <section className="mt-10 lg:mt-0 lg:ml-8">
                        <div className="p-6 border rounded-lg bg-gray-50">
                            <h2 className="text-lg font-bold mb-6">Order Summary</h2>

                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.cartDocId} className="flex justify-between items-center pb-2 border-b">
                                        <div className="flex items-center">
                                            <img src={item.image} alt={item.name} className="h-14 w-14 object-cover border rounded-md" />
                                            <div className="ml-4 text-sm">
                                                <p className="font-bold">{item.name}</p>
                                                <p>{currencySymbol} {item.price.toFixed(2)} × {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold">{currencySymbol} {(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <dl className="mt-6 space-y-4 border-t pt-4">
                                <div className="flex justify-between text-sm"><dt>Subtotal</dt><dd>{currencySymbol} {subTotal.toFixed(2)}</dd></div>
                                <div className="flex justify-between text-sm"><dt>Shipping</dt><dd>{currencySymbol} {shippingCost.toFixed(2)}</dd></div>
                                <div className="flex justify-between text-sm"><dt>Tax (5%)</dt><dd>{currencySymbol} {tax.toFixed(2)}</dd></div>
                                <div className="flex justify-between text-sm"><dt>Discount</dt><dd>-{currencySymbol} {discount.toFixed(2)}</dd></div>
                                <div className="flex justify-between text-lg font-bold border-t pt-4"><dt>Total</dt><dd>{currencySymbol} {total.toFixed(2)}</dd></div>
                            </dl>

                            {/* Coupon */}
                            <div className="mt-6">
                                <div className="flex gap-2">
                                    <input type="text" className="w-full px-4 py-2 border" placeholder="Enter Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                                    <button onClick={handleApplyCoupon} className="border px-4 py-2 text-[#5b392a]">Apply</button>
                                </div>
                                {couponMessage && <p className="mt-2 text-sm">{couponMessage}</p>}
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                className="mt-6 w-full bg-[#5b392a] text-white py-3 rounded-lg"
                                disabled={selectedPayment === "SQUARE" || !selectedStore} // Disable if no store selected
                            >
                                {selectedPayment === "SQUARE" ? "Click Pay with Card" : "Place Order"}
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;