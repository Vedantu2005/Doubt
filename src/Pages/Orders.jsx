import React, { useState } from 'react';
import { LayoutGrid, Package, History, MapPin, LogOut, DollarSign, Target, Box, Menu, X, Wallet, Banknote } from 'lucide-react'; // Added Banknote back for completeness, though unused in nav

// --- Configuration ---
const navItems = [
  { name: 'Dashboard', icon: LayoutGrid, href: '#dashboard', current: true },
  // Bank Details removed as requested
  { name: 'My Orders', icon: Package, href: '#orders', current: false },
  { name: 'Refund History', icon: History, href: '#refund', current: false },
  { name: 'Saved Address', icon: MapPin, href: '#address', current: false },
];

const userName = 'd.p.panchal225@gmail.com'; // Maintaining "Admin" as requested
const userEmail = 'd.p.panchal225@gmail.com';
const appTitle = 'Yral Foods'; 

// --- Component Definitions ---

// Reusable Navigation Link Component
const NavItem = ({ item, onClick }) => {
  const isCurrent = item.current;
  const activeClasses = 'bg-orange-50 text-orange-600 font-semibold';
  const inactiveClasses = 'text-gray-600 hover:bg-gray-50 hover:text-orange-600';

  return (
    <a
      href={item.href}
      onClick={onClick}
      className={`flex items-center p-3 rounded-xl transition duration-150 ease-in-out ${isCurrent ? activeClasses : inactiveClasses}`}
    >
      <item.icon className="h-5 w-5 mr-3" />
      <span>{item.name}</span>
    </a>
  );
};

// User Profile Card in Sidebar
const UserProfile = ({ onClose }) => (
  <div className="p-4 flex items-center justify-between border-b border-gray-100 mb-4">
    <div className="flex items-center space-x-3">
      {/* Avatar/Initial (A for Admin) */}
      <div className="w-10 h-10 bg-orange-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
        {userName.charAt(0)}
      </div>
      <div>
        <p className="text-gray-900 font-semibold text-base">{userName}</p>
        <p className="text-gray-500 text-sm">{userEmail}</p>
      </div>
    </div>
    {/* Close button inside the drawer header for mobile */}
    <button onClick={onClose} className="text-gray-500 lg:hidden p-1 rounded-full hover:bg-gray-100">
      <X className="h-6 w-6" />
    </button>
  </div>
);

// Stat Card Component (Modified to be responsive: vertical stack on mobile, horizontal flow on large screens)
const StatCard = ({ icon: Icon, title, value, unit, color }) => (
  // Mobile (default): Stacked vertically (flex-col) and takes full width (w-full).
  // Desktop (lg+): Horizontal layout (flex-row), allowing cards to be side-by-side.
  <div className="bg-white p-6 rounded-xl shadow-md w-full 
    flex flex-col items-start space-y-2 
    lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4 lg:flex-1 lg:min-w-0" // Resetting flex for desktop flow
  >
    {/* Icon and Value Container */}
    <div className='flex items-center space-x-3'>
      {/* Icon */}
      <div className={`p-2 rounded-full ${color.bg} ${color.text}`}>
        <Icon className="h-6 w-6" />
      </div>
      {/* Value */}
      <p className="text-xl sm:text-2xl font-bold text-gray-800">
        {unit}
        {value}
      </p>
    </div>
    
    {/* Title - Positioned correctly for both mobile (indented) and desktop (aligned right) */}
    <p className="text-gray-500 text-sm ml-12 lg:ml-auto lg:mr-0">
      {title}
    </p>
  </div>
);

// Main Dashboard Content Area
const DashboardContent = () => (
  // Updated lg:pt-8 to lg:mt-8 to align with the sidebar's top margin on desktop, achieving the desired offset.
  <div className="flex-grow p-4 lg:p-8 lg:mt-8"> 
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Hello, {userName}!
      </h1>
      <p className="text-gray-600 mb-8">
        From your My Account Dashboard you can view recent activity and update information.
      </p>

      {/* Stats Row - Responsive Flex Container: vertical stack on mobile, horizontal flow on desktop */}
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6 justify-start">
        {/* Total Order: Icon - Wallet, Value - $0, Color - Orange */}
        <StatCard
          icon={Wallet} 
          title="Total Order"
          value="0"
          unit="$"
          color={{ bg: 'bg-orange-100', text: 'text-orange-600' }}
        />
        {/* Total Points: Icon - History, Value - 0, Color - Red */}
        <StatCard
          icon={History} 
          title="Total Points"
          value="0"
          unit=""
          color={{ bg: 'bg-red-100', text: 'text-red-500' }}
        />
        {/* Total Orders: Icon - Box, Value - 0, Color - Orange */}
        <StatCard
          icon={Box}
          title="Total Orders"
          value="0"
          unit=""
          color={{ bg: 'bg-orange-100', text: 'text-orange-600' }}
        />
      </div>
    </div>
  </div>
);

// Sidebar Component
const Sidebar = ({ isOpen, onClose }) => (
  // On desktop (lg+), we use lg:static and explicitly set lg:z-0 to ensure it is in the normal document flow
  // and does not float above content, while maintaining z-50 for the mobile overlay.
  <div
    className={`fixed inset-y-0 left-0 z-50 lg:static lg:z-0 lg:block lg:w-64 bg-white shadow-xl shadow-gray-100/50 flex flex-col justify-between transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0 w-[80vw] sm:w-64' : '-translate-x-full'} lg:translate-x-0 min-h-screen lg:rounded-xl lg:mr-4 lg:mb-4 lg:ml-4 m-0 lg:mt-8`} 
  >
    {/* Profile/Close Button Area (Top of Drawer) */}
    <div className='p-0'>
      {/* Use UserProfile here which now includes the mobile close button */}
      <UserProfile onClose={onClose} />
      
      <nav className="space-y-1 p-4">
        {navItems.map((item) => (
          <NavItem key={item.name} item={item} onClick={onClose} />
        ))}
      </nav>
    </div>
    
    {/* Logout Link */}
    <div className="border-t border-gray-100 pt-4 mt-auto p-4">
        <a 
            href="#logout" 
            onClick={onClose}
            className="flex items-center p-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-orange-600 transition duration-150 ease-in-out"
        >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
        </a>
    </div>
  </div>
);

// Main Application Component
const Orders = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Determine the Icon component to show based on sidebar state
  const MobileMenuIcon = isSidebarOpen ? X : Menu;

  return (
    <div className="min-h-screen bg-gray-50 font-inter lg:mt-20">
      <script src="https://cdn.tailwindcss.com"></script>
      
      {/* Mobile Header (Fixed at top, NO shadow) */}
      <header className="lg:hidden mt-16 z-30 flex items-center justify-between p-4 bg-transparent">
        {/* Menu Button - Now on the left, with text and toggling icon */}
        <button 
            onClick={toggleSidebar} 
            className="flex items-center p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-150"
        >
            {/* Conditional Icon rendering */}
            <MobileMenuIcon className="h-5 w-5 mr-1" />
            <span className="font-medium">Menu</span>
        </button>
        
        {/* Title/Logo area removed as requested. Now only the menu button is present on the left. */}
      </header>
      
      {/* Main Layout - No top margin here */}
      <div className="flex flex-col lg:flex-row"> 
        {/* Sidebar and DashboardContent both now handle their own top margin and z-index */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        {/* Main Content Area */}
        <DashboardContent />

        {/* Backdrop for Mobile Sidebar - z-40 so it's below the sidebar (z-50) but above the header (z-30) */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </div>
    </div>
  );
};

export default Orders;
