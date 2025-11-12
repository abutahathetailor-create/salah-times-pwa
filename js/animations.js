// PRAYER-SPECIFIC ANIMATIONS
window.Animations = (function() {
    'use strict';
    
    function createFajrAnimations() {
        const fajrCard = document.querySelector('.prayer-card[data-prayer="Fajr"]');
        if (!fajrCard || fajrCard.querySelector('.birds-container')) return;
        
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
