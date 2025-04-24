const { defineConfig } = require('@vue/cli-service')
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': "#ee0a24",
            // 'link-color': '#1DA57A',
            // 'border-radius-base': '2px',
          },
          javascriptEnabled: true,
        },
      },
      scss: {
        additionalData: `
          @import "@/styles/theme/_mixins.scss";
        `
      }
    },
  },
  devServer: {
    port: 8081,   
    // 代理服务器
	proxy: {
		'/': {
			target: 'http://localhost:8082/',
			changeOrigin: true,  
				// pathRewrite: {
				//   '^/api': ''  
				// }
		}
	}
  }
})
