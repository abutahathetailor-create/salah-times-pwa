// COMPLETE SALAH TIMES APP - NO DUPLICATES
(function() {
    'use strict';
    
    // DOM Elements
    const currentDateEl = document.getElementById('currentDate');
    const hijriDateEl = document.getElementById('hijriDate');
    const currentTimeEl = document.getElementById('currentTime');
    const countdownTitleEl = document.getElementById('countdownTitle');
    const countdownTimerEl = document.getElementById('countdownTimer');
    const prayerGridEl = document.getElementById('prayerGrid');
    const errorMessageEl = document.getElementById('errorMessage');

    // Prayer times data - ONLY ONE DECLARATION
    const prayerTimes = {
        Fajr: "04:15 AM",
        Sunrise: "05:35 AM", 
        Dhuhr: "11:55 AM",
        Asr: "03:25 PM",
        Maghrib: "06:15 PM",
        Isha: "07:45 PM"
    };

    // Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('./sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registered');
                })
                .catch(function(error) {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }

    // Update current time
    function updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        });
        if (currentTimeEl) currentTimeEl.textContent = timeString;
        
        if (currentDateEl && !currentDateEl.textContent.includes(now.toLocaleDateString())) {
            updateDateInfo(now);
        }
    }

    function updateDateInfo(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        if (currentDateEl) currentDateEl.textContent = date.toLocaleDateString('en-US', options);
    }

    // Create prayer-specific elements
    function createPrayerSpecificElements() {
        // Fajr elements
        const fajrCard = document.querySelector('.prayer-card[data-prayer="Fajr"]');
        if (fajrCard && !fajrCard.querySelector('.birds-container')) {
            const birdsContainer = document.createElement('div');
            birdsContainer.className = 'birds-container';
            for (let i = 0; i < 5; i++) {
                const bird = document.createElement('div');
                bird.className = 'bird';
                birdsContainer.appendChild(bird);
            }
            
            const starsContainer = document.createElement('div');
            starsContainer.className = 'stars';
            for (let i = 0; i < 5; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                starsContainer.appendChild(star);
            }
            
            fajrCard.appendChild(birdsContainer);
            fajrCard.appendChild(starsContainer);
        }

        // Add other prayer animations as needed...
    }

    // Display prayer times
    function displayPrayerTimes() {
        if (!prayerGridEl) return;
        
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
        
        createPrayerSpecificElements();
    }

    // SIMPLE COUNTDOWN - WORKING VERSION
    function updateCountdown() {
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentSeconds = now.getSeconds();
        const currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
        
        // Reset classes
        document.querySelectorAll('.prayer-card').forEach(card => {
            card.classList.remove('active', 'next');
        });
        
        let nextPrayerName = '';
        let nextPrayerTime = null;
        let activePrayerName = '';
        
        // Convert prayer times to seconds since midnight
        const prayerTimesInSeconds = {};
        
        Object.entries(prayerTimes).forEach(([prayer, time]) => {
            const [timePart, period] = time.split(' ');
            let [hours, minutes] = timePart.split(':').map(Number);
            
            // Convert to 24-hour format
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            
            const prayerTotalSeconds = hours * 3600 + minutes * 60;
            prayerTimesInSeconds[prayer] = prayerTotalSeconds;
            
            // Check if this prayer is active
            if (prayerTotalSeconds <= currentTotalSeconds) {
                activePrayerName = prayer;
            }
        });
        
        // Find next prayer
        Object.entries(prayerTimesInSeconds).forEach(([prayer, prayerSeconds]) => {
            if (prayerSeconds > currentTotalSeconds) {
                if (!nextPrayerTime || prayerSeconds < nextPrayerTime) {
                    nextPrayerName = prayer;
                    nextPrayerTime = prayerSeconds;
                }
            }
        });
        
        // If no next prayer found today, use Fajr tomorrow
        if (!nextPrayerName) {
            nextPrayerName = 'Fajr';
            nextPrayerTime = prayerTimesInSeconds.Fajr + (24 * 3600);
        }
        
        // Update UI
        if (activePrayerName) {
            const activeCard = document.getElementById(`prayer-${activePrayerName}`);
            if (activeCard) activeCard.classList.add('active');
        }
        
        if (nextPrayerName) {
            const nextCard = document.getElementById(`prayer-${nextPrayerName}`);
            if (nextCard) nextCard.classList.add('next');
        }
        
        // Calculate time difference
        let timeDiff = nextPrayerTime - currentTotalSeconds;
        if (timeDiff < 0) timeDiff += 24 * 3600;
        
        const hours = Math.floor(timeDiff / 3600);
        const minutes = Math.floor((timeDiff % 3600) / 60);
        const seconds = timeDiff % 60;
        
        // Update display
        if (countdownTitleEl) countdownTitleEl.textContent = `Time until ${nextPrayerName}:`;
        if (countdownTimerEl) countdownTimerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Initialize app
    function initApp() {
        console.log('🚀 Initializing Salah Times App...');
        
        // Set initial date and Hijri date
        updateDateInfo(new Date());
        if (hijriDateEl) hijriDateEl.textContent = '7 Jumada al-Thani 1445 AH';
        
        // Display prayer times
        displayPrayerTimes();
        
        // Start timers
        updateCurrentTime();
        setInterval(updateCurrentTime, 1000);
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
        
        console.log('✅ App initialized successfully!');
    }

    // Start when page loads
    window.addEventListener('load', initApp);
})();
