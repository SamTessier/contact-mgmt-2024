const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  tailwind: true,
  postcss: true,
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildPath: "build/index.js",
  serverDependenciesToBundle: ["d3-time-format"],
  browserNodeBuiltinsPolyfill: {
    modules: { path: true, os: true, crypto: true },
  },
  webpack: (config) => {
    config.plugins = [
      ...config.plugins,
      new NodePolyfillPlugin(),
    ];
    return config;
  },
};
