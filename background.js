// Handle omnibox searches (works in Chrome/Edge)
chrome.omnibox.onInputEntered.addListener((query) => {
  if (query.trim()) {
    // No redirect tab, so all engines open in new tabs.
    handleSearch(query);
  }
});

// Handle messages from redirect page, now passing sender.tab.id
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'search' && message.query) {
    // The redirect tab will be used for the first search engine.
    handleSearch(message.query, sender.tab ? sender.tab.id : null);
    // Tell redirect page not to close itself if used as the search result tab.
    sendResponse({ status: "ok", keepTab: !!sender.tab });
  }
});

// Options page handler
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

// Updated search logic to load first engine in existing redirect tab if provided,
// and open subsequent engines in new tabs.
function handleSearch(query, redirectTabId) {
  chrome.storage.sync.get(["searchEngines"], (data) => {
    const searchEngines = data.searchEngines || [
      "https://chatgpt.com/?q=%s",
      "https://www.google.com/search?q=%s+site%3Areddit.com",
      "https://www.google.com/search?q=%s"
    ];
    if (redirectTabId && searchEngines.length > 0) {
      const firstUrl = searchEngines[0].replace("%s", encodeURIComponent(query.trim()));
      chrome.tabs.update(redirectTabId, { url: firstUrl, active: true });
      // Subsequent search engines open in new tabs.
      searchEngines.slice(1).forEach((url) => {
        const searchUrl = url.replace("%s", encodeURIComponent(query.trim()));
        chrome.tabs.create({ url: searchUrl, active: false });
      });
    } else {
      searchEngines.forEach((url) => {
        const searchUrl = url.replace("%s", encodeURIComponent(query.trim()));
        chrome.tabs.create({ url: searchUrl, active: false });
      });
    }
  });
}
