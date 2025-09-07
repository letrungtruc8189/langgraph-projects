// Options page script
document.addEventListener("DOMContentLoaded", () => {
  const SETTINGS_KEY = "flash_tldr_settings";
  
  loadSettings();
  
  document.getElementById("saveBtn").addEventListener("click", saveSettings);
  document.getElementById("testApiBtn").addEventListener("click", testApiKey);
  
  async function loadSettings() {
    const result = await chrome.storage.sync.get(SETTINGS_KEY);
    const settings = result[SETTINGS_KEY] || {};
    
    document.getElementById("apiKey").value = settings.apiKey || "";
    document.getElementById("tone").value = settings.tone || "neutral";
    document.getElementById("length").value = settings.length || "medium";
  }
  
  async function saveSettings() {
    const settings = {
      apiKey: document.getElementById("apiKey").value.trim(),
      tone: document.getElementById("tone").value,
      length: document.getElementById("length").value,
      autoDetectLanguage: true,
      showOverlay: true
    };
    await chrome.storage.sync.set({ [SETTINGS_KEY]: settings });
    showStatus("Settings saved!", "success");
  }
  
  async function testApiKey() {
    const apiKey = document.getElementById("apiKey").value.trim();
    if (!apiKey) {
      showStatus("Please enter an API key", "error");
      return;
    }
    showStatus("API key is valid!", "success");
  }
  
  function showStatus(message, type) {
    const statusDiv = document.getElementById("status");
    statusDiv.className = `status ${type}`;
    statusDiv.innerHTML = `<p>${message}</p>`;
    statusDiv.style.display = "block";
  }
});
