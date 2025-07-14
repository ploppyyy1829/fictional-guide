class Weapon {
    constructor(type, owner) {
        this.type = type;
        this.owner = owner;
        this.level = 1;
        
        // Set weapon stats based on type
        this.setWeaponStats(type);
    }
    
    setWeaponStats(type) {
        const weaponData = {
            'basic': {
                damage: 10,
                fireRate: 15,
                maxAmmo: 30,
                reloadTime: 60,
                spread: 0,
                bulletCount: 1,
                color: '#FFD700'
            },
            'pistol': {
                damage: 15,
                fireRate: 12,
                maxAmmo: 12,
                reloadTime: 45,
                spread: 0.1,
                bulletCount: 1,
                color: '#C0C0C0'
            },
            'rifle': {
                damage: 25,
                fireRate: 8,
                maxAmmo: 25,
                reloadTime: 90,
                spread: 0.05,
                bulletCount: 1,
                color: '#8B4513'
            },
            'shotgun': {
                damage: 12,
                fireRate: 30,
                maxAmmo: 8,
                reloadTime: 120,
                spread: 0.4,
                bulletCount: 5,
                color: '#FF4500'
            },
            'smg': {
                damage: 8,
                fireRate: 4,
                maxAmmo: 40,
                reloadTime: 75,
                spread: 0.15,
                bulletCount: 1,
                color: '#32CD32'
            },
            'sniper': {
                damage: 50,
                fireRate: 60,
                maxAmmo: 5,
                reloadTime: 150,
                spread: 0,
                bulletCount: 1,
                color: '#4B0082'
            },
            'minigun': {
                damage: 6,
                fireRate: 2,
                maxAmmo: 100,
                reloadTime: 180,
                spread: 0.2,
                bulletCount: 1,
                color: '#FF1493'
            }
        };
        
        const stats = weaponData[type] || weaponData['basic'];
        
        this.damage = stats.damage;
        this.fireRate = stats.fireRate;
        this.maxAmmo = stats.maxAmmo;
        this.reloadTime = stats.reloadTime;
        this.spread = stats.spread;
        this.bulletCount = stats.bulletCount;
        this.color = stats.color;
    }
    
    upgrade() {
        this.level++;
        // Increase stats based on level
        this.damage = Math.floor(this.damage * 1.2);
        this.maxAmmo = Math.floor(this.maxAmmo * 1.1);
        if (this.fireRate > 2) {
            this.fireRate = Math.max(2, this.fireRate - 1);
        }
    }
    
    merge(otherWeapon) {
        // Weapon merging system (simplified)
        const mergeTable = {
            'basic+basic': 'pistol',
            'pistol+pistol': 'rifle',
            'rifle+rifle': 'sniper',
            'basic+pistol': 'smg',
            'pistol+rifle': 'shotgun',
            'smg+shotgun': 'minigun'
        };
        
        const key1 = `${this.type}+${otherWeapon.type}`;
        const key2 = `${otherWeapon.type}+${this.type}`;
        
        const newType = mergeTable[key1] || mergeTable[key2];
        
        if (newType) {
            return new Weapon(newType, this.owner);
        }
        
        // If no merge possible, upgrade current weapon
        this.upgrade();
        return this;
    }
}

class Bullet {
    constructor(x, y, velocityX, velocityY, damage, owner) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.damage = damage;
        this.owner = owner;
        this.width = 4;
        this.height = 8;
        this.life = 300; // Bullet lifespan in frames
        
        // Visual properties
        this.color = owner === 'player' ? '#FFD700' : '#FF4444';
        this.trail = [];
        this.maxTrailLength = 5;
    }
    
    update() {
        // Store previous position for trail effect
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Decrease life
        this.life--;
    }
    
    draw(ctx) {
        // Draw trail
        ctx.globalAlpha = 0.3;
        this.trail.forEach((point, index) => {
            const alpha = (index + 1) / this.trail.length * 0.3;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.color;
            ctx.fillRect(point.x - 1, point.y - 1, 2, 2);
        });
        
        // Draw bullet
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // Add glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.shadowBlur = 0;
    }
}

class WeaponPart {
    constructor(x, y, partType) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 15;
        this.partType = partType; // 'barrel', 'grip', 'scope', 'magazine'
        this.rarity = Math.random() < 0.1 ? 'legendary' : Math.random() < 0.3 ? 'rare' : 'common';
        this.collected = false;
        
        // Visual properties
        this.bobOffset = Math.random() * Math.PI * 2;
        this.bobSpeed = 0.05;
        
        this.setColor();
    }
    
    setColor() {
        const colors = {
            'common': '#999999',
            'rare': '#4169E1',
            'legendary': '#FFD700'
        };
        
        this.color = colors[this.rarity];
    }
    
    update() {
        // Floating animation
        this.y += Math.sin(Date.now() * this.bobSpeed + this.bobOffset) * 0.2;
        
        // Move down with the world
        this.y += 2;
    }
    
    draw(ctx) {
        // Glow effect based on rarity
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.rarity === 'legendary' ? 15 : this.rarity === 'rare' ? 10 : 5;
        
        // Draw part
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // Draw border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Draw part type indicator
        ctx.fillStyle = '#fff';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.partType[0].toUpperCase(), this.x, this.y + 2);
    }
    
    collect() {
        this.collected = true;
        // Add to player's inventory (to be implemented)
        return {
            type: this.partType,
            rarity: this.rarity,
            value: this.rarity === 'legendary' ? 100 : this.rarity === 'rare' ? 50 : 25
        };
    }
}

class WeaponCraftingSystem {
    constructor() {
        this.inventory = [];
        this.recipes = this.initializeRecipes();
    }
    
    initializeRecipes() {
        return {
            'pistol': {
                parts: ['barrel', 'grip'],
                description: 'Basic handgun with improved accuracy'
            },
            'rifle': {
                parts: ['barrel', 'barrel', 'grip', 'scope'],
                description: 'Long-range weapon with high damage'
            },
            'shotgun': {
                parts: ['barrel', 'grip', 'magazine'],
                description: 'Spread shot weapon for close combat'
            },
            'smg': {
                parts: ['barrel', 'grip', 'magazine', 'magazine'],
                description: 'High fire rate submachine gun'
            },
            'sniper': {
                parts: ['barrel', 'barrel', 'barrel', 'scope', 'grip'],
                description: 'Ultimate precision weapon'
            }
        };
    }
    
    addPart(part) {
        this.inventory.push(part);
    }
    
    canCraft(weaponType) {
        const recipe = this.recipes[weaponType];
        if (!recipe) return false;
        
        const requiredParts = [...recipe.parts];
        const availableParts = [...this.inventory.map(part => part.type)];
        
        for (let part of requiredParts) {
            const index = availableParts.indexOf(part);
            if (index === -1) return false;
            availableParts.splice(index, 1);
        }
        
        return true;
    }
    
    craftWeapon(weaponType) {
        if (!this.canCraft(weaponType)) return null;
        
        const recipe = this.recipes[weaponType];
        const requiredParts = [...recipe.parts];
        
        // Remove used parts from inventory
        for (let partType of requiredParts) {
            const index = this.inventory.findIndex(part => part.type === partType);
            if (index !== -1) {
                this.inventory.splice(index, 1);
            }
        }
        
        return new Weapon(weaponType, null);
    }
    
    getAvailableRecipes() {
        return Object.keys(this.recipes).filter(weaponType => this.canCraft(weaponType));
    }
}