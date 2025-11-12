// PRAYER TIMES CALCULATIONS
window.PrayerTimes = (function() {
    'use strict';
    
    const JUBAIL_LAT = 27.0040;
    const JUBAIL_LNG = 49.6460;
    
    // Default prayer times (fallback)
    const defaultPrayerTimes = {
        Fajr: "04:15 AM",
        Sunrise: "05:35 AM", 
        Dhuhr: "11:55 AM",
        Asr: "03:25 PM",
        Maghrib: "06:15 PM",
        Isha: "07:45 PM"
    };
    
    let currentPrayerTimes = {...defaultPrayerTimes};
    
    function getPrayerTimes() {
        return currentPrayerTimes;
    }
    
    function setPrayerTimes(newTimes) {
        currentPrayerTimes = {...newTimes};
    }
    
    function getPrayerTimeInSeconds(prayerName) {
        const time = currentPrayerTimes[prayerName];
        if (!time) return 0;
        
        const [timePart, period] = time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
        
        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        return hours * 3600 + minutes * 60;
    }
    
    function getAllPrayerTimesInSeconds() {
        const result = {};
        Object.keys(currentPrayerTimes).forEach(prayer => {
            result[prayer] = getPrayerTimeInSeconds(prayer);
        });
        return result;
    }
    
    // Public API
    return {
        getPrayerTimes,
        setPrayerTimes,
        getPrayerTimeInSeconds,
        getAllPrayerTimesInSeconds,
        defaultPrayerTimes
    };
})();
