(function () {
  const cv = document.getElementById('game');
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const scoreEl = document.getElementById('score');
  const livesEl = document.getElementById('lives');
  const msg = document.getElementById('msg');
  const keys = { left: false, right: false };
  let player, bullets, bombs, aliens, dir, score, lives, running, over, level, last, cooldown;

  function setup(newGame) {
    if (newGame) { score = 0; lives = 3; level = 1; }
    player = { x: W / 2 - 20, y: H - 40, w: 40, h: 18 };
    bullets = []; bombs = []; aliens = []; dir = 1; cooldown = 0;
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 8; c++)
        aliens.push({ x: 50 + c * 48, y: 50 + r * 38, w: 30, h: 20, r });
    updateHud();
  }
  function updateHud() {
    scoreEl.textContent = 'Score: ' + score;
    livesEl.textContent = 'Lives: ' + lives;
  }
  function start() {
    setup(true); over = false; running = true; msg.textContent = '';
    last = performance.now();
  }
  function fire() {
    if (!running) { if (over || score === 0) start(); return; }
    if (cooldown <= 0) {
      bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 12 });
      cooldown = 0.35;
    }
  }
  function end(text) { running = false; over = true; msg.textContent = text + ' Press Space to restart.'; }

  function update(dt) {
    cooldown -= dt;
    player.x += ((keys.right ? 1 : 0) - (keys.left ? 1 : 0)) * 280 * dt;
    player.x = Math.max(0, Math.min(W - player.w, player.x));
    bullets.forEach(b => b.y -= 450 * dt);
    bullets = bullets.filter(b => b.y > -20);
    bombs.forEach(b => b.y += (180 + level * 15) * dt);
    bombs = bombs.filter(b => b.y < H);

    const speed = (30 + (40 - aliens.length) * 2.5 + level * 10) * dt * dir;
    let hitEdge = false;
    aliens.forEach(a => {
      a.x += speed;
      if (a.x < 8 || a.x + a.w > W - 8) hitEdge = true;
    });
    if (hitEdge) {
      dir = -dir;
      aliens.forEach(a => { a.x += dir * 4; a.y += 16; });
    }
    if (aliens.length && Math.random() < dt * (1 + level * 0.5)) {
      const a = aliens[Math.floor(Math.random() * aliens.length)];
      bombs.push({ x: a.x + a.w / 2 - 2, y: a.y + a.h, w: 4, h: 12 });
    }
    bullets.forEach(b => {
      aliens.forEach(a => {
        if (!b.dead && hit(b, a)) { b.dead = a.dead = true; score += 10 * (5 - a.r); }
      });
    });
    bullets = bullets.filter(b => !b.dead);
    aliens = aliens.filter(a => !a.dead);
    bombs.forEach(b => {
      if (hit(b, player)) { b.dead = true; lives--; if (lives <= 0) end('Game over!'); }
    });
    bombs = bombs.filter(b => !b.dead);
    if (aliens.some(a => a.y + a.h >= player.y)) { lives = 0; end('Invaded!'); }
    if (!aliens.length && running) { level++; const s = score, l = lives; setup(false); score = s; lives = l; }
    updateHud();
  }
  function hit(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }
  const colors = ['#f55', '#fa5', '#ff5', '#5f5', '#5af'];
  function draw() {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#6f6';
    ctx.fillRect(player.x, player.y + 8, player.w, 10);
    ctx.fillRect(player.x + player.w / 2 - 4, player.y, 8, 10);
    aliens.forEach(a => {
      ctx.fillStyle = colors[a.r];
      ctx.fillRect(a.x + 4, a.y, a.w - 8, a.h - 6);
      ctx.fillRect(a.x, a.y + 6, a.w, 8);
      ctx.fillRect(a.x + 4, a.y + 14, 5, 6);
      ctx.fillRect(a.x + a.w - 9, a.y + 14, 5, 6);
      ctx.fillStyle = '#000';
      ctx.fillRect(a.x + 9, a.y + 5, 4, 4);
      ctx.fillRect(a.x + a.w - 13, a.y + 5, 4, 4);
    });
    ctx.fillStyle = '#fff';
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));
    ctx.fillStyle = '#f66';
    bombs.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));
  }
  function loop(t) {
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    if (running) update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
    else if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
    else if (e.key === ' ') { e.preventDefault(); fire(); }
  });
  window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    else if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
  });
  function hold(id, k) {
    const el = document.getElementById(id);
    const on = e => { e.preventDefault(); keys[k] = true; };
    const off = e => { e.preventDefault(); keys[k] = false; };
    el.addEventListener('pointerdown', on);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(n => el.addEventListener(n, off));
  }
  hold('left', 'left'); hold('right', 'right');
  document.getElementById('fire').addEventListener('pointerdown', e => { e.preventDefault(); fire(); });
  document.getElementById('start').addEventListener('click', start);

  setup(true); running = false; over = false; last = performance.now();
  requestAnimationFrame(loop);
})();
