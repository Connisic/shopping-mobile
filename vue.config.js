const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'red': '#e53e3e',
            'primary-color': '#e53e3e'
          }
        }
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8090', // 后端服务地址，根据实际情况修改
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' // 将/api前缀重写为空
        }
      }
    }
  }
})
