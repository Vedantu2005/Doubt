import React, { useState, useEffect } from 'react';
import { LayoutGrid, Package, History, MapPin, LogOut, Box, Menu, X, Wallet, Coins, Phone, Mail, ChevronLeft, ChevronRight, Plus } from 'lucide-react'; 

// 🚨 FIREBASE IMPORTS 🚨
import { db,auth } from '../firebase'; 
import { 
    doc, 
    getDoc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove, 
    // 💡 IMPORTS FOR DYNAMIC ORDER FETCHING
    collection, 
    query,      
    where,      
    getDocs,
} from "firebase/firestore";

// --- Configuration ---
const navItems = [
    { name: 'Dashboard', page: 'dashboard', icon: LayoutGrid },
    { name: 'My Orders', page: 'orders', icon: Package },
    { name: 'Refund History', page: 'refund', icon: History },
    { name: 'Saved Address', page: 'address', icon: MapPin },
];

// Mock Data (now dynamically fetched, these arrays remain empty)
const mockOrders = [];
const mockRefunds = [];


// ===============================================
// --- FIREBASE HELPER FUNCTIONS ---
// ===============================================

// Function to get the logged-in User ID (UID) from Local Storage
const getUserId = () => {
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            return JSON.parse(storedUser).uid;
        }
    } catch (e) {
        console.error("Could not retrieve UID from local storage.", e);
        return null;
    }
    return null;
};

// Function to convert local state format to Firestore format for saving as a MAP
const formatAddressForFirestore = (address, isNew = false) => {
    // Local array order: [details, phoneNumber, cityState, zipCountry]
    const formattedData = {
        details: address.data[0], 
        phone: address.data[1],
        country: address.data[2],  
        pin: address.data[3],     
        type: address.type,
        isDefault: false,
    };

    if (isNew) {
        formattedData.addressId = Date.now().toString(); 
    } else {
        formattedData.addressId = address.id; 
    }
    return formattedData;
};

// Function to convert a Firestore map back to local component state format
const formatAddressFromFirestore = (addressMap) => {
    const type = addressMap.type || 'Other';
    const colorMap = {
        'Shipping': { color: 'text-green-600', badgeColor: 'bg-green-100' },
        'Billing': { color: 'text-blue-600', badgeColor: 'bg-blue-100' },
        'Other': { color: 'text-purple-600', badgeColor: 'bg-purple-100' },
    };
    
    return {
        id: addressMap.addressId, 
        type: type,
        data: [
            addressMap.details, 
            addressMap.phone, 
            addressMap.country || '',   
            addressMap.pin || '',     
        ],
        ...colorMap[type]
    };
};

// ===============================================
// --- COMPONENT DEFINITIONS ---
// ===============================================

// Address Modal Component (Unchanged)
const AddressModal = ({ address, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        type: address?.type || 'Shipping',
        addressLine1: address?.data[0] || '',
        phoneNumber: address?.data[1] || '',
        cityState: address?.data[2] || '',
        zipCountry: address?.data[3] || '',
    });

    const isEdit = !!address;
    const title = isEdit ? `Edit ${address.type} Address` : 'Add New Address';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const savedData = [
            formData.addressLine1,
            formData.phoneNumber,
            formData.cityState,
            formData.zipCountry,
        ];
        
        onSave({
            id: isEdit ? address.id : `new-${Date.now()}`,
            type: formData.type,
            data: savedData,
        });
    };

    const inputClasses = "w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition shadow-inner";

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className={inputClasses}
                            required
                        >
                            <option value="Shipping">Shipping</option>
                            <option value="Billing">Billing</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 (Details)</label>
                        <input
                            type="text"
                            name="addressLine1"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder="Street address, flat/unit number"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder="e.g., 123-456-7890"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City, State/Region</label>
                        <input
                            type="text"
                            name="cityState"
                            value={formData.cityState}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder="City, State"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code, Country (PIN)</label>
                        <input
                            type="text"
                            name="zipCountry"
                            value={formData.zipCountry}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder="Zip Code, Country"
                            required
                        />
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition"
                        >
                            {isEdit ? 'Save Changes' : 'Add Address'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// NavItem Component (Unchanged)
const NavItem = ({ item, currentPage, setCurrentPage, onClick }) => {
    const isCurrent = item.page === currentPage;
    const activeClasses = 'bg-orange-50 text-orange-600 font-semibold';
    const inactiveClasses = 'text-gray-600 hover:bg-gray-50 hover:text-orange-600';

    const handleClick = () => {
        setCurrentPage(item.page);
        if (onClick) onClick();
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full text-left flex items-center p-3 rounded-xl transition duration-150 ease-in-out ${isCurrent ? activeClasses : inactiveClasses}`}
        >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.name}</span>
        </button>
    );
};

// User Profile Card in Sidebar (Unchanged)
const UserProfile = ({ username, email, onClose }) => (
    <div className="p-4 flex items-center justify-between border-b border-gray-100 mb-4">
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                {username.charAt(0)}
            </div>
            <div>
                <p className="text-gray-900 font-semibold text-base">{username}</p>
                <p className="text-gray-500 text-sm">{email}</p>
            </div>
        </div>
        <button onClick={onClose} className="text-gray-500 lg:hidden p-1 rounded-full hover:bg-gray-100">
            <X className="h-6 w-6" />
        </button>
    </div>
);

// Stat Card Component (Updated to accept dynamic value)
const StatCard = ({ icon: Icon, title, value, unit, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md w-full 
        flex flex-col items-start space-y-2 
        lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4 lg:flex-1 lg:min-w-0"
    >
        <div className='flex items-center space-x-3'>
            <Icon className={`h-8 w-8 ${color.text}`} />
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
                {unit}
                {value}
            </p>
        </div>
        <p className="text-gray-500 text-sm ml-12 lg:ml-auto lg:mr-0">
            {title}
        </p>
    </div>
);

// Dashboard View Content (UPDATED to accept dynamic stats)
const DashboardContent = ({ username, totalOrderAmount, totalOrderCount }) => (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Hello, {username}!
        </h1>
        <p className="text-gray-600 mb-8">
            From your My Account Dashboard you can view recent activity and update information.
        </p>

        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6 justify-start">
            <StatCard
                icon={Wallet} 
                title="Total Order"
                value={totalOrderAmount.toFixed(2)} // Use dynamic amount, formatted
                unit="$"
                color={{ bg: 'bg-orange-100', text: 'text-orange-600' }}
            />
            <StatCard
                icon={Coins} 
                title="Total Points"
                value="0" // Placeholder for points, keeping it static
                unit=""
                color={{ bg: 'bg-red-100', text: 'text-red-500' }}
            />
            <StatCard
                icon={Box}
                title="Total Orders"
                value={totalOrderCount} // Use dynamic count
                unit=""
                color={{ bg: 'bg-orange-100', text: 'text-orange-600' }}
            />
        </div>
    </div>
);


// Order History Component (UPDATED to accept dynamic orders and handle navigation)
const OrderHistory = ({ orders }) => {
    
    // 💡 HANDLER FOR VIEW DETAILS
    const handleViewDetails = (orderId) => {
        const detailsUrl = `/dashboard/${orderId}`;
        window.location.href = detailsUrl; 
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                My Orders
            </h1>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 rounded-lg">
                        <tr>
                            {['Order Number', 'Date', 'Amount', 'Order Status', 'Payment Method', 'Payment ID', 'Action'].map((header) => (
                                <th
                                    key={header}
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders && orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber || order.id.slice(0, 8)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.amount ? parseFloat(order.amount).toFixed(2) : '0.00'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            order.status === 'Completed' || order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {order.status || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.method || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.paymentId || 'N/A'}</td>
                                    {/* 🚨 ACTION BUTTON WITH CLICK HANDLER */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            onClick={() => handleViewDetails(order.id)} // Call handler with order ID
                                            className="text-orange-600 hover:text-orange-900 font-medium bg-transparent border-none p-0 cursor-pointer"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                             <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="flex justify-end items-center mt-4">
                <button 
                    className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 mr-2"
                    disabled
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <button 
                    className="p-2 border border-gray-900 rounded-lg text-gray-900 hover:bg-gray-100"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

// Refund History Component (Unchanged)
const RefundHistory = () => {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Refund History
            </h1>
            <div className="overflow-x-auto mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 rounded-lg">
                        <tr>
                            {['Order', 'Status', 'Reason', 'Created At'].map((header) => (
                                <th
                                    key={header}
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mockRefunds.map((refund, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{refund.order}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        refund.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        refund.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {refund.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{refund.reason}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{refund.created}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="flex justify-end items-center mt-4">
                <button 
                    className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 mr-2"
                    disabled
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <button 
                    className="p-2 border border-gray-900 rounded-lg text-gray-900 hover:bg-gray-100"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

// Address Card Component (Unchanged)
const AddressCard = ({ address, handleEditClick, handleRemove }) => {
    const icons = [MapPin, Phone, Mail, Box];
    const { id, type, data, color, badgeColor } = address;

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{type}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${badgeColor} ${color}`}>{type}</span>
                </div>
                
                <div className="space-y-3 mb-6">
                    {data.map((line, index) => {
                        const Icon = icons[index] || MapPin;
                        return (
                            <div key={index} className="flex items-center text-gray-600 text-sm">
                                <Icon className={`h-4 w-4 mr-3 ${color}`} />
                                <span className='truncate'>{line}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex space-x-4 pt-4 border-t border-gray-100">
                <button 
                    onClick={() => handleEditClick(address)}
                    className="flex-1 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                    Edit
                </button>
                <button 
                    onClick={() => handleRemove(id)}
                    className="flex-1 py-2 text-sm font-medium border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

// Saved Address Component (Unchanged)
const SavedAddress = ({ addresses, handleAddClick, handleEditClick, handleRemove }) => {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Saved Addresses
                </h1>
                <button 
                    onClick={handleAddClick}
                    className="flex items-center px-4 py-2 bg-orange-600 text-white font-medium rounded-lg shadow-md hover:bg-orange-700 transition duration-150"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Address
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                    <AddressCard 
                        key={address.id}
                        address={address}
                        handleEditClick={handleEditClick} 
                        handleRemove={handleRemove}
                    />
                ))}
            </div>
        </div>
    );
};

// Sidebar Component (Unchanged)
const Sidebar = ({ isOpen, onClose, currentPage, setCurrentPage, username, email }) => (
    <div
        className={`fixed inset-y-0 left-0 z-50 lg:static lg:z-0 lg:block lg:w-64 bg-white shadow-xl shadow-gray-100/50 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 w-[80vw] sm:w-64' : '-translate-x-full'} lg:translate-x-0 min-h-0.5 lg:rounded-xl lg:mr-4 lg:mb-4 lg:ml-4 m-0 lg:mt-8`} 
    >
        <div className='p-0'>
            <UserProfile username={username} email={email} onClose={onClose} />
            
            <nav className="space-y-1 p-4">
                {navItems.map((item) => (
                    <NavItem 
                        key={item.page} 
                        item={item} 
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        onClick={onClose}
                    />
                ))}
            </nav>
        </div>
        
        <div className="border-t border-gray-100 pt-4 mt-auto p-4">
            <a 
                href="#logout" 
                onClick={() => {
                    localStorage.removeItem('user');
                    onClose();
                }}
                className="flex items-center p-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-orange-600 transition duration-150 ease-in-out"
            >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Logout</span>
            </a>
        </div>
    </div>
);

// ========================================================
// Main Application Component (Dashboard)
// ========================================================
const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard'); 
    const [addresses, setAddresses] = useState([]); 
    const [orders, setOrders] = useState([]); // 💡 Holds dynamic order data
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [editingAddress, setEditingAddress] = useState(null); 
    
    const [loggedUserName, setLoggedUserName] = useState("");
    const [loggedUserEmail, setLoggedUserEmail] = useState("");

    const userId = getUserId();

    // 💡 CALCULATION STATES
    const [totalOrderAmount, setTotalOrderAmount] = useState(0);
    const [totalOrderCount, setTotalOrderCount] = useState(0);

    // Load user data from localStorage on initial mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setLoggedUserName(userData.username || 'User');
                setLoggedUserEmail(userData.email || 'user@email.com');
            }
        } catch (e) {
            console.error('Error loading user from localStorage:', e);
        }
    }, []);

    // 💡 FUNCTION to FETCH ADDRESSES and USER INFO (Unchanged)
    const fetchAddresses = async () => {
        if (!userId) {
            setAddresses([]);
            return;
        }

        try {
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                const data = userDoc.data();
                
                setLoggedUserName(data.username || 'User');
                setLoggedUserEmail(data.email || 'user@email.com');

                const shipping = data.shippingAddresses || [];
                const billing = data.billingAddresses || [];

                const allAddresses = [
                    ...shipping.map(formatAddressFromFirestore),
                    ...billing.map(formatAddressFromFirestore)
                ];
                
                const uniqueAddresses = Array.from(new Set(allAddresses.map(a => a.id)))
                    .map(id => allAddresses.find(a => a.id === id));
                
                setAddresses(uniqueAddresses);
            } else {
                console.error(`User document with UID ${userId} not found.`);
                setAddresses([]);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    // 💡 FUNCTION to DYNAMICALLY FETCH USER ORDERS
    const fetchOrders = async () => {
        if (!userId) {
            setOrders([]);
            setTotalOrderAmount(0); // Reset stats
            setTotalOrderCount(0); // Reset stats
            return;
        }
    
        try {
            const ordersCollectionRef = collection(db, "orders"); 
            
            // Filter query by the logged-in user's ID
            const userOrdersQuery = query(
                ordersCollectionRef, 
                where("userId", "==", userId)
            );
            
            const querySnapshot = await getDocs(userOrdersQuery); 
            
            let totalAmount = 0;
            
            const fetchedOrders = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const amount = data.totalAmount || data.total || 0;
                totalAmount += parseFloat(amount); // Accumulate total amount
                
                return {
                    id: doc.id, 
                    orderNumber: data.orderId || `#${doc.id.slice(0, 8)}`,
                    amount: amount,
                    status: data.status || (data.paymentId || data.paymentMethod === "SQUARE" ? "PAID" : "PENDING"),
                    method: data.paymentMethod || 'N/A',
                    date: data.createdAt?.seconds
                        ? new Date(data.createdAt.seconds * 1000).toLocaleDateString()
                        : 'N/A',
                    paymentId: data.paymentToken || data.paymentId || "",
                    ...data 
                };
            });
            
            setOrders(fetchedOrders);
            setTotalOrderCount(fetchedOrders.length); // Set total count
            setTotalOrderAmount(totalAmount); // Set total amount
            
        } catch (error) {
            console.error("Error fetching user orders:", error);
            setOrders([]); 
            setTotalOrderAmount(0);
            setTotalOrderCount(0);
        }
    };
    
    // Initial Data Fetch (Addresses and ORDERS)
    useEffect(() => {
        fetchAddresses(); 
        fetchOrders(); // Call fetch orders here
    }, [userId]); 


    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


    // 💡 HANDLER to SAVE/ADD ADDRESS (Unchanged)
    const handleSaveAddress = async (newAddress) => {
        if (!userId) return;

        const userDocRef = doc(db, 'users', userId);
        const isNew = newAddress.id.startsWith('new-');
        const fieldName = newAddress.type === 'Billing' ? 'billingAddresses' : 'shippingAddresses';

        try {
            if (isNew) {
                const firestoreData = formatAddressForFirestore(newAddress, true);
                await updateDoc(userDocRef, {
                    [fieldName]: arrayUnion(firestoreData)
                });
            } else {
                const userDoc = await getDoc(userDocRef);
                const data = userDoc.data();
                
                const targetArray = data[fieldName] || [];
                const originalAddressMap = targetArray.find(a => a.addressId === newAddress.id);

                if (!originalAddressMap) {
                    throw new Error("Original address map not found for update.");
                }

                await updateDoc(userDocRef, {
                    [fieldName]: arrayRemove(originalAddressMap)
                });

                const newFirestoreData = formatAddressForFirestore(newAddress, false);
                await updateDoc(userDocRef, {
                    [fieldName]: arrayUnion(newFirestoreData)
                });
            }

            fetchAddresses(); 
            handleCloseModal();

        } catch (error) {
            console.error("Error saving address:", error);
            alert("Failed to save address. Check console for details.");
        }
    };

    // 💡 HANDLER to REMOVE ADDRESS (Unchanged)
    const handleRemoveAddress = async (addressId) => {
        if (!userId) return;

        try {
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            
            if (!userDoc.exists()) return;

            const data = userDoc.data();
            let addressToRemove = null;
            let fieldName = '';

            const shippingAddressMap = (data.shippingAddresses || []).find(a => a.addressId === addressId);
            const billingAddressMap = (data.billingAddresses || []).find(a => a.addressId === addressId);
            
            if (shippingAddressMap) {
                addressToRemove = shippingAddressMap;
                fieldName = 'shippingAddresses';
            } else if (billingAddressMap) {
                addressToRemove = billingAddressMap;
                fieldName = 'billingAddresses';
            } else {
                console.warn(`Address with ID ${addressId} not found.`);
                return;
            }

            await updateDoc(userDocRef, {
                [fieldName]: arrayRemove(addressToRemove)
            });

            fetchAddresses(); 
        } catch (error) {
            console.error("Error removing address:", error);
            alert("Failed to remove address. Check console for details.");
        }
    };

    // Handlers for Modal actions (Unchanged)
    const handleAddClick = () => {
        setEditingAddress(null); 
        setIsModalOpen(true);
    };

    const handleEditClick = (address) => {
        setEditingAddress(address); 
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAddress(null); 
    };

    const MobileMenuIcon = isSidebarOpen ? X : Menu;

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return (
                    <DashboardContent 
                        username={loggedUserName} 
                        totalOrderAmount={totalOrderAmount} // 🚨 PASS DYNAMIC AMOUNT
                        totalOrderCount={totalOrderCount} // 🚨 PASS DYNAMIC COUNT
                    />
                ); 
            case 'orders':
                // 🚨 PASS DYNAMIC ORDERS TO COMPONENT
                return <OrderHistory orders={orders} />; 
            case 'refund':
                return <RefundHistory />;
            case 'address':
                return (
                    <SavedAddress 
                        addresses={addresses} 
                        handleAddClick={handleAddClick} 
                        handleEditClick={handleEditClick} 
                        handleRemove={handleRemoveAddress} 
                    />
                );
            default:
                return (
                    <DashboardContent 
                        username={loggedUserName} 
                        totalOrderAmount={totalOrderAmount} 
                        totalOrderCount={totalOrderCount}
                    />
                );
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 font-inter lg:mt-20">
            <script src="https://cdn.tailwindcss.com"></script>
            
            <header className="lg:hidden mt-16 z-30 flex items-center justify-between p-4 bg-transparent">
                <button 
                    onClick={toggleSidebar} 
                    className="flex items-center p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-150"
                >
                    <MobileMenuIcon className="h-5 w-5 mr-1" />
                    <span className="font-medium">Menu</span>
                </button>
            </header>
            
            <div className="flex flex-col lg:flex-row"> 
                
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)} 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    username={loggedUserName} 
                    email={loggedUserEmail}    
                />
                
                <div className="flex-grow p-4 lg:p-8 pt-20 lg:mt-8"> 
                    {renderPage()}
                </div>

                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}
            </div>

            {/* Address Modal */}
            {isModalOpen && (
                <AddressModal
                    address={editingAddress}
                    onSave={handleSaveAddress} 
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default Dashboard;