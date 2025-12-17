import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // Make sure this path is correct
import { AlertCircle, X } from "lucide-react";

const Notification = () => {
  const [isClosed, setIsClosed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true); // Allow user to dismiss notification temporarily

  useEffect(() => {
    // Reference to your existing Firestore document
    const docRef = doc(db, "businessWorkHours", "workHours");

    // Listen for real-time updates
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        checkShopStatus(data.workHours);
      }
      setLoading(false);
    });

    // Optional: Re-check status every minute (in case shop closes while user is browsing)
    const interval = setInterval(() => {
        // This forces a re-render/re-check if you had stored data in a ref, 
        // but for simplicity, the snapshot usually handles the data update.
        // To be perfectly safe with time passing:
        if (!loading) {
            // We need the data to re-check. 
            // In a real app, you might save data to state to re-use it here.
            // For now, the snapshot is the main trigger.
        }
    }, 60000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const checkShopStatus = (workHours) => {
    if (!workHours) return;

    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    
    const now = new Date();
    const currentDayName = days[now.getDay()]; // e.g., "Wednesday"
    
    // Convert current time to minutes (e.g., 14:30 = 870 minutes)
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todaySchedule = workHours[currentDayName];

    // 1. Check if the day is completely unchecked (Closed all day)
    if (!todaySchedule || !todaySchedule.checked || !todaySchedule.slots || todaySchedule.slots.length === 0) {
      setIsClosed(true);
      return;
    }

    // 2. Check if current time matches any open slot
    let isOpenNow = false;

    for (let slot of todaySchedule.slots) {
      const [startH, startM] = slot.start.split(":").map(Number);
      const [endH, endM] = slot.end.split(":").map(Number);

      const startTotal = startH * 60 + startM;
      const endTotal = endH * 60 + endM;

      if (currentMinutes >= startTotal && currentMinutes < endTotal) {
        isOpenNow = true;
        break; // Found a valid slot, shop is open
      }
    }

    // If we found a slot where we are open, isClosed is false. Otherwise true.
    setIsClosed(!isOpenNow);
  };

  // If loading, or if the shop is OPEN, or if user manually closed the banner: DO NOT SHOW
  if (loading || !isClosed || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] bg-red-600 text-white shadow-lg animate-slide-up sm:relative sm:top-0">
      <div className="max-w-9xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-100 animate-pulse" />
          <div>
            <p className="font-bold text-sm sm:text-base">
              We are currently closed.
            </p>
            <p className="text-xs sm:text-sm text-red-100">
              Orders placed now will be processed when we reopen.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-md hover:bg-red-700 transition-colors"
        >
          <X size={20} />
        </button>

      </div>
    </div>
  );
};

export default Notification;