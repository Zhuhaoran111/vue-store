const { defineConfig } = require('@vue/cli-service')
let path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, //关闭eslint检查


})




module.exports = {
  lintOnSave: false, //关闭eslint检查
  configureWebpack: (config) => {
    config.resolve = {
      extensions: ['.js', '.json', '.vue'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    }
  },

  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
}