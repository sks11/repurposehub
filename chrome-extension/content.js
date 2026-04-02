// Listen for page content requests from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_PAGE_CONTENT') {
    // Extract main content from the page
    const content = extractPageContent();
    sendResponse({ content });
  }
  return true;
});

function extractPageContent() {
  // Try to get article content first
  const selectors = [
    'article',
    '[role="main"]',
    'main',
    '.post-content',
    '.article-content',
    '.entry-content',
    '.content',
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.innerText.trim().length > 100) {
      return cleanText(el.innerText);
    }
  }

  // Fallback: get body text
  return cleanText(document.body.innerText).slice(0, 10000);
}

function cleanText(text) {
  return text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\t/g, ' ')
    .replace(/ {3,}/g, ' ')
    .trim()
    .slice(0, 10000);
}

// Add floating button when text is selected
let floatingBtn = null;

document.addEventListener('mouseup', (e) => {
  const selection = window.getSelection().toString().trim();

  if (selection.length > 20) {
    showFloatingButton(e.pageX, e.pageY, selection);
  } else {
    removeFloatingButton();
  }
});

document.addEventListener('mousedown', (e) => {
  if (floatingBtn && !floatingBtn.contains(e.target)) {
    removeFloatingButton();
  }
});

function showFloatingButton(x, y, text) {
  removeFloatingButton();

  floatingBtn = document.createElement('div');
  floatingBtn.className = 'rh-floating-btn';
  floatingBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
    </svg>
    Repurpose
  `;

  floatingBtn.style.left = `${x}px`;
  floatingBtn.style.top = `${y + 10}px`;

  floatingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    chrome.runtime.sendMessage({
      type: 'OPEN_SIDEPANEL'
    });
    setTimeout(() => {
      chrome.runtime.sendMessage({
        type: 'REPURPOSE_TEXT',
        text: text,
        source: window.location.href
      });
    }, 600);
    removeFloatingButton();
  });

  document.body.appendChild(floatingBtn);
}

function removeFloatingButton() {
  if (floatingBtn) {
    floatingBtn.remove();
    floatingBtn = null;
  }
}
