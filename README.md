# Popup for Google Tasks

![screenshot](https://i.imgur.com/aXvemQS.png)

## Installation

### Chrome and Chromium-based browsers

1. Clone this repository
2. Go to `chrome://extensions/`
3. Enable developer mode
4. Click "Load unpacked"
5. Select the folder of the cloned repository (containing `manifest.json`)
6. You're done! Click the extension icon to open the popup.

### Firefox

To sign the extension for use in Firefox, you will need credentials from https://addons.mozilla.org/en-US/developers/addon/api/key/. Create a copy of `.env.example` named `.env` and replace the placeholders with your API key and secret. Install `web-ext` with `npm install -g web-ext` and sign the extension with `make sign-firefox`. The generated extension will appear as a `.xpi` file in `./web-ext-artifacts`. This file can be opened in Firefox to install the add-on.
