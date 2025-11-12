// Simple app.js that will work
console.log('Salah Times App Loaded');

// Update current time continuously
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
    });
    
    const currentTimeEl = document.getElementById('currentTime');
    if (currentTimeEl) {
        currentTimeEl.textContent = timeString;
    }
}

// Start time updates
setInterval(updateTime, 1000);
updateTime();

console.log('App initialized successfully');


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
