// Listen for auth token from the extension-callback page
window.addEventListener('message', (event) => {
  if (event.data?.type === 'REPURPOSEHUB_AUTH') {
    chrome.storage.local.set({
      authToken: event.data.authToken,
      userEmail: event.data.userEmail,
      userPlan: event.data.userPlan,
      usageCount: event.data.usageCount,
      usageLimit: event.data.usageLimit,
    });
  }
});

// Listen for page content requests from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_PAGE_CONTENT') {
    const content = extractPageContent();
    sendResponse({ content });
  }
  return true;
});

function extractPageContent() {
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

// No floating button — use right-click → "Repurpose with RepurposeHub" instead
