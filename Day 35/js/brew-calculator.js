/* ==========================================================================
   MALNAD CREST - SOUTH INDIAN FILTER KAAPI BREW CALCULATOR & TIMER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBrewCalculator();
});

let timerInterval = null;
let currentTimerSeconds = 0;
let totalTimerSeconds = 165; // 2 min 45 sec total

function initBrewCalculator() {
  const cupsSlider = document.getElementById('cupsSlider');
  const strengthSlider = document.getElementById('strengthSlider');

  if (!cupsSlider || !strengthSlider) return;

  const updateRecipe = () => {
    const cups = parseInt(cupsSlider.value, 10);
    const strength = parseInt(strengthSlider.value, 10); // 1 = Mild, 2 = Standard, 3 = Strong

    document.getElementById('cupsVal').innerText = `${cups} ${cups === 1 ? 'Cup' : 'Cups'}`;
    
    let strengthLabel = 'Standard Decoction';
    let ratio = 15; // grams per cup
    if (strength === 1) {
      strengthLabel = 'Mild Brew';
      ratio = 12;
    } else if (strength === 3) {
      strengthLabel = 'Strong Kadak';
      ratio = 18;
    }
    document.getElementById('strengthVal').innerText = strengthLabel;

    // Calculation formulas
    const powderGrams = cups * ratio;
    const waterMl = cups * 45; // 45ml water per cup into filter
    const decoctionYield = Math.round(waterMl * 0.75); // ~75% yield
    const milkMl = cups * 90; // 90ml hot milk per cup

    document.getElementById('powderResult').innerText = `${powderGrams}g`;
    document.getElementById('waterResult').innerText = `${waterMl}ml`;
    document.getElementById('decoctionResult').innerText = `${decoctionYield}ml`;
    document.getElementById('milkResult').innerText = `${milkMl}ml`;
  };

  cupsSlider.addEventListener('input', updateRecipe);
  strengthSlider.addEventListener('input', updateRecipe);
  updateRecipe();

  // Timer Buttons
  const startBtn = document.getElementById('startTimerBtn');
  const resetBtn = document.getElementById('resetTimerBtn');

  if (startBtn) {
    startBtn.addEventListener('click', toggleBrewTimer);
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', resetBrewTimer);
  }
}

function toggleBrewTimer() {
  const startBtn = document.getElementById('startTimerBtn');
  if (!startBtn) return;

  if (timerInterval) {
    // Pause
    clearInterval(timerInterval);
    timerInterval = null;
    startBtn.innerText = 'Resume Timer';
    startBtn.classList.remove('btn-primary');
    startBtn.classList.add('btn-outline');
  } else {
    // Start / Resume
    startBtn.innerText = 'Pause Timer';
    startBtn.classList.remove('btn-outline');
    startBtn.classList.add('btn-primary');

    timerInterval = setInterval(() => {
      currentTimerSeconds++;
      updateTimerUI();

      if (currentTimerSeconds >= totalTimerSeconds) {
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.innerText = 'Brew Completed! ☕';
        window.showToast('✨ Your South Indian Filter Decoction is ready to froth!');
      }
    }, 1000);
  }
}

function resetBrewTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  currentTimerSeconds = 0;
  const startBtn = document.getElementById('startTimerBtn');
  if (startBtn) {
    startBtn.innerText = 'Start Decoction Timer';
    startBtn.classList.add('btn-primary');
    startBtn.classList.remove('btn-outline');
  }
  updateTimerUI();
}

function updateTimerUI() {
  const display = document.getElementById('timerDisplay');
  const stepEl = document.getElementById('timerStepLabel');
  const circle = document.getElementById('timerCircle');

  if (!display || !stepEl) return;

  const mins = Math.floor(currentTimerSeconds / 60);
  const secs = currentTimerSeconds % 60;
  display.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Progress Deg
  const progressPercent = (currentTimerSeconds / totalTimerSeconds) * 360;
  if (circle) {
    circle.style.background = `conic-gradient(var(--accent-gold) ${progressPercent}deg, rgba(212, 175, 55, 0.1) 0deg)`;
  }

  // Step instruction update
  if (currentTimerSeconds < 15) {
    stepEl.innerText = 'Step 1: Add fine coffee powder & press lightly with disc';
  } else if (currentTimerSeconds < 45) {
    stepEl.innerText = 'Step 2: Pour boiling water over disc in top chamber';
  } else if (currentTimerSeconds < 150) {
    stepEl.innerText = 'Step 3: Slow gravity drip percolation into bottom vessel...';
  } else {
    stepEl.innerText = 'Step 4: Pour decoction with hot milk back and forth in dabarah!';
  }
}
