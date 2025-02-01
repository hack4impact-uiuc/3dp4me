module.exports = {
    entry: "./src/test.ts",
    target: 'node',
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
        filename: 'test.js',
        path: __dirname + '/build',
    },
};
