// UI RENDERING FUNCTIONS
window.UI = (function() {
    'use strict';
    
    function updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        });
        
        const currentTimeEl = document.getElementById('currentTime');
        if (currentTimeEl) currentTimeEl.textContent = timeString;
        
        updateDateInfo(now);
    }
    
    function updateDateInfo(date) {
        const currentDateEl = document.getElementById('currentDate');
        if (!currentDateEl) return;
        
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDateEl.textContent = date.toLocaleDateString('en-US', options);
    }
    
    function renderPrayerTimes() {
        const prayerGridEl = document.getElementById('prayerGrid');
        if (!prayerGridEl) return;
        
        const prayerTimes = window.PrayerTimes.getPrayerTimes();
        const prayerIcons = {
            Fajr: "fas fa-sun",
            Sunrise: "fas fa-sunrise",
            Dhuhr: "fas fa-sun",
            Asr: "fas fa-sun",
            Maghrib: "fas fa-sunset",
            Isha: "fas fa-moon"
        };
        
        prayerGridEl.innerHTML = '';
        
        Object.entries(prayerTimes).forEach(([prayer, time]) => {
            const prayerCard = document.createElement('div');
            prayerCard.className = 'prayer-card';
            prayerCard.id = `prayer-${prayer}`;
            prayerCard.setAttribute('data-prayer', prayer);
            
            prayerCard.innerHTML = `
                <div class="prayer-name">
                    <i class="${prayerIcons[prayer]}"></i>
                    <span>${prayer}</span>
                </div>
                <div class="prayer-time">${time}</div>
            `;
            
            prayerGridEl.appendChild(prayerCard);
        });
        
        // Create animations after rendering
        if (window.Animations) {
            window.Animations.createAllAnimations();
        }
    }
    
    function initializeUI() {
        // Set initial Hijri date
        const hijriDateEl = document.getElementById('hijriDate');
        if (hijriDateEl) hijriDateEl.textContent = '7 Jumada al-Thani 1445 AH';
        
        // Render prayer times
        renderPrayerTimes();
        
        // Start time updates
        updateCurrentTime();
        setInterval(updateCurrentTime, 1000);
    }
    
    // Public API
    return {
        initializeUI,
        renderPrayerTimes,
        updateCurrentTime
    };
})();
