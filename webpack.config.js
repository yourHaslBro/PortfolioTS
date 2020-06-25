var path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: ['@babel/polyfill', './app/main.ts'],
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@c': path.resolve(__dirname, './Components'),
      'scss': path.resolve(__dirname, './app/scss'),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
              appendTsSuffixTo: [/\.vue$/]
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: file => (/node_modules/.test(file) && !/\.vue\.js/.test(file))
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {loaders: {ts: 'ts-loader'}, esModule: true}
          },
        ]
      },
      {
        test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
        use: {
          loader: 'url-loader?limit=8763&name=images/[name].[ext]',
          options: {esModule: false},
        }
      },   
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: { 
              sourceMap: true,
              config: { 
                path: 'postcss.config.js' 
              } 
            }
          },
          {loader: 'sass-loader'}
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({filename: 'style.css'})
  ]
}
