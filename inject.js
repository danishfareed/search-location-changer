(function () {
    let mockGeoData = null; // null means config hasn't loaded yet
    const pendingRequests = [];

    // Listen for config from content script
    window.addEventListener('message', function (event) {
        if (event.source !== window) return;
        if (event.data.type && (event.data.type === 'UPDATE_LOCATION_CONFIG' || event.data.type === 'UPDATE_LOCATION_CONFIG_INIT')) {
            mockGeoData = event.data.payload;

            // Process any geolocation calls that happened before config loaded
            while (pendingRequests.length > 0) {
                const req = pendingRequests.shift();
                req();
            }
        }
    }, false);

    const mockPosition = function () {
        return {
            coords: {
                latitude: parseFloat(mockGeoData.lat),
                longitude: parseFloat(mockGeoData.lng),
                accuracy: 10,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null
            },
            timestamp: new Date().getTime()
        };
    };

    // --- Override Geolocation ---
    const oldGeolocation = navigator.geolocation;
    const getCurrentPositionOrig = oldGeolocation ? oldGeolocation.getCurrentPosition.bind(oldGeolocation) : null;
    const watchPositionOrig = oldGeolocation ? oldGeolocation.watchPosition.bind(oldGeolocation) : null;

    const geolocationInterceptor = {
        getCurrentPosition: function (successCallback, errorCallback, options) {
            const execute = () => {
                if (mockGeoData && mockGeoData.enabled) {
                    if (successCallback) {
                        setTimeout(() => successCallback(mockPosition()), 0);
                    }
                } else if (getCurrentPositionOrig) {
                    getCurrentPositionOrig(successCallback, errorCallback, options);
                }
            };

            if (mockGeoData === null) {
                pendingRequests.push(execute);
            } else {
                execute();
            }
        },
        watchPosition: function (successCallback, errorCallback, options) {
            const watchId = Math.floor(Math.random() * 10000);

            const execute = () => {
                if (mockGeoData && mockGeoData.enabled) {
                    if (successCallback) {
                        setTimeout(() => successCallback(mockPosition()), 0);
                    }
                } else if (watchPositionOrig) {
                    watchPositionOrig(successCallback, errorCallback, options);
                }
            };

            if (mockGeoData === null) {
                pendingRequests.push(execute);
            } else {
                execute();
            }

            return watchId;
        },
        clearWatch: function (watchId) {
            if (mockGeoData && mockGeoData.enabled) {
                // Mock handled, do nothing
            } else if (oldGeolocation && oldGeolocation.clearWatch) {
                oldGeolocation.clearWatch(watchId);
            }
        }
    };

    if (!navigator.geolocation) {
        navigator.geolocation = geolocationInterceptor;
    } else {
        try {
            Object.defineProperty(navigator, 'geolocation', {
                value: geolocationInterceptor,
                configurable: false,
                writable: false
            });
        } catch (e) { }
    }

    // --- Override Permissions API ---
    // Sometimes sites (like Google) check navigator.permissions before calling geolocation
    try {
        if (navigator.permissions && navigator.permissions.query) {
            const oldPermissionsQuery = navigator.permissions.query.bind(navigator.permissions);
            navigator.permissions.query = async function (descriptor) {
                if (descriptor && descriptor.name === 'geolocation') {
                    // If enabled, always tell the site we have granted permission
                    if (mockGeoData && mockGeoData.enabled) {
                        return { state: 'granted', status: 'granted', name: 'geolocation', onchange: null };
                    }
                }
                return oldPermissionsQuery(descriptor);
            };
        }
    } catch (e) { }
})();
