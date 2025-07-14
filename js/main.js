// Main initialization and game startup
document.addEventListener('DOMContentLoaded', function() {
    // Wait for all scripts to load
    let scriptsLoaded = 0;
    const totalScripts = 6; // Number of JS files we need to load
    
    function checkAllScriptsLoaded() {
        scriptsLoaded++;
        if (scriptsLoaded >= totalScripts) {
            initializeGame();
        }
    }
    
    // Initialize the game once everything is loaded
    function initializeGame() {
        try {
            // Create game instance
            window.game = new Game();
            
            // Create UI system
            window.ui = new UI(window.game);
            
            // Show initial loading screen briefly
            showLoadingScreen();
            
            // Start the game after a short delay
            setTimeout(() => {
                hideLoadingScreen();
                showWelcomeMessage();
            }, 1000);
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            showErrorMessage('Failed to initialize game. Please refresh the page.');
        }
    }
    
    function showLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loadingScreen';
        loadingScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            font-family: Arial, sans-serif;
            z-index: 2000;
        `;
        
        loadingScreen.innerHTML = `
            <div style="text-align: center;">
                <h1 style="font-size: 48px; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
                    WEAPON MASTER
                </h1>
                <p style="font-size: 18px; margin-bottom: 30px;">Web Edition</p>
                <div class="loading-spinner" style="
                    width: 50px;
                    height: 50px;
                    border: 5px solid rgba(255,255,255,0.3);
                    border-top: 5px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                "></div>
                <p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">Loading game assets...</p>
            </div>
        `;
        
        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(loadingScreen);
    }
    
    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
            }, 500);
        }
        
        // Add fade out animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    function showWelcomeMessage() {
        const welcome = document.createElement('div');
        welcome.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            text-align: center;
            z-index: 1000;
            border: 2px solid #3498DB;
            animation: slideDown 0.5s ease-out;
        `;
        
        welcome.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #3498DB;">Welcome to Weapon Master!</h3>
            <p style="margin: 0; font-size: 14px;">
                Move with WASD, aim with mouse, shoot to survive!<br>
                Press <strong>C</strong> for weapon crafting, <strong>ESC</strong> to pause
            </p>
        `;
        
        // Add slide down animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(welcome);
        
        // Remove welcome message after 5 seconds
        setTimeout(() => {
            welcome.style.animation = 'slideUp 0.5s ease-in';
            setTimeout(() => {
                if (welcome.parentNode) {
                    welcome.parentNode.removeChild(welcome);
                }
            }, 500);
        }, 5000);
        
        // Add slide up animation
        const style2 = document.createElement('style');
        style2.textContent = `
            @keyframes slideUp {
                from { transform: translateX(-50%) translateY(0); opacity: 1; }
                to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style2);
    }
    
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #E74C3C;
            color: white;
            padding: 30px;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            text-align: center;
            z-index: 3000;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        `;
        
        errorDiv.innerHTML = `
            <h2 style="margin: 0 0 15px 0;">Error</h2>
            <p style="margin: 0 0 20px 0;">${message}</p>
            <button onclick="location.reload()" style="
                background: white;
                color: #E74C3C;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            ">Reload Page</button>
        `;
        
        document.body.appendChild(errorDiv);
    }
    
    // Check if we can access canvas
    function checkWebGLSupport() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
    }
    
    function checkCanvasSupport() {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext && canvas.getContext('2d'));
    }
    
    // Verify browser compatibility
    if (!checkCanvasSupport()) {
        showErrorMessage('Your browser does not support HTML5 Canvas. Please use a modern browser.');
        return;
    }
    
    // Check for required features
    if (typeof requestAnimationFrame === 'undefined') {
        showErrorMessage('Your browser does not support requestAnimationFrame. Please update your browser.');
        return;
    }
    
    // Add performance monitoring
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let fps = 60;
    
    function updatePerformanceStats() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastFrameTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastFrameTime = currentTime;
            
            // Update FPS display if performance is poor
            if (fps < 30 && window.game) {
                console.warn('Low FPS detected:', fps);
                // Could implement performance adjustments here
            }
        }
        
        requestAnimationFrame(updatePerformanceStats);
    }
    
    // Start performance monitoring
    updatePerformanceStats();
    
    // Handle page visibility change (pause when tab is not active)
    document.addEventListener('visibilitychange', function() {
        if (window.game) {
            if (document.hidden) {
                // Page is hidden, pause the game
                if (window.game.state === 'playing') {
                    window.game.state = 'paused';
                    window.ui.showNotification('Game paused (tab inactive)', '#F39C12');
                }
            } else {
                // Page is visible again
                if (window.game.state === 'paused') {
                    // Don't automatically resume, let player choose
                    window.ui.showNotification('Press ESC to resume', '#3498DB');
                }
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.game) {
            // Could implement responsive canvas resizing here
            console.log('Window resized');
        }
    });
    
    // Prevent context menu on game canvas
    document.addEventListener('contextmenu', function(e) {
        if (e.target.id === 'gameCanvas') {
            e.preventDefault();
        }
    });
    
    // Handle full screen requests
    function toggleFullscreen() {
        const gameContainer = document.getElementById('gameContainer');
        
        if (!document.fullscreenElement) {
            gameContainer.requestFullscreen().then(() => {
                window.ui.showNotification('Fullscreen mode activated', '#27AE60');
            }).catch(err => {
                window.ui.showNotification('Fullscreen not supported', '#E74C3C');
            });
        } else {
            document.exitFullscreen().then(() => {
                window.ui.showNotification('Exited fullscreen', '#3498DB');
            });
        }
    }
    
    // Add fullscreen toggle on F key
    document.addEventListener('keydown', function(e) {
        if (e.code === 'KeyF') {
            toggleFullscreen();
        }
    });
    
    // Add touch controls for mobile (basic implementation)
    function setupTouchControls() {
        const canvas = document.getElementById('gameCanvas');
        let touchStart = null;
        
        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            touchStart = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
            
            if (window.game && window.game.player) {
                window.game.player.startShooting();
            }
        });
        
        canvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
            if (window.game && window.game.player && touchStart) {
                const rect = canvas.getBoundingClientRect();
                window.game.mouse.x = e.touches[0].clientX - rect.left;
                window.game.mouse.y = e.touches[0].clientY - rect.top;
            }
        });
        
        canvas.addEventListener('touchend', function(e) {
            e.preventDefault();
            if (window.game && window.game.player) {
                window.game.player.stopShooting();
            }
            touchStart = null;
        });
    }
    
    // Setup mobile controls if touch is supported
    if ('ontouchstart' in window) {
        setupTouchControls();
        // Show mobile instructions
        setTimeout(() => {
            if (window.ui) {
                window.ui.showNotification('Touch controls enabled!', '#9B59B6');
            }
        }, 2000);
    }
    
    // Initialize the game immediately since scripts are loaded inline
    initializeGame();
    
    // Export useful functions for debugging
    window.gameDebug = {
        getGameState: () => window.game ? window.game.state : 'Not initialized',
        getFPS: () => fps,
        getParticleCount: () => window.game ? window.game.particles.length : 0,
        getEnemyCount: () => window.game ? window.game.enemies.length : 0,
        toggleGodMode: () => {
            if (window.game && window.game.player) {
                window.game.player.health = window.game.player.maxHealth;
                window.ui.showNotification('God mode activated!', '#9B59B6');
            }
        },
        addScore: (amount) => {
            if (window.game) {
                window.game.score += amount;
                window.ui.showNotification(`Added ${amount} points!`, '#27AE60');
            }
        }
    };
    
    console.log('Weapon Master Web Edition loaded successfully!');
    console.log('Debug commands available in window.gameDebug');
});