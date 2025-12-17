import React, { useState } from 'react';
import { Calendar, MessageCircle } from 'lucide-react';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "5 Tips for Making the Perfect Donuts at Home",
      image: "/browse3.jpg",
      date: "April 23, 2025",
      comments: "No Comments",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim"
    },
    {
      id: 2,
      title: "10 Mouthwatering Donut Recipes You Must Try",
      image: "/featured2.jpg",
      date: "April 22, 2025",
      comments: "No Comments",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim"
    },
    {
      id: 3,
      title: "Exploring Different Variations of Chocolate Donuts",
      image: "/featured3.jpg",
      date: "April 22, 2025",
      comments: "No Comments",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim"
    },
    {
      id: 4,
      title: "What Ingredients Do You Need for Making Donuts?",
      image: "/browse4.jpg",
      date: "April 21, 2025",
      comments: "No Comments",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim"
    },
    {
      id: 5,
      title: "Why Is the Glazed Donut Everyone's Favorite?",
      image: "/BelowRight.png",
      date: "April 20, 2025",
      comments: "No Comments",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim"
    },
    {
      id: 6,
      title: "8 Must-Try Donut Variants You Need to Taste",
      image: "/h4.jpg",
      date: "April 20, 2025",
      comments: "No Comments",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim"
    }
  ];

  return (
    <div className="min-h-screen mt-35 bg-gray-50">
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
        .blog-title {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
      
      {/* Hero Section */}
      <div className="bg-[#5b392a] rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row justify-between items-end mx-4 sm:mx-8 lg:mx-16 my-8 lg:my-12 shadow-xl overflow-hidden relative min-h-[220px] md:min-h-[260px]">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-0 animate-slide-up" style={{ fontFamily: 'Georgia, serif' }}>
          Blog
        </h1>
        <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 flex justify-center items-center animate-rotate-in">
          <img
            src="/banner2.png"
            alt="Donut"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-transform duration-300"
              onClick={() => window.location.href = `/blog/${post.id}`}
            >
              {/* Post Title Above Image */}
              <h3 className="blog-title text-2xl font-normal text-gray-900 mb-4 leading-tight hover:text-[#d97706] transition-colors">
                {post.title}
              </h3>
              
              {/* Post Image */}
              <div className="relative h-64 overflow-hidden rounded-2xl mb-4">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className={`w-full h-full ${
                    post.id === 4 ? 'object-cover object-[85%_center]' : 
                    post.id === 5 ? 'object-cover' : 
                    post.id === 6 ? 'object-cover object-center scale-[0.65]' : 
                    'object-cover'
                  }`}
                />
              </div>
              
              {/* Meta Information */}
              <div className="flex items-center gap-4 mb-4 text-sm text-[#d97706]">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </div>
              </div>
              
              {/* Excerpt */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}