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
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'repurpose-selection' && info.selectionText) {
    // Open side panel and send selected text
    await chrome.sidePanel.open({ tabId: tab.id });
    // Small delay to let side panel load
    setTimeout(() => {
      chrome.runtime.sendMessage({
        type: 'REPURPOSE_TEXT',
        text: info.selectionText,
        source: tab.url
      });
    }, 500);
  }

  if (info.menuItemId === 'repurpose-page') {
    // Get page content via content script
    chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_CONTENT' }, async (response) => {
      if (response?.content) {
        await chrome.sidePanel.open({ tabId: tab.id });
        setTimeout(() => {
          chrome.runtime.sendMessage({
            type: 'REPURPOSE_TEXT',
            text: response.content,
            source: tab.url
          });
        }, 500);
      }
    });
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_SIDEPANEL') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        await chrome.sidePanel.open({ tabId: tabs[0].id });
      }
    });
  }
});
