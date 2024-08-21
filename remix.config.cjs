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
  serverDependenciesToBundle: [
    "@react-spring/animated",
    "@react-spring/core",
    "@react-spring/rafz",
    "@react-spring/shared",
    "@react-spring/types",
    "@react-spring/web",
    "d3-array",
    "d3-color",
    "d3-format",
    "d3-interpolate",
    "d3-path",
    "d3-scale",
    "d3-scale-chromatic",
    "d3-shape",
    "d3-time",
    "d3-time-format",
    "internmap",
    "esm/merge",
  ],
  browserNodeBuiltinsPolyfill: {
    modules: { path: true, os: true, crypto: true },
  },
  webpack: (config) => {
    config.plugins = [...config.plugins, new NodePolyfillPlugin()];
    return config;
  },
};
