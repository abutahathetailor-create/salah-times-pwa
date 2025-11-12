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
    currentTimeEl.textContent = timeString;
    
    if (!currentDateEl.textContent.includes(now.toLocaleDateString())) {
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
    currentDateEl.textContent = date.toLocaleDateString('en-US', options);
}

// Simple time format conversion
function formatTime(timeString) {
    // If already formatted, return as is
    if (timeString.includes('AM') || timeString.includes('PM')) {
        return timeString;
    }
    
    // Handle 24-hour format (e.g., "04:15")
    const [hours, minutes] = timeString.split(':');
    let hour = parseInt(hours);
    const minute = minutes;
    
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    
    return `${hour}:${minute} ${ampm}`;
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

    // Add other prayer animations here...
}

// Display prayer times
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
    
    createPrayerSpecificElements();
}

// SIMPLE COUNTDOWN FIX
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
    
    // Convert prayer times to minutes since midnight
    const prayerTimesInMinutes = {};
    
    Object.entries(prayerTimes).forEach(([prayer, time]) => {
        const formattedTime = formatTime(time);
        const [timePart, period] = formattedTime.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
        
        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        const prayerTotalSeconds = hours * 3600 + minutes * 60;
        prayerTimesInMinutes[prayer] = prayerTotalSeconds;
        
        // Check if this prayer is active (current time is after prayer time)
        if (prayerTotalSeconds <= currentTotalSeconds) {
            activePrayerName = prayer;
        }
    });
    
    // Find next prayer
    Object.entries(prayerTimesInMinutes).forEach(([prayer, prayerSeconds]) => {
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
        nextPrayerTime = prayerTimesInMinutes.Fajr + (24 * 3600); // Add 24 hours
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
    if (timeDiff < 0) timeDiff += 24 * 3600; // Handle wrap-around to next day
    
    const hours = Math.floor(timeDiff / 3600);
    const minutes = Math.floor((timeDiff % 3600) / 60);
    const seconds = timeDiff % 60;
    
    // Update display
    countdownTitleEl.textContent = `Time until ${nextPrayerName}:`;
    countdownTimerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    console.log(`Current: ${currentTotalSeconds}s, Next ${nextPrayerName}: ${nextPrayerTime}s, Diff: ${timeDiff}s`);
}

// Get fallback prayer times
function getFallbackPrayerTimes() {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Simple fallback times based on current time
    return {
        Fajr: "04:15 AM",
        Sunrise: "05:35 AM", 
        Dhuhr: "11:55 AM",
        Asr: "03:25 PM",
        Maghrib: "06:15 PM",
        Isha: "07:45 PM"
    };
}

// Initialize app
function initApp() {
    console.log('Initializing app...');
    
    // Set initial date
    updateDateInfo(new Date());
    
    // Use fallback times immediately
    prayerTimes = getFallbackPrayerTimes();
    hijriDateEl.textContent = '7 Jumada al-Thani 1445 AH';
    
    // Display prayer times
    displayPrayerTimes();
    
    // Start timers
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    console.log('App initialized with prayer times:', prayerTimes);
}

// Start when page loads
window.addEventListener('load', initApp);
