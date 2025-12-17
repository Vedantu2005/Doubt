// src/utils/storeStatus.js
export const checkIsStoreOpen = (workHours, dayOverride = null) => {
  if (!workHours) return true; // Default to open if data hasn't loaded

  const now = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayOverride || days[now.getDay()];
  
  const todaySchedule = workHours[todayName];

  // If the checkbox for the day is unchecked, store is closed
  if (!todaySchedule || !todaySchedule.checked || !todaySchedule.slots) {
    return false;
  }

  const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

  // Check if current time falls within any of the slots
  return todaySchedule.slots.some(slot => {
    const [startH, startM] = slot.start.split(':').map(Number);
    const [endH, endM] = slot.end.split(':').map(Number);
    
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    return currentTimeMinutes >= startTotal && currentTimeMinutes <= endTotal;
  });
};