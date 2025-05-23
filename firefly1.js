(function () {
  // Wait for full DOM readiness
  function onReady(callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  }

  onReady(() => {
    // === Canvas Setup ===
    const canvas = document.createElement("canvas");
    canvas.id = "fireflyCanvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "0"; // sits under UI but above bg
    canvas.style.pointerEvents = "none";
    canvas.style.opacity = "0.7";
    canvas.style.transition = "opacity 0.5s ease";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // Ensure html/body full height
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // === Firefly Config ===
    const fireflies = [];
    const maxFireflies = Math.min(180, Math.floor(width * height / 8500));
    const colors = [
      { r: 255, g: 255, b: 210 },  // warm white
      { r: 200, g: 255, b: 255 },  // soft blue
      { r: 240, g: 220, b: 255 },  // soft violet
      { r: 255, g: 245, b: 200 },  // creamy yellow
    ];

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function createFirefly() {
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: random(0, width),
        y: random(0, height),
        dx: random(-0.4, 0.4),
        dy: random(-0.4, 0.4),
        radius: random(1.0, 2.2),
        alpha: random(0.2, 0.8),
        pulseDir: 1,
        pulseSpeed: random(0.01, 0.03),
        maxAlpha: random(0.7, 0.9),
        minAlpha: random(0.2, 0.3),
        color,
        angleX: random(0, Math.PI * 2),
        angleY: random(0, Math.PI * 2),
        angleSpeed: random(0.01, 0.03),
      };
    }

    for (let i = 0; i < maxFireflies; i++) {
      fireflies.push(createFirefly());
    }

    // === Animation Loop ===
    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < fireflies.length; i++) {
        const f = fireflies[i];

        // Drift via sine wave
        f.x += f.dx + Math.sin(f.angleX) * 0.2;
        f.y += f.dy + Math.sin(f.angleY) * 0.2;
        f.angleX += f.angleSpeed;
        f.angleY += f.angleSpeed;

        // Pulsing glow
        f.alpha += f.pulseDir * f.pulseSpeed;
        if (f.alpha >= f.maxAlpha || f.alpha <= f.minAlpha) {
          f.pulseDir *= -1;
        }

        // Reset if off-screen
        if (f.x < -50 || f.x > width + 50 || f.y < -50 || f.y > height + 50) {
          fireflies[i] = createFirefly();
          const side = Math.floor(random(0, 4));
          switch (side) {
            case 0: f.y = -10; f.x = random(0, width); break;       // top
            case 1: f.x = width + 10; f.y = random(0, height); break; // right
            case 2: f.y = height + 10; f.x = random(0, width); break; // bottom
            case 3: f.x = -10; f.y = random(0, height); break;        // left
          }
        }

        // Draw glow
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius * 3);
        g.addColorStop(0, `rgba(${f.color.r},${f.color.g},${f.color.b},${f.alpha})`);
        g.addColorStop(1, `rgba(${f.color.r},${f.color.g},${f.color.b},0)`);
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius * 3, 0, 2 * Math.PI);
        ctx.fillStyle = g;
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(${f.color.r},${f.color.g},${f.color.b},${Math.min(1, f.alpha + 0.2)})`;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    draw();

    // === Responsive Resize ===
    window.addEventListener("resize", () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });

    // === Optional: Scroll-based fade ===
    window.addEventListener("scroll", () => {
      const scrollRatio = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      canvas.style.opacity = `${Math.max(0.25, 0.7 - scrollRatio * 0.5)}`;
    });
  });
})();
