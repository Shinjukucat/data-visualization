const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // 这里是指定项目在哪个端口打开和自动打开浏览器，不重要，可要可不要
    port: 8090,
    // open: true
  },
})
