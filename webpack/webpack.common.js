const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlPageNames = ['form-info','form-join'];

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
  devServer: {
    port: 8080, // 클라이언트 포트 번호
    proxy: {
      '/api/': { // /api/로 시작하는 url은 아래의 전체 도메인을 추가하고, 옵션을 적용 
        target: 'http://localhost:4000', // 클라이언트에서 api로 보내는 요청은 주소를 3095로 바꿔서 보내겠다 라는 뜻
        changeOrigin: true, // cross origin 허용 설정
      },
    },
  },
};
