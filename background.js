chrome.runtime.onInstalled.addListener(() => {
    // Initialize default values if not set
    chrome.storage.local.get(['enabled', 'lat', 'lng'], (data) => {
        if (data.enabled === undefined) chrome.storage.local.set({ enabled: false });
        if (data.lat === undefined) chrome.storage.local.set({ lat: 40.712776 });
        if (data.lng === undefined) chrome.storage.local.set({ lng: -74.005974 });
    });
});

function updateBadgeStatus(enabled) {
    if (enabled) {
        chrome.action.setBadgeText({ text: 'ON' });
        chrome.action.setBadgeBackgroundColor({ color: '#10b981' }); // success green
    } else {
        chrome.action.setBadgeText({ text: '' });
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "TOGGLE_STATE_CHANGED" || request.type === "LOCATION_UPDATED") {

        chrome.storage.local.get(['enabled', 'lat', 'lng'], (data) => {
            updateBadgeStatus(data.enabled);

            // Notify all active tabs to update injected settings if they are already loaded
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach(tab => {
                    if (tab.id) {
                        try {
                            chrome.tabs.sendMessage(tab.id, {
                                type: "UPDATE_GEO",
                                data: data
                            }).catch(() => {
                                // Ignore errors for tabs without content script
                            });
                        } catch (e) { }
                    }
                });
            });
        });
    }
});

// Initial badge state
chrome.storage.local.get(['enabled'], (data) => {
    updateBadgeStatus(data.enabled);
});
