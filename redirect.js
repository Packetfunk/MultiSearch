const query = new URLSearchParams(window.location.search).get('q');
if (query) {
  chrome.runtime.sendMessage({ type: 'search', query: query }, (response) => {
    if (chrome.runtime.lastError) {
      console.warn(chrome.runtime.lastError.message);
    }
    // Only remove the tab if the background did not indicate to keep it.
    if (!response || !response.keepTab) {
      setTimeout(() => {
        chrome.tabs.getCurrent((tab) => {
          if (tab && tab.id) chrome.tabs.remove(tab.id);
        });
      }, 100);
    }
  });
} else {
  chrome.tabs.getCurrent((tab) => {
    if (tab && tab.id) chrome.tabs.remove(tab.id);
  });
}
