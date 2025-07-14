class Enemy {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;
        this.game = game;
        
        // Enemy stats
        this.health = 50;
        this.maxHealth = 50;
        this.speed = 1.5 + Math.random();
        this.damage = 15;
        
        // Movement pattern
        this.movePattern = Math.random() < 0.5 ? 'straight' : 'zigzag';
        this.direction = Math.random() < 0.5 ? -1 : 1;
        this.zigzagTimer = 0;
        
        // Shooting
        this.shootCooldown = 0;
        this.shootRate = 90 + Math.random() * 60; // Random shoot rate
        
        // Visual
        this.color = '#FF4444';
        this.rotation = 0;
    }
    
    update() {
        this.move();
        this.updateShooting();
        this.rotation += 0.05;
    }
    
    move() {
        // Always move down
        this.y += this.speed + this.game.scrollSpeed;
        
        // Apply movement pattern
        switch (this.movePattern) {
            case 'straight':
                // Just move down
                break;
                
            case 'zigzag':
                this.zigzagTimer++;
                if (this.zigzagTimer > 30) {
                    this.direction *= -1;
                    this.zigzagTimer = 0;
                }
                this.x += this.direction * 1.5;
                break;
        }
        
        // Keep in bounds
        if (this.x < this.width / 2) {
            this.x = this.width / 2;
            this.direction = 1;
        }
        if (this.x > this.game.width - this.width / 2) {
            this.x = this.game.width - this.width / 2;
            this.direction = -1;
        }
    }
    
    updateShooting() {
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
        
        if (this.shootCooldown <= 0 && this.y > 0 && this.y < this.game.height - 100) {
            this.shoot();
            this.shootCooldown = this.shootRate;
        }
    }
    
    shoot() {
        // Calculate angle to player
        const angle = Math.atan2(
            this.game.player.y - this.y,
            this.game.player.x - this.x
        );
        
        const bulletSpeed = 4;
        const velocityX = Math.cos(angle) * bulletSpeed;
        const velocityY = Math.sin(angle) * bulletSpeed;
        
        const bullet = new Bullet(
            this.x,
            this.y + this.height / 2,
            velocityX,
            velocityY,
            this.damage,
            'enemy'
        );
        
        this.game.addBullet(bullet);
    }
    
    takeDamage(damage) {
        this.health -= damage;
        
        // Create damage particles
        for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            this.game.addParticle(new Particle(this.x, this.y, angle, speed, 'damage'));
        }
        
        return this.health <= 0;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Enemy body
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Enemy outline
        ctx.strokeStyle = '#990000';
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Enemy details (simple cross pattern)
        ctx.strokeStyle = '#FFAAAA';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-this.width / 4, -this.height / 4);
        ctx.lineTo(this.width / 4, this.height / 4);
        ctx.moveTo(this.width / 4, -this.height / 4);
        ctx.lineTo(-this.width / 4, this.height / 4);
        ctx.stroke();
        
        ctx.restore();
        
        // Health bar
        this.drawHealthBar(ctx);
    }
    
    drawHealthBar(ctx) {
        if (this.health >= this.maxHealth) return;
        
        const barWidth = this.width;
        const barHeight = 3;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.height / 2 - 8;
        
        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = '#FF4444';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}

class HeavyEnemy extends Enemy {
    constructor(x, y, game) {
        super(x, y, game);
        
        this.width = 40;
        this.height = 40;
        this.health = 120;
        this.maxHealth = 120;
        this.speed = 0.8;
        this.damage = 25;
        this.shootRate = 45; // Shoots more frequently
        
        this.color = '#8B0000';
    }
    
    shoot() {
        // Shoots multiple bullets in a spread
        for (let i = -1; i <= 1; i++) {
            const baseAngle = Math.atan2(
                this.game.player.y - this.y,
                this.game.player.x - this.x
            );
            
            const angle = baseAngle + (i * 0.3);
            const bulletSpeed = 3;
            const velocityX = Math.cos(angle) * bulletSpeed;
            const velocityY = Math.sin(angle) * bulletSpeed;
            
            const bullet = new Bullet(
                this.x,
                this.y + this.height / 2,
                velocityX,
                velocityY,
                this.damage,
                'enemy'
            );
            
            this.game.addBullet(bullet);
        }
    }
}

class FastEnemy extends Enemy {
    constructor(x, y, game) {
        super(x, y, game);
        
        this.width = 20;
        this.height = 20;
        this.health = 25;
        this.maxHealth = 25;
        this.speed = 3;
        this.damage = 10;
        this.shootRate = 120; // Shoots less frequently but moves fast
        
        this.color = '#FF6B6B';
        this.movePattern = 'zigzag';
    }
}

class Obstacle {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 40;
        this.game = game;
        
        this.health = 80;
        this.maxHealth = 80;
        this.speed = this.game.scrollSpeed;
        
        // Obstacle type
        this.type = this.getRandomType();
        this.setTypeProperties();
        
        // Visual effects
        this.damageFlash = 0;
    }
    
    getRandomType() {
        const types = ['crate', 'barrel', 'wall', 'turret'];
        return types[Math.floor(Math.random() * types.length)];
    }
    
    setTypeProperties() {
        switch (this.type) {
            case 'crate':
                this.health = 60;
                this.maxHealth = 60;
                this.color = '#8B4513';
                this.reward = 'weaponPart';
                break;
                
            case 'barrel':
                this.health = 40;
                this.maxHealth = 40;
                this.color = '#696969';
                this.reward = 'explosion';
                break;
                
            case 'wall':
                this.health = 120;
                this.maxHealth = 120;
                this.width = 80;
                this.height = 30;
                this.color = '#708090';
                this.reward = 'points';
                break;
                
            case 'turret':
                this.health = 100;
                this.maxHealth = 100;
                this.color = '#2F4F4F';
                this.reward = 'weaponUpgrade';
                this.shootCooldown = 0;
                this.shootRate = 90;
                break;
        }
    }
    
    update() {
        this.y += this.speed;
        
        // Reduce damage flash
        if (this.damageFlash > 0) {
            this.damageFlash--;
        }
        
        // Turret shooting
        if (this.type === 'turret') {
            this.updateTurretShooting();
        }
    }
    
    updateTurretShooting() {
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
        
        if (this.shootCooldown <= 0 && this.y > 0 && this.y < this.game.height - 50) {
            this.shootAtPlayer();
            this.shootCooldown = this.shootRate;
        }
    }
    
    shootAtPlayer() {
        const angle = Math.atan2(
            this.game.player.y - this.y,
            this.game.player.x - this.x
        );
        
        const bulletSpeed = 5;
        const velocityX = Math.cos(angle) * bulletSpeed;
        const velocityY = Math.sin(angle) * bulletSpeed;
        
        const bullet = new Bullet(
            this.x,
            this.y,
            velocityX,
            velocityY,
            20,
            'enemy'
        );
        
        this.game.addBullet(bullet);
    }
    
    takeDamage(damage) {
        this.health -= damage;
        this.damageFlash = 10;
        
        // Create damage particles
        for (let i = 0; i < 2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            this.game.addParticle(new Particle(this.x, this.y, angle, speed, 'sparks'));
        }
        
        if (this.health <= 0) {
            this.destroy();
            return true;
        }
        
        return false;
    }
    
    destroy() {
        // Create destruction effect
        this.game.createExplosion(this.x, this.y);
        
        // Give reward based on type
        switch (this.reward) {
            case 'weaponPart':
                this.spawnWeaponPart();
                break;
                
            case 'explosion':
                this.createBarrelExplosion();
                break;
                
            case 'points':
                this.game.score += 75;
                break;
                
            case 'weaponUpgrade':
                this.spawnWeaponUpgrade();
                break;
        }
    }
    
    spawnWeaponPart() {
        const partTypes = ['barrel', 'grip', 'scope', 'magazine'];
        const partType = partTypes[Math.floor(Math.random() * partTypes.length)];
        // This would spawn a weapon part pickup
        // For now, just add score
        this.game.score += 200;
    }
    
    createBarrelExplosion() {
        // Larger explosion that can damage nearby enemies
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 * i) / 15;
            const speed = Math.random() * 5 + 3;
            this.game.addParticle(new Particle(this.x, this.y, angle, speed, 'explosion'));
        }
        
        // Damage nearby enemies
        this.game.enemies.forEach((enemy, index) => {
            const distance = Math.sqrt(
                Math.pow(enemy.x - this.x, 2) + Math.pow(enemy.y - this.y, 2)
            );
            
            if (distance < 80) {
                if (enemy.takeDamage(50)) {
                    this.game.enemies.splice(index, 1);
                    this.game.score += 100;
                }
            }
        });
    }
    
    spawnWeaponUpgrade() {
        // This would spawn a weapon upgrade pickup
        // For now, just add score
        this.game.score += 300;
    }
    
    draw(ctx) {
        // Flash white when damaged
        if (this.damageFlash > 0) {
            ctx.fillStyle = '#FFFFFF';
        } else {
            ctx.fillStyle = this.color;
        }
        
        ctx.fillRect(
            this.x - this.width / 2, 
            this.y - this.height / 2, 
            this.width, 
            this.height
        );
        
        // Draw type-specific details
        this.drawTypeDetails(ctx);
        
        // Outline
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.x - this.width / 2, 
            this.y - this.height / 2, 
            this.width, 
            this.height
        );
        
        // Health bar
        this.drawHealthBar(ctx);
    }
    
    drawTypeDetails(ctx) {
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        switch (this.type) {
            case 'crate':
                // Draw crate lines
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(this.x - this.width / 4, this.y - this.height / 2);
                ctx.lineTo(this.x - this.width / 4, this.y + this.height / 2);
                ctx.moveTo(this.x + this.width / 4, this.y - this.height / 2);
                ctx.lineTo(this.x + this.width / 4, this.y + this.height / 2);
                ctx.stroke();
                break;
                
            case 'barrel':
                // Draw barrel rings
                ctx.strokeStyle = '#444';
                ctx.lineWidth = 1;
                for (let i = -1; i <= 1; i++) {
                    ctx.beginPath();
                    ctx.moveTo(this.x - this.width / 2, this.y + i * 10);
                    ctx.lineTo(this.x + this.width / 2, this.y + i * 10);
                    ctx.stroke();
                }
                break;
                
            case 'turret':
                // Draw turret cannon
                ctx.fillStyle = '#1C1C1C';
                const angle = Math.atan2(
                    this.game.player.y - this.y,
                    this.game.player.x - this.x
                );
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(angle);
                ctx.fillRect(0, -3, 25, 6);
                ctx.restore();
                break;
        }
    }
    
    drawHealthBar(ctx) {
        if (this.health >= this.maxHealth) return;
        
        const barWidth = this.width;
        const barHeight = 4;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.height / 2 - 10;
        
        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}