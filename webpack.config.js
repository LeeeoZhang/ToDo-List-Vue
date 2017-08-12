module.exports = {
  entry: './src/app.js',
  output: {
    filename: './dist/bundle.js'
  },
  module: {
    loaders:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react'
      },
      {
        test: /\.css$/,
        loader: ['style-loader','css-loader']
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  }
}