const TOTAL_STEPS = 5;
let currentStep = 1;

const state = {
  bizType:     null,
  goal:        null,
  style:       null,
  styleBg:     null,
  styleAccent: null,
  styleDark:   null,
  name:        '',
  tagline:     '',
  buildMethod: null
};

const progressFill  = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');
const nextBtn       = document.getElementById('nextBtn');
const backBtn       = document.getElementById('backBtn');

// Map bizType to closest template
const BIZ_TEMPLATE_MAP = {
  restaurant:     'restaurant',
  salon:          'local-business',
  shop:           'online-store',
  contractor:     'local-business',
  professional:   'coaching',
  fitness:        'coaching',
  creative:       'portfolio',
  'local-business': 'local-business'
};

function updateProgress() {
  const pct = (currentStep / TOTAL_STEPS) * 100;
  progressFill.style.width = pct + '%';
  progressLabel.textContent = `Step ${currentStep} of ${TOTAL_STEPS}`;
  backBtn.style.visibility = currentStep > 1 ? 'visible' : 'hidden';
  if (currentStep === TOTAL_STEPS) {
    nextBtn.textContent = "Build my site ✦";
    nextBtn.classList.add('last');
  } else {
    nextBtn.textContent = 'Continue →';
    nextBtn.classList.remove('last');
  }
  validateStep();
}

function validateStep() {
  if (currentStep === 1) nextBtn.disabled = !state.bizType;
  if (currentStep === 2) nextBtn.disabled = !state.goal;
  if (currentStep === 3) nextBtn.disabled = !state.style;
  if (currentStep === 4) nextBtn.disabled = state.name.trim().length < 1;
  if (currentStep === 5) {
    const method = state.buildMethod;
    if (!method) { nextBtn.disabled = true; return; }
    if (method === 'ai-quick' || method === 'ai-guided') {
      const key = document.getElementById('apiKeyInput')?.value.trim() || '';
      nextBtn.disabled = !key;
    } else {
      nextBtn.disabled = false;
    }
  }
}

function goToStep(n) {
  document.querySelector(`.ob-step[data-step="${currentStep}"]`).classList.remove('active');
  currentStep = n;
  document.querySelector(`.ob-step[data-step="${currentStep}"]`).classList.add('active');
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

nextBtn.addEventListener('click', () => {
  if (nextBtn.disabled) return;
  if (currentStep < TOTAL_STEPS) goToStep(currentStep + 1);
  else finish();
});

backBtn.addEventListener('click', () => {
  if (currentStep > 1) goToStep(currentStep - 1);
});

// Step 1: Business type
document.querySelectorAll('#bizTypeGrid .ob-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#bizTypeGrid .ob-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.bizType = btn.dataset.value;
    validateStep();
    setTimeout(() => { if (!nextBtn.disabled) goToStep(2); }, 280);
  });
});

// Step 2: Goal
document.querySelectorAll('#goalGrid .ob-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#goalGrid .ob-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.goal = btn.dataset.value;
    validateStep();
    setTimeout(() => { if (!nextBtn.disabled) goToStep(3); }, 280);
  });
});

// Step 3: Style
document.querySelectorAll('.ob-style-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ob-style-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.style       = btn.dataset.value;
    state.styleBg     = btn.dataset.bg;
    state.styleAccent = btn.dataset.accent;
    state.styleDark   = btn.dataset.dark;
    validateStep();
    const card = document.getElementById('namePreviewCard');
    if (card) card.style.background = btn.dataset.dark === '#FFFFFF' ? '#0D0D0D' : btn.dataset.bg;
    setTimeout(() => { if (!nextBtn.disabled) goToStep(4); }, 280);
  });
});

// Step 4: Name
const siteNameInput  = document.getElementById('siteNameInput');
const taglineInput   = document.getElementById('taglineInput');
const previewLogo    = document.getElementById('previewLogo');
const previewTagline = document.getElementById('previewTagline');

siteNameInput.addEventListener('input', () => {
  state.name = siteNameInput.value;
  previewLogo.textContent = state.name || 'Your Business';
  validateStep();
});
taglineInput.addEventListener('input', () => {
  state.tagline = taglineInput.value;
  previewTagline.textContent = state.tagline || 'Your tagline goes here';
});
siteNameInput.addEventListener('keydown', e => { if (e.key === 'Enter' && state.name.trim()) goToStep(5); });

const observer = new MutationObserver(() => {
  const step4 = document.querySelector('.ob-step[data-step="4"]');
  if (step4?.classList.contains('active')) setTimeout(() => siteNameInput.focus(), 200);
});
observer.observe(document.getElementById('obSteps'), { attributes: true, subtree: true, attributeFilter: ['class'] });

// Step 5: Build method
document.querySelectorAll('#buildMethodGrid .ob-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#buildMethodGrid .ob-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.buildMethod = btn.dataset.value;

    const quickPrompt = document.getElementById('aiQuickPrompt');
    const keyRow = document.getElementById('aiKeyRow');
    const isAI = state.buildMethod === 'ai-quick' || state.buildMethod === 'ai-guided';

    quickPrompt.style.display = state.buildMethod === 'ai-quick' ? 'block' : 'none';
    keyRow.style.display = isAI ? 'block' : 'none';

    if (state.buildMethod === 'ai-quick') {
      setTimeout(() => document.getElementById('aiQuickInput')?.focus(), 100);
    }

    validateStep();
  });
});

document.getElementById('apiKeyInput')?.addEventListener('input', validateStep);
document.getElementById('aiQuickInput')?.addEventListener('input', validateStep);

// Finish
function finish() {
  const onboardingData = {
    bizType:     state.bizType,
    goal:        state.goal,
    style:       state.style,
    styleBg:     state.styleBg,
    styleAccent: state.styleAccent,
    styleDark:   state.styleDark,
    name:        state.name.trim(),
    tagline:     state.tagline.trim(),
    buildMethod: state.buildMethod,
    completed:   true
  };

  localStorage.setItem('trellis_onboarding', JSON.stringify(onboardingData));
  localStorage.removeItem('trellis_project');

  const apiKey = document.getElementById('apiKeyInput')?.value.trim() || '';
  if (apiKey) localStorage.setItem('trellis_apikey', apiKey);

  nextBtn.textContent = 'Building your site…';
  nextBtn.disabled = true;

  const template = BIZ_TEMPLATE_MAP[state.bizType] || 'local-business';

  setTimeout(() => {
    if (state.buildMethod === 'ai-quick') {
      const prompt = document.getElementById('aiQuickInput')?.value.trim() || state.name;
      window.location.href = `editor.html?mode=ai&prompt=${encodeURIComponent(prompt)}&onboarding=1`;
    } else if (state.buildMethod === 'ai-guided') {
      window.location.href = `editor.html?mode=ai-guided&onboarding=1`;
    } else if (state.buildMethod === 'template') {
      window.location.href = `templates.html`;
    } else {
      window.location.href = `editor.html?template=${template}&onboarding=1`;
    }
  }, 600);
}

updateProgress();