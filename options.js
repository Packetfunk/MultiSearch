const defaultSettings = {
    searchEngines: [
      "https://chatgpt.com/?q=%s&hints=search",
      "https://www.google.com/search?q=%s+site%3Areddit.com",
      "https://www.google.com/search?q=%s"
    ]
  };
  
  // Load settings and populate UI
  function loadSettings() {
    chrome.storage.sync.get(defaultSettings, (data) => {
      const enginesContainer = document.getElementById("search-engines");
      enginesContainer.innerHTML = "";
      data.searchEngines.forEach((url, index) => {
        addEngineRow(enginesContainer, url, index);
      });
    });
  
    document.getElementById("add-engine").addEventListener("click", addNewEngine);
    document.getElementById("save-settings").addEventListener("click", saveSettings);
    document.getElementById("restore-defaults").addEventListener("click", restoreDefaults);
  }
  
  function addEngineRow(container, url = "", index) {
    const row = document.createElement("div");
    row.className = "search-engine-row";
    row.innerHTML = `
      <input type="text" class="engine-input" data-index="${index}" value="${url}" placeholder="Enter search engine URL" />
      <button class="delete-engine" data-index="${index}">X</button>
    `;
    container.appendChild(row);
  
    row.querySelector(".delete-engine").addEventListener("click", deleteEngine);
  }
  
  function addNewEngine() {
    const container = document.getElementById("search-engines");
    addEngineRow(container);
  }
  
  function deleteEngine(event) {
    const container = document.getElementById("search-engines");
    const row = event.target.parentNode;
    container.removeChild(row);
    saveSettings();
  }
  
  function saveSettings() {
    const searchEngines = Array.from(document.querySelectorAll(".engine-input"))
      .map(input => input.value)
      .filter(url => url);
  
    chrome.storage.sync.set({ searchEngines }, () => {
      alert("Settings saved!");
    });
  }
  
  function restoreDefaults() {
    chrome.storage.sync.set(defaultSettings, () => {
      loadSettings();
      alert("Default settings restored!");
    });
  }
  
  // Initialize the options page
  document.addEventListener("DOMContentLoaded", loadSettings);
  