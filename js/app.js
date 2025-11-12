// MAIN APP LOADER
(function() {
    'use strict';
    
    console.log('🚀 Loading Salah Times App...');
    
    // Load all modules
    Promise.all([
        loadScript('js/prayer-times.js'),
        loadScript('js/countdown.js'),
        loadScript('js/animations.js'),
        loadScript('js/ui.js')
    ]).then(() => {
        console.log('✅ All modules loaded successfully!');
        initializeApp();
    }).catch(error => {
        console.error('❌ Error loading modules:', error);
    });
    
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    function initializeApp() {
        if (window.SalahTimes && window.SalahTimes.init) {
            window.SalahTimes.init();
        } else {
            console.error('SalahTimes module not found');
        }
    }
})();
