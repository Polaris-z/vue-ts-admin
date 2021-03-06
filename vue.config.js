const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const isProduction = process.env.NODE_ENV === 'production'
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  // 基本路径
  publicPath: '/',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  productionSourceMap: false,

  // 是否生成.map文件
  configureWebpack: config => {
    config.devtool = 'source-map' // 调试 时需要开启
    if (isProduction) {
      config.externals = {
        'vue': 'Vue',
        'viser-vue': 'ViserVue',
        'ant-design-vue': 'antd',
        'moment': 'moment',
        'axios': 'axios',
        'lodash': '_'
      }
      config.plugins.push(new BundleAnalyzerPlugin()) // 打包显示模块依赖关系
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }))
    }
  },
  devServer: {
    port: 3001,
    // 设置代理
    proxy: {
      '/rest': {
        target: 'https://www.easy-mock.com/mock/5c7a5a02dc9d506d00c573b5/api',
        changeOrigin: true,
        pathRewrite: {
          '^/rest': ''
        }
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 'primary-color': '#1DA57A',
          // 'link-color': '#1DA57A',
          'border-radius-base': '2px',
        },
        javascriptEnabled: true
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src'))
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  }
}

function resolve(dir) {
  return path.join(__dirname, dir)
}