// Debug version of content script
console.log('🔍 Debug content script starting...');

try {
  console.log('⚡ FlashTL;DR content script loaded on:', window.location.href);
  
  // Test Chrome APIs
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    console.log('✅ Chrome APIs available');
  } else {
    console.log('❌ Chrome APIs not available');
  }
  
  // Test basic functionality
  console.log('📄 Page title:', document.title);
  console.log('🔗 Page URL:', window.location.href);
  
  // Test message listener
  if (chrome && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('📨 Message received:', request);
      if (request.action === 'ping') {
        sendResponse({ status: 'ready' });
        return true;
      }
    });
    console.log('✅ Message listener set up');
  } else {
    console.log('❌ Message listener setup failed');
  }
  
  console.log('✅ Debug content script completed successfully');
  
} catch (error) {
  console.error('❌ Error in debug content script:', error);
}
