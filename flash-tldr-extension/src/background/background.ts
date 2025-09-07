// Background service worker for FlashTL;DR extension

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings on first install
    chrome.storage.sync.set({
      flash_tldr_settings: {
        apiKey: '',
        tone: 'neutral',
        length: 'medium',
        autoDetectLanguage: true,
        showOverlay: true
      }
    });
    
    // Open options page on first install
    chrome.runtime.openOptionsPage();
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'summarize') {
    // Send message to active tab to trigger summarization
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'summarize' });
      }
    });
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Open popup (handled by manifest)
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'logUsage') {
    // Log usage for analytics (optional)
    console.log('Usage logged:', request.data);
  }
});
