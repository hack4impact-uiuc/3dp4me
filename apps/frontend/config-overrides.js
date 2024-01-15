module.exports = function override(config, env) {
  config.plugins.find(plugin => plugin.constructor.name === 'ForkTsCheckerWebpackPlugin').memoryLimit = 4096;
  return config;
};