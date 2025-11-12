// COUNTDOWN TIMER LOGIC
window.Countdown = (function() {
    'use strict';
    
    let countdownInterval;
    
    function getCurrentTimeInSeconds() {
        const now = new Date();
        return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    }
    
    function findCurrentAndNextPrayer() {
        const currentTime = getCurrentTimeInSeconds();
        const prayerTimes = window.PrayerTimes.getAllPrayerTimesInSeconds();
        
        let nextPrayerName = '';
        let nextPrayerTime = null;
        let activePrayerName = '';
        
        // Find active prayer (last prayer that passed)
        Object.entries(prayerTimes).forEach(([prayer, prayerTime]) => {
            if (prayerTime <= currentTime) {
                activePrayerName = prayer;
            }
        });
        
        // Find next prayer
        Object.entries(prayerTimes).forEach(([prayer, prayerTime]) => {
            if (prayerTime > currentTime) {
                if (!nextPrayerTime || prayerTime < nextPrayerTime) {
                    nextPrayerName = prayer;
                    nextPrayerTime = prayerTime;
                }
            }
        });
        
        // If no next prayer today, use Fajr tomorrow
        if (!nextPrayerName) {
            nextPrayerName = 'Fajr';
            nextPrayerTime = prayerTimes.Fajr + (24 * 3600);
        }
        
        return { activePrayerName, nextPrayerName, nextPrayerTime };
    }
    
    function updateCountdown() {
        const currentTime = getCurrentTimeInSeconds();
        const { activePrayerName, nextPrayerName, nextPrayerTime } = findCurrentAndNextPrayer();
        
        // Update UI
        updatePrayerCards(activePrayerName, nextPrayerName);
        
        // Calculate time difference
        let timeDiff = nextPrayerTime - currentTime;
        if (timeDiff < 0) timeDiff += 24 * 3600;
        
        const hours = Math.floor(timeDiff / 3600);
        const minutes = Math.floor((timeDiff % 3600) / 60);
        const seconds = timeDiff % 60;
        
        // Update countdown display
        const countdownTitleEl = document.getElementById('countdownTitle');
        const countdownTimerEl = document.getElementById('countdownTimer');
        
        if (countdownTitleEl) {
            countdownTitleEl.textContent = `Time until ${nextPrayerName}:`;
        }
        if (countdownTimerEl) {
            countdownTimerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        return { activePrayerName, nextPrayerName, timeDiff };
    }
    
    function updatePrayerCards(activePrayer, nextPrayer) {
        // Reset all cards
        document.querySelectorAll('.prayer-card').forEach(card => {
            card.classList.remove('active', 'next');
        });
        
        // Set active prayer
        if (activePrayer) {
            const activeCard = document.getElementById(`prayer-${activePrayer}`);
            if (activeCard) activeCard.classList.add('active');
        }
        
        // Set next prayer
        if (nextPrayer) {
            const nextCard = document.getElementById(`prayer-${nextPrayer}`);
            if (nextCard) nextCard.classList.add('next');
        }
    }
    
    function startCountdown() {
        updateCountdown(); // Initial update
        countdownInterval = setInterval(updateCountdown, 1000);
    }
    
    function stopCountdown() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    }
    
    // Public API
    return {
        startCountdown,
        stopCountdown,
        updateCountdown
    };
})();
