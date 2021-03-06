const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const path = require('path');
// const InterpolateHtmlPlugin = require('interpolate-html-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
});



module.exports = {
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin()],
    usedExports: true,
    sideEffects: true,
  },
  plugins: [
    htmlPlugin,
    // new InterpolateHtmlPlugin({
    //   PUBLIC_URL: '/public',
    // }),
  ],
};
