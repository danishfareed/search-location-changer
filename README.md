# Chrome Location Changer Extension
![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

A premium, open-source Google Chrome extension that allows you to simulate and lock your browser's HTML5 Geolocation. Works entirely out of the box with zero configuration required.

## Features
- 🌍 **Search Anywhere:** Type any city, street, or neighborhood using the integrated OpenStreetMap Nominatim search.
- 📍 **Interactive Map:** Pick or fine-tune your desired coordinates visually on a map (via Leaflet).
- 🔓 **No API Keys Required:** Uses completely free services (OSM & Leaflet).
- ⚙️ **Robust Override:** Injects directly into the page's execution environment to override `navigator.geolocation`, bypassing typical restrictions and avoiding Chrome's "Yellow Debugger Bar".
- 🎨 **Premium UI:** Features a sleek dark mode, glassmorphism aesthetics, and smooth animations.

## Installation
1. Clone or download this repository.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click the **Load unpacked** button.
5. Select the directory containing this extension (`search-location-changer`).

## Usage
1. Click the extension icon in your browser toolbar.
2. Search for your desired location or click anywhere on the interactive map.
3. Click the toggle switch at the top to turn Location Override **ON**.
4. The extension will automatically intercept location requests from websites and provide them with your selected coordinates.

## How it works
The extension uses Manifest V3. When active, it injects a lightweight script (`inject.js`) into the `MAIN` world of every web page before the document loads. This script hijacks the native `navigator.geolocation.getCurrentPosition` and `watchPosition` methods and returns the fake coordinates stored in `chrome.storage.local`.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is open-source and available under the [MIT License](LICENSE).
