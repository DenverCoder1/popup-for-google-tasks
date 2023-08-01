#!/usr/bin/env bash

# Declare list of files to zip
FILES='images/* LICENSE manifest.json README.md popup.html popup.js'

# Create directory for zip files
mkdir -p dist

# Zip files
zip -r -X "dist/extension.zip" $FILES
