import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, X } from 'lucide-react';

/**
 * Custom Notification Box
 */
const NotificationBox = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100 relative">
                <h3 className="text-xl font-bold text-[#5b392a] mb-3">Success!</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                    aria-label="Close notification"
                >
                    <X className="w-5 h-5" />
                </button>
                <button
                    onClick={onClose}
                    className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition"
                >
                    Got It
                </button>
            </div>
        </div>
    );
};

const InfoCard = ({ icon: Icon, title, text, isHighlighted }) => (
    <div className={`rounded-3xl p-6 text-left shadow-md transition-all duration-300 
      ${isHighlighted ? 'bg-[#5b392a] text-white' : 'bg-amber-200 hover:shadow-lg'}`}>
        <h3 className={`font-normal text-base mb-1 ${isHighlighted ? 'text-white' : 'text-gray-700'}`}>{title}</h3>
        <p className={`font-bold text-xl ${isHighlighted ? 'text-white' : 'text-gray-900'}`}>{text}</p>
    </div>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setNotificationMessage('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };
  
  const handleCloseNotification = () => setNotificationMessage('');

  return (
    <div className="min-h-screen mt-35 bg-gray-50">
      <NotificationBox 
        message={notificationMessage} 
        onClose={handleCloseNotification}
      />
      
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes rotateIn {
          from {
            transform: rotate(-15deg);
            opacity: 0;
          }
          to {
            transform: rotate(0deg);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slideUp 1s ease-out forwards;
        }
        .animate-rotate-in {
          animation: rotateIn 1s ease-out forwards;
        }
      `}</style>
      
      {/* Hero Section */}
      <div className="bg-[#5b392a] rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row justify-between items-end mx-4 sm:mx-8 lg:mx-16 my-8 lg:my-12 shadow-xl overflow-hidden relative min-h-[220px] md:min-h-[260px]">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-0 animate-slide-up" style={{ fontFamily: 'Georgia, serif' }}>
          Contact Us
        </h1>
        <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 flex justify-center items-center animate-rotate-in">
          <img
            src="/banner2.png"
            alt="Donut"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Contact Info Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <InfoCard icon={Clock} title="Working hours" text="09:00 am - 08:30 pm" isHighlighted={false} />
          <InfoCard icon={Phone} title="Call us on" text="(+1) 254 56 789" isHighlighted={false} />
          <InfoCard icon={Mail} title="You can email here" text="ex@domain.com" isHighlighted={false} />
          <InfoCard icon={MapPin} title="Address" text="633, Northwest, Ecuador" isHighlighted={true} />
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Image */}
          <div className="flex justify-center lg:justify-start">
            <img 
              src="/featured3.jpg" 
              alt="Donuts" 
              className="w-full max-w-md rounded-3xl shadow-lg object-cover"
            />
          </div>
          
          {/* Right Side - Form */}
          <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              Get in Touch
            </h2>
            
            <div className="space-y-5">
              <input 
                type="text" 
                name="name"
                placeholder="Name" 
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-full p-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition"
              />
              
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-full p-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition"
              />
              
              <textarea 
                name="message"
                placeholder="Message" 
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-3xl p-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] resize-none transition"
              ></textarea>
              
              <button 
                onClick={handleSubmit}
                className="bg-[#d97706] text-white font-semibold py-3 px-12 rounded-full hover:bg-[#b45309] transition-transform duration-150 active:scale-95 shadow-lg"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mx-4 sm:mx-8 lg:mx-16 my-12 lg:my-16 bg-[#5b392a] rounded-3xl p-12 sm:p-16 lg:p-20 text-center shadow-xl">
        <p className="text-[#d97706] text-lg font-semibold mb-4">Ask Question</p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          View Frequently Asked Questions
        </h2>
        <p className="text-white text-base sm:text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
          I am text block. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
        </p>
        <button className="bg-[#d97706] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#b45309] transition-transform duration-150 active:scale-95 shadow-lg">
          View FAQ
        </button>
      </div>
    </div>
  );
}