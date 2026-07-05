const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.watchFolders = [projectRoot];

config.resolver.blockList = [
  /node_modules\/.*\/node_modules/,
  /.*\.git\/.*/,
  /.*\/apps\/mobile\/android\/.*/,
  /.*\/apps\/mobile\/ios\/.*/,
  /.*\/apps\/mobile\/\.expo\/.*/,
];

module.exports = config;
