/* ============================================================
   ProStrike Football Academy — Football Action Animations
   Google Doodle-style animated scenes that cycle:
   1. Goal Save (keeper diving)
   2. Free Kick (ball curving over wall)
   3. Penalty Kick (ball into net)
   4. Header (player jumping to head)
   5. Bicycle Kick (overhead kick)
   
   Runs as background animations that transition one to the next.
   ============================================================ */

'use strict';

class FootballActionsAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.scenes = ['goalSave', 'freeKick', 'penalty', 'header', 'bicycleKick'];
        this.currentScene = 0;
        this.sceneTime = 0;
        this.sceneDuration = 4000; // 4 seconds per scene
        this.transitionDuration = 800;
        this.transitioning = false;
        this.opacity = 1;
        this.lastTime = 0;
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.lastTime = Date.now();
        this.animate();
    }
    
    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.offsetWidth * dpr;
        this.canvas.height = this.canvas.offsetHeight * dpr;
        this.ctx.scale(dpr, dpr);
        this.w = this.canvas.offsetWidth;
        this.h = this.canvas.offsetHeight;
    }
    
    animate() {
        const now = Date.now();
        const dt = now - this.lastTime;
        this.lastTime = now;
        this.sceneTime += dt;
        
        // Handle scene transitions
        if (this.sceneTime >= this.sceneDuration) {
            this.sceneTime = 0;
            this.currentScene = (this.currentScene + 1) % this.scenes.length;
        }
        
        // Calculate transition opacity
        if (this.sceneTime < this.transitionDuration) {
            this.opacity = this.sceneTime / this.transitionDuration;
        } else if (this.sceneTime > this.sceneDuration - this.transitionDuration) {
            this.opacity = (this.sceneDuration - this.sceneTime) / this.transitionDuration;
        } else {
            this.opacity = 1;
        }
        
        // Clear and draw
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.globalAlpha = this.opacity * 0.6;
        
        const progress = Math.min(this.sceneTime / (this.sceneDuration - this.transitionDuration), 1);
        
        switch (this.scenes[this.currentScene]) {
            case 'goalSave': this.drawGoalSave(progress); break;
            case 'freeKick': this.drawFreeKick(progress); break;
            case 'penalty': this.drawPenalty(progress); break;
            case 'header': this.drawHeader(progress); break;
            case 'bicycleKick': this.drawBicycleKick(progress); break;
        }
        
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
    
    // ============ HELPER DRAWING FUNCTIONS ============
    
    drawBall(x, y, radius = 12) {
        this.ctx.save();
        // Ball body
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(200, 200, 200, 0.8)';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
        
        // Pentagon pattern
        this.ctx.beginPath();
        const pentR = radius * 0.45;
        for (let i = 0; i < 5; i++) {
            const angle = (i * 72 - 90) * Math.PI / 180;
            const px = x + Math.cos(angle) * pentR;
            const py = y + Math.sin(angle) * pentR;
            i === 0 ? this.ctx.moveTo(px, py) : this.ctx.lineTo(px, py);
        }
        this.ctx.closePath();
        this.ctx.fillStyle = 'rgba(50, 50, 50, 0.6)';
        this.ctx.fill();
        this.ctx.restore();
    }
    
    drawStickFigure(x, y, scale = 1, pose = 'standing', color = 'rgba(255, 193, 7, 0.9)') {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.scale(scale, scale);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        switch (pose) {
            case 'standing':
                // Head
                this.ctx.beginPath();
                this.ctx.arc(0, -35, 8, 0, Math.PI * 2);
                this.ctx.stroke();
                // Body
                this.ctx.beginPath();
                this.ctx.moveTo(0, -27); this.ctx.lineTo(0, 0);
                this.ctx.stroke();
                // Arms
                this.ctx.beginPath();
                this.ctx.moveTo(-15, -15); this.ctx.lineTo(0, -20); this.ctx.lineTo(15, -15);
                this.ctx.stroke();
                // Legs
                this.ctx.beginPath();
                this.ctx.moveTo(-12, 25); this.ctx.lineTo(0, 0); this.ctx.lineTo(12, 25);
                this.ctx.stroke();
                break;
                
            case 'kicking':
                // Head
                this.ctx.beginPath();
                this.ctx.arc(0, -35, 8, 0, Math.PI * 2);
                this.ctx.stroke();
                // Body (leaning back)
                this.ctx.beginPath();
                this.ctx.moveTo(-3, -27); this.ctx.lineTo(3, 0);
                this.ctx.stroke();
                // Arms (balance)
                this.ctx.beginPath();
                this.ctx.moveTo(-20, -20); this.ctx.lineTo(0, -18); this.ctx.lineTo(15, -25);
                this.ctx.stroke();
                // Standing leg
                this.ctx.beginPath();
                this.ctx.moveTo(3, 0); this.ctx.lineTo(-5, 25);
                this.ctx.stroke();
                // Kicking leg (extended forward)
                this.ctx.beginPath();
                this.ctx.moveTo(3, 0); this.ctx.lineTo(25, 5); this.ctx.lineTo(35, 10);
                this.ctx.stroke();
                break;
                
            case 'diving':
                // Head
                this.ctx.beginPath();
                this.ctx.arc(-30, -5, 8, 0, Math.PI * 2);
                this.ctx.stroke();
                // Body (horizontal)
                this.ctx.beginPath();
                this.ctx.moveTo(-22, -5); this.ctx.lineTo(10, 0);
                this.ctx.stroke();
                // Arms (stretched)
                this.ctx.beginPath();
                this.ctx.moveTo(-25, -15); this.ctx.lineTo(-35, -20);
                this.ctx.moveTo(-25, 5); this.ctx.lineTo(-35, 10);
                this.ctx.stroke();
                // Legs
                this.ctx.beginPath();
                this.ctx.moveTo(10, 0); this.ctx.lineTo(25, -10);
                this.ctx.moveTo(10, 0); this.ctx.lineTo(25, 10);
                this.ctx.stroke();
                break;
                
            case 'heading':
                // Head (thrust forward)
                this.ctx.beginPath();
                this.ctx.arc(5, -40, 8, 0, Math.PI * 2);
                this.ctx.stroke();
                // Body (arched back)
                this.ctx.beginPath();
                this.ctx.moveTo(2, -32); this.ctx.lineTo(-5, 0);
                this.ctx.stroke();
                // Arms (back for balance)
                this.ctx.beginPath();
                this.ctx.moveTo(-15, -10); this.ctx.lineTo(-5, -15); this.ctx.lineTo(-20, -25);
                this.ctx.stroke();
                // Legs (tucked - in air)
                this.ctx.beginPath();
                this.ctx.moveTo(-5, 0); this.ctx.lineTo(-15, 15); this.ctx.lineTo(-10, 25);
                this.ctx.moveTo(-5, 0); this.ctx.lineTo(5, 15); this.ctx.lineTo(10, 25);
                this.ctx.stroke();
                break;
                
            case 'bicycle':
                // Head (looking up)
                this.ctx.beginPath();
                this.ctx.arc(-5, 10, 8, 0, Math.PI * 2);
                this.ctx.stroke();
                // Body (inverted/leaning back)
                this.ctx.beginPath();
                this.ctx.moveTo(-3, 2); this.ctx.lineTo(5, -25);
                this.ctx.stroke();
                // Arms (catching fall)
                this.ctx.beginPath();
                this.ctx.moveTo(-3, 2); this.ctx.lineTo(-15, 20);
                this.ctx.moveTo(-3, 2); this.ctx.lineTo(10, 18);
                this.ctx.stroke();
                // Kicking leg (up high)
                this.ctx.beginPath();
                this.ctx.moveTo(5, -25); this.ctx.lineTo(0, -45); this.ctx.lineTo(10, -55);
                this.ctx.stroke();
                // Other leg
                this.ctx.beginPath();
                this.ctx.moveTo(5, -25); this.ctx.lineTo(20, -20);
                this.ctx.stroke();
                break;
        }
        
        this.ctx.restore();
    }
    
    drawGoalPost(x, y, width = 200, height = 80) {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 4;
        
        // Posts and crossbar
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, y - height);
        this.ctx.lineTo(x + width, y - height);
        this.ctx.lineTo(x + width, y);
        this.ctx.stroke();
        
        // Net pattern
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        this.ctx.lineWidth = 0.5;
        const spacing = 12;
        for (let i = spacing; i < width; i += spacing) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + i, y - height);
            this.ctx.lineTo(x + i, y);
            this.ctx.stroke();
        }
        for (let j = spacing; j < height; j += spacing) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y - j);
            this.ctx.lineTo(x + width, y - j);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    drawTrail(x, y, trail = []) {
        if (trail.length < 2) return;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
            this.ctx.lineTo(trail[i].x, trail[i].y);
        }
        this.ctx.strokeStyle = 'rgba(255, 193, 7, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([4, 4]);
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
    
    // ============ SCENE: GOAL SAVE ============
    drawGoalSave(progress) {
        const cx = this.w * 0.5;
        const cy = this.h * 0.6;
        
        // Goal
        this.drawGoalPost(cx - 100, cy + 30, 200, 80);
        
        // Ball path (shot toward top corner)
        const ballStartX = cx - 150;
        const ballStartY = cy + 50;
        const ballEndX = cx + 80;
        const ballEndY = cy - 40;
        
        const ballProgress = Math.min(progress * 1.8, 1);
        const eased = this.easeOutCubic(ballProgress);
        const ballX = ballStartX + (ballEndX - ballStartX) * eased;
        const ballY = ballStartY + (ballEndY - ballStartY) * eased;
        
        // Trail
        const trail = [];
        for (let t = 0; t <= ballProgress; t += 0.05) {
            const e = this.easeOutCubic(t);
            trail.push({
                x: ballStartX + (ballEndX - ballStartX) * e,
                y: ballStartY + (ballEndY - ballStartY) * e
            });
        }
        this.drawTrail(ballX, ballY, trail);
        
        // Goalkeeper diving
        const keeperX = cx + 30;
        const keeperY = cy - 5;
        const diveProgress = Math.min(progress * 2 - 0.3, 1);
        
        if (diveProgress > 0) {
            const dp = this.easeOutCubic(Math.max(0, diveProgress));
            this.ctx.save();
            this.ctx.translate(keeperX + dp * 50, keeperY - dp * 30);
            this.drawStickFigure(0, 0, 1, 'diving', 'rgba(0, 200, 100, 0.9)');
            this.ctx.restore();
        } else {
            this.drawStickFigure(keeperX, keeperY, 1, 'standing', 'rgba(0, 200, 100, 0.9)');
        }
        
        // Draw ball
        this.drawBall(ballX, ballY, 10);
        
        // "SAVE!" text flash at end
        if (progress > 0.7) {
            const textOpacity = Math.min((progress - 0.7) / 0.2, 1);
            this.ctx.save();
            this.ctx.globalAlpha = textOpacity * 0.7;
            this.ctx.font = 'bold 28px Montserrat, sans-serif';
            this.ctx.fillStyle = '#28a745';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('SAVE!', cx, cy - 90);
            this.ctx.restore();
        }
        
        // Label
        this.drawSceneLabel('Goal Save');
    }
    
    // ============ SCENE: FREE KICK ============
    drawFreeKick(progress) {
        const cx = this.w * 0.5;
        const cy = this.h * 0.6;
        
        // Goal in background
        this.drawGoalPost(cx - 80, cy - 10, 160, 65);
        
        // Wall of players
        const wallX = cx - 20;
        const wallY = cy + 20;
        for (let i = 0; i < 4; i++) {
            this.drawStickFigure(wallX + i * 18, wallY, 0.6, 'standing', 'rgba(255, 100, 100, 0.7)');
        }
        
        // Kicker
        const kickerX = cx - 120;
        const kickerY = cy + 40;
        const kickProgress = Math.min(progress * 2, 1);
        
        if (kickProgress < 0.3) {
            this.drawStickFigure(kickerX, kickerY, 0.9, 'standing', 'rgba(255, 193, 7, 0.9)');
        } else {
            this.drawStickFigure(kickerX, kickerY, 0.9, 'kicking', 'rgba(255, 193, 7, 0.9)');
        }
        
        // Ball curves over wall
        if (progress > 0.2) {
            const ballP = Math.min((progress - 0.2) / 0.6, 1);
            const ep = this.easeOutCubic(ballP);
            
            const startX = kickerX + 30;
            const startY = kickerY;
            const endX = cx + 30;
            const endY = cy - 40;
            const cpX = cx - 40;
            const cpY = cy - 80; // High arc over wall
            
            // Bezier curve position
            const t = ep;
            const ballX = (1-t)*(1-t)*startX + 2*(1-t)*t*cpX + t*t*endX;
            const ballY = (1-t)*(1-t)*startY + 2*(1-t)*t*cpY + t*t*endY;
            
            // Trail
            const trail = [];
            for (let tr = 0; tr <= t; tr += 0.03) {
                trail.push({
                    x: (1-tr)*(1-tr)*startX + 2*(1-tr)*tr*cpX + tr*tr*endX,
                    y: (1-tr)*(1-tr)*startY + 2*(1-tr)*tr*cpY + tr*tr*endY
                });
            }
            this.drawTrail(ballX, ballY, trail);
            this.drawBall(ballX, ballY, 9);
        }
        
        // "GOAL!" at end
        if (progress > 0.8) {
            const textOpacity = Math.min((progress - 0.8) / 0.15, 1);
            this.ctx.save();
            this.ctx.globalAlpha = textOpacity * 0.7;
            this.ctx.font = 'bold 32px Montserrat, sans-serif';
            this.ctx.fillStyle = '#ffc107';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GOAL!', cx, cy - 85);
            this.ctx.restore();
        }
        
        this.drawSceneLabel('Free Kick');
    }
    
    // ============ SCENE: PENALTY ============
    drawPenalty(progress) {
        const cx = this.w * 0.5;
        const cy = this.h * 0.6;
        
        // Goal
        this.drawGoalPost(cx - 100, cy + 10, 200, 75);
        
        // Goalkeeper
        const keeperSway = Math.sin(progress * 8) * 5;
        this.drawStickFigure(cx + keeperSway, cy - 10, 0.9, 'standing', 'rgba(0, 200, 100, 0.8)');
        
        // Penalty taker
        const kickerX = cx;
        const kickerY = cy + 60;
        
        if (progress < 0.4) {
            // Run up
            const runProgress = progress / 0.4;
            this.drawStickFigure(kickerX - 40 + runProgress * 40, kickerY, 0.9, 'standing', 'rgba(255, 193, 7, 0.9)');
        } else {
            this.drawStickFigure(kickerX, kickerY, 0.9, 'kicking', 'rgba(255, 193, 7, 0.9)');
        }
        
        // Ball
        if (progress > 0.4) {
            const ballP = Math.min((progress - 0.4) / 0.4, 1);
            const ep = this.easeOutCubic(ballP);
            
            // Ball goes to bottom-left corner
            const startX = kickerX + 20;
            const startY = kickerY;
            const endX = cx - 70;
            const endY = cy - 5;
            
            const ballX = startX + (endX - startX) * ep;
            const ballY = startY + (endY - startY) * ep;
            
            const trail = [];
            for (let t = 0; t <= ep; t += 0.05) {
                trail.push({
                    x: startX + (endX - startX) * t,
                    y: startY + (endY - startY) * t
                });
            }
            this.drawTrail(ballX, ballY, trail);
            this.drawBall(ballX, ballY, 10);
        } else {
            // Ball on penalty spot
            this.drawBall(kickerX + 5, kickerY + 5, 8);
        }
        
        // Net ripple effect
        if (progress > 0.75) {
            this.ctx.save();
            const rippleP = (progress - 0.75) / 0.25;
            this.ctx.beginPath();
            this.ctx.arc(cx - 70, cy - 5, 20 + rippleP * 30, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * (1 - rippleP)})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.restore();
        }
        
        if (progress > 0.8) {
            const textOpacity = Math.min((progress - 0.8) / 0.15, 1);
            this.ctx.save();
            this.ctx.globalAlpha = textOpacity * 0.7;
            this.ctx.font = 'bold 30px Montserrat, sans-serif';
            this.ctx.fillStyle = '#1a73e8';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PENALTY!', cx, cy - 80);
            this.ctx.restore();
        }
        
        this.drawSceneLabel('Penalty Kick');
    }
    
    // ============ SCENE: HEADER ============
    drawHeader(progress) {
        const cx = this.w * 0.5;
        const cy = this.h * 0.6;
        
        // Cross coming in from side
        const crossProgress = Math.min(progress * 1.5, 1);
        const crossEased = this.easeOutCubic(crossProgress);
        
        const ballStartX = cx + 150;
        const ballStartY = cy - 60;
        const ballMidX = cx + 20;
        const ballMidY = cy - 50;
        
        const ballX = ballStartX + (ballMidX - ballStartX) * crossEased;
        const ballY = ballStartY + (ballMidY - ballStartY) * crossEased - Math.sin(crossEased * Math.PI) * 30;
        
        // Player jumping
        const jumpProgress = Math.min(Math.max((progress - 0.2) / 0.5, 0), 1);
        const jumpEased = this.easeInOutQuad(jumpProgress);
        const jumpHeight = Math.sin(jumpEased * Math.PI) * 50;
        
        const playerX = cx;
        const playerY = cy + 20 - jumpHeight;
        
        if (jumpProgress > 0.3) {
            this.drawStickFigure(playerX, playerY, 1, 'heading', 'rgba(255, 193, 7, 0.9)');
        } else {
            this.drawStickFigure(playerX, playerY, 1, 'standing', 'rgba(255, 193, 7, 0.9)');
        }
        
        // Ball after header (redirected toward goal)
        if (progress > 0.5) {
            const headerP = Math.min((progress - 0.5) / 0.4, 1);
            const hEased = this.easeOutCubic(headerP);
            
            const endX = cx - 80;
            const endY = cy + 30;
            
            const hBallX = ballMidX + (endX - ballMidX) * hEased;
            const hBallY = ballMidY + (endY - ballMidY) * hEased;
            
            this.drawBall(hBallX, hBallY, 9);
            
            // Trail
            const trail = [];
            for (let t = 0; t <= hEased; t += 0.05) {
                trail.push({
                    x: ballMidX + (endX - ballMidX) * t,
                    y: ballMidY + (endY - ballMidY) * t
                });
            }
            this.drawTrail(hBallX, hBallY, trail);
        } else {
            // Ball in flight
            const trail = [];
            for (let t = 0; t <= crossEased; t += 0.05) {
                trail.push({
                    x: ballStartX + (ballMidX - ballStartX) * t,
                    y: ballStartY + (ballMidY - ballStartY) * t - Math.sin(t * Math.PI) * 30
                });
            }
            this.drawTrail(ballX, ballY, trail);
            this.drawBall(ballX, ballY, 9);
        }
        
        // Defender
        this.drawStickFigure(cx + 40, cy + 20, 0.8, 'standing', 'rgba(255, 100, 100, 0.6)');
        
        if (progress > 0.85) {
            const textOpacity = Math.min((progress - 0.85) / 0.1, 1);
            this.ctx.save();
            this.ctx.globalAlpha = textOpacity * 0.7;
            this.ctx.font = 'bold 28px Montserrat, sans-serif';
            this.ctx.fillStyle = '#ff6b35';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('HEADER!', cx, cy - 90);
            this.ctx.restore();
        }
        
        this.drawSceneLabel('Header');
    }
    
    // ============ SCENE: BICYCLE KICK ============
    drawBicycleKick(progress) {
        const cx = this.w * 0.5;
        const cy = this.h * 0.6;
        
        // Goal
        this.drawGoalPost(cx - 80, cy + 20, 160, 60);
        
        // Player performing bicycle kick
        const kickProgress = Math.min(progress * 1.5, 1);
        const kickEased = this.easeInOutQuad(kickProgress);
        
        const playerX = cx + 20;
        const playerY = cy + 10;
        
        if (kickProgress < 0.4) {
            const jumpH = Math.sin(kickProgress / 0.4 * Math.PI) * 40;
            this.drawStickFigure(playerX, playerY - jumpH, 1, 'standing', 'rgba(255, 193, 7, 0.9)');
        } else {
            const airP = (kickProgress - 0.4) / 0.6;
            const jumpH = Math.sin(Math.PI * 0.7) * 40;
            this.ctx.save();
            this.ctx.translate(playerX, playerY - jumpH);
            this.ctx.rotate(-airP * Math.PI * 0.4);
            this.drawStickFigure(0, 0, 1, 'bicycle', 'rgba(255, 193, 7, 0.9)');
            this.ctx.restore();
        }
        
        // Ball (dropping from above, then rocketing to goal)
        if (progress < 0.5) {
            const dropP = this.easeOutCubic(progress / 0.5);
            const bx = playerX + 10;
            const by = cy - 80 + dropP * 50;
            this.drawBall(bx, by, 9);
        } else {
            const shotP = Math.min((progress - 0.5) / 0.35, 1);
            const ep = this.easeOutCubic(shotP);
            
            const startX = playerX + 10;
            const startY = cy - 30;
            const endX = cx - 50;
            const endY = cy - 10;
            
            const bx = startX + (endX - startX) * ep;
            const by = startY + (endY - startY) * ep;
            
            const trail = [];
            for (let t = 0; t <= ep; t += 0.05) {
                trail.push({
                    x: startX + (endX - startX) * t,
                    y: startY + (endY - startY) * t
                });
            }
            this.drawTrail(bx, by, trail);
            this.drawBall(bx, by, 9);
        }
        
        if (progress > 0.82) {
            const textOpacity = Math.min((progress - 0.82) / 0.12, 1);
            this.ctx.save();
            this.ctx.globalAlpha = textOpacity * 0.7;
            this.ctx.font = 'bold 26px Montserrat, sans-serif';
            this.ctx.fillStyle = '#e040fb';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('BICYCLE KICK!', cx, cy - 85);
            this.ctx.restore();
        }
        
        this.drawSceneLabel('Bicycle Kick');
    }
    
    // ============ SCENE LABEL ============
    drawSceneLabel(text) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.font = '11px Open Sans, sans-serif';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(text, this.w - 30, this.h - 20);
        this.ctx.restore();
    }
}

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    new FootballActionsAnimation('footballActionsCanvas');
});
