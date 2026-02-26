// Communicate initial state to inject.js
function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    script.onload = function () {
        this.remove();
    };
    if (node) {
        node.appendChild(script);
    } else {
        document.documentElement.appendChild(script);
    }
}

// Inject the physical script
injectScript(chrome.runtime.getURL('inject.js'), 'head');

// Fetch current storage and send it to window where inject.js is running
chrome.storage.local.get(['enabled', 'lat', 'lng'], (data) => {
    // Send initial configuration to inject.js via window message
    // We use setTimeout to ensure inject.js has loaded
    setTimeout(() => {
        window.postMessage({
            type: 'UPDATE_LOCATION_CONFIG_INIT',
            payload: data
        }, '*');
    }, 10);
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
