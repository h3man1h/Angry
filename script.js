// --- AUDIO & BALLOON SETUP ---
const audio = document.getElementById('audio');
const balloonContainer = document.getElementById('balloonsContainer');

// --- SPAWN & SPEED CONTROLS ---
let spawnInterval = 2000;        // Milliseconds between new balloons
let balloonIntervalId = null;    // For clearing/resetting intervals
let currentFloatDuration = 8.0;  // Default float time (in seconds)

// --- AUTOPLAY AUDIO & BALLOONS ON LOAD ---
window.addEventListener("load", () => {
  audio.currentTime = 0;
  audio.volume = 1.0;
  audio.muted = false;
  audio.play().catch(err => console.log("Autoplay blocked:", err));

  if (balloonIntervalId) clearInterval(balloonIntervalId);
  balloonIntervalId = setInterval(createBalloon, spawnInterval);
});

// --- BALLOON CREATION ---
function createBalloon() {
  const balloonWrapper = document.createElement('div');
  balloonWrapper.className = 'balloon';
  balloonWrapper.style.animationDuration = currentFloatDuration + 's';

  const balloonShape = document.createElement('div');
  balloonShape.className = 'balloon-shape';

  const balloonString = document.createElement('div');
  balloonString.className = 'balloon-string';

  const randomHue = Math.floor(Math.random() * 360);
  const randomSaturation = 80 + Math.floor(Math.random() * 20);
  const randomLightness = 40 + Math.floor(Math.random() * 20);
  const balloonColor = `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`;

  balloonWrapper.dataset.color = balloonColor;
  balloonShape.style.background =
    `radial-gradient(circle at 30% 30%, #fff, ${balloonColor})`;
  balloonWrapper.style.left = Math.floor(Math.random() * 90) + '%';

  balloonWrapper.appendChild(balloonShape);
  balloonWrapper.appendChild(balloonString);
  balloonContainer.appendChild(balloonWrapper);

  // Set auto-pop to occur between 1s and 3s.
  const popTime = Math.random() * 2000 + 1000;
  const autoPopTimer = setTimeout(() => popBalloon(balloonWrapper), popTime);

  balloonShape.addEventListener('click', () => {
    clearTimeout(autoPopTimer);
    popBalloon(balloonWrapper);
  });
}

// --- BALLOON POP ---
function popBalloon(balloonWrapper) {
  if (!balloonWrapper.parentNode) return;
  const rect = balloonWrapper.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  balloonWrapper.remove();

  const splash = document.createElement('div');
  splash.className = 'splash';
  splash.style.left = x + 'px';
  splash.style.top = y + 'px';

  const color = balloonWrapper.dataset.color || '#00f';
  splash.style.background = `radial-gradient(circle, ${color} 20%, transparent 70%)`;
  const randomAngle = Math.floor(Math.random() * 360);
  splash.style.transform = `translate(-50%, -50%) rotate(${randomAngle}deg)`;

  balloonContainer.appendChild(splash);
  splash.addEventListener('animationend', () => splash.remove());

  // Trigger a confetti effect at the pop location.
  triggerConfetti(x, y);
}

// --- CONFETTI EFFECT ---
function triggerConfetti(x, y) {
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    const hue = Math.floor(Math.random() * 360);
    confetti.style.backgroundColor = `hsl(${hue}, 80%, 60%)`;
    confetti.style.left = (x + (Math.random() * 50 - 25)) + 'px';
    confetti.style.top = (y + (Math.random() * 50 - 25)) + 'px';
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    balloonContainer.appendChild(confetti);
    confetti.addEventListener('animationend', () => confetti.remove());
  }
}
