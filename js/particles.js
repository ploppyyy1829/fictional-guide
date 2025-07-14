class Particle {
    constructor(x, y, angle, speed, type) {
        this.x = x;
        this.y = y;
        this.velocityX = Math.cos(angle) * speed;
        this.velocityY = Math.sin(angle) * speed;
        this.type = type;
        
        // Set properties based on type
        this.setParticleProperties(type);
        
        // Common properties
        this.life = this.maxLife;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.3;
    }
    
    setParticleProperties(type) {
        switch (type) {
            case 'explosion':
                this.maxLife = 30;
                this.color = '#FF6B00';
                this.size = Math.random() * 8 + 4;
                this.gravity = 0.1;
                this.friction = 0.98;
                this.fadeRate = 0.05;
                break;
                
            case 'muzzle':
                this.maxLife = 8;
                this.color = '#FFFF00';
                this.size = Math.random() * 6 + 3;
                this.gravity = 0;
                this.friction = 0.9;
                this.fadeRate = 0.15;
                break;
                
            case 'damage':
                this.maxLife = 20;
                this.color = '#FF0000';
                this.size = Math.random() * 4 + 2;
                this.gravity = 0.05;
                this.friction = 0.95;
                this.fadeRate = 0.08;
                break;
                
            case 'sparks':
                this.maxLife = 25;
                this.color = '#FFD700';
                this.size = Math.random() * 3 + 1;
                this.gravity = 0.15;
                this.friction = 0.97;
                this.fadeRate = 0.06;
                break;
                
            case 'smoke':
                this.maxLife = 40;
                this.color = '#666666';
                this.size = Math.random() * 12 + 6;
                this.gravity = -0.02; // Rises up
                this.friction = 0.99;
                this.fadeRate = 0.03;
                break;
                
            case 'blood':
                this.maxLife = 15;
                this.color = '#8B0000';
                this.size = Math.random() * 5 + 2;
                this.gravity = 0.2;
                this.friction = 0.96;
                this.fadeRate = 0.1;
                break;
                
            default:
                this.maxLife = 20;
                this.color = '#FFFFFF';
                this.size = 3;
                this.gravity = 0.1;
                this.friction = 0.98;
                this.fadeRate = 0.05;
        }
        
        this.alpha = 1.0;
    }
    
    update() {
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Apply gravity
        this.velocityY += this.gravity;
        
        // Apply friction
        this.velocityX *= this.friction;
        this.velocityY *= this.friction;
        
        // Update rotation
        this.rotation += this.rotationSpeed;
        
        // Update life and alpha
        this.life--;
        this.alpha = Math.max(0, this.life / this.maxLife);
        
        // Fade out based on type
        this.alpha *= (1 - this.fadeRate * (this.maxLife - this.life) / this.maxLife);
    }
    
    draw(ctx) {
        if (this.alpha <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Draw based on type
        switch (this.type) {
            case 'explosion':
                this.drawExplosion(ctx);
                break;
                
            case 'muzzle':
                this.drawMuzzleFlash(ctx);
                break;
                
            case 'sparks':
                this.drawSpark(ctx);
                break;
                
            case 'smoke':
                this.drawSmoke(ctx);
                break;
                
            default:
                this.drawDefault(ctx);
                break;
        }
        
        ctx.restore();
    }
    
    drawExplosion(ctx) {
        // Create gradient for explosion effect
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, '#FFFF00');
        gradient.addColorStop(0.4, this.color);
        gradient.addColorStop(1, '#FF0000');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add outer glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.size * 2;
        ctx.fill();
    }
    
    drawMuzzleFlash(ctx) {
        // Draw star-like muzzle flash
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.size;
        
        ctx.beginPath();
        const spikes = 6;
        const step = Math.PI / spikes;
        
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? this.size : this.size * 0.5;
            const angle = i * step;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.closePath();
        ctx.fill();
    }
    
    drawSpark(ctx) {
        // Draw elongated spark
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.size;
        
        ctx.fillRect(-this.size / 2, -this.size * 2, this.size, this.size * 4);
    }
    
    drawSmoke(ctx) {
        // Draw circular smoke
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawDefault(ctx) {
        // Draw simple circle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    
    addParticle(particle) {
        this.particles.push(particle);
    }
    
    createExplosion(x, y, intensity = 1) {
        const particleCount = Math.floor(8 * intensity);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
            const speed = Math.random() * 3 + 2 * intensity;
            this.addParticle(new Particle(x, y, angle, speed, 'explosion'));
        }
        
        // Add some sparks
        for (let i = 0; i < Math.floor(4 * intensity); i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1;
            this.addParticle(new Particle(x, y, angle, speed, 'sparks'));
        }
        
        // Add smoke
        for (let i = 0; i < Math.floor(3 * intensity); i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 1 + 0.5;
            this.addParticle(new Particle(x, y, angle, speed, 'smoke'));
        }
    }
    
    createMuzzleFlash(x, y, angle) {
        // Main muzzle flash
        this.addParticle(new Particle(x, y, angle, 1, 'muzzle'));
        
        // Additional sparks
        for (let i = 0; i < 3; i++) {
            const sparkAngle = angle + (Math.random() - 0.5) * 0.8;
            const speed = Math.random() * 2 + 1;
            this.addParticle(new Particle(x, y, sparkAngle, speed, 'sparks'));
        }
    }
    
    createDamageEffect(x, y) {
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            this.addParticle(new Particle(x, y, angle, speed, 'damage'));
        }
    }
    
    createBloodSplatter(x, y) {
        for (let i = 0; i < 6; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            this.addParticle(new Particle(x, y, angle, speed, 'blood'));
        }
    }
    
    update() {
        // Update all particles
        this.particles.forEach(particle => particle.update());
        
        // Remove dead particles
        this.particles = this.particles.filter(particle => particle.life > 0);
    }
    
    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }
    
    clear() {
        this.particles = [];
    }
    
    getParticleCount() {
        return this.particles.length;
    }
}

// Special effect particles for powerups and other game events
class PowerupParticle extends Particle {
    constructor(x, y, color) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        super(x, y, angle, speed, 'powerup');
        
        this.maxLife = 60;
        this.color = color;
        this.size = Math.random() * 6 + 4;
        this.gravity = -0.05; // Float upward
        this.friction = 0.99;
        this.fadeRate = 0.02;
        this.pulseSpeed = 0.1;
        this.baseSize = this.size;
    }
    
    update() {
        super.update();
        
        // Pulsing effect
        this.size = this.baseSize + Math.sin(Date.now() * this.pulseSpeed) * 2;
    }
    
    draw(ctx) {
        if (this.alpha <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        // Draw glowing orb
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.7, this.color + '80'); // Semi-transparent
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add sparkle effect
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = this.alpha * 0.8;
        ctx.beginPath();
        ctx.arc(this.x + Math.cos(this.rotation) * this.size * 0.3, 
                this.y + Math.sin(this.rotation) * this.size * 0.3, 1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class TrailParticle extends Particle {
    constructor(x, y, angle, speed, color, length = 10) {
        super(x, y, angle, speed, 'trail');
        
        this.maxLife = length;
        this.color = color;
        this.size = 2;
        this.gravity = 0;
        this.friction = 1; // No friction for trails
        this.fadeRate = 0;
        this.length = length;
    }
    
    draw(ctx) {
        if (this.alpha <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';
        
        // Draw line from current to previous position
        const prevX = this.x - this.velocityX;
        const prevY = this.y - this.velocityY;
        
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        
        ctx.restore();
    }
}