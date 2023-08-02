# Popup for Google Tasks

![screenshot](https://i.imgur.com/aXvemQS.png)

## Installation

[![Available in the Chrome Web Store](https://user-images.githubusercontent.com/20955511/201192698-df2474d7-83e8-429f-a4a5-d590ff1bfb5b.png)](https://chrome.google.com/webstore/detail/popup-for-google-tasks/neafpdejiddfkboppdcblgnfngngdeif)
[![Firefox Get the Add-on](https://user-images.githubusercontent.com/20955511/172904059-eb121557-ef91-43a6-a5f6-f4be5e20a5dc.png)](https://addons.mozilla.org/addon/popup-for-google-tasks/)

### Chrome and Chromium-based browsers

Install from [Chrome Web Store](https://chrome.google.com/webstore/detail/popup-for-google-tasks/neafpdejiddfkboppdcblgnfngngdeif) or follow the instructions to build the extension from the source.

1. Clone this repository
2. Go to `chrome://extensions/`
3. Enable developer mode
4. Click "Load unpacked"
5. Select the folder of the cloned repository (containing `manifest.json`)
6. You're done! Click the extension icon to open the popup.

### Firefox

Install from [Mozilla Add-ons](https://addons.mozilla.org/addon/popup-for-google-tasks/) or follow the instructions to build the extension from the source.

To sign the extension for use in Firefox, you will need credentials from https://addons.mozilla.org/en-US/developers/addon/api/key/. Create a copy of `.env.example` named `.env` and replace the placeholders with your API key and secret. Install `web-ext` with `npm install -g web-ext` and sign the extension with `make sign-firefox`. The generated extension will appear as a `.xpi` file in `./web-ext-artifacts`. This file can be opened in Firefox to install the add-on.
