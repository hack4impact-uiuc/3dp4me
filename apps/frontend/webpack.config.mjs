import Dotenv from "dotenv-webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const config = (env) => {
  let frontendUrl = 'http://localhost:8080';
  if (env.production)
    frontendUrl = `https://${process.env.PROJECT_NAME}.3dp4me-software.org/`

  let envPrefix = "development"
  if (env.production)
      envPrefix = "production"

  const dotenvPath = `./${envPrefix}.${process.env.PROJECT_NAME}.env`

  return {
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
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "public/3dp4me_logo.png",
          },
          {
            from: "public/favicon.ico",
          },
          {
            from: "public/robots.txt",
          },
          {
            from: "public/manifest.json",
          },
        ],
      }),


      new HtmlWebpackPlugin({
        template: "./public/index.html",
        base: frontendUrl
      }),

      new Dotenv({
        path: dotenvPath,
        safe: true,
      }),
    ],
  }
};

export default config;