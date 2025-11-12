// Prayer-specific functionality
function createPrayerSpecificElements() {
    // Add Fajr-specific elements (birds and stars)
    const fajrCard = document.querySelector('.prayer-card[data-prayer="Fajr"]');
    if (fajrCard) {
        // Create birds container
        const birdsContainer = document.createElement('div');
        birdsContainer.className = 'birds-container';
        
        // Create 5 birds
        for (let i = 0; i < 5; i++) {
            const bird = document.createElement('div');
            bird.className = 'bird';
            birdsContainer.appendChild(bird);
        }
        
        // Create stars container
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars';
        
        // Create 5 stars
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            starsContainer.appendChild(star);
        }
        
        fajrCard.appendChild(birdsContainer);
        fajrCard.appendChild(starsContainer);
    }
}

// Update displayPrayerTimes to include data attributes
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
        prayerCard.setAttribute('data-prayer', prayer); // Add data attribute
        
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
