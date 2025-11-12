// Jubail coordinates
const JUBAIL_LAT = 27.0040;
const JUBAIL_LNG = 49.6460;

// DOM Elements
const currentDateEl = document.getElementById('currentDate');
const hijriDateEl = document.getElementById('hijriDate');
const currentTimeEl = document.getElementById('currentTime');
const countdownTitleEl = document.getElementById('countdownTitle');
const countdownTimerEl = document.getElementById('countdownTimer');
const prayerGridEl = document.getElementById('prayerGrid');
const errorMessageEl = document.getElementById('errorMessage');

// Prayer times data
let prayerTimes = {};
let activePrayer = '';
let nextPrayer = '';
let apiAttempts = 0;
const MAX_API_ATTEMPTS = 2;

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
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
    currentTimeEl.textContent = timeString;
    
    // Update date once a day
    if (!currentDateEl.textContent.includes(now.toLocaleDateString())) {
        updateDateInfo(now);
    }
}

// Update date information
function updateDateInfo(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    currentDateEl.textContent = date.toLocaleDateString('en-US', options);
}

// Show error message
function showError(message) {
    errorMessageEl.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <div>${message}</div>
            <button class="retry-button" onclick="retryLoadPrayerTimes()">
                <i class="fas fa-redo"></i> Retry
            </button>
        </div>
    `;
    errorMessageEl.style.display = 'block';
}

// Hide error message
function hideError() {
    errorMessageEl.style.display = 'none';
}

// Retry loading prayer times
function retryLoadPrayerTimes() {
    hideError();
    apiAttempts = 0;
    initPrayerTimes();
}

// Fetch prayer times from API with multiple fallback methods
async function fetchPrayerTimes() {
    const today = new Date();
    const dateString = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
    
    // Try different API endpoints and methods
    const apiEndpoints = [
        // Direct API call
        `https://api.aladhan.com/v1/timings/${dateString}?latitude=${JUBAIL_LAT}&longitude=${JUBAIL_LNG}&method=4`,
        // With CORS proxy
        `https://corsproxy.io/?${encodeURIComponent(`https://api.aladhan.com/v1/timings/${dateString}?latitude=${JUBAIL_LAT}&longitude=${JUBAIL_LNG}&method=4`)}`,
        // Alternative CORS proxy
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.aladhan.com/v1/timings/${dateString}?latitude=${JUBAIL_LAT}&longitude=${JUBAIL_LNG}&method=4`)}`
    ];
    
    for (let i = apiAttempts; i < apiEndpoints.length; i++) {
        try {
            console.log(`Trying API endpoint ${i + 1}...`);
            const response = await fetch(apiEndpoints[i], {
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
            console.log('Successfully fetched prayer times');
            return data.data;
        } catch (error) {
            console.warn(`API attempt ${i + 1} failed:`, error);
            if (i === apiEndpoints.length - 1) {
                throw error;
            }
        }
    }
    
    throw new Error('All API attempts failed');
}

// Get accurate prayer times for Jubail based on current date
function getFallbackPrayerTimes() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // Sample prayer times for Jubail (you can adjust these as needed)
    let times;
    
    if (month >= 3 && month <= 5) { // Spring
        times = {
            Fajr: "04:15",
            Sunrise: "05:35",
            Dhuhr: "11:55",
            Asr: "15:25",
            Maghrib: "18:15",
            Isha: "19:45"
        };
    } else if (month >= 6 && month <= 8) { // Summer
        times = {
            Fajr: "03:45",
            Sunrise: "05:05",
            Dhuhr: "11:45",
            Asr: "15:15",
            Maghrib: "18:35",
            Isha: "20:05"
        };
    } else if (month >= 9 && month <= 11) { // Autumn
        times = {
            Fajr: "04:30",
            Sunrise: "05:50",
            Dhuhr: "11:50",
            Asr: "15:10",
            Maghrib: "17:55",
            Isha: "19:25"
        };
    } else { // Winter
        times = {
            Fajr: "04:55",
            Sunrise: "06:15",
            Dhuhr: "11:45",
            Asr: "14:55",
            Maghrib: "17:25",
            Isha: "18:55"
        };
    }
    
    // Calculate Hijri date
    const hijriDay = (day + 10) % 30 || 30;
    const hijriMonths = ["Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qadah", "Dhu al-Hijjah"];
    const hijriMonth = hijriMonths[(month + 5) % 12];
    const hijriYear = 1445; // Approximate Hijri year
    
    return {
        timings: times,
        date: {
            hijri: {
                day: hijriDay,
                month: { en: hijriMonth },
                year: hijriYear.toString()
            }
        }
    };
}

// Create prayer-specific elements for all prayers
function createPrayerSpecificElements() {
    // Fajr elements
    const fajrCard = document.querySelector('.prayer-card[data-prayer="Fajr"]');
    if (fajrCard) {
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

    // Sunrise elements
    const sunriseCard = document.querySelector('.prayer-card[data-prayer="Sunrise"]');
    if (sunriseCard) {
        const sunRays = document.createElement('div');
        sunRays.className = 'sun-rays';
        for (let i = 0; i < 4; i++) {
            const ray = document.createElement('div');
            ray.className = 'ray';
            sunRays.appendChild(ray);
        }
        
        const clouds = document.createElement('div');
        clouds.className = 'clouds';
        for (let i = 0; i < 2; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            clouds.appendChild(cloud);
        }
        
        sunriseCard.appendChild(sunRays);
        sunriseCard.appendChild(clouds);
    }

    // Dhuhr elements
    const dhuhrCard = document.querySelector('.prayer-card[data-prayer="Dhuhr"]');
    if (dhuhrCard) {
        const sunBeams = document.createElement('div');
        sunBeams.className = 'sun-beams';
        for (let i = 0; i < 4; i++) {
            const beam = document.createElement('div');
            beam.className = 'beam';
            sunBeams.appendChild(beam);
        }
        
        const heatWaves = document.createElement('div');
        heatWaves.className = 'heat-waves';
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.className = 'heat-wave';
            heatWaves.appendChild(wave);
        }
        
        dhuhrCard.appendChild(sunBeams);
        dhuhrCard.appendChild(heatWaves);
    }

    // Asr elements
    const asrCard = document.querySelector('.prayer-card[data-prayer="Asr"]');
    if (asrCard) {
        const shadowRays = document.createElement('div');
        shadowRays.className = 'shadow-rays';
        for (let i = 0; i < 3; i++) {
            const ray = document.createElement('div');
            ray.className = 'shadow-ray';
            shadowRays.appendChild(ray);
        }
        
        const goldenParticles = document.createElement('div');
        goldenParticles.className = 'golden-particles';
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            goldenParticles.appendChild(particle);
        }
        
        asrCard.appendChild(shadowRays);
        asrCard.appendChild(goldenParticles);
    }

    // Maghrib elements
    const maghribCard = document.querySelector('.prayer-card[data-prayer="Maghrib"]');
    if (maghribCard) {
        const horizon = document.createElement('div');
        horizon.className = 'horizon';
        
        const waterReflection = document.createElement('div');
        waterReflection.className = 'water-reflection';
        
        const twilightStars = document.createElement('div');
        twilightStars.className = 'twilight-stars';
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('div');
            star.className = 'twilight-star';
            twilightStars.appendChild(star);
        }
        
        const silhouette = document.createElement('div');
        silhouette.className = 'silhouette';
        
        maghribCard.appendChild(horizon);
        maghribCard.appendChild(waterReflection);
        maghribCard.appendChild(twilightStars);
        maghribCard.appendChild(silhouette);
    }

    // Isha elements
    const ishaCard = document.querySelector('.prayer-card[data-prayer="Isha"]');
    if (ishaCard) {
        const moon = document.createElement('div');
        moon.className = 'moon';
        
        const nightStars = document.createElement('div');
        nightStars.className = 'night-stars';
        for (let i = 0; i < 8; i++) {
            const star = document.createElement('div');
            star.className = 'night-star';
            nightStars.appendChild(star);
        }
        
        const shootingStars = document.createElement('div');
        shootingStars.className = 'shooting-stars';
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('div');
            star.className = 'shooting-star';
            shootingStars.appendChild(star);
        }
        
        const constellations = document.createElement('div');
        constellations.className = 'constellations';
        for (let i = 0; i < 4; i++) {
            const star = document.createElement('div');
            star.className = 'constellation';
            constellations.appendChild(star);
        }
        
        ishaCard.appendChild(moon);
        ishaCard.appendChild(nightStars);
        ishaCard.appendChild(shootingStars);
        ishaCard.appendChild(constellations);
    }
}

// Display prayer times in the grid
function displayPrayerTimes() {
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
            <div class="prayer-time">${formatTime(time)}</div>
        `;
        
        prayerGridEl.appendChild(prayerCard);
    });
    
    // Create prayer-specific elements after cards are rendered
    createPrayerSpecificElements();
}

// Format time to 12-hour format (handle both 24h and 12h formats)
function formatTime(timeString) {
    // If time is already in 12-hour format (contains AM/PM), return as is
    if (timeString.includes('AM') || timeString.includes('PM')) {
        return timeString;
    }
    
    // Handle 24-hour format from API
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    
    if (isNaN(hour) || isNaN(minute)) {
        return timeString; // Return original if parsing fails
    }
    
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

// Update countdown to next prayer (FIXED VERSION)
function updateCountdown() {
    const now = new Date();
    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    
    // Reset active prayer classes
    document.querySelectorAll('.prayer-card').forEach(card => {
        card.classList.remove('active', 'next');
    });
    
    // Find current and next prayer
    let nextPrayerName = '';
    let nextPrayerTime = null;
    let activePrayerName = '';
    let foundNext = false;

    // Convert all prayer times to seconds and find current/next
    Object.entries(prayerTimes).forEach(([prayer, time]) => {
        // Convert prayer time to 24-hour format seconds
        const formattedTime = formatTime(time);
        const [timePart, period] = formattedTime.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
        
        // Convert to 24-hour format if needed
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        
        const prayerTime = hours * 3600 + minutes * 60;
        
        // Check if this prayer is currently active
        if (prayerTime <= currentTime) {
            activePrayerName = prayer;
        }
        
        // Find the next prayer that hasn't passed yet
        if (prayerTime > currentTime && !foundNext) {
            nextPrayerName = prayer;
            nextPrayerTime = prayerTime;
            foundNext = true;
        }
    });
    
    // If no next prayer found today, use first prayer of next day
    if (!nextPrayerName) {
        nextPrayerName = 'Fajr';
        // Get Fajr time for tomorrow (add 24 hours)
        const fajrTime = formatTime(prayerTimes.Fajr);
        const [timePart, period] = fajrTime.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
        
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        
        nextPrayerTime = (hours * 3600 + minutes * 60) + (24 * 3600);
    }
    
    // Update UI with active and next prayer
    if (activePrayerName) {
        const activeCard = document.getElementById(`prayer-${activePrayerName}`);
        if (activeCard) {
            activeCard.classList.add('active');
        }
    }
    
    if (nextPrayerName) {
        const nextCard = document.getElementById(`prayer-${nextPrayerName}`);
        if (nextCard) {
            nextCard.classList.add('next');
        }
    }
    
    // Calculate time difference
    let timeDiff;
    if (nextPrayerTime > currentTime) {
        timeDiff = nextPrayerTime - currentTime;
    } else {
        // If next prayer time is less than current, it's for tomorrow
        timeDiff = nextPrayerTime + (24 * 3600) - currentTime;
    }
    
    // Update countdown display
    const hours = Math.floor(timeDiff / 3600);
    const minutes = Math.floor((timeDiff % 3600) / 60);
    const seconds = timeDiff % 60;
    
    if (countdownTitleEl && countdownTimerEl) {
        countdownTitleEl.textContent = `Time until ${nextPrayerName}:`;
        countdownTimerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Update variables
    activePrayer = activePrayerName;
    nextPrayer = nextPrayerName;
}

// Initialize prayer times
async function initPrayerTimes() {
    try {
        apiAttempts++;
        hideError();
        
        let prayerData;
        if (apiAttempts <= MAX_API_ATTEMPTS) {
            prayerData = await fetchPrayerTimes();
        } else {
            throw new Error('Using fallback data after multiple attempts');
        }
        
        // Update Hijri date
        const hijri = prayerData.date.hijri;
        hijriDateEl.textContent = `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;
        
        // Extract prayer times
        prayerTimes = {
            Fajr: prayerData.timings.Fajr,
            Sunrise: prayerData.timings.Sunrise,
            Dhuhr: prayerData.timings.Dhuhr,
            Asr: prayerData.timings.Asr,
            Maghrib: prayerData.timings.Maghrib,
            Isha: prayerData.timings.Isha
        };
        
        // Display prayer times
        displayPrayerTimes();
        
        // Start countdown
        updateCountdown();
        
    } catch (error) {
        console.error('Error loading prayer times:', error);
        
        // Use fallback data
        const fallbackData = getFallbackPrayerTimes();
        prayerTimes = {
            Fajr: fallbackData.timings.Fajr,
            Sunrise: fallbackData.timings.Sunrise,
            Dhuhr: fallbackData.timings.Dhuhr,
            Asr: fallbackData.timings.Asr,
            Maghrib: fallbackData.timings.Maghrib,
            Isha: fallbackData.timings.Isha
        };
        
        hijriDateEl.textContent = `${fallbackData.date.hijri.day} ${fallbackData.date.hijri.month.en} ${fallbackData.date.hijri.year} AH`;
        
        displayPrayerTimes();
        updateCountdown();
        
        showError(`Using approximate prayer times. ${error.message}`);
    }
}

// Initialize the app
function initApp() {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // Show fallback data immediately while API loads
    const fallbackData = getFallbackPrayerTimes();
    prayerTimes = fallbackData.timings;
    hijriDateEl.textContent = `${fallbackData.date.hijri.day} ${fallbackData.date.hijri.month.en} ${fallbackData.date.hijri.year} AH`;
    displayPrayerTimes();
    updateCountdown();
    
    // Then try to load from API
    setTimeout(() => {
        initPrayerTimes();
    }, 1000);
    
    setInterval(updateCountdown, 1000);
    
    // Update prayer times at midnight
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const timeToMidnight = midnight - now;
    
    setTimeout(() => {
        initPrayerTimes();
        // Set daily update
        setInterval(initPrayerTimes, 24 * 60 * 60 * 1000);
    }, timeToMidnight);
}

// Start the app
window.onload = initApp;
