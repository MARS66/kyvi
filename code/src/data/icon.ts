/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-10-16 08:26:51
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-16 11:29:32
 */
// import { ReplaceMode } from '@kyvi/chart-diagram';
import axios from "axios";
import { parseSvg } from "@kyvi/cobweb-svg";  
export const userPensUrl = {
    "svg": getUserDir("/data_source/svg/",[]),
    "png": getUserDir("/data_source/image/",[]),
}
function getUserDir(path='',extend = []) {
    return async () => {
        const {data: fileList} = await axios.get(path)
        return fileList.concat(extend)  // 合并路径，方便未来用户自定义扩充路径
    }
}



export async function getOtherIcons(){
    let result = []
    let datas  = await Promise.all([
        getSvg(),
        getImages(),
    ])
    result.push(...datas.filter(Boolean))
    return result
}

async function getSvg(){
    const folderName = "data_source/svg/"
    let svgs = []
    const svgUrl = await userPensUrl.svg()
    for (let i of svgUrl ){
        if(i.type === "directory"){
            const {data:files} = await axios.get(folderName+i.name+'/')
            svgs.push({
                name: i.name,
                path:'/'+folderName+i.name+'/',
                count:files.length,
                list:[],  // 进行懒加载 暂时不获取文件内容
                folder:true,  // 标记为文件夹 懒加载时进行处理
                show:true,
                svg:true, // 标记为svg文件
                loaded:false // 是否已经懒加载
            })
        }
    }
    return svgs
}

async function getImages(){
    const folderName = "data_source/image/"
    let png = []
    const pngUrl =await userPensUrl.png()
    for (let i of pngUrl ){
        if(i.type === "directory"){
            const {data:files} = await axios.get(folderName+i.name+'/')
            png.push({
                name:i.name,
                count:files.length,
                path:'/'+folderName+i.name+'/',
                list:[],  
                folder:true, 
                show:true,
                svg:false, 
                loaded:false
            })
        }
    }
    return png
}

export async function svgToPens(f:any, dName:string) {
    const name = getFileName(f.name)
    const image = "/data_source/svg/" + dName + "/" + f.name
    return {
        name,
        image,
        data: parseSvg(await fetch(image).then((res)=> res.text())),
        component: true,
    }
}

function getFileName(name:string){
    const n = name.lastIndexOf('.')
    if(n!==-1){
        return name.substring(0,n)
    }
    return name
}

export async function pngToPens(f:any,dName:string){
    const name = getFileName(f.name)
    const image = "/data_source/image/" + dName + "/" + f.name
    return {
        name,
        image
    }
}