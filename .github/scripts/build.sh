#!/usr/bin/env bash

# Declare list of files to zip
FILES='images/* LICENSE manifest.json README.md popup.html popup.js'

# Create directory for zip files
mkdir -p dist

############################
# Chrome Extension Archive #
############################

zip -r -X "dist/chrome-extension.zip" $FILES

#############################
# Firefox Extension Archive #
#############################

setup() {
    # Ensure files to move exist
    if [ ! -f manifest-firefox.json ] || [ ! -f manifest.json ]; then
        echo "manifest-firefox.json or manifest.json was not found. Please run this script from the root of the extension."
        exit 1
    fi
    # Copy the firefox manifest to use instead of the chrome manifest
    mv manifest.json manifest-chrome.json && mv manifest-firefox.json manifest.json
    # Run cleanup in case of Ctrl+C
    trap cleanup SIGINT
}

cleanup() {
    # Ensure files to move exist
    if [ ! -f manifest-chrome.json ] || [ ! -f manifest.json ]; then
        echo "manifest-chrome.json or manifest.json was not found. Please run this script from the root of the extension."
        exit 1
    fi
    # Copy the chrome manifest back to the firefox manifest
    mv manifest.json manifest-firefox.json && mv manifest-chrome.json manifest.json
}

setup
zip -r -X "dist/firefox-extension.zip" $FILES
cleanup
