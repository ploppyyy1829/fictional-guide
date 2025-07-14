class Player {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 40;
        this.game = game;
        
        // Player stats
        this.health = 100;
        this.maxHealth = 100;
        this.speed = 5;
        
        // Weapon system
        this.weapon = new Weapon('basic', this);
        this.currentAmmo = this.weapon.maxAmmo;
        this.reloadTime = 0;
        this.isReloading = false;
        
        // Shooting
        this.isShooting = false;
        this.shootCooldown = 0;
        
        // Movement
        this.velocity = { x: 0, y: 0 };
        
        // Auto-run simulation (like mobile game)
        this.autoRunSpeed = 1;
    }
    
    update() {
        this.handleInput();
        this.updatePosition();
        this.updateShooting();
        this.updateReload();
        
        // Auto-run forward (simulating the endless runner aspect)
        this.y -= this.autoRunSpeed;
        
        // Keep player in bounds
        this.x = Math.max(this.width / 2, Math.min(this.game.width - this.width / 2, this.x));
        this.y = Math.max(this.height / 2, Math.min(this.game.height - this.height / 2, this.y));
    }
    
    handleInput() {
        this.velocity.x = 0;
        this.velocity.y = 0;
        
        // WASD movement
        if (this.game.keys['KeyA'] || this.game.keys['ArrowLeft']) {
            this.velocity.x = -this.speed;
        }
        if (this.game.keys['KeyD'] || this.game.keys['ArrowRight']) {
            this.velocity.x = this.speed;
        }
        if (this.game.keys['KeyW'] || this.game.keys['ArrowUp']) {
            this.velocity.y = -this.speed;
        }
        if (this.game.keys['KeyS'] || this.game.keys['ArrowDown']) {
            this.velocity.y = this.speed;
        }
    }
    
    updatePosition() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
    
    updateShooting() {
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
        
        if (this.isShooting && this.shootCooldown <= 0 && this.currentAmmo > 0 && !this.isReloading) {
            this.shoot();
            this.shootCooldown = this.weapon.fireRate;
            this.currentAmmo--;
            
            if (this.currentAmmo <= 0) {
                this.startReload();
            }
        }
    }
    
    updateReload() {
        if (this.isReloading) {
            this.reloadTime--;
            if (this.reloadTime <= 0) {
                this.currentAmmo = this.weapon.maxAmmo;
                this.isReloading = false;
            }
        }
    }
    
    shoot() {
        // Calculate angle to mouse
        const angle = Math.atan2(
            this.game.mouse.y - this.y,
            this.game.mouse.x - this.x
        );
        
        // Create bullet
        const bulletSpeed = 8;
        const bulletX = this.x + Math.cos(angle) * (this.width / 2);
        const bulletY = this.y + Math.sin(angle) * (this.height / 2);
        const velocityX = Math.cos(angle) * bulletSpeed;
        const velocityY = Math.sin(angle) * bulletSpeed;
        
        const bullet = new Bullet(
            bulletX, 
            bulletY, 
            velocityX, 
            velocityY, 
            this.weapon.damage,
            'player'
        );
        
        this.game.addBullet(bullet);
        
        // Create muzzle flash particle
        this.game.addParticle(new Particle(bulletX, bulletY, angle, 2, 'muzzle'));
    }
    
    startShooting() {
        this.isShooting = true;
    }
    
    stopShooting() {
        this.isShooting = false;
    }
    
    reload() {
        if (!this.isReloading && this.currentAmmo < this.weapon.maxAmmo) {
            this.startReload();
        }
    }
    
    startReload() {
        this.isReloading = true;
        this.reloadTime = this.weapon.reloadTime;
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.game.state = 'gameOver';
        }
        
        // Create damage particles
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            this.game.addParticle(new Particle(this.x, this.y, angle, speed, 'damage'));
        }
    }
    
    upgradeWeapon(weaponType) {
        this.weapon = new Weapon(weaponType, this);
        this.currentAmmo = this.weapon.maxAmmo;
    }
    
    draw(ctx) {
        // Draw player as a simple triangle (spaceship-like)
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Calculate rotation to face mouse
        const angle = Math.atan2(
            this.game.mouse.y - this.y,
            this.game.mouse.x - this.x
        );
        ctx.rotate(angle + Math.PI / 2);
        
        // Player body
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(-this.width / 2, this.height / 2);
        ctx.lineTo(this.width / 2, this.height / 2);
        ctx.closePath();
        ctx.fill();
        
        // Player outline
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Weapon indicator
        ctx.fillStyle = '#FF5722';
        ctx.fillRect(-2, -this.height / 2 - 5, 4, 8);
        
        ctx.restore();
        
        // Draw health bar
        this.drawHealthBar(ctx);
        
        // Draw reload indicator
        if (this.isReloading) {
            this.drawReloadBar(ctx);
        }
    }
    
    drawHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 4;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.height / 2 - 15;
        
        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FF9800' : '#F44336';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
    
    drawReloadBar(ctx) {
        const barWidth = this.width;
        const barHeight = 3;
        const barX = this.x - barWidth / 2;
        const barY = this.y + this.height / 2 + 10;
        
        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Reload progress
        const reloadPercent = 1 - (this.reloadTime / this.weapon.reloadTime);
        ctx.fillStyle = '#2196F3';
        ctx.fillRect(barX, barY, barWidth * reloadPercent, barHeight);
        
        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}