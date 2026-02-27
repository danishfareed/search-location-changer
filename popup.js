document.addEventListener('DOMContentLoaded', async () => {
    const toggleSpoof = document.getElementById('toggleSpoof');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const mapOverlay = document.getElementById('mapOverlay');
    const latInput = document.getElementById('latInput');
    const lngInput = document.getElementById('lngInput');
    const saveBtn = document.getElementById('saveBtn');

    let map;
    let marker;
    let searchTimeout;

    // Load saved settings
    const data = await chrome.storage.local.get({
        enabled: false,
        lat: 40.712776, // Default to NY
        lng: -74.005974
    });

    toggleSpoof.checked = data.enabled;
    latInput.value = data.lat;
    lngInput.value = data.lng;

    updateOverlay();

    // Initialize Map
    function initMap(lat, lng) {
        // Fix Leaflet's default image path issues when loaded in Chrome Extension
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'lib/images/marker-icon-2x.png',
            iconUrl: 'lib/images/marker-icon.png',
            shadowUrl: 'lib/images/marker-shadow.png',
        });

        map = L.map('map').setView([lat, lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        marker = L.marker([lat, lng], { draggable: true }).addTo(map);

        marker.on('dragend', function (event) {
            const position = marker.getLatLng();
            latInput.value = position.lat.toFixed(6);
            lngInput.value = position.lng.toFixed(6);
            reverseGeocode(position.lat, position.lng);
        });

        map.on('click', function (e) {
            marker.setLatLng(e.latlng);
            latInput.value = e.latlng.lat.toFixed(6);
            lngInput.value = e.latlng.lng.toFixed(6);
            reverseGeocode(e.latlng.lat, e.latlng.lng);
        });
    }

    initMap(data.lat, data.lng);
    // Optional: fetch initial address if search bar is empty
    reverseGeocode(data.lat, data.lng);

    // Toggle Handler
    toggleSpoof.addEventListener('change', async (e) => {
        const enabled = e.target.checked;
        const lat = parseFloat(latInput.value) || data.lat;
        const lng = parseFloat(lngInput.value) || data.lng;

        await chrome.storage.local.set({ enabled, lat, lng });
        updateOverlay();
        // Send message to background to notify active tabs
        chrome.runtime.sendMessage({ type: "TOGGLE_STATE_CHANGED" });
    });

    function updateOverlay() {
        if (toggleSpoof.checked) {
            mapOverlay.classList.add('hidden');
        } else {
            mapOverlay.classList.remove('hidden');
        }
    }

    // Save Button Handler
    saveBtn.addEventListener('click', async () => {
        const lat = parseFloat(latInput.value);
        const lng = parseFloat(lngInput.value);

        if (isNaN(lat) || isNaN(lng)) return;

        await chrome.storage.local.set({ lat, lng });

        // Visual feedback
        const originalText = saveBtn.textContent;
        saveBtn.textContent = "Saved!";
        saveBtn.style.background = "var(--success)";

        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = "";
        }, 1500);

        // Send message to background
        chrome.runtime.sendMessage({ type: "LOCATION_UPDATED", lat, lng });
    });

    // Inputs manual change
    [latInput, lngInput].forEach(input => {
        input.addEventListener('change', () => {
            const lat = parseFloat(latInput.value);
            const lng = parseFloat(lngInput.value);
            if (!isNaN(lat) && !isNaN(lng)) {
                const newLatLng = new L.LatLng(lat, lng);
                marker.setLatLng(newLatLng);
                map.panTo(newLatLng);
            }
        });
    });

    // Search Logic using Nominatim
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();

        if (query.length < 3) {
            searchResults.classList.add('hidden');
            return;
        }

        searchTimeout = setTimeout(() => performSearch(query), 500);
    });

    async function performSearch(query) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'ChromeLocationChanger/1.0'
                }
            });
            const results = await response.json();

            searchResults.innerHTML = '';
            if (results.length === 0) {
                searchResults.classList.add('hidden');
                return;
            }

            results.forEach(result => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.textContent = result.display_name;
                div.addEventListener('click', () => {
                    const lat = parseFloat(result.lat);
                    const lng = parseFloat(result.lon);

                    latInput.value = lat.toFixed(6);
                    lngInput.value = lng.toFixed(6);

                    const newLatLng = new L.LatLng(lat, lng);
                    marker.setLatLng(newLatLng);
                    map.setView(newLatLng, 15);

                    searchInput.value = result.display_name.split(',')[0];
                    searchResults.classList.add('hidden');
                });
                searchResults.appendChild(div);
            });

            searchResults.classList.remove('hidden');
        } catch (error) {
            console.error("Search failed:", error);
        }
    }

    async function reverseGeocode(lat, lng) {
        try {
            searchInput.placeholder = "Loading address...";
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'ChromeLocationChanger/1.0'
                }
            });
            const data = await response.json();

            if (data && data.display_name) {
                searchInput.value = data.display_name;
            } else {
                searchInput.value = '';
                searchInput.placeholder = "Search street, city or country...";
            }
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
            searchInput.placeholder = "Search street, city or country...";
        }
    }

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });
});
