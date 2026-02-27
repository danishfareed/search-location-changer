chrome.runtime.onInstalled.addListener(() => {
    // Initialize default values if not set
    chrome.storage.local.get(['enabled', 'lat', 'lng'], (data) => {
        if (data.enabled === undefined) chrome.storage.local.set({ enabled: false });
        if (data.lat === undefined) chrome.storage.local.set({ lat: 40.712776 });
        if (data.lng === undefined) chrome.storage.local.set({ lng: -74.005974 });
    });
});

function genUULE(latFloat, lngFloat) {
    const lat = Math.floor(latFloat * 1e7) || 407127760;
    const lng = Math.floor(lngFloat * 1e7) || -740059740;
    const decodedXgeo = 'role: CURRENT_LOCATION\nproducer: DEVICE_LOCATION\nradius: 65000\nlatlng <\n  latitude_e7: ' + lat + '\n  longitude_e7: ' + lng + '\n>';
    const encodedXgeo = 'a ' + btoa(decodedXgeo);
    return encodedXgeo;
}

function updateNetRules(enabled, lat, lng) {
    if (enabled) {
        chrome.declarativeNetRequest.updateSessionRules({
            removeRuleIds: [1],
            addRules: [{
                "id": 1,
                "priority": 1,
                "action": {
                    "type": "modifyHeaders",
                    "requestHeaders": [
                        {
                            "header": "x-geo",
                            "operation": "set",
                            "value": genUULE(lat, lng)
                        }
                    ]
                },
                "condition": {
                    "urlFilter": "google.com/",
                    "resourceTypes": ["main_frame", "sub_frame", "xmlhttprequest", "ping"]
                }
            }]
        });
    } else {
        chrome.declarativeNetRequest.updateSessionRules({
            removeRuleIds: [1]
        });
    }
}

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
            updateNetRules(data.enabled, data.lat, data.lng);

            // Notify all active tabs to update injected settings if they are already loaded
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach(tab => {
                    if (tab.id) {
                        try {
                            chrome.tabs.sendMessage(tab.id, {
                                type: "UPDATE_GEO",
                                data: data
                            }).catch(() => { });

                            // Force reload Google Search ONLY if it's the currently active tab
                            if (tab.active && tab.url && tab.url.includes("google.com/search")) {
                                chrome.tabs.reload(tab.id);
                            }
                        } catch (e) { }
                    }
                });
            });
        });
    }
});

// Initial badge and rules state
chrome.storage.local.get(['enabled', 'lat', 'lng'], (data) => {
    updateBadgeStatus(data.enabled);
    updateNetRules(data.enabled, data.lat, data.lng);
});
