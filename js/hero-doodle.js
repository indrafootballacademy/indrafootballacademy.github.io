/* ============================================================
   ProStrike Football Academy — Google Doodle-Style Hero Scene
   
   Proper simulation with SIDE-VIEW players:
   1. PENALTY: Ball on spot → run up → kick → ball travels → keeper dives → net
   2. HEADER: Cross floats in → player jumps → heads into net → keeper beaten
   3. FREE KICK: Ball placed → kick → curves over wall → into corner
   
   Players have thick chunky bodies, proper positions, ball moves
   realistically from player to goal.
   ============================================================ */

'use strict';

class HeroDoodleAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.time = 0;
        this.frame = 0;
        this.sceneIndex = 0;
        this.sceneTimer = 0;
        this.sceneDuration = 5; // seconds per scene
        
        this.colors = {
            teamA: '#EC4899',       // Pink jersey (attacker)
            teamADark: '#BE185D',
            teamB: '#F59E0B',       // Gold jersey (defender)
            teamBDark: '#92400E',
            keeper: '#22D3EE',      // Cyan jersey
            keeperDark: '#0891B2',
            skin: '#FBBF24',
            skinShadow: '#D97706',
            hair: '#1E1B4B',
            hairLight: '#4338CA',
            boots: '#8B5CF6',
            bootsAlt: '#EC4899',
            shorts: '#1E1B4B',
            gloves: '#FBBF24',
            ball: '#FFFFFF',
            grass: '#059669',
            grassDark: '#064E3B',
            post: '#FFFFFF',
            net: 'rgba(139, 92, 246, 0.15)',
            glow: '#22D3EE'
        };
        
        this.particles = [];
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        const dpr = window.devicePixelRatio || 1;
        const parent = this.canvas.parentElement;
        const rect = parent.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.ctx.scale(dpr, dpr);
        this.w = rect.width;
        this.h = rect.height;
    }
    
    animate() {
        this.time += 0.016;
        this.frame++;
        this.sceneTimer += 0.016;
        
        if (this.sceneTimer >= this.sceneDuration) {
            this.sceneTimer = 0;
            this.sceneIndex = (this.sceneIndex + 1) % 3;
        }
        
        this.ctx.clearRect(0, 0, this.w, this.h);
        
        // Scene progress (0 to 1)
        const p = this.sceneTimer / this.sceneDuration;
        
        // Fade in/out
        const fadeIn = Math.min(p * 5, 1);
        const fadeOut = Math.min((1 - p) * 5, 1);
        this.ctx.globalAlpha = Math.min(fadeIn, fadeOut);
        
        this.drawField();
        
        switch (this.sceneIndex) {
            case 0: this.scenePenalty(p); break;
            case 1: this.sceneHeader(p); break;
            case 2: this.sceneFreeKick(p); break;
        }
        
        this.drawParticles();
        this.ctx.globalAlpha = 1;
        
        requestAnimationFrame(() => this.animate());
    }
    
    // ============ FIELD ============
    drawField() {
        const gy = this.h * 0.78;
        
        // Sky/atmosphere
        const sky = this.ctx.createLinearGradient(0, 0, 0, gy);
        sky.addColorStop(0, 'rgba(15, 22, 41, 0.3)');
        sky.addColorStop(1, 'rgba(6, 78, 59, 0.2)');
        this.ctx.fillStyle = sky;
        this.ctx.fillRect(0, 0, this.w, gy);
        
        // Ground
        const ground = this.ctx.createLinearGradient(0, gy, 0, this.h);
        ground.addColorStop(0, this.colors.grass);
        ground.addColorStop(0.3, this.colors.grassDark);
        ground.addColorStop(1, 'rgba(6, 60, 40, 0.3)');
        this.ctx.fillStyle = ground;
        this.ctx.fillRect(0, gy, this.w, this.h - gy);
        
        // Field line
        this.ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([8, 8]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, gy + 2);
        this.ctx.lineTo(this.w, gy + 2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawGoal(cx, groundY, scale = 1) {
        const pw = 160 * scale;
        const ph = 100 * scale;
        const leftX = cx - pw / 2;
        const rightX = cx + pw / 2;
        const topY = groundY - ph;
        
        this.ctx.save();
        
        // Net
        this.ctx.strokeStyle = this.colors.net;
        this.ctx.lineWidth = 0.8;
        const sp = 10 * scale;
        for (let x = leftX; x <= rightX; x += sp) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, topY);
            this.ctx.lineTo(x + 5 * scale, groundY);
            this.ctx.stroke();
        }
        for (let y = topY; y <= groundY; y += sp) {
            this.ctx.beginPath();
            this.ctx.moveTo(leftX, y);
            this.ctx.lineTo(rightX, y);
            this.ctx.stroke();
        }
        
        // Posts
        this.ctx.shadowColor = this.colors.glow;
        this.ctx.shadowBlur = 8;
        this.ctx.strokeStyle = this.colors.post;
        this.ctx.lineWidth = 5 * scale;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(leftX, groundY);
        this.ctx.lineTo(leftX, topY);
        this.ctx.lineTo(rightX, topY);
        this.ctx.lineTo(rightX, groundY);
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
        
        this.ctx.restore();
    }
    
    // ============ BALL ============
    drawBall(x, y, r = 14, glowing = true) {
        this.ctx.save();
        this.ctx.translate(x, y);
        
        if (glowing) {
            // Glow
            const g = this.ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 2.5);
            g.addColorStop(0, 'rgba(34, 211, 238, 0.3)');
            g.addColorStop(1, 'transparent');
            this.ctx.fillStyle = g;
            this.ctx.fillRect(-r * 3, -r * 3, r * 6, r * 6);
        }
        
        // Ball
        this.ctx.rotate(this.time * 3);
        const bg = this.ctx.createRadialGradient(-r * 0.2, -r * 0.2, 1, 0, 0, r);
        bg.addColorStop(0, '#FFFFFF');
        bg.addColorStop(0.5, '#E0F2FE');
        bg.addColorStop(1, '#94A3B8');
        
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fillStyle = bg;
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Pentagon
        this.ctx.beginPath();
        const pr = r * 0.38;
        for (let i = 0; i < 5; i++) {
            const a = (i * 72 - 90) * Math.PI / 180;
            i === 0 ? this.ctx.moveTo(Math.cos(a) * pr, Math.sin(a) * pr) : this.ctx.lineTo(Math.cos(a) * pr, Math.sin(a) * pr);
        }
        this.ctx.closePath();
        this.ctx.fillStyle = 'rgba(30, 30, 60, 0.5)';
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    // ============ PLAYER BODY (Chunky, thick proportions) ============
    drawPlayer(x, y, opts) {
        const {
            jersey = this.colors.teamA,
            shortColor = this.colors.shorts,
            skinColor = this.colors.skin,
            hairColor = this.colors.hair,
            bootColor = this.colors.boots,
            scale = 1,
            flip = false,
            opacity = 1,
            // Body angles
            bodyAngle = 0,
            leftArmAngle = 0.4,
            rightArmAngle = -0.4,
            leftLegAngle = 0.1,
            leftKneeAngle = 0,
            rightLegAngle = -0.1,
            rightKneeAngle = 0,
            headOffsetX = 0,
            headOffsetY = 0,
            isGloves = false
        } = opts;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.scale(scale * (flip ? -1 : 1), scale);
        this.ctx.rotate(bodyAngle);
        this.ctx.globalAlpha *= opacity;
        
        const headR = 12;
        const torsoH = 30;
        const upperLeg = 22;
        const lowerLeg = 22;
        const upperArm = 18;
        
        // ---- LEGS ----
        const lHipX = -6, lHipY = torsoH * 0.4;
        const lKneeX = lHipX + Math.sin(leftLegAngle) * upperLeg;
        const lKneeY = lHipY + Math.cos(leftLegAngle) * upperLeg;
        const lFootX = lKneeX + Math.sin(leftLegAngle + leftKneeAngle) * lowerLeg;
        const lFootY = lKneeY + Math.cos(leftLegAngle + leftKneeAngle) * lowerLeg;
        
        const rHipX = 6, rHipY = torsoH * 0.4;
        const rKneeX = rHipX + Math.sin(rightLegAngle) * upperLeg;
        const rKneeY = rHipY + Math.cos(rightLegAngle) * upperLeg;
        const rFootX = rKneeX + Math.sin(rightLegAngle + rightKneeAngle) * lowerLeg;
        const rFootY = rKneeY + Math.cos(rightLegAngle + rightKneeAngle) * lowerLeg;
        
        // Draw legs
        this.limb(lHipX, lHipY, lKneeX, lKneeY, 9, shortColor);
        this.limb(lKneeX, lKneeY, lFootX, lFootY, 7, skinColor);
        this.circle(lFootX, lFootY, 6, bootColor);
        
        this.limb(rHipX, rHipY, rKneeX, rKneeY, 9, shortColor);
        this.limb(rKneeX, rKneeY, rFootX, rFootY, 7, skinColor);
        this.circle(rFootX, rFootY, 6, bootColor);
        
        // ---- TORSO ----
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 14, torsoH * 0.55, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = jersey;
        this.ctx.fill();
        
        // Number on jersey
        this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
        this.ctx.font = 'bold 10px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('9', 0, 5);
        
        // ---- ARMS ----
        const lShX = -12, lShY = -torsoH * 0.3;
        const lElbX = lShX + Math.sin(leftArmAngle) * upperArm;
        const lElbY = lShY + Math.cos(leftArmAngle) * upperArm;
        
        const rShX = 12, rShY = -torsoH * 0.3;
        const rElbX = rShX + Math.sin(rightArmAngle) * upperArm;
        const rElbY = rShY + Math.cos(rightArmAngle) * upperArm;
        
        this.limb(lShX, lShY, lElbX, lElbY, 5, skinColor);
        this.limb(rShX, rShY, rElbX, rElbY, 5, skinColor);
        
        if (isGloves) {
            this.circle(lElbX, lElbY, 7, this.colors.gloves);
            this.circle(rElbX, rElbY, 7, this.colors.gloves);
        }
        
        // ---- HEAD ----
        const headX = headOffsetX;
        const headY = -torsoH * 0.55 + headOffsetY;
        this.limb(0, -torsoH * 0.4, headX, headY + headR * 0.5, 5, skinColor);
        this.circle(headX, headY, headR, skinColor);
        
        // Hair
        this.ctx.beginPath();
        this.ctx.arc(headX, headY - 2, headR - 1, Math.PI * 1.15, Math.PI * -0.15);
        this.ctx.fillStyle = hairColor;
        this.ctx.fill();
        
        // Eyes
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(headX - 4, headY - 2, 2.5, 2.5);
        this.ctx.fillRect(headX + 2, headY - 2, 2.5, 2.5);
        
        this.ctx.restore();
    }
    
    limb(x1, y1, x2, y2, w, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = w;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
    }
    
    circle(x, y, r, color) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
    
    // ============ EASING ============
    easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    easeIn(t) { return t * t * t; }
    easeInOut(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2; }
    bezier(t, p0, p1, p2) { const m=1-t; return m*m*p0 + 2*m*t*p1 + t*t*p2; }
    lerp(a, b, t) { return a + (b - a) * t; }
    
    // ============ SCENE 1: PENALTY ============
    scenePenalty(p) {
        const gy = this.h * 0.78;
        const goalCx = this.w * 0.72;
        this.drawGoal(goalCx, gy, 0.85);
        
        const penaltySpotX = this.w * 0.32;
        const penaltySpotY = gy - 5;
        
        // STRIKER
        let strikerX;
        let kickLeg = 0, standLeg = 0, bodyLean = 0, armL = 0.3, armR = -0.3;
        let kickKnee = 0;
        
        if (p < 0.3) {
            const rp = p / 0.3;
            strikerX = penaltySpotX - 80 + rp * 65;
            const cycle = Math.sin(rp * Math.PI * 4);
            kickLeg = cycle * 0.5;
            standLeg = -cycle * 0.5;
            kickKnee = Math.max(0, -cycle) * 0.5;
            armL = cycle * 0.3;
            armR = -cycle * 0.3;
            bodyLean = 0.05;
        } else if (p < 0.42) {
            const kp = (p - 0.3) / 0.12;
            strikerX = penaltySpotX - 15;
            kickLeg = -0.6 + this.easeOut(kp) * 2.2;
            kickKnee = kp < 0.5 ? -0.8 : -0.3;
            standLeg = 0.05;
            bodyLean = -0.1 + kp * 0.15;
            armL = -0.6;
            armR = 0.6;
        } else {
            strikerX = penaltySpotX - 12;
            kickLeg = 1.4;
            kickKnee = -0.2;
            standLeg = 0.05;
            bodyLean = 0.1;
            armL = 0.2;
            armR = -0.3;
        }
        
        this.drawPlayer(strikerX, gy - 50, {
            jersey: this.colors.teamA, shortColor: this.colors.shorts,
            bootColor: this.colors.boots, scale: 1.05, bodyAngle: bodyLean,
            leftLegAngle: standLeg, leftKneeAngle: 0.1,
            rightLegAngle: kickLeg, rightKneeAngle: kickKnee,
            leftArmAngle: armL, rightArmAngle: armR
        });
        
        // BALL
        let ballX, ballY;
        if (p < 0.35) { ballX = penaltySpotX; ballY = penaltySpotY; }
        else if (p < 0.72) {
            const bp = (p - 0.35) / 0.37;
            const ep = this.easeOut(bp);
            ballX = penaltySpotX + ep * (goalCx - 55 - penaltySpotX);
            ballY = penaltySpotY + ep * (-15) - Math.sin(ep * Math.PI) * 35;
        } else { ballX = goalCx - 55; ballY = gy - 20; }
        this.drawBall(ballX, ballY, 11, p >= 0.35);
        
        // Speed lines
        if (p > 0.35 && p < 0.72) {
            this.ctx.save(); this.ctx.globalAlpha *= 0.4;
            for (let i = 0; i < 3; i++) {
                this.limb(ballX - 18 - i*10, ballY + (i-1)*7, ballX - 32 - i*10, ballY + (i-1)*7, 2, this.colors.glow);
            }
            this.ctx.restore();
        }
        
        // GOALKEEPER
        let gkx = goalCx, gky = gy - 50;
        let gkOpts = {
            jersey: this.colors.keeper, shortColor: this.colors.keeperDark,
            bootColor: this.colors.bootsAlt, hairColor: this.colors.hairLight,
            scale: 0.95, isGloves: true,
            leftArmAngle: -0.3, rightArmAngle: 0.3,
            leftLegAngle: 0.05, rightLegAngle: -0.05,
            leftKneeAngle: 0.1, rightKneeAngle: 0.1, bodyAngle: 0
        };
        
        if (p > 0.38) {
            const dp = Math.min((p - 0.38) / 0.25, 1);
            const de = this.easeOut(dp);
            gkx = goalCx + de * 50;
            gky = gy - 50 + de * 12;
            gkOpts.bodyAngle = de * 1.2;
            gkOpts.leftArmAngle = -1.3 - de * 0.4;
            gkOpts.rightArmAngle = -1.0 - de * 0.3;
            gkOpts.leftLegAngle = -0.3 * de;
            gkOpts.rightLegAngle = 0.5 * de;
        } else if (p > 0.15) {
            gky += Math.sin(p * 25) * 2;
        }
        this.drawPlayer(gkx, gky, gkOpts);
        
        // Net bulge
        if (p > 0.7) { this.burst(goalCx - 55, gy - 20, 2); }
        
        // Penalty spot
        if (p < 0.38) { this.circle(penaltySpotX, penaltySpotY + 3, 3, 'rgba(255,255,255,0.4)'); }
    }
    
    // ============ SCENE 2: HEADER ============
    sceneHeader(p) {
        const gy = this.h * 0.78;
        const goalCx = this.w * 0.72;
        this.drawGoal(goalCx, gy, 0.85);
        
        // Crosser (far left)
        this.drawPlayer(this.w * 0.06, gy - 48, {
            jersey: this.colors.teamA, scale: 0.7,
            rightLegAngle: 0.8, rightKneeAngle: -0.3,
            leftArmAngle: -0.5, rightArmAngle: 0.4, bodyAngle: 0.1
        });
        
        // Header player
        const hx = this.w * 0.38;
        let hy = gy - 48;
        let hOpts = {
            jersey: this.colors.teamA, bootColor: this.colors.boots, scale: 1.05,
            leftLegAngle: 0.1, rightLegAngle: -0.1, leftArmAngle: 0.3, rightArmAngle: -0.3,
            leftKneeAngle: 0, rightKneeAngle: 0, bodyAngle: 0, headOffsetX: 0, headOffsetY: 0
        };
        
        if (p > 0.2 && p < 0.7) {
            const jp = (p < 0.45) ? (p - 0.2) / 0.25 : 1 - (p - 0.45) / 0.25;
            const jumpH = Math.sin(Math.min(jp, 1) * Math.PI) * 55;
            hy = gy - 48 - jumpH;
            hOpts.leftLegAngle = -0.3;
            hOpts.rightLegAngle = 0.3;
            hOpts.leftKneeAngle = 0.7;
            hOpts.rightKneeAngle = 0.5;
            hOpts.leftArmAngle = -0.7;
            hOpts.rightArmAngle = 0.6;
            if (p > 0.3 && p < 0.5) {
                hOpts.headOffsetX = 4;
                hOpts.headOffsetY = 3;
                hOpts.bodyAngle = 0.15;
            }
        }
        this.drawPlayer(hx, hy, hOpts);
        
        // Defender (beaten)
        const defJump = (p > 0.22 && p < 0.6) ? Math.sin((p-0.22)/0.38 * Math.PI) * 28 : 0;
        this.drawPlayer(hx + 35, gy - 46 - defJump, {
            jersey: this.colors.teamB, shortColor: this.colors.teamBDark,
            bootColor: '#333', hairColor: this.colors.skinShadow,
            scale: 0.9, flip: true,
            leftLegAngle: 0.2, rightLegAngle: -0.2,
            leftKneeAngle: 0.4, rightKneeAngle: 0.3,
            leftArmAngle: -0.5, rightArmAngle: 0.4
        });
        
        // Ball
        let bx, by;
        if (p < 0.3) {
            const cp = p / 0.3;
            bx = this.w * 0.08 + this.easeOut(cp) * (this.w * 0.32);
            by = gy - 105 - Math.sin(cp * Math.PI) * 25;
        } else if (p < 0.55) {
            const hp = (p - 0.3) / 0.25;
            bx = hx + 12 + this.easeIn(hp) * (goalCx - 25 - hx);
            by = gy - 90 + this.easeIn(hp) * 55;
        } else {
            bx = goalCx - 25;
            by = gy - 35;
        }
        this.drawBall(bx, by, 10, p > 0.25);
        
        // Keeper
        let kx = goalCx - 5, ky = gy - 48;
        let kOpts = {
            jersey: this.colors.keeper, shortColor: this.colors.keeperDark,
            bootColor: this.colors.bootsAlt, hairColor: this.colors.hairLight,
            scale: 0.9, isGloves: true,
            leftArmAngle: -0.3, rightArmAngle: 0.3,
            leftLegAngle: 0.05, rightLegAngle: -0.05,
            leftKneeAngle: 0.1, rightKneeAngle: 0.1, bodyAngle: 0
        };
        if (p > 0.4) {
            const dp = Math.min((p - 0.4) / 0.2, 1);
            const de = this.easeOut(dp);
            ky -= de * 18;
            kOpts.leftArmAngle = -1.4;
            kOpts.rightArmAngle = -1.1;
            kOpts.bodyAngle = -de * 0.4;
        }
        this.drawPlayer(kx, ky, kOpts);
        
        if (p > 0.55) this.burst(goalCx - 25, gy - 35, 2);
    }
    
    // ============ SCENE 3: FREE KICK ============
    sceneFreeKick(p) {
        const gy = this.h * 0.78;
        const goalCx = this.w * 0.73;
        this.drawGoal(goalCx, gy, 0.8);
        
        // Wall (3 defenders)
        const wallX = this.w * 0.48;
        for (let i = 0; i < 3; i++) {
            this.drawPlayer(wallX + i * 18, gy - 48, {
                jersey: this.colors.teamB, shortColor: this.colors.teamBDark,
                bootColor: '#333', hairColor: i === 1 ? this.colors.skinShadow : this.colors.hair,
                scale: 0.7, leftArmAngle: 0.1, rightArmAngle: -0.1
            });
        }
        
        // Kicker
        const kickerX = this.w * 0.14;
        let kOpts = {
            jersey: this.colors.teamA, bootColor: this.colors.boots, scale: 1.0,
            leftLegAngle: 0.05, rightLegAngle: 0, leftKneeAngle: 0, rightKneeAngle: 0,
            leftArmAngle: 0.3, rightArmAngle: -0.3, bodyAngle: 0
        };
        if (p > 0.15 && p < 0.35) {
            const kp = (p - 0.15) / 0.2;
            kOpts.rightLegAngle = -0.6 + this.easeOut(kp) * 2.2;
            kOpts.rightKneeAngle = kp > 0.6 ? -0.3 : -0.9;
            kOpts.bodyAngle = -0.08 + kp * 0.15;
            kOpts.leftArmAngle = -0.5;
            kOpts.rightArmAngle = 0.6;
        } else if (p >= 0.35) {
            kOpts.rightLegAngle = 1.4;
            kOpts.rightKneeAngle = -0.2;
            kOpts.bodyAngle = 0.08;
        }
        this.drawPlayer(kickerX, gy - 48, kOpts);
        
        // Ball
        let bx, by;
        const ballStart = kickerX + 28;
        if (p < 0.22) { bx = ballStart; by = gy - 5; }
        else if (p < 0.7) {
            const bp = (p - 0.22) / 0.48;
            const ep = this.easeInOut(bp);
            bx = this.bezier(ep, ballStart, wallX + 10, goalCx + 35);
            by = this.bezier(ep, gy - 5, gy - 155, gy - 78);
        } else { bx = goalCx + 35; by = gy - 78; }
        this.drawBall(bx, by, 10, p > 0.22);
        
        // Ball trail
        if (p > 0.22 && p < 0.7) {
            this.ctx.save(); this.ctx.globalAlpha *= 0.25;
            const bp = (p - 0.22) / 0.48;
            for (let t = Math.max(0, bp - 0.12); t < bp; t += 0.015) {
                const ep = this.easeInOut(t);
                const tx = this.bezier(ep, ballStart, wallX + 10, goalCx + 35);
                const ty = this.bezier(ep, gy - 5, gy - 155, gy - 78);
                this.circle(tx, ty, 2.5, this.colors.glow);
            }
            this.ctx.restore();
        }
        
        // Keeper diving to corner
        let gkx = goalCx + 5, gky = gy - 48;
        let gkPose = {
            jersey: this.colors.keeper, shortColor: this.colors.keeperDark,
            bootColor: this.colors.bootsAlt, hairColor: this.colors.hairLight,
            scale: 0.9, isGloves: true,
            leftArmAngle: -0.3, rightArmAngle: 0.3,
            leftLegAngle: 0.05, rightLegAngle: -0.05,
            leftKneeAngle: 0.1, rightKneeAngle: 0.1, bodyAngle: 0
        };
        if (p > 0.5) {
            const dp = Math.min((p - 0.5) / 0.2, 1);
            const de = this.easeOut(dp);
            gkx += de * 25;
            gky -= de * 30;
            gkPose.bodyAngle = de * 1.0;
            gkPose.leftArmAngle = -1.5;
            gkPose.rightArmAngle = -1.3;
            gkPose.leftLegAngle = -de * 0.5;
            gkPose.rightLegAngle = de * 0.4;
        }
        this.drawPlayer(gkx, gky, gkPose);
        
        if (p > 0.67) this.burst(goalCx + 35, gy - 78, 2);
    }
    
    // ============ PARTICLES ============
    burst(x, y, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y, vx: (Math.random()-0.5)*4, vy: -Math.random()*3-1,
                size: Math.random()*4+2, life: 1,
                color: ['#22d3ee','#EC4899','#FBBF24','#fff'][~~(Math.random()*4)]
            });
        }
    }
    
    drawParticles() {
        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.05;
            p.life -= 0.02; p.size *= 0.97;
            this.ctx.globalAlpha = p.life * 0.7;
            this.circle(p.x, p.y, p.size, p.color);
            this.ctx.globalAlpha = 1;
        });
        if (this.particles.length > 50) this.particles = this.particles.slice(-35);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const c = document.getElementById('heroDoodleCanvas');
    if (c) new HeroDoodleAnimation('heroDoodleCanvas');
});
