import Dotenv from "dotenv-webpack";
// const path = require("path")
import path from "path";
// import { Configuration } from "webpack";
// // import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const config = {
  mode: "production",
  entry: "./src/index.tsx",
  module: {
    rules: [

      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
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
  },
  plugins: [
    new HtmlWebpackPlugin({
      // template: "./public/index.html"
    }),

    new Dotenv({
      path: './production.env', // Path to .env file (this is the default)
      safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
    })


    // new webpack.ProvidePlugin({
    //   process: 'process/browser',
    // }),

    // new webpack.DefinePlugin({
    //   "process.env.REACT_APP_BACKEND_BASE_URL",
    //   "REACT_APP_CALLBACK_URL",
    //   "REACT_APP_COGNITO_IDENTITY_POOL_ID",
    //   "REACT_APP_COGNITO_REGION",
    //   "REACT_APP_COGNITO_USER_POOL_ID",
    //   "REACT_APP_COGNITO_WEB_COIENT_ID",
    //   "REACT_APP_OAUTH_DOMAIN",
    // })
  ],
};

export default config;