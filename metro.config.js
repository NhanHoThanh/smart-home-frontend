const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add web support for import.meta
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configure transformer for better web compatibility
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

module.exports = config;
