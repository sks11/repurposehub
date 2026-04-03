// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'repurpose-selection',
    title: 'Repurpose with RepurposeHub',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'repurpose-page',
    title: 'Repurpose this page',
    contexts: ['page']
  });

  // Clicking the extension icon opens side panel
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'repurpose-selection' && info.selectionText) {
    // Store text in storage — side panel will pick it up
    chrome.storage.local.set({
      pendingRepurpose: { text: info.selectionText, source: tab.url, timestamp: Date.now() }
    });
    // Open side panel directly from context menu click (user gesture)
    chrome.sidePanel.open({ tabId: tab.id });
  }

  if (info.menuItemId === 'repurpose-page') {
    // Open side panel first (user gesture — must be synchronous)
    chrome.sidePanel.open({ tabId: tab.id });
    // Then get page content and store it
    chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_CONTENT' }, (response) => {
      if (chrome.runtime.lastError || !response?.content) return;
      chrome.storage.local.set({
        pendingRepurpose: { text: response.content, source: tab.url, timestamp: Date.now() }
      });
    });
  }
});
