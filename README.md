# Weapon Master - Web Edition

A web-based remake of the popular mobile game "Weapon Master: Gun Shooter Run" by HOMA GAMES. This is a JavaScript/HTML5 Canvas implementation featuring the core mechanics of the original game.

## 🎮 Game Features

- **Run & Gun Gameplay**: Player automatically moves forward while you aim and shoot
- **Weapon System**: Multiple weapon types with different stats and behaviors
- **Weapon Crafting**: Upgrade weapons using points earned from gameplay
- **Enemy Variety**: Different enemy types with unique movement patterns and behaviors
- **Destructible Obstacles**: Various obstacle types that provide rewards when destroyed
- **Particle Effects**: Explosions, muzzle flashes, and visual feedback
- **Progressive Difficulty**: Game gets harder as you progress
- **Touch Controls**: Mobile-friendly touch controls for smartphones and tablets

## 🎯 How to Play

### Controls
- **WASD** or **Arrow Keys**: Move player
- **Mouse**: Aim and shoot (hold to continuous fire)
- **R**: Reload weapon
- **C**: Open weapon crafting menu
- **ESC**: Pause/Resume game
- **F**: Toggle fullscreen mode

### Mobile Controls
- **Touch**: Aim and shoot
- **Drag**: Move aim direction

### Gameplay
1. Survive waves of enemies by shooting them down
2. Destroy obstacles to earn points and clear the path
3. Collect points to upgrade your weapons
4. Use the crafting system (C key) to purchase better weapons
5. Try to achieve the highest score possible!

## 🔫 Weapon Types

- **Basic**: Starting weapon with balanced stats
- **Pistol**: Improved accuracy and damage (Cost: 500 points)
- **Rifle**: High damage, long-range weapon (Cost: 1000 points)
- **Shotgun**: Spread shot for close combat (Cost: 750 points)
- **SMG**: High fire rate with medium damage (Cost: 800 points)
- **Sniper**: Extreme damage with slow fire rate (Cost: 1500 points)
- **Minigun**: Rapid fire with high ammo capacity (Cost: 2000 points)

## 🎨 Technical Features

- **HTML5 Canvas Rendering**: Smooth 60 FPS gameplay
- **Object-Oriented Design**: Modular, maintainable code structure
- **Particle System**: Dynamic visual effects
- **Responsive UI**: Works on desktop and mobile devices
- **Performance Monitoring**: Built-in FPS tracking
- **Debug Console**: Development tools for testing

## 🚀 Getting Started

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. Start playing immediately - no installation required!

### Requirements
- Modern web browser with HTML5 Canvas support
- JavaScript enabled
- For best experience: Chrome, Firefox, Safari, or Edge

## 🛠️ Development

### File Structure
```
weapon-master-web/
├── index.html          # Main HTML file
├── js/
│   ├── game.js         # Core game engine
│   ├── player.js       # Player class and controls
│   ├── weapons.js      # Weapon system and bullets
│   ├── enemies.js      # Enemy types and obstacles
│   ├── particles.js    # Particle effects system
│   ├── ui.js           # User interface management
│   └── main.js         # Game initialization
└── README.md
```

### Debug Console
Open browser developer tools and use:
- `window.gameDebug.getGameState()` - Get current game state
- `window.gameDebug.getFPS()` - Check current FPS
- `window.gameDebug.toggleGodMode()` - Enable invincibility
- `window.gameDebug.addScore(amount)` - Add points

## 🎯 Game Mechanics

### Scoring System
- **Enemy Kill**: 100 points
- **Obstacle Destroyed**: 50-300 points (varies by type)
- **Barrel Explosion Chain**: Bonus points for chain reactions

### Enemy Types
- **Basic Enemy**: Standard movement, shoots at player
- **Heavy Enemy**: More health, shoots spread bullets
- **Fast Enemy**: Quick movement, zigzag pattern

### Obstacle Types
- **Crate**: Destructible, rewards weapon parts
- **Barrel**: Explodes on destruction, damages nearby enemies
- **Wall**: High health, blocks path
- **Turret**: Shoots at player, valuable when destroyed

## 🔧 Future Enhancements

Potential features for future versions:
- Sound effects and background music
- More weapon types and upgrade paths
- Boss battles
- Power-ups and special abilities
- Leaderboard system
- Level progression system
- Custom graphics and animations

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile Safari (iOS 12+)
- ✅ Chrome Mobile

## 📄 License

This project is a fan recreation for educational purposes. The original "Weapon Master" game is owned by HOMA GAMES. This remake is not affiliated with or endorsed by HOMA GAMES.

## 🤝 Contributing

This is an educational project. Feel free to fork, modify, and experiment with the code to learn about game development!

---

**Enjoy playing Weapon Master - Web Edition!** 🎮