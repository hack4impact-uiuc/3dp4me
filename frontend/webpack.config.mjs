// const path = require("path")
import path from "path";
// import { Configuration } from "webpack";
// // import CopyWebpackPlugin from "copy-webpack-plugin";
// import HtmlWebpackPlugin from "html-webpack-plugin";

const config = {
  mode: "development",
  entry: "./src/index.tsx",
  module: {
    rules: [

      {
        test: /\.(js|jsx)$/,
       // test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // query:
          //   {
          //     presets:['react', 'preset-env']
          //   }
        }
      },

      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },

      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true,
            },
          },
        ],
      },

      { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader", exclude: /node_modules/ },

      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },

      {
        test: /\.m?js/,
        resolve: {
            fullySpecified: false
        }
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"]
    }
  },
  output: {
    filename: "bundle.js",
    // path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    // new CopyWebpackPlugin({
    //   patterns: [{ from: "public" }],
    // }),
    // new HtmlWebpackPlugin({
    // })
  ],
};

export default config;