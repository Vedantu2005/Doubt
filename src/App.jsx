import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { checkIsStoreOpen } from "./utils/storeStatus"; // Helper to validate hours

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Hero from "./Pages/Hero";
import Featured from "./Pages/Featured";
import LatestProducts from "./Pages/LatestProducts";
import Category from "./Pages/Category";
import Faq from "./Pages/Faq";
import Subscribe from "./Pages/Subscribe";
import ScrollMarquee from "./Pages/ScrollMarquee";
import AboutPage from "./Pages/AboutPage";
import ProductPage from "./Pages/ProductPage";
import ProductDetail from "./Pages/ProductDetail";
import Cart from "./Components/Cart";
import Banner1 from "./Pages/Banner1";
import Banner2 from "./Pages/Banner2";
import Checkout from "./Pages/Checkout";
import MyAccount from "./Pages/MyAccount";
import ForgotPassword from "./Pages/ForgotPassword";
import Contact from "./Pages/Contact";
import Blog from "./Pages/Blog";
import BlogSinglePage from './Pages/BlogSinglePage';
import Dashboard from "./Pages/Dashboard";
import Terms from './Pages/Terms';
import Privacy from './Pages/Privacy';
import RefundReturn from "./Pages/RefundReturn";
import Store from "./Pages/Store";
import CategoryPage from "./Pages/CategoryPage";
import LatestAlbum from "./Pages/LatestAlbum";
import OrderDetails from './Pages/OrderDetails';
import Notification from './Components/Notification';

function App() {
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  useEffect(() => {
    // 📡 Real-time listener for business hours changes from Admin side
    const unsub = onSnapshot(doc(db, "businessWorkHours", "workHours"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // checkIsStoreOpen evaluates current time against the workHours object
        setIsStoreOpen(checkIsStoreOpen(data.workHours));
      }
    });
    return () => unsub();
  }, []);

  return (
    <Router>
      {/* 🚨 Global Status Banner: Visible site-wide when store is closed */}
      {!isStoreOpen && (
        <div className="bg-red-600 text-white text-center py-2 fixed top-0 w-full z-[100] font-bold text-sm shadow-md animate-pulse">
          Store is currently closed. You can browse products, but ordering is disabled.
        </div>
      )}

      <Notification />
      
      {/* Dynamic padding ensures Navbar doesn't overlap the "Closed" banner */}
      <div className={!isStoreOpen ? "pt-10" : ""}>
        <Navbar />
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Featured />
                <LatestProducts />
                <Category />
                <Banner1 />
                <Banner2 />
                <Faq />
                <ScrollMarquee />
                <Subscribe />
                <LatestAlbum />
              </>
            }
          />

          <Route path="/products" element={<ProductPage />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogSinglePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:orderId" element={<OrderDetails />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund&return" element={<RefundReturn />} />
          <Route path="/store" element={<Store />} />
          <Route path="/category" element={<CategoryPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;