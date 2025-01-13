// Omnibox functionality
chrome.omnibox.onInputEntered.addListener((query) => {
    chrome.storage.sync.get(["searchEngines"], (data) => {
      const searchEngines = data.searchEngines || [
        "https://chatgpt.com/?q=%s",
        "https://www.google.com/search?q=%s+site%3Areddit.com",
        "https://www.google.com/search?q=%s"
      ];
  
      if (query.trim()) {
        searchEngines.forEach((url) => {
          const searchUrl = url.replace("%s", encodeURIComponent(query.trim()));
          chrome.tabs.create({ url: searchUrl });
        });
      }
    });
  });
  
  // Handle extension icon click to open the options page
  chrome.action.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage();
  });
  