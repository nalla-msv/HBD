// Fireworks implementation
class Firework {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.reset();
    }
    
    reset() {
    // Choose a random corner: 0=top-left, 1=top-right, 2=bottom-left, 3=bottom-right
    const corner = Math.floor(Math.random() * 4);
    
    switch(corner) {
        case 0: // Top-left corner
            this.x = Math.random() * (this.canvas.width * 0.15);
            this.y = Math.random() * (this.canvas.height * 0.15);
            this.targetY = Math.random() * (this.canvas.height * 0.3) + (this.canvas.height * 0.1);
            break;
        case 1: // Top-right corner
            this.x = Math.random() * (this.canvas.width * 0.15) + (this.canvas.width * 0.85);
            this.y = Math.random() * (this.canvas.height * 0.15);
            this.targetY = Math.random() * (this.canvas.height * 0.3) + (this.canvas.height * 0.1);
            break;
        case 2: // Bottom-left corner
            this.x = Math.random() * (this.canvas.width * 0.15);
            this.y = this.canvas.height - Math.random() * (this.canvas.height * 0.15);
            this.targetY = this.y - Math.random() * (this.canvas.height * 0.3) - 50;
            break;
        case 3: // Bottom-right corner
            this.x = Math.random() * (this.canvas.width * 0.15) + (this.canvas.width * 0.85);
            this.y = this.canvas.height - Math.random() * (this.canvas.height * 0.15);
            this.targetY = this.y - Math.random() * (this.canvas.height * 0.3) - 50;
            break;
    }
    
    this.speed = Math.random() * 3 + 5;
    this.exploded = false;
    this.particles = [];
    this.hue = Math.random() * 360;
    this.brightness = Math.random() * 50 + 50;
    this.alpha = 1;
}
    
    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.explode();
            }
        } else {
            this.particles.forEach((particle, index) => {
                particle.update();
                if (particle.alpha <= 0) {
                    this.particles.splice(index, 1);
                }
            });
            
            if (this.particles.length === 0) {
                this.reset();
            }
        }
    }
    
    explode() {
        this.exploded = true;
        const particleCount = Math.random() * 30 + 20;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.x, this.y, this.hue, this.brightness));
        }
    }
    
    draw() {
        if (!this.exploded) {
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'lighter';
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
            this.ctx.fill();
            this.ctx.restore();
        } else {
            this.particles.forEach(particle => particle.draw(this.ctx));
        }
    }
}

class Particle {
    constructor(x, y, hue, brightness) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 12;
        this.vy = (Math.random() - 0.5) * 12;
        this.gravity = 0.1;
        this.friction = 0.98;
        this.hue = hue + Math.random() * 60 - 30;
        this.brightness = brightness;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.01;
    }
    
    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        if (this.alpha < 0) this.alpha = 0;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
        ctx.fill();
        ctx.restore();
    }
}

// Fireworks manager
let fireworks = [];
let fireworksCanvas;
let animationId;

function initFireworks() {
    // Create canvas if it doesn't exist
    if (!document.getElementById('fireworksCanvas')) {
        fireworksCanvas = document.createElement('canvas');
        fireworksCanvas.id = 'fireworksCanvas';
        fireworksCanvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        document.body.appendChild(fireworksCanvas);
    } else {
        fireworksCanvas = document.getElementById('fireworksCanvas');
    }
    
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
    
    // Create initial fireworks
    for (let i = 0; i < 3; i++) {
        fireworks.push(new Firework(fireworksCanvas));
    }
    
    // Start animation
    animateFireworks();
}

function animateFireworks() {
    const ctx = fireworksCanvas.getContext('2d');
    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    fireworks.forEach(firework => {
        firework.update();
        firework.draw();
    });
    
    // Add new fireworks randomly
    if (Math.random() < 0.05) {
        fireworks.push(new Firework(fireworksCanvas));
    }
    
    animationId = requestAnimationFrame(animateFireworks);
}

function stopFireworks() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    if (fireworksCanvas) {
        fireworksCanvas.remove();
    }
    fireworks = [];
}

// Handle window resize
window.addEventListener('resize', () => {
    if (fireworksCanvas) {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    }
});

// Auto-start fireworks when script loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initFireworks, 1000); // Start after 1 second
});