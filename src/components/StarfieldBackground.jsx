// StarfieldBackground.jsx - Cinematic Parallax space background with Hyperdrive Warp & Lens Flares
import React, { useEffect, useRef } from 'react';

const StarfieldBackground = ({ enabled = true }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const warpSpeed = useRef(1.0); // 1 = normal, up to 25 = hyperdrive warp

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize stars
    const starCount = 220;
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      // Angle and radius from center for hyperdrive stretch
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * Math.max(width, height) * 0.5;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        originAngle: angle,
        originDist: dist,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        twinkleSpeed: 0.005 + Math.random() * 0.01,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        depth: 0.04 + Math.random() * 0.36,
        color: Math.random() > 0.82 
          ? (Math.random() > 0.5 ? '#7df4ff' : '#ecb2ff') 
          : '#ffffff'
      });
    }

    // Drifting Asteroids
    const asteroids = [];
    for (let i = 0; i < 8; i++) {
      asteroids.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0.05 + Math.random() * 0.15,
        vy: 0.02 + Math.random() * 0.08,
        size: Math.random() * 4 + 2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: 0.005 + Math.random() * 0.01
      });
    }

    // Shooting stars
    const shootingStars = [];
    const spawnShootingStar = () => {
      if (!enabled || Math.random() > 0.12 || shootingStars.length > 2) return;
      shootingStars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.35),
        length: 60 + Math.random() * 80,
        speed: 9 + Math.random() * 12,
        angle: Math.PI / 6 + Math.random() * (Math.PI / 8),
        opacity: 1.0,
        fadeSpeed: 0.015 + Math.random() * 0.01
      });
    };

    // Orbiting Satellites
    const satellites = [];
    const spawnSatellite = () => {
      if (!enabled || Math.random() > 0.006 || satellites.length > 1) return;
      satellites.push({
        x: -20,
        y: 40 + Math.random() * (height * 0.45),
        speed: 0.7 + Math.random() * 0.6,
        size: 2,
        ledFlash: 0,
        ledSpeed: 0.1
      });
    };

    // Nebula clouds
    const nebulae = [
      { x: width * 0.15, y: height * 0.25, r: Math.min(width, height) * 0.38, color: 'rgba(0, 240, 255, 0.038)', dx: 0.05, dy: 0.03 },
      { x: width * 0.85, y: height * 0.65, r: Math.min(width, height) * 0.42, color: 'rgba(207, 92, 255, 0.028)', dx: -0.03, dy: 0.05 }
    ];

    let auroraTime = 0;

    // Handle mouse movement for parallax & lens flare centers
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.14;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.14;
      mouseRef.current.mouseX = e.clientX;
      mouseRef.current.mouseY = e.clientY;
    };

    // Handle transition hyperdrive warp start
    const handleTransitionStart = () => {
      warpSpeed.current = 24.0; // Boost warp!
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('transition-start', handleTransitionStart);
    window.addEventListener('resize', handleResize);

    // Main 60FPS loop
    const draw = () => {
      ctx.fillStyle = '#051424';
      ctx.fillRect(0, 0, width, height);

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Decay warp speed back to baseline 1.0
      if (warpSpeed.current > 1.0) {
        warpSpeed.current += (1.0 - warpSpeed.current) * 0.06;
      }

      if (enabled) {
        // 1. Auroras
        auroraTime += 0.005;
        drawAurora(ctx, width, height, auroraTime);

        // 2. Nebulae
        nebulae.forEach(n => {
          n.x += n.dx;
          n.y += n.dy;
          if (n.x < -n.r || n.x > width + n.r) n.dx *= -1;
          if (n.y < -n.r || n.y > height + n.r) n.dy *= -1;

          const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
          grad.addColorStop(0, n.color);
          grad.addColorStop(1, 'rgba(5, 20, 36, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // 3. Draw Stars with Parallax + Hyperdrive Stretch
        stars.forEach(s => {
          s.alpha += s.twinkleSpeed * s.twinkleDir;
          if (s.alpha >= 1) {
            s.alpha = 1;
            s.twinkleDir = -1;
          } else if (s.alpha <= 0.15) {
            s.alpha = 0.15;
            s.twinkleDir = 1;
          }

          // Move stars outwards if warp is active
          if (warpSpeed.current > 1.5) {
            s.originDist += warpSpeed.current * 0.45;
            if (s.originDist > Math.max(width, height)) {
              s.originDist = Math.random() * 50;
              s.originAngle = Math.random() * Math.PI * 2;
            }
            s.x = width / 2 + Math.cos(s.originAngle) * s.originDist;
            s.y = height / 2 + Math.sin(s.originAngle) * s.originDist;
          }

          // Apply mouse parallax
          const posX = s.x - mouse.x * s.depth;
          const posY = s.y - mouse.y * s.depth;

          // Wrapping
          let wrapX = ((posX % width) + width) % width;
          let wrapY = ((posY % height) + height) % height;

          ctx.fillStyle = s.color;
          ctx.globalAlpha = s.alpha;

          if (warpSpeed.current > 1.8) {
            // Draw warp drive streaks
            const startX = wrapX;
            const startY = wrapY;
            const endX = wrapX + Math.cos(s.originAngle) * warpSpeed.current * 1.5;
            const endY = wrapY + Math.sin(s.originAngle) * warpSpeed.current * 1.5;

            ctx.strokeStyle = s.color;
            ctx.lineWidth = s.size * 0.8;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
          } else {
            // Standard dot star
            ctx.beginPath();
            ctx.arc(wrapX, wrapY, s.size, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.globalAlpha = 1.0;

        // 4. Asteroids
        asteroids.forEach(ast => {
          ast.x += ast.vx;
          ast.y += ast.vy;
          ast.rot += ast.rotSpeed;

          if (ast.x > width + 20) ast.x = -20;
          if (ast.y > height + 20) ast.y = -20;

          ctx.fillStyle = 'rgba(144, 164, 174, 0.28)';
          ctx.save();
          ctx.translate(ast.x, ast.y);
          ctx.rotate(ast.rot);
          ctx.beginPath();
          // Draw rough rocky hexagon shape
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const r = ast.size * (0.85 + Math.sin(i * 1.5 + ast.rot) * 0.15);
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        });

        // 5. Shooting Stars
        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const ss = shootingStars[i];
          const endX = ss.x + Math.cos(ss.angle) * ss.length;
          const endY = ss.y + Math.sin(ss.angle) * ss.length;

          const grad = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
          grad.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
          grad.addColorStop(0.2, `rgba(125, 244, 255, ${ss.opacity * 0.8})`);
          grad.addColorStop(1, 'rgba(5,20,36,0)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(ss.x, ss.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          ss.x += Math.cos(ss.angle) * ss.speed;
          ss.y += Math.sin(ss.angle) * ss.speed;
          ss.opacity -= ss.fadeSpeed;

          if (ss.opacity <= 0 || ss.x > width || ss.y > height) {
            shootingStars.splice(i, 1);
          }
        }
        spawnShootingStar();

        // 6. Satellites
        for (let i = satellites.length - 1; i >= 0; i--) {
          const sat = satellites[i];
          ctx.fillStyle = '#b9cacb';
          ctx.fillRect(sat.x, sat.y, sat.size, sat.size);
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sat.x - 3, sat.y + sat.size / 2);
          ctx.lineTo(sat.x + sat.size + 3, sat.y + sat.size / 2);
          ctx.stroke();

          sat.ledFlash = (sat.ledFlash + sat.ledSpeed) % (Math.PI * 2);
          if (Math.sin(sat.ledFlash) > 0.6) {
            ctx.fillStyle = '#2ecc71';
            ctx.beginPath();
            ctx.arc(sat.x + sat.size / 2, sat.y - 2, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }

          sat.x += sat.speed;
          if (sat.x > width + 10) satellites.splice(i, 1);
        }
        spawnSatellite();

        // 7. Interactive Cursor Lens Flare (glowing light leakage)
        if (mouse.mouseX && mouse.mouseY) {
          drawLensFlare(ctx, mouse.mouseX, mouse.mouseY);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('transition-start', handleTransitionStart);
      window.removeEventListener('resize', handleResize);
    };
  }, [enabled]);

  // Auroras
  const drawAurora = (ctx, w, h, time) => {
    ctx.save();
    const points = [];
    const segments = 24;
    const step = w / segments;

    for (let i = 0; i <= segments; i++) {
      const x = i * step;
      const y = h * 0.05 + 
                Math.sin(i * 0.25 + time * 1.5) * 14 + 
                Math.cos(i * 0.15 - time) * 8;
      points.push({ x, y });
    }

    for (let band = 0; band < 3; band++) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y + band * 8);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y + band * 8);
      }
      
      const grad = ctx.createLinearGradient(0, 0, 0, h * 0.28);
      grad.addColorStop(0, `rgba(46, 204, 113, ${0.075 - band * 0.02})`);
      grad.addColorStop(0.5, `rgba(0, 240, 255, ${0.035 - band * 0.01})`);
      grad.addColorStop(1, 'rgba(5, 20, 36, 0)');
      
      ctx.strokeStyle = grad;
      ctx.lineWidth = 36 - band * 8;
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    ctx.restore();
  };

  // Lens flare drawer
  const drawLensFlare = (ctx, mx, my) => {
    ctx.save();
    
    // Core flare glow
    const coreR = 15;
    const coreGrad = ctx.createRadialGradient(mx, my, 0, mx, my, coreR);
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    coreGrad.addColorStop(0.3, 'rgba(0, 240, 255, 0.15)');
    coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(mx, my, coreR, 0, Math.PI * 2);
    ctx.fill();

    // Multi-element halos (ghosting rings radiating from opposite vectors)
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    // Vector from mouse to screen center
    const dx = cx - mx;
    const dy = cy - my;

    // Draw 3 ghost rings along vector
    for (let i = 1; i <= 3; i++) {
      const scale = i * 0.35;
      const gx = mx + dx * scale;
      const gy = my + dy * scale;

      ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 - i * 0.02})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(gx, gy, 8 * i, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -5,
        pointerEvents: 'none'
      }}
    />
  );
};

export default StarfieldBackground;
