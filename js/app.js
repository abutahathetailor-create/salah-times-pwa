// MAIN APP LOADER WITH API INTEGRATION
(function() {
    'use strict';
    
    console.log('🚀 Loading Salah Times App...');
    
    // Global app namespace
    window.SalahTimes = {
        // Configuration
        config: {
            JUBAIL_LAT: 27.0040,
            JUBAIL_LNG: 49.6460,
            API_METHOD: 4, // University of Islamic Sciences, Karachi
            API_ENDPOINTS: [
                'https://api.aladhan.com/v1/timings/{date}?latitude={lat}&longitude={lng}&method={method}',
                'https://api.aladhan.com/v1/timings/{date}?latitude={lat}&longitude={lng}&method={method}&school=1'
            ]
        },
        
        // Default fallback times (will be replaced by API)
        defaultPrayerTimes: {
            Fajr: "04:15 AM",
            Sunrise: "05:35 AM", 
            Dhuhr: "11:55 AM",
            Asr: "03:25 PM",
            Maghrib: "06:15 PM",
            Isha: "07:45 PM"
        },
        
        currentPrayerTimes: {},
        
        init: function() {
            console.log('✅ Initializing Salah Times App...');
            
            // Set initial date
            this.updateDateInfo(new Date());
            
            // Show loading state
            this.showLoadingState();
            
            // Load prayer times from API
            this.loadPrayerTimesFromAPI();
            
            // Start timers
            this.startTimers();
        },
        
        showLoadingState: function() {
            const prayerGridEl = document.getElementById('prayerGrid');
            if (prayerGridEl) {
                prayerGridEl.innerHTML = `
                    <div class="loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <div>Fetching prayer times...</div>
                    </div>
                `;
            }
            
            // Set temporary Hijri date
            this.setHijriDate('Loading...');
        },
        
        showErrorState: function(message) {
            const prayerGridEl = document.getElementById('prayerGrid');
            if (prayerGridEl) {
                prayerGridEl.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>${message}</div>
                        <button class="retry-button" onclick="SalahTimes.loadPrayerTimesFromAPI()">
                            <i class="fas fa-redo"></i> Retry
                        </button>
                    </div>
                `;
            }
        },
        
        async loadPrayerTimesFromAPI() {
            console.log('📡 Fetching prayer times from API...');
            
            try {
                const prayerData = await this.fetchPrayerTimes();
                
                // Update prayer times
                this.currentPrayerTimes = {
                    Fajr: this.formatTimeForDisplay(prayerData.timings.Fajr),
                    Sunrise: this.formatTimeForDisplay(prayerData.timings.Sunrise),
                    Dhuhr: this.formatTimeForDisplay(prayerData.timings.Dhuhr),
                    Asr: this.formatTimeForDisplay(prayerData.timings.Asr),
                    Maghrib: this.formatTimeForDisplay(prayerData.timings.Maghrib),
                    Isha: this.formatTimeForDisplay(prayerData.timings.Isha)
                };
                
                // Update Hijri date
                const hijri = prayerData.date.hijri;
                this.setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year} AH`);
                
                // Render prayer times
                this.renderPrayerTimes();
                
                console.log('✅ Prayer times loaded successfully:', this.currentPrayerTimes);
                
            } catch (error) {
                console.error('❌ API Error:', error);
                this.useFallbackData();
                this.showErrorState(`Using approximate times. ${error.message}`);
            }
        },
        
        async fetchPrayerTimes() {
            const today = new Date();
            const dateString = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
            
            // Try multiple API endpoints
            const apiEndpoints = [
                // Primary endpoint
                `https://api.aladhan.com/v1/timings/${dateString}?latitude=${this.config.JUBAIL_LAT}&longitude=${this.config.JUBAIL_LNG}&method=${this.config.API_METHOD}`,
                // With CORS proxy
                `https://corsproxy.io/?${encodeURIComponent(`https://api.aladhan.com/v1/timings/${dateString}?latitude=${this.config.JUBAIL_LAT}&longitude=${this.config.JUBAIL_LNG}&method=${this.config.API_METHOD}`)}`,
                // Alternative CORS proxy
                `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.aladhan.com/v1/timings/${dateString}?latitude=${this.config.JUBAIL_LAT}&longitude=${this.config.JUBAIL_LNG}&method=${this.config.API_METHOD}`)}`
            ];
            
            for (const endpoint of apiEndpoints) {
                try {
                    console.log(`Trying endpoint: ${endpoint}`);
                    const response = await fetch(endpoint, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        },
                        mode: 'cors'
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    
                    if (data.code === 200) {
                        console.log('✅ API call successful');
                        return data.data;
                    } else {
                        throw new Error(`API error: ${data.data}`);
                    }
                    
                } catch (error) {
                    console.warn(`Endpoint failed:`, error);
                    // Continue to next endpoint
                }
            }
            
            throw new Error('All API endpoints failed');
        },
        
        formatTimeForDisplay: function(time24h) {
            // Convert 24h format (e.g., "04:15") to 12h format (e.g., "4:15 AM")
            const [hours, minutes] = time24h.split(':');
            const hour = parseInt(hours);
            const minute = parseInt(minutes);
            
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            
            return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
        },
        
        useFallbackData: function() {
            console.log('🔄 Using fallback prayer times');
            this.currentPrayerTimes = {...this.defaultPrayerTimes};
            this.setHijriDate('7 Jumada al-Thani 1445 AH');
            this.renderPrayerTimes();
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
            
            // Update countdown immediately
            this.updateCountdown();
        },
        
        getPrayerTimes: function() {
            // Return current prayer times or fallback
            return Object.keys(this.currentPrayerTimes).length > 0 
                ? this.currentPrayerTimes 
                : this.defaultPrayerTimes;
        },
        
createAnimations: function() {
    console.log('🎨 Creating animations...');
    
    // Fajr animations
    const fajrCard = document.querySelector('.prayer-card[data-prayer="Fajr"]');
    if (fajrCard) {
        console.log('🕋 Creating Fajr animations');
        
        // Create birds container
        if (!fajrCard.querySelector('.birds-container')) {
            const birdsContainer = document.createElement('div');
            birdsContainer.className = 'birds-container';
            for (let i = 0; i < 5; i++) {
                const bird = document.createElement('div');
                bird.className = 'bird';
                birdsContainer.appendChild(bird);
            }
            fajrCard.appendChild(birdsContainer);
        }
        
        // Create stars container
        if (!fajrCard.querySelector('.stars')) {
            const starsContainer = document.createElement('div');
            starsContainer.className = 'stars';
            for (let i = 0; i < 5; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                starsContainer.appendChild(star);
            }
            fajrCard.appendChild(starsContainer);
        }
        
        // Create clouds container for Fajr
        if (!fajrCard.querySelector('.fajr-clouds')) {
            const cloudsContainer = document.createElement('div');
            cloudsContainer.className = 'fajr-clouds';
            for (let i = 0; i < 3; i++) {
                const cloud = document.createElement('div');
                cloud.className = 'fajr-cloud';
                cloudsContainer.appendChild(cloud);
            }
            fajrCard.appendChild(cloudsContainer);
        }
    }

    // Sunrise animations
const sunriseCard = document.querySelector('.prayer-card[data-prayer="Sunrise"]');
if (sunriseCard) {
    console.log('🌅 Creating Sunrise animations');
    
    // Create sun element
    if (!sunriseCard.querySelector('.sunrise-sun')) {
        const sunElement = document.createElement('div');
        sunElement.className = 'sunrise-sun';
        sunriseCard.appendChild(sunElement);
    }
    
    // Create sun rays
    if (!sunriseCard.querySelector('.sunrise-rays')) {
        const sunRays = document.createElement('div');
        sunRays.className = 'sunrise-rays';
        for (let i = 0; i < 4; i++) {
            const ray = document.createElement('div');
            ray.className = 'sunrise-ray';
            sunRays.appendChild(ray);
        }
        sunriseCard.appendChild(sunRays);
    }
    
    // Create clouds
    if (!sunriseCard.querySelector('.sunrise-clouds')) {
        const clouds = document.createElement('div');
        clouds.className = 'sunrise-clouds';
        for (let i = 0; i < 2; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'sunrise-cloud';
            clouds.appendChild(cloud);
        }
        sunriseCard.appendChild(clouds);
    }
}
    
    // Add other prayer animations here as we fix them
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
            
            // Update prayer times at midnight
            this.scheduleMidnightUpdate();
        },
        
        scheduleMidnightUpdate: function() {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);
            const timeToMidnight = midnight - now;
            
            setTimeout(() => {
                this.loadPrayerTimesFromAPI();
                // Set daily update
                setInterval(() => this.loadPrayerTimesFromAPI(), 24 * 60 * 60 * 1000);
            }, timeToMidnight);
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
