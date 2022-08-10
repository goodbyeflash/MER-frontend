const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlPageNames = ['form-info','form-join','admin-member','training', 'admin', 'admin-member-detail', 'mer', 'mer-detail'];

const multipleHtmlPlugins = htmlPageNames.map(name => {
  return new HtmlWebpackPlugin({
    template: Path.resolve(__dirname, `../src/pages/${name}.html`), // relative path to the HTML files
    filename: `${name}.html`, // output HTML files
    chunks: [`${name}`] // respective JS files
  });
});

module.exports = {
  entry: {
    'main' : Path.resolve(__dirname, '../src/scripts/index.js'),
    'form-info' : Path.resolve(__dirname, '../src/scripts/form-info.js'),
    'form-join' : Path.resolve(__dirname, '../src/scripts/form-join.js'),
    'admin-member' : Path.resolve(__dirname, '../src/scripts/admin-member.js'),
    'training' : Path.resolve(__dirname, '../src/scripts/training.js'),
    'admin-member-detail' : Path.resolve(__dirname, '../src/scripts/admin-member-detail.js'),
    'mer' : Path.resolve(__dirname, '../src/scripts/mer.js'),
    'mer-detail' : Path.resolve(__dirname, '../src/scripts/mer-detail.js'),
    'admin' : Path.resolve(__dirname, '../src/scripts/admin.js'),
  },
  output: {
    path: Path.join(__dirname, '../build'),
    filename: 'js/[name].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: Path.resolve(__dirname, '../public'), to: 'public' }],
    }),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/index.html'),
      chunks : ['main']
    }),
  ].concat(multipleHtmlPlugins),
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        type: 'asset'
      },
    ],
  },
};