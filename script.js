const overlay      = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');

function openModal(type) {
  if (type === 'scratch') {
    const hasOnboarded = localStorage.getItem('trellis_onboarding');
    window.location.href = hasOnboarded ? 'templates.html' : 'onboarding.html';
    return;
  }

  // AI modal — Quick vs Guided tabs
  const savedKey = localStorage.getItem('trellis_apikey') || '';

  modalContent.innerHTML = `
    <div class="modal-header">
      <div class="modal-step">✦ AI Builder</div>
      <h2>Build with AI</h2>
      <p>Tell Trellis about your business — it builds the site for you.</p>
    </div>

    <div class="ai-mode-tabs">
      <button class="ai-mode-tab active" data-mode="quick">⚡ Quick Build</button>
      <button class="ai-mode-tab" data-mode="guided">✦ Guided Build</button>
    </div>

    <div id="aiModeQuick">
      <div class="ai-examples">
        <span class="ai-example" data-text="A warm Italian restaurant in Brooklyn with outdoor seating and a family-friendly vibe">Restaurant</span>
        <span class="ai-example" data-text="A hair salon in Miami offering cuts, colour, and blowouts — modern and welcoming">Salon</span>
        <span class="ai-example" data-text="A plumbing contractor in Chicago — emergency repairs, honest pricing, 20 years experience">Contractor</span>
        <span class="ai-example" data-text="A boutique clothing store selling handmade women's fashion — earthy, sustainable, beautiful">Boutique</span>
        <span class="ai-example" data-text="A personal trainer in LA focused on weight loss and strength — motivating and no-nonsense">Fitness</span>
      </div>
      <textarea class="modal-textarea" id="aiPrompt" rows="3" placeholder="Describe your business — what you do, where you are, and the vibe you want…"></textarea>
    </div>

    <div id="aiModeGuided" style="display:none;">
      <div class="guided-steps" id="guidedSteps">
        <div class="guided-q active" data-q="1">
          <label class="guided-label">What does your business do?</label>
          <input class="modal-input" id="gq1" placeholder="e.g. We run a family bakery in Austin, Texas" autocomplete="off">
        </div>
        <div class="guided-q" data-q="2">
          <label class="guided-label">Who are your customers?</label>
          <input class="modal-input" id="gq2" placeholder="e.g. Local families, office workers, weekend brunch crowd" autocomplete="off">
        </div>
        <div class="guided-q" data-q="3">
          <label class="guided-label">What do you want visitors to do?</label>
          <input class="modal-input" id="gq3" placeholder="e.g. Call us, visit the shop, place an order online" autocomplete="off">
        </div>
        <div class="guided-q" data-q="4">
          <label class="guided-label">What's special about you?</label>
          <input class="modal-input" id="gq4" placeholder="e.g. Everything is baked fresh daily using family recipes from 1952" autocomplete="off">
        </div>
        <div class="guided-progress">
          <span id="guidedCounter">Question 1 of 4</span>
          <button class="guided-next-btn" id="guidedNextBtn">Next →</button>
        </div>
      </div>
    </div>

    <div class="ai-key-row">
      <input class="ai-key-input" id="apiKeyInput" type="password"
        placeholder="Anthropic API key (sk-ant-...)"
        value="${savedKey}">
      <a class="ai-key-link" href="https://console.anthropic.com" target="_blank">Get key →</a>
    </div>
    <p class="ai-key-note">Stored only in your browser. Never sent anywhere except Anthropic.</p>
    <button class="modal-submit" id="modalSubmit">✦ Generate my site</button>
  `;

  overlay.classList.add('active');

  // Tab switching
  let currentAIMode = 'quick';
  document.querySelectorAll('.ai-mode-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ai-mode-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentAIMode = tab.dataset.mode;
      document.getElementById('aiModeQuick').style.display = currentAIMode === 'quick' ? 'block' : 'none';
      document.getElementById('aiModeGuided').style.display = currentAIMode === 'guided' ? 'block' : 'none';
    });
  });

  // Quick build examples
  document.querySelectorAll('.ai-example').forEach(chip => {
    chip.addEventListener('click', () => {
      document.getElementById('aiPrompt').value = chip.dataset.text;
      document.getElementById('aiPrompt').focus();
    });
  });

  // Guided steps
  let guidedStep = 1;
  const totalGuidedSteps = 4;

  function updateGuidedStep() {
    document.querySelectorAll('.guided-q').forEach(q => q.classList.remove('active'));
    document.querySelector(`.guided-q[data-q="${guidedStep}"]`)?.classList.add('active');
    document.getElementById('guidedCounter').textContent = `Question ${guidedStep} of ${totalGuidedSteps}`;
    const btn = document.getElementById('guidedNextBtn');
    if (btn) btn.textContent = guidedStep < totalGuidedSteps ? 'Next →' : 'Done ✓';
    // Focus the active input
    setTimeout(() => document.getElementById(`gq${guidedStep}`)?.focus(), 100);
  }

  document.getElementById('guidedNextBtn')?.addEventListener('click', () => {
    if (guidedStep < totalGuidedSteps) {
      guidedStep++;
      updateGuidedStep();
    }
  });

  // Submit
  document.getElementById('modalSubmit').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) {
      const ki = document.getElementById('apiKeyInput');
      ki.focus(); ki.style.borderColor = '#C05C2A'; return;
    }
    localStorage.setItem('trellis_apikey', apiKey);
    localStorage.removeItem('trellis_project');

    let prompt = '';
    if (currentAIMode === 'quick') {
      prompt = document.getElementById('aiPrompt').value.trim();
      if (!prompt) {
        const ta = document.getElementById('aiPrompt');
        ta.focus(); ta.style.borderColor = '#C05C2A'; return;
      }
    } else {
      // Build guided prompt from answers
      const q1 = document.getElementById('gq1')?.value.trim() || '';
      const q2 = document.getElementById('gq2')?.value.trim() || '';
      const q3 = document.getElementById('gq3')?.value.trim() || '';
      const q4 = document.getElementById('gq4')?.value.trim() || '';
      if (!q1) {
        document.getElementById('gq1')?.focus();
        guidedStep = 1; updateGuidedStep(); return;
      }
      prompt = `Business: ${q1}. Customers: ${q2 || 'general public'}. Goal: ${q3 || 'get in touch'}. What makes us special: ${q4 || 'great service'}.`;
    }

    window.location.href = `editor.html?mode=ai&prompt=${encodeURIComponent(prompt)}`;
    overlay.classList.remove('active');
  });
}

document.getElementById('manualBtn').addEventListener('click', () => openModal('scratch'));
document.getElementById('aiBtn').addEventListener('click',     () => openModal('ai'));
document.getElementById('modalClose').addEventListener('click', () => overlay.classList.remove('active'));
overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('active'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') overlay.classList.remove('active'); });
const fctaBtn = document.getElementById('fctaBtn');
if (fctaBtn) fctaBtn.addEventListener('click', () => openModal('scratch'));
const navCta = document.querySelector('.nav-cta');
if (navCta) navCta.addEventListener('click', () => openModal('scratch'));