// src/components/OrderDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, DollarSign, Package, User, Hash, Phone } from 'lucide-react'; 

// 🚨 FIREBASE IMPORTS 🚨
import { db } from '../firebase'; 
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

// --- Utility Functions ---

const formatOrderDate = (timestamp) => {
    if (timestamp?.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    return 'N/A';
};

const getStatusBadge = (status) => {
    const s = status ? status.toUpperCase() : 'PENDING';
    switch (s) {
        case 'PAID':
        case 'COMPLETED':
        case 'SHIPPED':
            return { text: 'text-green-800', bg: 'bg-green-100' };
        case 'PENDING':
        case 'PROCESSING':
            return { text: 'text-yellow-800', bg: 'bg-yellow-100' };
        case 'CANCELLED':
        case 'REFUNDED':
            return { text: 'text-red-800', bg: 'bg-red-100' };
        default:
            return { text: 'text-gray-800', bg: 'bg-gray-100' };
    }
};

const renderShippingAddress = (address) => {
    if (address === 'N/A' || typeof address === 'string') return <p className="text-gray-500">{address}</p>;
    
    return (
        <div className="space-y-1 text-sm text-gray-700">
            <p>{address.details || 'N/A'}</p>
            <p>{address.country || 'N/A'}</p>
            <p>{address.pin || 'N/A'}</p>
            <p className="flex items-center text-gray-500"><Phone size={14} className="mr-2"/>{address.phone || 'N/A'}</p>
        </div>
    );
};

// ========================================================
// Main OrderDetails Component
// ========================================================
const OrderDetails = () => {
    const { orderId } = useParams(); 
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                setError("No Order ID provided.");
                setLoading(false);
                return;
            }

            try {
                // 1. Fetch Main Order Document
                const orderDocRef = doc(db, 'orders', orderId); 
                const docSnap = await getDoc(orderDocRef);

                if (!docSnap.exists()) {
                    setError(`Order with ID ${orderId} not found.`);
                    setLoading(false);
                    return;
                }
                const data = docSnap.data();

                // 2. Fetch Items from Subcollection
                let fetchedItems = data.items || [];
                
                if (fetchedItems.length === 0) {
                    const itemsCollectionRef = collection(db, 'orders', orderId, 'items');
                    const itemsSnapshot = await getDocs(itemsCollectionRef);
                    
                    fetchedItems = itemsSnapshot.docs.map(itemDoc => {
                        const itemData = itemDoc.data();
                        return {
                            id: itemDoc.id,
                            name: itemData.name || itemData.title || 'Product Item',
                            price: itemData.salePrice || itemData.price || 0,
                            quantity: itemData.quantity || 1,
                            image: itemData.image || itemData.imageUrl || '/default-placeholder.jpg',
                            ...itemData
                        };
                    });
                } else {
                     // Ensure images/prices are mapped correctly even if loaded from data.items
                     fetchedItems = fetchedItems.map(item => ({
                        ...item,
                        price: item.salePrice || item.price || 0,
                        quantity: item.quantity || 1,
                        image: item.image || item.imageUrl || '/default-placeholder.jpg',
                        name: item.name || item.title || 'Product Item',
                     }));
                }


                // 3. Fetch Customer Info (if needed, simplified)
                let customerName = data.customerName || "Unknown User"; 
                let customerEmail = data.email || data.customerEmail || 'N/A';
                
                if (data.userId) {
                    const userRef = doc(db, "users", data.userId);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        customerName = userData.username || userData.fullName || data.email || customerName;
                        customerEmail = userData.email || customerEmail;
                    }
                }
                
                // 4. Construct Final Order Object
                setOrder({
                    id: docSnap.id,
                    orderNumber: data.orderId || `#${docSnap.id.slice(0, 8)}`,
                    customerName,
                    email: customerEmail,
                    totalAmount: data.totalAmount || data.total || 0,
                    status: data.status || (data.paymentId || data.paymentMethod === "SQUARE" ? "PAID" : "PENDING"),
                    paymentMethod: data.paymentMethod || 'N/A',
                    paymentId: data.paymentToken || data.paymentId || 'N/A',
                    date: formatOrderDate(data.createdAt),
                    items: fetchedItems, 
                    shippingAddress: data.shippingAddress || data.billingAddresses?.[0] || 'N/A',
                    tax: data.tax || 0,
                    shippingCost: data.shippingCost || data.shipping || 0,
                    ...data, 
                });

            } catch (err) {
                console.error("Error fetching order:", err);
                setError("Failed to load order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);
    
    // --- Render Logic ---

    if (loading) {
        return <div className="p-8 text-center text-lg text-gray-500">Loading order details...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600 bg-red-50 border border-red-200 rounded-xl">{error}</div>;
    }

    if (!order) {
        return <div className="p-8 text-center text-gray-500">No order data available.</div>;
    }
    
    const statusInfo = getStatusBadge(order.status);
    const total = parseFloat(order.totalAmount).toFixed(2);
    
    const tax = parseFloat(order.tax || 0);
    const shippingCost = parseFloat(order.shippingCost || 0);
    const subtotal = (order.totalAmount - tax - shippingCost);

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            
            <button 
                onClick={() => navigate('/dashboard')} 
                className="flex items-center text-orange-600 hover:text-orange-700 mb-6 transition"
            >
                <ArrowLeft size={20} className="mr-2" />
                Back to My Orders
            </button>

            {/* 🚨 ADDED margin-top (mt-6) 🚨 */}
            <div className="mt-20 bg-white shadow-xl rounded-xl p-6 md:p-10">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        Order <Hash size={24} className="ml-2 mr-1 text-orange-600"/>{order.orderNumber}
                    </h1>
                    <span className={`mt-2 sm:mt-0 px-4 py-1 text-sm font-semibold rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                        {order.status}
                    </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    
                    {/* Customer Info */}
                    <div className="p-4 border border-gray-100 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center"><User size={18} className="mr-2 text-blue-500"/>Customer</h2>
                        <p className="text-gray-700">{order.customerName}</p>
                        <p className="text-sm text-gray-500 truncate">Email: {order.email || 'N/A'}</p>
                    </div>

                    {/* Order Dates & Payment */}
                    <div className="p-4 border border-gray-100 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center"><Calendar size={18} className="mr-2 text-purple-500"/>Date & Payment</h2>
                        <p className="text-gray-700 text-sm">Placed On: {order.date}</p>
                        <p className="text-gray-700 text-sm">Method: {order.paymentMethod}</p>
                        <p className="text-gray-500 text-xs truncate">Txn ID: {order.paymentId}</p>
                    </div>

                    {/* Shipping Address */}
                    <div className="p-4 border border-gray-100 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center"><MapPin size={18} className="mr-2 text-green-500"/>Shipping Address</h2>
                        {renderShippingAddress(order.shippingAddress)}
                    </div>

                </div>

                {/* Order Items Table */}
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><Package size={20} className="mr-2 text-orange-600"/>Order Items</h2>
                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm mb-6">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {order.items.length > 0 ? (
                                order.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <img
                                                src={item.image || '/default-placeholder.jpg'} 
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded"
                                                onError={(e) => { e.target.onerror = null; e.target.src = '/default-placeholder.jpg'; }}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name || 'Product'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(item.price || 0).toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity || 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No items found for this order.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Summary Totals */}
                <div className="flex justify-end">
                    <div className="w-full max-w-sm space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Shipping:</span>
                            <span>${shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 border-b pb-2">
                            <span>Tax:</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                            <span className='flex items-center'><DollarSign size={20} className='mr-1 text-orange-600'/>Order Total:</span>
                            <span>${total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;