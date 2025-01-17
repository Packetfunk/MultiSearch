chrome.omnibox.onInputEntered.addListener((query) => {
  if (query.trim()) {
    // Query the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const activeTab = tabs[0];

        // Open the search links
        chrome.storage.sync.get(["searchEngines"], (data) => {
          const searchEngines = data.searchEngines || [
            "https://chatgpt.com/?q=%s",
            "https://www.google.com/search?q=%s+site%3Areddit.com",
            "https://www.google.com/search?q=%s"
          ];

          searchEngines.forEach((url) => {
            const searchUrl = url.replace("%s", encodeURIComponent(query.trim()));
            chrome.tabs.create({ url: searchUrl, active: false }); // Open in background tabs
          });
        });
      }
    });
  }
});

// Handle extension icon click to open the options page
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
