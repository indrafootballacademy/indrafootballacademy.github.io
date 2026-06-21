/* ============================================================
   ProStrike Football Academy — Advanced Particle System
   Canvas-based animated background with connected nodes,
   floating footballs, geometric shapes, and gradient trails
   ============================================================ */

'use strict';

class ParticleSystem {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.footballs = [];
        this.geometrics = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.animationId = null;
        
        // Configuration
        this.config = {
            particleCount: options.particleCount || 80,
            footballCount: options.footballCount || 5,
            geometricCount: options.geometricCount || 12,
            particleColor: options.particleColor || 'rgba(255, 193, 7, 0.6)',
            lineColor: options.lineColor || 'rgba(255, 193, 7, 0.1)',
            maxLineDistance: options.maxLineDistance || 120,
            speed: options.speed || 0.5,
            interactive: options.interactive !== false
        };
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.createFloatingFootballs();
        this.createGeometricShapes();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth * (window.devicePixelRatio || 1);
        this.canvas.height = this.canvas.offsetHeight * (window.devicePixelRatio || 1);
        this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.particles = [];
            this.createParticles();
        });
        
        if (this.config.interactive) {
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
            
            this.canvas.addEventListener('mouseleave', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
        }
    }
    
    // ============ PARTICLES (Connected Nodes) ============
    createParticles() {
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * this.config.speed,
                vy: (Math.random() - 0.5) * this.config.speed,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3,
                color: this.getRandomParticleColor()
            });
        }
    }
    
    getRandomParticleColor() {
        const colors = [
            'rgba(255, 193, 7, ',    // Gold
            'rgba(26, 115, 232, ',   // Blue
            'rgba(255, 255, 255, ',  // White
            'rgba(40, 167, 69, ',    // Green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    drawParticles() {
        this.particles.forEach((p, i) => {
            // Move
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;
            
            // Mouse interaction — push particles away
            if (this.mouse.x && this.mouse.y) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.x += dx * force * 0.02;
                    p.y += dy * force * 0.02;
                }
            }
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color + p.opacity + ')';
            this.ctx.fill();
            
            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.config.maxLineDistance) {
                    const opacity = (1 - dist / this.config.maxLineDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(255, 193, 7, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });
    }
    
    // ============ FLOATING FOOTBALLS ============
    createFloatingFootballs() {
        for (let i = 0; i < this.config.footballCount; i++) {
            this.footballs.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 20 + 15,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                opacity: Math.random() * 0.15 + 0.05
            });
        }
    }
    
    drawFootball(x, y, size, rotation, opacity) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.globalAlpha = opacity;
        
        // Draw pentagon football pattern
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
        
        // Pentagon in center
        const pentSize = size * 0.45;
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 72 - 90) * Math.PI / 180;
            const px = Math.cos(angle) * pentSize;
            const py = Math.sin(angle) * pentSize;
            if (i === 0) this.ctx.moveTo(px, py);
            else this.ctx.lineTo(px, py);
        }
        this.ctx.closePath();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Lines from pentagon to edges
        for (let i = 0; i < 5; i++) {
            const angle = (i * 72 - 90) * Math.PI / 180;
            const px = Math.cos(angle) * pentSize;
            const py = Math.sin(angle) * pentSize;
            const ex = Math.cos(angle) * size * 0.85;
            const ey = Math.sin(angle) * size * 0.85;
            this.ctx.beginPath();
            this.ctx.moveTo(px, py);
            this.ctx.lineTo(ex, ey);
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    drawFloatingFootballs() {
        this.footballs.forEach(fb => {
            fb.x += fb.vx;
            fb.y += fb.vy;
            fb.rotation += fb.rotationSpeed;
            
            // Wrap around edges
            if (fb.x < -fb.size) fb.x = this.width + fb.size;
            if (fb.x > this.width + fb.size) fb.x = -fb.size;
            if (fb.y < -fb.size) fb.y = this.height + fb.size;
            if (fb.y > this.height + fb.size) fb.y = -fb.size;
            
            this.drawFootball(fb.x, fb.y, fb.size, fb.rotation, fb.opacity);
        });
    }
    
    // ============ GEOMETRIC SHAPES ============
    createGeometricShapes() {
        const shapes = ['triangle', 'hexagon', 'diamond', 'ring'];
        
        for (let i = 0; i < this.config.geometricCount; i++) {
            this.geometrics.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 25 + 10,
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.01,
                opacity: Math.random() * 0.12 + 0.03,
                color: this.getRandomGeoColor(),
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    getRandomGeoColor() {
        const colors = ['#ffc107', '#1a73e8', '#28a745', '#e040fb', '#00bcd4'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    drawGeometricShapes() {
        const time = Date.now() * 0.001;
        
        this.geometrics.forEach(geo => {
            geo.x += geo.vx;
            geo.y += geo.vy;
            geo.rotation += geo.rotationSpeed;
            
            // Wrap edges
            if (geo.x < -50) geo.x = this.width + 50;
            if (geo.x > this.width + 50) geo.x = -50;
            if (geo.y < -50) geo.y = this.height + 50;
            if (geo.y > this.height + 50) geo.y = -50;
            
            // Pulse size
            const pulse = Math.sin(time + geo.pulsePhase) * 0.2 + 1;
            const size = geo.size * pulse;
            
            this.ctx.save();
            this.ctx.translate(geo.x, geo.y);
            this.ctx.rotate(geo.rotation);
            this.ctx.globalAlpha = geo.opacity;
            this.ctx.strokeStyle = geo.color;
            this.ctx.lineWidth = 1.5;
            
            switch (geo.shape) {
                case 'triangle':
                    this.ctx.beginPath();
                    for (let i = 0; i < 3; i++) {
                        const angle = (i * 120 - 90) * Math.PI / 180;
                        const px = Math.cos(angle) * size;
                        const py = Math.sin(angle) * size;
                        i === 0 ? this.ctx.moveTo(px, py) : this.ctx.lineTo(px, py);
                    }
                    this.ctx.closePath();
                    this.ctx.stroke();
                    break;
                    
                case 'hexagon':
                    this.ctx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const angle = (i * 60) * Math.PI / 180;
                        const px = Math.cos(angle) * size;
                        const py = Math.sin(angle) * size;
                        i === 0 ? this.ctx.moveTo(px, py) : this.ctx.lineTo(px, py);
                    }
                    this.ctx.closePath();
                    this.ctx.stroke();
                    break;
                    
                case 'diamond':
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, -size);
                    this.ctx.lineTo(size * 0.6, 0);
                    this.ctx.lineTo(0, size);
                    this.ctx.lineTo(-size * 0.6, 0);
                    this.ctx.closePath();
                    this.ctx.stroke();
                    break;
                    
                case 'ring':
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, size, 0, Math.PI * 1.5);
                    this.ctx.stroke();
                    break;
            }
            
            this.ctx.restore();
        });
    }
    
    // ============ GRADIENT ORB EFFECTS ============
    drawGradientOrbs(time) {
        // Large ambient glow orbs
        const orbs = [
            { x: this.width * 0.2, y: this.height * 0.3, r: 200, color: '26, 115, 232' },
            { x: this.width * 0.8, y: this.height * 0.6, r: 250, color: '255, 193, 7' },
            { x: this.width * 0.5, y: this.height * 0.8, r: 180, color: '40, 167, 69' }
        ];
        
        orbs.forEach((orb, i) => {
            const offsetX = Math.sin(time * 0.3 + i * 2) * 30;
            const offsetY = Math.cos(time * 0.2 + i * 3) * 20;
            
            const gradient = this.ctx.createRadialGradient(
                orb.x + offsetX, orb.y + offsetY, 0,
                orb.x + offsetX, orb.y + offsetY, orb.r
            );
            gradient.addColorStop(0, `rgba(${orb.color}, 0.08)`);
            gradient.addColorStop(0.5, `rgba(${orb.color}, 0.03)`);
            gradient.addColorStop(1, `rgba(${orb.color}, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.width, this.height);
        });
    }
    
    // ============ ANIMATION LOOP ============
    animate() {
        const time = Date.now() * 0.001;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw layers (back to front)
        this.drawGradientOrbs(time);
        this.drawGeometricShapes();
        this.drawFloatingFootballs();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
    }
}

// ============ WAVE ANIMATION (for section dividers) ============
class WaveAnimation {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.config = {
            waves: options.waves || 3,
            colors: options.colors || [
                'rgba(26, 115, 232, 0.1)',
                'rgba(255, 193, 7, 0.08)',
                'rgba(40, 167, 69, 0.06)'
            ],
            speed: options.speed || 0.02,
            amplitude: options.amplitude || 30
        };
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    animate() {
        const time = Date.now() * this.config.speed;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let w = 0; w < this.config.waves; w++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.canvas.height);
            
            for (let x = 0; x <= this.canvas.width; x += 5) {
                const y = Math.sin(x * 0.003 + time + w * 0.8) * this.config.amplitude * (w + 1) * 0.5
                        + Math.sin(x * 0.006 + time * 1.5 + w) * this.config.amplitude * 0.3
                        + this.canvas.height * 0.5;
                this.ctx.lineTo(x, y);
            }
            
            this.ctx.lineTo(this.canvas.width, this.canvas.height);
            this.ctx.closePath();
            this.ctx.fillStyle = this.config.colors[w % this.config.colors.length];
            this.ctx.fill();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============ INITIALIZE ON DOM READY ============
document.addEventListener('DOMContentLoaded', () => {
    // Hero particle system
    const heroParticles = new ParticleSystem('heroCanvas', {
        particleCount: 70,
        footballCount: 4,
        geometricCount: 10,
        speed: 0.4,
        maxLineDistance: 100
    });
    
    // Wave divider (if element exists)
    const waveAnim = new WaveAnimation('waveCanvas');
});
