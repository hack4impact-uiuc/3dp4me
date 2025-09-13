// webpack.config.js
import { ExpirationStatus } from '@aws-sdk/client-s3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: "./src/index.ts",
    // TODO: UPDATE
    mode: 'development',
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
        __dirname: true,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.node'],
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        module: true,
    },
    experiments: {
        outputModule: true,
    },
};
