import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins:
    [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './index.html',
        title: 'hello App'
      })
    ],
  resolve: {
    alias: {'vue': 'vue/dist/vue.js'}
  }
}
export default config;
