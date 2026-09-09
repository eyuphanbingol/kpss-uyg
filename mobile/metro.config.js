const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const catalogJson = /src[\\/]content[\\/]catalog\.json$/;
config.resolver.blockList = config.resolver.blockList
    ? [config.resolver.blockList, catalogJson]
    : catalogJson;

module.exports = config;
