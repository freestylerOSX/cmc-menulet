const path = require('path')
const webpack = require('webpack')
const { productName, dependencies } = require('./package.json')
const HappyPack = require('happypack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  target: 'electron-renderer',
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval',
  entry: [
    'source-map-support/register',
    './src/index.css',
    './src/index.jsx',
  ],
  plugins: [
    new HappyPack({
      loaders: ['babel-loader'],
      threads: 4,
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.ExternalsPlugin('commonjs', Object.keys(dependencies)),
    new webpack.NamedModulesPlugin(),
    new webpack.EnvironmentPlugin({ NODE_ENV: 'development', CHANNEL: 'web' }),
    // new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify() }),
    new webpack.LoaderOptionsPlugin({ minimize: process.env.NODE_ENV === 'production' }),
    new ExtractTextPlugin('renderer.css'),
    new HtmlWebpackPlugin({
      title: productName,
      filename: 'renderer.html',
      template: 'src/index.ejs',
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'renderer.js',
  },
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json', '.css'],
  },
  module: {
    loaders: [
      {
        test: /\.css/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'postcss-loader'],
        }),
      },
      {
        test: /\.jsx?$/,
        use: 'happypack/loader',
        include: [
          path.resolve('./src'),
          path.resolve('./node_modules/react-icons'),
        ],
      },
      {
        test: /\.json$/,
        use: 'json-loader',
      },
    ],
  },
}