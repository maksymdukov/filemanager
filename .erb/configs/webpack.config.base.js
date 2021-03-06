/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import fs from 'fs';
import dotenv from 'dotenv';
import { dependencies as externals } from '../../src/package.json';

const envVars = dotenv.parse(fs.readFileSync(path.join(process.cwd(), '.env')));

export default {
  externals: {
    electron: 'commonjs2 electron',
    react: 'commonjs2 react',
    'react-dom': 'commonjs2 react-dom',
  },

  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        loader: 'worker-loader',
        options: {
          filename: '[name].[contenthash].js',
          worker: 'WorkerThread',
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },

  output: {
    path: path.join(__dirname, '../../src'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [
      path.join(__dirname, '..', '..', 'src'),
      'node_modules',
      path.join(__dirname, '..', '..', 'src', 'node_modules'),
    ],
    alias: {
      'elcommander-plugin-sdk': path.resolve(
        __dirname,
        '..',
        '..',
        'packages',
        'elcommander-plugin-sdk',
        'src'
      ),
      'elcommander-fs-plugin-google-drive': path.resolve(
        __dirname,
        '..',
        '..',
        'packages',
        'elcommander-fs-plugin-google-drive',
        'src'
      ),
    },
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      ...envVars,
    }),
  ],
};
