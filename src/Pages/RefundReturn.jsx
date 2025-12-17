import React from 'react';

const RefundReturn = () => {
  // Define the Refund and Return Policy content in a structured array
  const policySections = [
    {
      title: "1. Order Changes & Cancellations",
      type: "list",
      content: [
        "You may request to cancel or change the pickup date of your order if you let us know at least **24 hours in advance** of your scheduled pickup.",
        "If cancellation or changes are requested with at least 24 hours’ notice, we can process either a **refund** or offer a **store credit**, depending on what works best for you.",
        "If the order is requested for today or less than 24 hours before the pickup time, we may not be able to accommodate changes or cancellations (as production may be in progress).",
      ],
    },
    {
      title: "2. Missed Pickups / No Shows",
      type: "list",
      content: [
        "If you forget to pick up your order at the scheduled time, we’re sorry, but **refunds will not be offered** in that case.",
        "Unclaimed orders will be held for a reasonable amount of time (e.g. until end of business day), after which they may be donated or disposed of.",
      ],
    },
    {
      title: "3. Defective / Wrong / Damaged Items",
      type: "list",
      content: [
        "We do everything possible to ensure your order is correct and of high quality. If you find that your donuts or beverages are faulty, damaged, or incorrect, please contact us **on the same day as pickup**.",
        "You will need to provide your order details and **photos or proof** of the issue.",
        "In such cases, we will offer either a **replacement, store credit, or a refund**, depending on the situation.",
      ],
    },
    {
      title: "4. Emergencies & Special Circumstances",
      type: "list",
      content: [
        "We understand that sometimes things happen beyond your control. In emergency situations (illness, accident, etc.), when you are unable to make your pickup, reach out to us as soon as you can.",
        "In these special cases, **store credit is typically provided** rather than a refund, unless there are exceptional circumstances.",
      ],
    },
    {
      title: "5. Time Limits & Proof",
      type: "list",
      content: [
        "All claims for incorrect, damaged, or unsatisfactory items must be made **on the day of pickup**.",
        "Please have your order number, name, and ideally **photo proof** of the issue ready.",
      ],
    },
    {
      title: "6. Store Credit vs Refunds",
      type: "list",
      content: [
        "Refunds are only possible in these scenarios:",
        <ul key="refund-list" className="list-[circle] ml-6 mt-1 space-y-1">
          <li>You cancelled or changed the pickup date at least 24 hours before the scheduled time.</li>
          <li>There was a mistake, damage, or defect in your order.</li>
        </ul>,
        "In emergency or exceptional cases, we’ll issue store credit instead of a refund.",
      ],
    },
    {
      title: "7. How to Request a Refund or Store Credit",
      type: "list",
      content: [
        "Contact us via phone, email, or in person (whichever is easiest) with your **order number, date, what went wrong, and any supporting photos**.",
        "We’ll review and decide whether a refund, replacement, or store credit is appropriate.",
        "If approved, refunds will be issued to the original payment method. Store credits will be provided as an e-gift card which never expires.",
      ],
    },
    {
      title: "8. Disclaimer",
      type: "list",
      content: [
        "Due to the perishable nature of our products (especially food and beverages), all sales are **final** unless one of the above conditions applies.",
        "We cannot accept returns or refunds simply for **change of mind** after the order is made or after pickup.",
      ],
    },
  ];

  return (
    <div className="bg-gray-50 mt-15 py-12 sm:py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
          
          {/* Left Section - Header & Contact Button */}
          <div className="flex flex-col justify-between space-y-6 sm:space-y-8 lg:w-96 lg:flex-shrink-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-black leading-tight font-main">
              Refund &<br/> Return Policy
            </h1>
            
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg lg:text-xl text-black font-main">
                Ready to Request Assistance?
              </h3>
              
              <button className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                Start a Claim
              </button>
            </div>
          </div>
          
          {/* Right Section - Policy Content */}
          <div className="space-y-8 w-full">
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Thank you for choosing **Boxcar Donuts**. We love serving you fresh, delicious donuts and coffee, and we want to make sure you’re happy with your order. Because our items are made fresh per order, we have the following policy in place.
            </p>
            
            {/* Map over the policySections to display each section */}
            <div className="space-y-6">
              {policySections.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight font-main">
                    {item.title}
                  </h2>
                  
                  <div className="text-gray-700 text-base sm:text-lg leading-relaxed">
                    {/* Render content as an unordered list */}
                    <ul className="list-disc ml-5 space-y-2">
                      {item.content.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundReturn;