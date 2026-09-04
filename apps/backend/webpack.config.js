const nodeExternals = require('webpack-node-externals')

module.exports = {
    entry: "./src/index.ts",
    target: 'node',
    // Externalize real npm deps (so native modules like sharp still resolve their
    // prebuilt binaries at runtime), but keep bundling @3dp4me/* workspace packages —
    // they're monorepo-internal and the runtime image never ships their build output.
    externals: [nodeExternals({ allowlist: [/^@3dp4me\//] })],
    module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.node$/,
            use: 'node-loader',
          },
        ],
    },
    node: {
      __dirname: false,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.node'],
    },
    output: {
        filename: 'bundle.js',
        path: __dirname + '/build',
    },
};
