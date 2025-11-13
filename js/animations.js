// PRAYER-SPECIFIC ANIMATIONS
window.Animations = (function() {
    'use strict';
    
// In animations.js - update createFajrAnimations function
function createFajrAnimations() {
    const fajrCard = document.querySelector('.prayer-card[data-prayer="Fajr"]');
    if (!fajrCard || fajrCard.querySelector('.birds-container')) return;
    
    // Create birds container
    const birdsContainer = document.createElement('div');
    birdsContainer.className = 'birds-container';
    for (let i = 0; i < 5; i++) {
        const bird = document.createElement('div');
        bird.className = 'bird';
        birdsContainer.appendChild(bird);
    }
    
    // Create stars container
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        starsContainer.appendChild(star);
    }
    
    // Create clouds container for Fajr
    const cloudsContainer = document.createElement('div');
    cloudsContainer.className = 'fajr-clouds';
    for (let i = 0; i < 3; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'fajr-cloud';
        cloudsContainer.appendChild(cloud);
    }
    
    fajrCard.appendChild(birdsContainer);
    fajrCard.appendChild(starsContainer);
    fajrCard.appendChild(cloudsContainer);
}
    
    function createSunriseAnimations() {
        const sunriseCard = document.querySelector('.prayer-card[data-prayer="Sunrise"]');
        if (!sunriseCard || sunriseCard.querySelector('.sun-rays')) return;
        
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
    
    // Add other animation functions here...
    
    function createAllAnimations() {
        createFajrAnimations();
        createSunriseAnimations();
        // Add other animation calls here...
    }
    
    // Public API
    return {
        createAllAnimations,
        createFajrAnimations,
        createSunriseAnimations
    };
})();
