
module.exports = {
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      hot: true,
      port: 9000,
      watchOptions: {
        poll: true,
        ignored: '/node_modules/',
      },
    },
    optimization: {
      runtimeChunk: true,
    },
    optimization: {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    },
    output: {
      pathinfo: false,
    },
  };