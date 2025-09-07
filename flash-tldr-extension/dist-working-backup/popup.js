// Simple popup script
function showStatus(message, type = 'info') {
    const status = document.getElementById('status');
    status.className = `status ${type}`;
    status.innerHTML = `<p>${message}</p>`;
}

function showLoading(show = true) {
    const loading = document.getElementById('loading');
    const buttons = document.querySelectorAll('button');
    
    loading.style.display = show ? 'block' : 'none';
    buttons.forEach(btn => btn.disabled = show);
}

function testContentScript() {
    showLoading(true);
    showStatus('Testing content script connection...', 'info');
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'ping' }, (response) => {
                showLoading(false);
                if (chrome.runtime.lastError) {
                    showStatus('❌ Connection failed. Please refresh the page and try again.', 'error');
                } else if (response && response.status === 'ready') {
                    showStatus('✅ Content script is working perfectly!', 'success');
                } else {
                    showStatus('❌ Content script not responding. Please refresh the page.', 'error');
                }
            });
        } else {
            showLoading(false);
            showStatus('❌ No active tab found', 'error');
        }
    });
}

function summarizePage() {
    showLoading(true);
    showStatus('Analyzing page content...', 'info');
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'summarize' }, (response) => {
                showLoading(false);
                if (chrome.runtime.lastError) {
                    showStatus('❌ Connection failed. Please refresh the page and try again.', 'error');
                } else if (response && response.success) {
                    showStatus('✅ Content extracted successfully! Check the page for results.', 'success');
                    setTimeout(() => window.close(), 2000);
                } else {
                    showStatus(`❌ ${response?.error || 'Failed to analyze content'}`, 'error');
                }
            });
        } else {
            showLoading(false);
            showStatus('❌ No active tab found', 'error');
        }
    });
}

function openOptions() {
    chrome.runtime.openOptionsPage();
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    document.getElementById('summarizeBtn').addEventListener('click', summarizePage);
    document.getElementById('testBtn').addEventListener('click', testContentScript);
    document.getElementById('optionsBtn').addEventListener('click', openOptions);
    
    // Test connection on load
    setTimeout(testContentScript, 500);
});
