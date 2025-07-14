class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.state = 'playing'; // 'menu', 'playing', 'paused', 'gameOver'
        this.score = 0;
        this.level = 1;
        this.scrollSpeed = 2;
        
        // Game objects
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.obstacles = [];
        this.powerups = [];
        this.particles = [];
        
        // Input handling
        this.keys = {};
        this.mouse = { x: 0, y: 0, down: false };
        
        // Timing
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // Background
        this.backgroundY = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.player = new Player(this.width / 2, this.height - 100, this);
        this.spawnEnemies();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'KeyR') {
                this.player.reload();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.down = true;
            this.player.startShooting();
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            this.mouse.down = false;
            this.player.stopShooting();
        });
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    gameLoop(currentTime = 0) {
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update();
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update() {
        if (this.state !== 'playing') return;
        
        // Update background scroll
        this.backgroundY += this.scrollSpeed;
        if (this.backgroundY >= this.height) {
            this.backgroundY = 0;
        }
        
        // Update player
        this.player.update();
        
        // Update enemies
        this.enemies.forEach((enemy, index) => {
            enemy.update();
            if (enemy.y > this.height + 50) {
                this.enemies.splice(index, 1);
            }
        });
        
        // Update bullets
        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.y < -50 || bullet.y > this.height + 50 || 
                bullet.x < -50 || bullet.x > this.width + 50) {
                this.bullets.splice(index, 1);
            }
        });
        
        // Update obstacles
        this.obstacles.forEach((obstacle, index) => {
            obstacle.update();
            if (obstacle.y > this.height + 50) {
                this.obstacles.splice(index, 1);
            }
        });
        
        // Update particles
        this.particles.forEach((particle, index) => {
            particle.update();
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
        
        // Check collisions
        this.checkCollisions();
        
        // Spawn new enemies periodically
        if (Math.random() < 0.02) {
            this.spawnEnemies();
        }
        
        // Spawn obstacles
        if (Math.random() < 0.01) {
            this.spawnObstacle();
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw background
        this.drawBackground();
        
        // Draw game objects
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        this.particles.forEach(particle => particle.draw(this.ctx));
        this.player.draw(this.ctx);
        
        // Draw UI elements
        this.drawUI();
    }
    
    drawBackground() {
        // Simple scrolling grid pattern
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        const gridSize = 50;
        const offsetY = this.backgroundY % gridSize;
        
        // Vertical lines
        for (let x = 0; x < this.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = -gridSize + offsetY; y < this.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }
    
    drawUI() {
        // This will be handled by ui.js, but we can add some basic info here
        document.getElementById('score').textContent = this.score;
        document.getElementById('health').textContent = this.player.health;
        document.getElementById('ammo').textContent = this.player.currentAmmo;
        document.getElementById('weaponType').textContent = this.player.weapon.type;
    }
    
    spawnEnemies() {
        const numEnemies = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numEnemies; i++) {
            const x = Math.random() * (this.width - 40) + 20;
            const y = -50 - (i * 60);
            this.enemies.push(new Enemy(x, y, this));
        }
    }
    
    spawnObstacle() {
        const x = Math.random() * (this.width - 60) + 30;
        const y = -50;
        this.obstacles.push(new Obstacle(x, y, this));
    }
    
    checkCollisions() {
        // Bullet vs Enemy collisions
        this.bullets.forEach((bullet, bulletIndex) => {
            if (bullet.owner === 'player') {
                this.enemies.forEach((enemy, enemyIndex) => {
                    if (this.checkCollision(bullet, enemy)) {
                        // Create explosion particles
                        this.createExplosion(enemy.x, enemy.y);
                        
                        // Remove bullet and enemy
                        this.bullets.splice(bulletIndex, 1);
                        this.enemies.splice(enemyIndex, 1);
                        
                        // Add score
                        this.score += 100;
                    }
                });
                
                // Bullet vs Obstacle collisions
                this.obstacles.forEach((obstacle, obstacleIndex) => {
                    if (this.checkCollision(bullet, obstacle)) {
                        obstacle.takeDamage(bullet.damage);
                        this.bullets.splice(bulletIndex, 1);
                        
                        if (obstacle.health <= 0) {
                            this.createExplosion(obstacle.x, obstacle.y);
                            this.obstacles.splice(obstacleIndex, 1);
                            this.score += 50;
                        }
                    }
                });
            }
        });
        
        // Enemy vs Player collisions
        this.enemies.forEach((enemy, enemyIndex) => {
            if (this.checkCollision(enemy, this.player)) {
                this.player.takeDamage(20);
                this.enemies.splice(enemyIndex, 1);
                this.createExplosion(enemy.x, enemy.y);
            }
        });
    }
    
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    createExplosion(x, y) {
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const speed = Math.random() * 3 + 2;
            this.particles.push(new Particle(x, y, angle, speed, 'explosion'));
        }
    }
    
    addBullet(bullet) {
        this.bullets.push(bullet);
    }
    
    addParticle(particle) {
        this.particles.push(particle);
    }
}