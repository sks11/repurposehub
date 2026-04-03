// Use localhost for dev, change to production URL before publishing
const API_BASE = 'http://localhost:3000';

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
let pendingText = '';
let pendingSource = '';
let pendingUrl = '';

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
      if (!selectedPlatforms.includes(p.id)) selectedPlatforms.push(p.id);
    } else {
      selectedPlatforms = selectedPlatforms.filter(id => id !== p.id);
    }
    updatePlatformCount();
  });
  platformsBar.appendChild(pill);
});

// All / None toggles
document.getElementById('btn-select-all').addEventListener('click', () => {
  selectedPlatforms = PLATFORMS.map(p => p.id);
  document.querySelectorAll('.platform-pill').forEach(p => p.classList.add('active'));
  updatePlatformCount();
});
document.getElementById('btn-select-none').addEventListener('click', () => {
  selectedPlatforms = [];
  document.querySelectorAll('.platform-pill').forEach(p => p.classList.remove('active'));
  updatePlatformCount();
});

function updatePlatformCount() {
  const countEl = document.getElementById('platform-count');
  if (countEl) countEl.textContent = selectedPlatforms.length;
}

// Check auth + pending content on load
chrome.storage.local.get(['authToken', 'pendingRepurpose'], (data) => {
  if (!data.authToken) {
    showState('auth');
    return;
  }
  if (data.pendingRepurpose) {
    const { text, source } = data.pendingRepurpose;
    loadContent(text, source || '');
    chrome.storage.local.remove('pendingRepurpose');
  }
});

// Sign in button
document.getElementById('btn-signin').addEventListener('click', () => {
  chrome.tabs.create({ url: `${API_BASE}/auth/signin?extension=true` });
});

// Listen for storage changes (auth token + pending content)
chrome.storage.onChanged.addListener((changes) => {
  // If auth token was just saved, switch from auth screen to empty/ready state
  if (changes.authToken?.newValue) {
    showState('empty');
  }
  if (changes.pendingRepurpose?.newValue) {
    const { text, source } = changes.pendingRepurpose.newValue;
    loadContent(text, source || '');
    chrome.storage.local.remove('pendingRepurpose');
  }
});

// Also keep runtime message listener for context menu / floating button
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'REPURPOSE_TEXT') {
    loadContent(message.text, message.source || '');
  }
});

function loadContent(text, source) {
  pendingText = text;
  pendingSource = source;
  pendingUrl = ''; // Clear URL when loading text directly

  // Show the ready state with preview
  document.getElementById('ready-text').textContent = text.length > 500 ? text.slice(0, 500) + '...' : text;
  const sourceEl = document.getElementById('ready-source');
  if (source && source !== 'popup') {
    try {
      sourceEl.textContent = `Source: ${new URL(source).hostname} · ${text.length.toLocaleString()} chars`;
    } catch {
      sourceEl.textContent = `${text.length.toLocaleString()} chars`;
    }
  } else {
    sourceEl.textContent = `${text.length.toLocaleString()} chars`;
  }

  updatePlatformCount();
  showState('ready');
}

// URL input — fetch via API
document.getElementById('btn-url-go').addEventListener('click', () => {
  const input = document.getElementById('url-input');
  const url = input.value.trim();
  if (!url) return;
  if (!/^https?:\/\/.+/.test(url)) {
    showState('error');
    document.getElementById('error-msg').textContent = 'Please enter a valid URL starting with http:// or https://';
    return;
  }
  pendingText = '';
  pendingSource = url;
  pendingUrl = url;

  // Show ready state with URL preview
  document.getElementById('ready-text').textContent = `Content will be fetched from this URL`;
  document.getElementById('ready-source').textContent = `URL: ${url}`;
  updatePlatformCount();
  showState('ready');
});

// Also allow Enter key in URL input
document.getElementById('url-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('btn-url-go').click();
  }
});

// Generate button
document.getElementById('btn-generate').addEventListener('click', () => {
  if (!pendingText && !pendingUrl) return;
  if (!selectedPlatforms.length) return;
  repurposeContent(pendingText, pendingSource);
});

// Retry button
document.getElementById('btn-retry').addEventListener('click', () => {
  if (pendingText || pendingUrl) {
    showState('ready');
  }
});

// Sign in button on error state
document.getElementById('btn-signin-error').addEventListener('click', () => {
  chrome.storage.local.remove('authToken');
  chrome.tabs.create({ url: `${API_BASE}/auth/signin?extension=true` });
});

// Copy all button
document.getElementById('btn-copy-all').addEventListener('click', async () => {
  const btn = document.getElementById('btn-copy-all');
  const cards = document.querySelectorAll('.output-card');
  const allContent = [];
  cards.forEach(card => {
    const platform = card.querySelector('.output-platform')?.textContent || '';
    const text = card.querySelector('.output-text')?.textContent || '';
    allContent.push(`--- ${platform} ---\n${text}`);
  });
  await navigator.clipboard.writeText(allContent.join('\n\n'));
  btn.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
    Copied All!
  `;
  btn.classList.add('copied');
  setTimeout(() => {
    btn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
      </svg>
      Copy All
    `;
    btn.classList.remove('copied');
  }, 2000);
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
    showState('auth');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.authToken}`
      },
      body: JSON.stringify(
        pendingUrl
          ? { url: pendingUrl, platforms: selectedPlatforms }
          : { inputText: text, platforms: selectedPlatforms }
      )
    });

    const result = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        chrome.storage.local.remove('authToken');
        showState('auth');
        return;
      }
      showError(result.error || 'Generation failed. Please try again.', res.status === 403);
      return;
    }

    displayResults(result.outputs, text, source);
  } catch (err) {
    showError('Network error. Check your connection and try again.', false);
  }
}

function showError(message, isUpgrade) {
  showState('error');
  document.getElementById('error-msg').textContent = message;
  document.getElementById('btn-upgrade').style.display = isUpgrade ? 'block' : 'none';
  document.getElementById('btn-signin-error').style.display = isUpgrade ? 'none' : 'block';
}

function displayResults(outputs, originalText, source) {
  showState('results');

  // Source info
  const sourceInfo = document.getElementById('source-info');
  const charCount = originalText.length;
  if (source && source !== 'popup') {
    try {
      sourceInfo.innerHTML = `
        <strong>Source:</strong> ${new URL(source).hostname}
        &middot; <span class="char-count">${charCount.toLocaleString()} chars</span>
        &middot; <span>${outputs.length} platforms</span>
      `;
    } catch {
      sourceInfo.innerHTML = `<span class="char-count">${charCount.toLocaleString()} chars</span> &middot; <span>${outputs.length} platforms</span>`;
    }
  } else {
    sourceInfo.innerHTML = `<span class="char-count">${charCount.toLocaleString()} chars</span> &middot; <span>${outputs.length} platforms</span>`;
  }

  // Render output cards
  const container = document.getElementById('results-container');
  container.innerHTML = '';

  outputs.forEach((output, index) => {
    const platform = PLATFORMS.find(p => p.id === output.platform);
    if (!platform) return;

    const contentStr = formatContent(output.content);

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
        <div class="output-text">${escapeHtml(contentStr)}</div>
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
      await navigator.clipboard.writeText(contentStr);
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

function formatContent(content) {
  if (typeof content === 'string') return content;
  if (typeof content === 'object' && content !== null) {
    return Object.entries(content)
      .map(([key, val]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${Array.isArray(val) ? val.join(', ') : val}`)
      .join('\n\n');
  }
  return String(content);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
