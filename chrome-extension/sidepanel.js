const API_BASE = 'https://repurposehub.vercel.app';

const PLATFORMS = [
  { id: 'twitter', name: 'Twitter/X', badge: 'badge-twitter' },
  { id: 'linkedin', name: 'LinkedIn', badge: 'badge-linkedin' },
  { id: 'instagram', name: 'Instagram', badge: 'badge-instagram' },
  { id: 'youtube', name: 'YouTube', badge: 'badge-youtube' },
  { id: 'email', name: 'Email', badge: 'badge-email' },
  { id: 'telegram', name: 'Telegram', badge: 'badge-telegram' },
  { id: 'reddit', name: 'Reddit', badge: 'badge-reddit' },
  { id: 'medium', name: 'Medium', badge: 'badge-medium' },
  { id: 'tiktok', name: 'TikTok', badge: 'badge-tiktok' },
  { id: 'substack', name: 'Substack', badge: 'badge-substack' },
  { id: 'threads', name: 'Threads', badge: 'badge-threads' },
  { id: 'pinterest', name: 'Pinterest', badge: 'badge-pinterest' },
];

let selectedPlatforms = PLATFORMS.map(p => p.id);
let lastText = '';
let lastSource = '';

// Initialize platform pills
const platformsBar = document.getElementById('platforms-bar');
PLATFORMS.forEach(p => {
  const pill = document.createElement('button');
  pill.className = 'platform-pill active';
  pill.textContent = p.name;
  pill.dataset.id = p.id;
  pill.addEventListener('click', () => {
    pill.classList.toggle('active');
    if (pill.classList.contains('active')) {
      selectedPlatforms.push(p.id);
    } else {
      selectedPlatforms = selectedPlatforms.filter(id => id !== p.id);
    }
  });
  platformsBar.appendChild(pill);
});

// Listen for repurpose messages
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'REPURPOSE_TEXT') {
    lastText = message.text;
    lastSource = message.source || '';
    repurposeContent(message.text, message.source);
  }
});

// Retry button
document.getElementById('btn-retry').addEventListener('click', () => {
  if (lastText) repurposeContent(lastText, lastSource);
});

function showState(stateId) {
  document.querySelectorAll('.state').forEach(s => s.classList.remove('active'));
  document.getElementById(`state-${stateId}`).classList.add('active');
}

async function repurposeContent(text, source) {
  showState('loading');
  document.getElementById('loading-platforms').textContent = `Creating ${selectedPlatforms.length} platform versions`;

  // Get auth token
  const data = await chrome.storage.local.get(['authToken']);
  if (!data.authToken) {
    showState('error');
    document.getElementById('error-msg').textContent = 'Please sign in to RepurposeHub first. Click the extension icon to sign in.';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.authToken}`
      },
      body: JSON.stringify({
        inputText: text,
        platforms: selectedPlatforms
      })
    });

    const result = await res.json();

    if (!res.ok) {
      showState('error');
      document.getElementById('error-msg').textContent = result.error || 'Generation failed. Please try again.';
      return;
    }

    displayResults(result.outputs, text, source);
  } catch (err) {
    showState('error');
    document.getElementById('error-msg').textContent = 'Network error. Check your connection and try again.';
  }
}

function displayResults(outputs, originalText, source) {
  showState('results');

  // Source info
  const sourceInfo = document.getElementById('source-info');
  const charCount = originalText.length;
  sourceInfo.innerHTML = `
    <strong>Source:</strong> ${source ? new URL(source).hostname : 'Pasted text'}
    &middot; <span class="char-count">${charCount.toLocaleString()} chars</span>
  `;

  // Render output cards
  const container = document.getElementById('results-container');
  container.innerHTML = '';

  outputs.forEach((output, index) => {
    const platform = PLATFORMS.find(p => p.id === output.platform);
    if (!platform) return;

    const card = document.createElement('div');
    card.className = 'output-card';
    card.innerHTML = `
      <div class="output-header">
        <span class="output-platform ${platform.badge}">${platform.name}</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <button class="copy-btn" data-index="${index}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
            </svg>
            Copy
          </button>
          <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
      <div class="output-body">
        <div class="output-text">${escapeHtml(output.content)}</div>
      </div>
    `;

    // Toggle expand
    card.querySelector('.output-header').addEventListener('click', (e) => {
      if (e.target.closest('.copy-btn')) return;
      const body = card.querySelector('.output-body');
      const chevron = card.querySelector('.chevron');
      body.classList.toggle('open');
      chevron.classList.toggle('open');
    });

    // Copy button
    card.querySelector('.copy-btn').addEventListener('click', async (e) => {
      e.stopPropagation();
      const btn = card.querySelector('.copy-btn');
      await navigator.clipboard.writeText(output.content);
      btn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
        Copied!
      `;
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          Copy
        `;
        btn.classList.remove('copied');
      }, 2000);
    });

    // Auto-expand first result
    if (index === 0) {
      card.querySelector('.output-body').classList.add('open');
      card.querySelector('.chevron').classList.add('open');
    }

    container.appendChild(card);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
