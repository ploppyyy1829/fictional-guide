class UI {
    constructor(game) {
        this.game = game;
        this.showCraftingMenu = false;
        this.showGameOverScreen = false;
        this.showPauseMenu = false;
        
        // UI elements
        this.scoreElement = document.getElementById('score');
        this.healthElement = document.getElementById('health');
        this.ammoElement = document.getElementById('ammo');
        this.weaponTypeElement = document.getElementById('weaponType');
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // ESC key for pause menu
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                this.togglePauseMenu();
            }
            if (e.code === 'KeyC') {
                this.toggleCraftingMenu();
            }
        });
    }
    
    update() {
        // Update basic UI elements
        this.scoreElement.textContent = this.game.score;
        this.healthElement.textContent = this.game.player.health;
        this.ammoElement.textContent = this.game.player.currentAmmo;
        this.weaponTypeElement.textContent = this.game.player.weapon.type;
        
        // Update weapon type color based on rarity/type
        this.updateWeaponDisplay();
        
        // Check for game over
        if (this.game.state === 'gameOver' && !this.showGameOverScreen) {
            this.showGameOver();
        }
    }
    
    updateWeaponDisplay() {
        const weaponColors = {
            'basic': '#999999',
            'pistol': '#C0C0C0',
            'rifle': '#8B4513',
            'shotgun': '#FF4500',
            'smg': '#32CD32',
            'sniper': '#4B0082',
            'minigun': '#FF1493'
        };
        
        const color = weaponColors[this.game.player.weapon.type] || '#FFFFFF';
        this.weaponTypeElement.style.color = color;
        this.weaponTypeElement.style.textShadow = `0 0 10px ${color}`;
    }
    
    togglePauseMenu() {
        if (this.game.state === 'playing') {
            this.game.state = 'paused';
            this.showPauseMenu = true;
            this.displayPauseMenu();
        } else if (this.game.state === 'paused') {
            this.game.state = 'playing';
            this.showPauseMenu = false;
            this.hidePauseMenu();
        }
    }
    
    toggleCraftingMenu() {
        this.showCraftingMenu = !this.showCraftingMenu;
        if (this.showCraftingMenu) {
            this.displayCraftingMenu();
        } else {
            this.hideCraftingMenu();
        }
    }
    
    displayPauseMenu() {
        const pauseMenu = this.createPauseMenu();
        document.body.appendChild(pauseMenu);
    }
    
    hidePauseMenu() {
        const pauseMenu = document.getElementById('pauseMenu');
        if (pauseMenu) {
            pauseMenu.remove();
        }
    }
    
    createPauseMenu() {
        const menu = document.createElement('div');
        menu.id = 'pauseMenu';
        menu.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            font-family: Arial, sans-serif;
            z-index: 1000;
        `;
        
        menu.innerHTML = `
            <h1 style="font-size: 48px; margin-bottom: 30px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">PAUSED</h1>
            <div style="text-align: center; font-size: 18px; line-height: 2;">
                <p><strong>Controls:</strong></p>
                <p>WASD / Arrow Keys - Move</p>
                <p>Mouse - Aim & Shoot</p>
                <p>R - Reload</p>
                <p>C - Crafting Menu</p>
                <p>ESC - Pause/Resume</p>
            </div>
            <button id="resumeButton" style="
                margin-top: 30px;
                padding: 15px 30px;
                font-size: 20px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            ">Resume Game</button>
        `;
        
        menu.querySelector('#resumeButton').addEventListener('click', () => {
            this.togglePauseMenu();
        });
        
        return menu;
    }
    
    displayCraftingMenu() {
        const craftingMenu = this.createCraftingMenu();
        document.body.appendChild(craftingMenu);
    }
    
    hideCraftingMenu() {
        const craftingMenu = document.getElementById('craftingMenu');
        if (craftingMenu) {
            craftingMenu.remove();
        }
    }
    
    createCraftingMenu() {
        const menu = document.createElement('div');
        menu.id = 'craftingMenu';
        menu.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            max-height: 500px;
            background: linear-gradient(135deg, #2C3E50, #34495E);
            border: 3px solid #3498DB;
            border-radius: 15px;
            padding: 20px;
            color: white;
            font-family: Arial, sans-serif;
            z-index: 1000;
            box-shadow: 0 0 30px rgba(0,0,0,0.8);
            overflow-y: auto;
        `;
        
        let craftingHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #3498DB;">Weapon Crafting</h2>
                <button id="closeCrafting" style="
                    background: #E74C3C;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                    font-size: 16px;
                ">×</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #F39C12;">Current Weapon</h3>
                <div style="
                    background: rgba(0,0,0,0.3);
                    padding: 10px;
                    border-radius: 8px;
                    border: 2px solid #95A5A6;
                ">
                    <strong>${this.game.player.weapon.type.toUpperCase()}</strong><br>
                    Damage: ${this.game.player.weapon.damage}<br>
                    Ammo: ${this.game.player.weapon.maxAmmo}<br>
                    Level: ${this.game.player.weapon.level}
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #F39C12;">Available Upgrades</h3>
                <div id="upgradeButtons">
        `;
        
        // Add weapon upgrade buttons
        const weaponTypes = ['pistol', 'rifle', 'shotgun', 'smg', 'sniper'];
        weaponTypes.forEach(type => {
            if (type !== this.game.player.weapon.type) {
                craftingHTML += `
                    <button class="upgradeButton" data-weapon="${type}" style="
                        display: block;
                        width: 100%;
                        margin: 5px 0;
                        padding: 10px;
                        background: #27AE60;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background 0.3s;
                    " onmouseover="this.style.background='#2ECC71'" onmouseout="this.style.background='#27AE60'">
                        Upgrade to ${type.toUpperCase()} (Cost: ${this.getUpgradeCost(type)} points)
                    </button>
                `;
            }
        });
        
        craftingHTML += `
                </div>
            </div>
            
            <div>
                <h3 style="color: #F39C12;">Weapon Info</h3>
                <div style="font-size: 12px; color: #BDC3C7; line-height: 1.4;">
                    <p><strong>Pistol:</strong> Balanced weapon with good accuracy</p>
                    <p><strong>Rifle:</strong> High damage, long range</p>
                    <p><strong>Shotgun:</strong> Spread shot, close combat</p>
                    <p><strong>SMG:</strong> High fire rate, medium damage</p>
                    <p><strong>Sniper:</strong> Extreme damage, slow fire rate</p>
                </div>
            </div>
        `;
        
        menu.innerHTML = craftingHTML;
        
        // Add event listeners
        menu.querySelector('#closeCrafting').addEventListener('click', () => {
            this.toggleCraftingMenu();
        });
        
        menu.querySelectorAll('.upgradeButton').forEach(button => {
            button.addEventListener('click', (e) => {
                const weaponType = e.target.getAttribute('data-weapon');
                const cost = this.getUpgradeCost(weaponType);
                
                if (this.game.score >= cost) {
                    this.game.score -= cost;
                    this.game.player.upgradeWeapon(weaponType);
                    this.toggleCraftingMenu(); // Close and reopen to refresh
                    this.toggleCraftingMenu();
                } else {
                    this.showNotification('Not enough points!', '#E74C3C');
                }
            });
        });
        
        return menu;
    }
    
    getUpgradeCost(weaponType) {
        const costs = {
            'pistol': 500,
            'rifle': 1000,
            'shotgun': 750,
            'smg': 800,
            'sniper': 1500,
            'minigun': 2000
        };
        return costs[weaponType] || 500;
    }
    
    showGameOver() {
        this.showGameOverScreen = true;
        const gameOverMenu = this.createGameOverMenu();
        document.body.appendChild(gameOverMenu);
    }
    
    createGameOverMenu() {
        const menu = document.createElement('div');
        menu.id = 'gameOverMenu';
        menu.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            font-family: Arial, sans-serif;
            z-index: 1000;
        `;
        
        menu.innerHTML = `
            <h1 style="font-size: 60px; margin-bottom: 20px; color: #E74C3C; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">GAME OVER</h1>
            <div style="text-align: center; font-size: 24px; margin-bottom: 30px;">
                <p>Final Score: <span style="color: #F39C12; font-weight: bold;">${this.game.score}</span></p>
                <p>Weapon: <span style="color: #3498DB;">${this.game.player.weapon.type.toUpperCase()}</span></p>
            </div>
            <button id="restartButton" style="
                padding: 15px 30px;
                font-size: 20px;
                background: #27AE60;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                margin: 10px;
            ">Play Again</button>
        `;
        
        menu.querySelector('#restartButton').addEventListener('click', () => {
            this.restartGame();
        });
        
        return menu;
    }
    
    restartGame() {
        // Remove game over menu
        const gameOverMenu = document.getElementById('gameOverMenu');
        if (gameOverMenu) {
            gameOverMenu.remove();
        }
        
        // Reset game state
        this.showGameOverScreen = false;
        
        // Reinitialize the game
        this.game.score = 0;
        this.game.level = 1;
        this.game.state = 'playing';
        
        // Reset player
        this.game.player.health = this.game.player.maxHealth;
        this.game.player.weapon = new Weapon('basic', this.game.player);
        this.game.player.currentAmmo = this.game.player.weapon.maxAmmo;
        this.game.player.x = this.game.width / 2;
        this.game.player.y = this.game.height - 100;
        
        // Clear all game objects
        this.game.enemies = [];
        this.game.bullets = [];
        this.game.obstacles = [];
        this.game.particles = [];
        
        // Spawn initial enemies
        this.game.spawnEnemies();
    }
    
    showNotification(message, color = '#3498DB') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            z-index: 1001;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Add animation keyframes if not already added
        if (!document.getElementById('notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    drawHealthBar(ctx) {
        // Draw a more detailed health bar on canvas
        const barWidth = 200;
        const barHeight = 20;
        const barX = 20;
        const barY = 50;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(barX - 5, barY - 5, barWidth + 10, barHeight + 10);
        
        // Health bar background
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health bar fill
        const healthPercent = this.game.player.health / this.game.player.maxHealth;
        const fillColor = healthPercent > 0.6 ? '#27AE60' : 
                         healthPercent > 0.3 ? '#F39C12' : '#E74C3C';
        
        ctx.fillStyle = fillColor;
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Health bar border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Health text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            `${this.game.player.health}/${this.game.player.maxHealth}`, 
            barX + barWidth / 2, 
            barY + barHeight / 2 + 5
        );
    }
    
    drawAmmoCounter(ctx) {
        // Draw ammo counter on canvas
        const x = this.game.width - 150;
        const y = 50;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x - 10, y - 25, 140, 40);
        
        // Ammo text
        ctx.fillStyle = this.game.player.currentAmmo > 5 ? '#FFFFFF' : '#E74C3C';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'right';
        
        const ammoText = this.game.player.isReloading ? 
            'RELOADING...' : 
            `${this.game.player.currentAmmo}/${this.game.player.weapon.maxAmmo}`;
            
        ctx.fillText(ammoText, x + 120, y);
        
        // Weapon name
        ctx.fillStyle = '#CCCCCC';
        ctx.font = '12px Arial';
        ctx.fillText(this.game.player.weapon.type.toUpperCase(), x + 120, y + 15);
    }
}