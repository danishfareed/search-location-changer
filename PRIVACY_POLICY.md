# Privacy Policy for Search Location Changer

**Last Updated: March 2, 2026**
**Extension Version: 1.0**

---

## 1. Introduction

This Privacy Policy describes how the **Search Location Changer** Chrome extension ("the Extension", "we", "our", or "us") handles user data. We are committed to protecting your privacy and being fully transparent about our data practices.

Search Location Changer is a browser extension that allows users to override their HTML5 Geolocation and Google Search location by specifying custom latitude and longitude coordinates. This policy covers all data handling, storage, permissions, and third-party interactions associated with the Extension.

---

## 2. Developer Information

- **Developer:** Danish Fareed
- **Contact:** For any privacy-related questions or concerns, please open an issue on our [GitHub repository](https://github.com/danishfareed/search-location-changer)
- **Source Code:** The complete source code is publicly available at [https://github.com/danishfareed/search-location-changer](https://github.com/danishfareed/search-location-changer)

---

## 3. Data Collection and Usage

### 3.1 What Data We Store

The Extension stores the following data **locally on your device only**, using Chrome's built-in `chrome.storage.local` API:

| Data Item | Type | Purpose | Default Value |
|---|---|---|---|
| **Enabled/Disabled State** | Boolean (`true`/`false`) | Remembers whether the location override is currently active | `false` |
| **Latitude** | Number (float) | The latitude coordinate you have chosen to spoof | `40.712776` (New York City) |
| **Longitude** | Number (float) | The longitude coordinate you have chosen to spoof | `-74.005974` (New York City) |

### 3.2 What Data We Do NOT Collect

We want to be absolutely clear about what we **do not** do:

- ❌ We do **not** collect any personally identifiable information (PII)
- ❌ We do **not** collect your real/actual geolocation
- ❌ We do **not** collect your browsing history or browsing activity
- ❌ We do **not** collect your IP address
- ❌ We do **not** collect any usage analytics or telemetry
- ❌ We do **not** use cookies or tracking technologies
- ❌ We do **not** collect your search queries
- ❌ We do **not** track which websites you visit
- ❌ We do **not** store any data on external servers
- ❌ We do **not** collect any data for advertising purposes
- ❌ We do **not** collect or process authentication credentials or financial information

### 3.3 Data Storage Location

All data is stored **exclusively on your local device** within Chrome's extension storage. No data is ever transmitted to, stored on, or processed by any server owned or operated by us.

### 3.4 Data Retention

Your settings (enabled state, latitude, and longitude) persist in Chrome's local storage until:

- You uninstall the Extension (all data is automatically removed by Chrome)
- You manually clear your browser's extension data
- You reset the coordinates within the Extension's popup interface

---

## 4. Permissions Explained

The Extension requires the following Chrome permissions to function. Below is a detailed explanation of why each permission is necessary:

### 4.1 `storage`
- **What it does:** Allows the Extension to save and retrieve data using Chrome's `chrome.storage.local` API.
- **Why it's needed:** To persist your chosen coordinates (latitude and longitude) and the enabled/disabled toggle state across browser sessions. Without this permission, you would need to re-enter your coordinates every time you open the browser.
- **Data stored:** Only three values — `enabled` (boolean), `lat` (number), and `lng` (number).

### 4.2 `tabs`
- **What it does:** Allows the Extension to interact with browser tabs — specifically, to query open tabs and reload them when needed.
- **Why it's needed:** When you change your spoofed location or toggle the override on/off, the Extension needs to notify all open tabs so they pick up the new coordinates. Additionally, if a Google Search tab is currently active, it is automatically reloaded so that the new location is reflected in your search results immediately.
- **What it does NOT do:** The Extension does **not** read the content of your tabs, track your browsing history, or monitor your web activity.

### 4.3 `declarativeNetRequest`
- **What it does:** Allows the Extension to modify HTTP request headers using declarative rules, without intercepting or reading the actual content of your network traffic.
- **Why it's needed:** To add a custom `x-geo` header to requests sent to `google.com`. This header contains an encoded representation of your chosen coordinates (in UULE format), which tells Google Search to return results as if you were searching from that location.
- **Scope:** This rule applies **only** to requests to `google.com` domains. No other websites' requests are modified.
- **What it does NOT do:** The Extension does **not** read, log, or store any of your network traffic, request bodies, response bodies, or any other HTTP data.

### 4.4 `<all_urls>` (Host Permission)
- **What it does:** Grants the Extension permission to run content scripts on all websites.
- **Why it's needed:** The Extension overrides the browser's built-in `navigator.geolocation` API so that **any website** requesting your location receives your chosen coordinates instead of your real location. Since any website can call the Geolocation API, the Extension must be able to inject its override script on all pages. Without this permission, the geolocation override would only work on specific websites.
- **What it does NOT do:** The Extension does **not** read, modify, or collect any page content, form data, passwords, or other information from the websites you visit. The injected script **solely** intercepts `navigator.geolocation.getCurrentPosition()`, `navigator.geolocation.watchPosition()`, and `navigator.permissions.query()` calls to provide your chosen mock coordinates.

---

## 5. Third-Party Services

### 5.1 OpenStreetMap / Nominatim API

The Extension makes requests to the **OpenStreetMap Nominatim API** (`nominatim.openstreetmap.org`) in two scenarios:

1. **Location Search (Forward Geocoding):** When you type a place name (street, city, or country) in the search bar within the Extension's popup, a request is sent to Nominatim to find matching coordinates.
2. **Address Display (Reverse Geocoding):** When you select a location on the map (by clicking or dragging the marker), a request is sent to Nominatim to retrieve the human-readable address for those coordinates.

**Data sent to Nominatim:**
- Your search query text (what you typed in the search bar)
- The latitude and longitude coordinates you selected on the map
- A generic contact email identifier for API compliance (`contact@locationchanger.ext`)

**Data NOT sent to Nominatim:**
- No personally identifiable information
- No browser fingerprinting data
- No cookies or tracking identifiers
- No browsing history

**Nominatim's own privacy policy** applies to requests made to their service. You can review it at: [https://osmfoundation.org/wiki/Privacy_Policy](https://osmfoundation.org/wiki/Privacy_Policy)

### 5.2 OpenStreetMap Tile Server

The Extension uses OpenStreetMap's tile server (`tile.openstreetmap.org`) to render the interactive map displayed in the popup window. This is a standard map tile service that delivers map images. No personal data is sent to this service beyond standard HTTP request information (your IP address, as is the case with any web request).

### 5.3 Leaflet.js

The Extension uses **Leaflet.js**, an open-source JavaScript mapping library, to render the interactive map in the popup. Leaflet.js runs entirely within your browser and does not transmit any data externally on its own.

### 5.4 No Other Third-Party Services

The Extension does **not** use:
- ❌ Any analytics services (Google Analytics, Mixpanel, etc.)
- ❌ Any advertising networks or ad SDKs
- ❌ Any crash reporting services
- ❌ Any A/B testing or experimentation platforms
- ❌ Any social media SDKs or integrations
- ❌ Any user tracking or fingerprinting tools
- ❌ Any cloud storage or database services

---

## 6. Data Sharing and Transfer

- We do **not** sell your data to any third party.
- We do **not** share your data with any third party for any purpose.
- We do **not** transfer your data to any external server or service (except the Nominatim API requests described above in Section 5.1, which only include the search query or coordinates, not any personal information).
- We do **not** use your data for purposes unrelated to the Extension's core functionality.

---

## 7. User Rights and Data Control

You have full control over all data stored by the Extension:

- **View your data:** Your saved coordinates are always visible in the Extension's popup interface.
- **Modify your data:** You can change your coordinates at any time by entering new values, searching for a location, or clicking/dragging on the map.
- **Delete your data:** Uninstalling the Extension from Chrome will automatically delete all stored data. You can also clear extension data through Chrome's settings at `chrome://settings/content/all` or by navigating to **Settings → Privacy and Security → Site Settings → View permissions and data stored across sites**.
- **Disable the Extension:** You can disable the Extension at any time using the toggle switch, which stops all geolocation spoofing and header modification without deleting your saved coordinates.

---

## 8. Security

- All data is stored locally using Chrome's secure `chrome.storage.local` API, which is sandboxed and accessible only to this Extension.
- The Extension does not establish any persistent connections to external servers.
- The Extension runs with the minimum permissions necessary for its functionality.
- All source code is open-source and publicly available for review on [GitHub](https://github.com/danishfareed/search-location-changer).

---

## 9. Children's Privacy

The Extension does not knowingly collect any personal information from children under the age of 13 (or the applicable age in your jurisdiction). Since the Extension does not collect any personal information from any user, there is no risk of collecting information from children.

---

## 10. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Any changes will be reflected in this document with an updated "Last Updated" date at the top. We encourage you to review this Privacy Policy periodically.

If material changes are made, we will update the version notes in the Chrome Web Store listing to inform users.

---

## 11. Compliance

This Extension is designed to comply with:
- **Chrome Web Store Developer Program Policies**
- **General Data Protection Regulation (GDPR)** — No personal data is collected or processed
- **California Consumer Privacy Act (CCPA)** — No personal information is sold or shared

---

## 12. Contact Us

If you have any questions, concerns, or requests regarding this Privacy Policy or the Extension's data practices, please:

- **Open an issue** on our GitHub repository: [https://github.com/danishfareed/search-location-changer/issues](https://github.com/danishfareed/search-location-changer/issues)

---

*This privacy policy is effective as of March 2, 2026.*
