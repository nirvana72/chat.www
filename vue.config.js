module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  // 它支持webPack-dev-server的所有选项
  devServer: {
    // host: '192.168.31.60',
    host: '0.0.0.0',
    // public: '192.168.31.60:82',
    port: 8889, // 端口号
    https: false, // https:{type:Boolean}
    proxy: process.env.VUE_APP_APIHOST, // 配置跨域处理,只有一个代理

    // 配置多个代理
    // proxy: {}

    // natapp Invalid Host header
    disableHostCheck: true,
  },
}