(function () {
    let mockGeoData = {
        enabled: false,
        lat: 40.712776,
        lng: -74.005974
    };

    window.addEventListener('message', function (event) {
        if (event.source !== window) return;
        if (event.data.type && (event.data.type === 'UPDATE_LOCATION_CONFIG' || event.data.type === 'UPDATE_LOCATION_CONFIG_INIT')) {
            mockGeoData = event.data.payload;
        }
    }, false);

    const oldGeolocation = navigator.geolocation;

    // Store original functions
    const getCurrentPositionOrig = oldGeolocation ? oldGeolocation.getCurrentPosition.bind(oldGeolocation) : null;
    const watchPositionOrig = oldGeolocation ? oldGeolocation.watchPosition.bind(oldGeolocation) : null;

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

    const interceptor = {
        getCurrentPosition: function (successCallback, errorCallback, options) {
            if (mockGeoData.enabled) {
                if (successCallback) {
                    // Execute original flow securely in async
                    setTimeout(() => {
                        successCallback(mockPosition());
                    }, 0);
                }
            } else if (getCurrentPositionOrig) {
                getCurrentPositionOrig(successCallback, errorCallback, options);
            }
        },
        watchPosition: function (successCallback, errorCallback, options) {
            if (mockGeoData.enabled) {
                if (successCallback) {
                    setTimeout(() => {
                        successCallback(mockPosition());
                    }, 0);

                    // Return a fake watch ID
                    return Math.floor(Math.random() * 10000);
                }
            } else if (watchPositionOrig) {
                return watchPositionOrig(successCallback, errorCallback, options);
            }
        },
        clearWatch: function (watchId) {
            if (mockGeoData.enabled) {
                // Do nothing
            } else if (oldGeolocation && oldGeolocation.clearWatch) {
                oldGeolocation.clearWatch(watchId);
            }
        }
    };

    // Replace the internal geolocation object
    if (!navigator.geolocation) {
        navigator.geolocation = interceptor;
    } else {
        Object.defineProperty(navigator, 'geolocation', {
            value: interceptor,
            configurable: false,
            writable: false
        });
    }
})();
