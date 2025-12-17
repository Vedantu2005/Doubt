import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MessageCircle } from 'lucide-react';

export default function BlogSinglePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = parseInt(id);

  // Add console log to debug
  console.log('Blog Post ID:', postId);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: ''
  });

  // All blog posts data
  const allBlogPosts = [
    {
      id: 1,
      title: "5 Tips for Making the Perfect Donuts at Home",
      image: "/browse3.jpg",
      date: "April 23, 2025",
      comments: "No Comments",
      author: "Admin",
      content: [
        "Making perfect donuts at home is an art that combines precise measurements, proper technique, and a dash of patience. Whether you're a beginner or an experienced baker, these tips will help you create donuts that rival those from your favorite bakery.",
        "The key to achieving that perfect texture lies in understanding the dough. Temperature control, kneading time, and resting periods all play crucial roles in developing the ideal consistency. Let's explore the essential techniques that will transform your home baking.",
        "From selecting the right flour to mastering the frying temperature, each step in the donut-making process contributes to the final result. With these professional tips, you'll be creating bakery-quality donuts in your own kitchen."
      ]
    },
    {
      id: 2,
      title: "10 Mouthwatering Donut Recipes You Must Try",
      image: "/featured2.jpg",
      date: "April 22, 2025",
      comments: "No Comments",
      author: "Admin",
      content: [
        "The world of donuts is vast and exciting, with countless variations waiting to be discovered. From classic glazed to innovative flavor combinations, there's a donut recipe for every taste preference and occasion.",
        "Each recipe in this collection has been carefully tested and refined to ensure success. Whether you prefer cake donuts or yeast-raised varieties, you'll find recipes that are both delicious and achievable at home.",
        "These recipes range from traditional favorites to creative twists on classic flavors. Get ready to embark on a delicious journey through the diverse world of homemade donuts."
      ]
    },
    {
      id: 3,
      title: "Exploring Different Variations of Chocolate Donuts",
      image: "/featured3.jpg",
      date: "April 22, 2025",
      comments: "No Comments",
      author: "Admin",
      content: [
        "Chocolate donuts are a beloved classic that never goes out of style. From rich double chocolate to elegant chocolate glazed, the possibilities for chocolate donut variations are endless.",
        "The type of chocolate you choose can dramatically affect the flavor profile of your donuts. Dark chocolate provides a sophisticated, slightly bitter note, while milk chocolate offers a sweeter, creamier taste.",
        "Experimenting with different chocolate combinations and toppings allows you to create unique flavor experiences. Let's dive into the delicious world of chocolate donut varieties."
      ]
    },
    {
      id: 4,
      title: "What Ingredients Do You Need for Making Donuts?",
      image: "/browse4.jpg",
      date: "April 21, 2025",
      comments: "No Comments",
      author: "Admin",
      content: [
        "Understanding the role of each ingredient in donut making is essential for success. From the flour that provides structure to the sugar that adds sweetness, every component serves a specific purpose.",
        "Quality ingredients make a significant difference in the final product. Using fresh yeast, good-quality flour, and pure vanilla extract will elevate your homemade donuts to professional standards.",
        "While the basic ingredients are simple, knowing how they interact and why they're necessary will help you troubleshoot issues and create consistently excellent donuts."
      ]
    },
    {
      id: 5,
      title: "Why Is the Glazed Donut Everyone's Favorite?",
      image: "/BelowRight.png",
      date: "April 20, 2025",
      comments: "No Comments",
      author: "Admin",
      content: [
        "The glazed donut holds a special place in the hearts of donut lovers worldwide. Its simple elegance and perfect balance of sweetness make it a timeless favorite that transcends trends.",
        "The secret to a perfect glaze lies in achieving just the right consistency and applying it at the optimal temperature. A well-made glaze should be smooth, shiny, and just sweet enough to complement the donut without overwhelming it.",
        "From its origins to its enduring popularity, the glazed donut represents the perfect harmony of texture and flavor that makes donuts so universally beloved."
      ]
    },
    {
      id: 6,
      title: "8 Must-Try Donut Variants You Need to Taste",
      image: "/h4.jpg",
      date: "April 20, 2025",
      comments: "No Comments",
      author: "Admin",
      content: [
        "The evolution of donuts has brought us an incredible array of creative variations. From filled donuts to specialty toppings, modern bakeries continue to push the boundaries of traditional donut making.",
        "Each variant offers a unique taste experience, from the crispy exterior of a French cruller to the soft, pillowy texture of a Boston cream. Exploring these different styles will expand your appreciation for this versatile pastry.",
        "Whether you're seeking classic comfort or adventurous new flavors, these donut variants represent the best of both traditional and contemporary baking artistry."
      ]
    }
  ];

  // Get current post
  const currentPost = allBlogPosts.find(post => post.id === postId) || allBlogPosts[0];

  // Recent posts (excluding current post)
  const recentPosts = allBlogPosts.filter(post => post.id !== currentPost.id).slice(0, 4);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Thank you for your comment!');
    setFormData({ name: '', email: '', comment: '' });
  };

  const handleRecentPostClick = (postId) => {
    navigate(`/blog/${postId}`);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    navigate('/blog');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
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
        .floating-image {
          animation: float 4s ease-in-out infinite;
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
          Blog Single
        </h1>
        <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 flex justify-center items-center">
          <img
            src="/banner2.png"
            alt="Donut"
            className="w-full h-full object-contain floating-image"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Scrollable Content */}
          <div className="lg:col-span-2">
            {/* Featured Image with Animation */}
            <div className="mb-8 rounded-3xl overflow-hidden">
              <img 
                src={currentPost.image} 
                alt={currentPost.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Blog Title */}
            <h1 className="blog-title text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {currentPost.title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center gap-6 mb-8 text-sm text-[#d97706]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{currentPost.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{currentPost.comments}</span>
              </div>
            </div>

            {/* Blog Content */}
            <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 mb-12">
              {currentPost.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why This Matters</h2>
              <p>
                Understanding these techniques and insights will help you appreciate the craft behind every donut. Whether you're baking at home or simply enjoying your favorite treats, this knowledge enhances the experience.
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tips for Success</h2>
              <p>
                Remember that practice makes perfect. Don't be discouraged if your first attempts aren't flawless. Each batch teaches you something new, and soon you'll be creating amazing donuts with confidence.
              </p>
            </div>

            {/* Leave a Reply Section - Now on Left Side */}
            <div className="bg-white rounded-3xl p-8 shadow-md">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Leave a Reply</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] transition"
                  />
                </div>
                <div>
                  <textarea
                    name="comment"
                    placeholder="Your Comment"
                    rows="6"
                    value={formData.comment}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] resize-none transition"
                  ></textarea>
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-[#d97706] text-white font-semibold py-3 rounded-full hover:bg-[#b45309] transition-transform duration-150 active:scale-95 shadow-lg"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Sticky Sidebar with Recent Posts Only */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl p-6 shadow-md">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Posts</h3>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div 
                      key={post.id} 
                      className="flex gap-3 cursor-pointer hover:opacity-80 transition"
                      onClick={() => handleRecentPostClick(post.id)}
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-[#d97706]">{post.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}