#!/bin/sh
 
# Install Node.js using Homebrew
brew install node
 
# Install CocoaPods using Homebrew
brew install cocoapods
 
# Navigate to the project root directory
cd ..
 
# Install Node.js dependencies
npm install
 
# Navigate back to the ios directory
cd ios
 
# Install dependencies you manage with CocoaPods
pod install

npm i patch-package
npx patch-package

# xcode cloud sets `CI` env var to 'TRUE':
# This causes a crash: Error: GetEnv.NoBoolean: TRUE is not a boolean.
# This is a workaround for that issue.
CI="true" npx expo prebuild