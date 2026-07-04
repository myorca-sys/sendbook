const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Only watch the project root and the shared folder (STRICT)
config.watchFolders = [projectRoot, path.resolve(workspaceRoot, "shared")];

// 2. Let Metro know where to find node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. Force Metro to ignore large/useless directories to save watchers
config.resolver.blockList = [
  /node_modules\/.*\/node_modules/, // Ignore nested node_modules
  /.*\/apps\/(?!mobile).*/, // Ignore all other apps except mobile
  /.*\.git\/.*/, // Ignore git
  /.*\.next\/.*/, // Ignore next.js build artifacts
  /.*\/apps\/mobile\/android\/.*/,
  /.*\/apps\/mobile\/ios\/.*/,
  /.*\/apps\/mobile\/\.expo\/.*/,
];

config.resolver.disableHierarchicalLookup = true;

// Polyfill Node core modules
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  buffer: require.resolve("@craftzdog/react-native-buffer"),
};

module.exports = config;
