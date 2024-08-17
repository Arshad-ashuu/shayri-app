// Import the default Metro configuration from Expo
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add `.cjs` to the list of file extensions that Metro should resolve
config.resolver.sourceExts.push("cjs");

// Export the customized Metro configuration
module.exports = config;
