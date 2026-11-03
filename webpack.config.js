const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const dotenv = require("dotenv");
dotenv.config();
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: 'auto',
    webassemblyModuleFilename: 'wasm/[hash].wasm',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules|public\/wasm/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.wasm$/,
        type: 'webassembly/async',
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      templateParameters: {
        process: {
          env: {
            NODE_ENV: process.env.NODE_ENV
          }
        }
      }
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
      React: 'react',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env.REGISTRY_URL": JSON.stringify(process.env.REGISTRY_URL),
      "process.env.REPO_OWNER": JSON.stringify(process.env.REPO_OWNER),
      "process.env.REGISTRY_USERNAME": JSON.stringify(process.env.REGISTRY_USERNAME),
      "process.env.REGISTRY_PASSWORD": JSON.stringify(process.env.REGISTRY_PASSWORD),
      "process.env.BIOCHEF_CATALOG_PACKAGE": JSON.stringify(process.env.BIOCHEF_CATALOG_PACKAGE),
      "process.env.BIOCHEF_CATALOG_PUBLIC_JWK": JSON.stringify(process.env.BIOCHEF_CATALOG_PUBLIC_JWK),
      "process.env.BIOCHEF_ALLOW_UNSIGNED_LOCAL_CATALOG": JSON.stringify(process.env.BIOCHEF_ALLOW_UNSIGNED_LOCAL_CATALOG),
    }),
  ],
  resolve: {
    fallback: {
      crypto: false,
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      path: require.resolve('path-browserify'),
      fs: false,
      vm: require.resolve('vm-browserify'),
    },
    alias: {
      wasm: path.resolve(__dirname, 'public/wasm'),
    },
    extensions: ['.js', '.jsx', '.wasm'], // Ensure .wasm files are resolved
  },
  experiments: {
    asyncWebAssembly: true,
    topLevelAwait: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    host: '0.0.0.0',       // Added this line to specify the host
    port: 8082,            // Changed the port to 8082
    historyApiFallback: true,
    open: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    maxAssetSize: 5000000, // 5 MB
    maxEntrypointSize: 5000000, // 5 MB
  },
};
