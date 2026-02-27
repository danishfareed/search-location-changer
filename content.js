// Fetch current storage and send it to window where inject.js is running
chrome.storage.local.get(['enabled', 'lat', 'lng'], (data) => {
    // Send initial configuration to inject.js via window message
    window.postMessage({
        type: 'UPDATE_LOCATION_CONFIG_INIT',
        payload: data
    }, '*');
});

// Listen for updates from background.js and forward to inject.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "UPDATE_GEO") {
        window.postMessage({
            type: 'UPDATE_LOCATION_CONFIG',
            payload: request.data
        }, '*');
    }
});
