/** @type {import('next').NextConfig} */

const obfuscatorOptions = {
  // ... your obfuscator options
  compact: true,
  controlFlowFlattening: false,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: false,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: true,
  debugProtectionInterval: 0,
  disableConsoleOutput: true,
  domainLock: [],
  domainLockRedirectUrl: "about:blank",
  forceTransformStrings: [],
  identifierNamesCache: null,
  identifierNamesGenerator: "hexadecimal",
  identifiersDictionary: [],
  identifiersPrefix: "",
  ignoreImports: false,
  inputFileName: "",
  log: false,
  numbersToExpressions: false,
  optionsPreset: "default",
  renameGlobals: false,
  renameProperties: false,
  renamePropertiesMode: "safe",
  reservedNames: [],
  reservedStrings: [],
  seed: 0,
  selfDefending: false,
  simplify: true,
  sourceMap: true,
  sourceMapBaseUrl: "",
  sourceMapFileName: "",
  sourceMapMode: "separate",
  sourceMapSourcesMode: "sources-content",
  splitStrings: false,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.5,
  stringArrayEncoding: [],
  stringArrayIndexesType: ["hexadecimal-number"],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 1,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 2,
  stringArrayWrappersType: "variable",
  stringArrayThreshold: 0.75,
  target: "browser",
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
};

const pluginOptions = {
  // ... your plugin options
  enabled: "detect",
  patterns: ["**/*.{js,jsx,ts,tsx}"],
  obfuscateFiles: {
    buildManifest: false,
    ssgManifest: false,
    webpack: false,
    additionalModules: [],
  },
  log: false,
};

const withNextJsObfuscator = require("nextjs-obfuscator")(
  obfuscatorOptions,
  pluginOptions
);

/** @type {import("next").NextConfig} */
const nextConfig = withNextJsObfuscator({
  // ... your next.js configuration
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["kobakoo.com"],
  },
});

module.exports = nextConfig;
