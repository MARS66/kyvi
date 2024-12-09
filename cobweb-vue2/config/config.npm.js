/*
 * @Description:
 * @Author: Kevin
 * @Date: 2024-10-30 08:56:45
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-31 09:11:44
 */
const { resolve, getComponentEntries } = require('./utils');
const TerserPlugin = require('terser-webpack-plugin');

const npmBuildConfig = {
  // 输出文件目录
  outputDir: resolve('lib'),
  // webpack配置
  configureWebpack: {
    //  入口文件
    entry: getComponentEntries('packages'),
    //  输出配置
    output: {
      //  文件名称
      filename: '[name]/index.js',
      //  构建依赖类型
      libraryTarget: 'umd',
      umdNamedDefine: false,
      //  依赖输出
      libraryExport: 'default',
      //  依赖名称
      library: 'ws-grocery-store'
    },
    externals: {
      vue: {
        root: 'Vue',
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue'
      }
    },
    optimization: {
      minimizer: [ // 定制压缩选项
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false // 去掉注释
            }
          }
        })
      ]
    }
  },
  //  样式输出
  css: {
    sourceMap: true,
    extract: {
      filename: '[name]/style.css'
    }
  },
  chainWebpack: config => {
    config.optimization.delete('splitChunks');
    config.plugins.delete('copy');
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');
    config.plugins.delete('html');
    config.plugins.delete('hmr');
    config.entryPoints.delete('app');
  }
};

module.exports = npmBuildConfig;
