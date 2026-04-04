// Use localhost for dev, change to production URL before publishing
const API_BASE = 'https://repurposehub.co';

// Check stored auth on load
document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.local.get(['authToken', 'userEmail', 'userPlan', 'usageCount', 'usageLimit']);

  if (data.authToken) {
    showLoggedIn(data);
  } else {
    showLoggedOut();
  }
});

function showLoggedOut() {
  document.getElementById('logged-out').classList.add('active');
  document.getElementById('logged-in').classList.remove('active');
}

function showLoggedIn(data) {
  document.getElementById('logged-out').classList.remove('active');
  document.getElementById('logged-in').classList.add('active');

  document.getElementById('user-email').textContent = data.userEmail || 'user@example.com';
  document.getElementById('user-avatar').textContent = (data.userEmail || 'U')[0].toUpperCase();
  document.getElementById('user-plan').textContent = `${(data.userPlan || 'free').charAt(0).toUpperCase() + (data.userPlan || 'free').slice(1)} Plan`;

  const count = data.usageCount || 0;
  const limit = data.usageLimit || 30;
  document.getElementById('usage-count').textContent = limit === -1 ? `${count} (unlimited)` : `${count} / ${limit}`;
  document.getElementById('usage-fill').style.width = limit === -1 ? '0%' : `${Math.min(100, (count / limit) * 100)}%`;
}

// Sign in button
document.getElementById('btn-signin').addEventListener('click', () => {
  chrome.tabs.create({ url: `${API_BASE}/auth/signin?extension=true` });
});

// Sign up button
document.getElementById('btn-signup').addEventListener('click', () => {
  chrome.tabs.create({ url: `${API_BASE}/auth/signup?extension=true` });
});

// Repurpose pasted text — store in chrome.storage so side panel picks it up
document.getElementById('btn-repurpose').addEventListener('click', async () => {
  const text = document.getElementById('paste-input').value.trim();
  if (!text) return;

  // Store pending content, then open side panel
  await chrome.storage.local.set({
    pendingRepurpose: { text, source: 'popup', timestamp: Date.now() }
  });
  chrome.runtime.sendMessage({ type: 'OPEN_SIDEPANEL' });
  window.close();
});

// Repurpose current page
document.getElementById('btn-page').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_CONTENT' }, async (response) => {
      if (chrome.runtime.lastError) {
        // Content script not available — page might not support it
        return;
      }
      if (response?.content) {
        await chrome.storage.local.set({
          pendingRepurpose: { text: response.content, source: tab.url, timestamp: Date.now() }
        });
        chrome.runtime.sendMessage({ type: 'OPEN_SIDEPANEL' });
        window.close();
      }
    });
  }
});

// Open dashboard
document.getElementById('btn-dashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: `${API_BASE}/dashboard` });
  window.close();
});
