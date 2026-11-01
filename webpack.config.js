const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const dotenv = require("dotenv");
dotenv.config();
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
        // The webR runtime, served from this origin rather than left to load
        // from webR's public CDN. Every other artifact the app executes is
        // pulled from our own registry, addressed by a digest recorded in a
        // recipe; fetching ~20 MB of R at run time from a third party would sit
        // outside that entirely, and would make R operations fail whenever that
        // host is unavailable. Only the files the runtime actually requests are
        // copied -- not the REPL, tests or source maps that share the package.
        // R and webR are GPL-licensed, and this ships their binaries.
        {
          from: 'node_modules/webr/LICENSE.md',
          to: 'webr/LICENSE.md',
          toType: 'file',
        },
        {
          from: 'node_modules/webr/dist',
          to: 'webr',
          globOptions: {
            ignore: [
              '**/repl/**',
              '**/tests/**',
              '**/*.map',
              '**/*.d.ts',
              '**/webr.cjs',
              '**/webr.mjs',
              '**/webr.js',
            ],
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
    minimizer: [
      // The default minimizer, with the copied webR runtime excluded. Those
      // files are shipped verbatim so they can be compared against the ones in
      // the package they came from; re-minifying them changes every byte and
      // makes that impossible, which was half the point of serving them
      // ourselves. Everything else is minified exactly as before.
      new TerserPlugin({
        exclude: /^webr\//,
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    maxAssetSize: 5000000, // 5 MB
    maxEntrypointSize: 5000000, // 5 MB
  },
};
