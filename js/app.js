// MAIN APP LOADER - FIXED VERSION
(function() {
    'use strict';
    
    console.log('🚀 Loading Salah Times App...');
    
    // Global app namespace
    window.SalahTimes = {
        init: function() {
            console.log('✅ Initializing Salah Times App...');
            
            // Set initial date and Hijri date
            this.updateDateInfo(new Date());
            this.setHijriDate('7 Jumada al-Thani 1445 AH');
            
            // Render prayer times
            this.renderPrayerTimes();
            
            // Start timers
            this.startTimers();
            
            console.log('🎉 App initialized successfully!');
        },
        
        updateDateInfo: function(date) {
            const currentDateEl = document.getElementById('currentDate');
            if (!currentDateEl) return;
            
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            currentDateEl.textContent = date.toLocaleDateString('en-US', options);
        },
        
        setHijriDate: function(hijriDate) {
            const hijriDateEl = document.getElementById('hijriDate');
            if (hijriDateEl) hijriDateEl.textContent = hijriDate;
        },
        
        updateCurrentTime: function() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true 
            });
            
            const currentTimeEl = document.getElementById('currentTime');
            if (currentTimeEl) currentTimeEl.textContent = timeString;
        },
        
        renderPrayerTimes: function() {
            const prayerGridEl = document.getElementById('prayerGrid');
            if (!prayerGridEl) return;
            
            const prayerTimes = this.getPrayerTimes();
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
            
            // Create animations
            this.createAnimations();
        },
        
        getPrayerTimes: function() {
            return {
                Fajr: "04:15 AM",
                Sunrise: "05:35 AM", 
                Dhuhr: "11:55 AM",
                Asr: "03:25 PM",
                Maghrib: "06:15 PM",
                Isha: "07:45 PM"
            };
        },
        
        createAnimations: function() {
            // Fajr animations
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
            
            // Add other animations as needed...
        },
        
        updateCountdown: function() {
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();
            const currentSeconds = now.getSeconds();
            const currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
            
            // Reset classes
            document.querySelectorAll('.prayer-card').forEach(card => {
                card.classList.remove('active', 'next');
            });
            
            const prayerTimes = this.getPrayerTimes();
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
            const countdownTitleEl = document.getElementById('countdownTitle');
            const countdownTimerEl = document.getElementById('countdownTimer');
            
            if (countdownTitleEl) countdownTitleEl.textContent = `Time until ${nextPrayerName}:`;
            if (countdownTimerEl) countdownTimerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        },
        
        startTimers: function() {
            // Current time updates
            this.updateCurrentTime();
            setInterval(() => this.updateCurrentTime(), 1000);
            
            // Countdown updates
            this.updateCountdown();
            setInterval(() => this.updateCountdown(), 1000);
        }
    };
    
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('./sw.js')
                .then(function(registration) {
                    console.log('✅ ServiceWorker registered');
                })
                .catch(function(error) {
                    console.log('❌ ServiceWorker registration failed: ', error);
                });
        });
    }
    
    // Initialize app when page loads
    window.addEventListener('load', function() {
        window.SalahTimes.init();
    });
    
})();
