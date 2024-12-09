/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2023-10-31 17:14:18
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-16 09:52:56
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import fs from "fs"
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    devServerMiddleware(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "./src/svg")],
      symbolId: "icon-[dir]-[name]",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
  },
});

function devServerMiddleware(){
  return {
    name:"vite-plugin-get-files",  // 插件名，标准配置
    configureServer(server){  // 方法
      server.middlewares.use( // 引入中间间
          (req, res, next)=>{
            const url = req.originalUrl  // 获取请求的源路径
            if((url.startsWith("/data_source/") || url.startsWith("/png/") || url.startsWith("/icon/") || url.startsWith("/canvasDraw/") || url.startsWith("/path2D/"))  && url.endsWith("/")){  // 路径判断 特殊处理svg和png路径的
                const pwd = decodeURI(path.join(__dirname, 'public', url));  // 路径
                try {
                    const files = fs.readdirSync(pwd, {  //  同步读取文件夹
                        withFileTypes: true,
                    });
                    const list = [];
                    for (const item of files) {
                        if (item.isDirectory()) {  // 判断是否为文件夹
                            list.push({ name: item.name, type: 'directory' });
                        } else {  // 非文件夹  则返回文件名  为了懒加载实现
                            list.push({ name: item.name });
                        }
                    }
                    res.end(JSON.stringify(list));
                }catch (e){
                    console.error(e)
                    next()
                }

            }else {
                next()  // 跳到下一步
            }
          }
      )
    }
  }
}