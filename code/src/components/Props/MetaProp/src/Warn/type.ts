/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-09-06 11:19:17
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-12 09:10:06
 */
export  enum EventAction {
  Link,           // 打开链接  
  SetProps,       // 更改属性
  StartAnimate,   // 执行动画
  PauseAnimate,   // 暂停动画
  StopAnimate,    // 停止动画
  JS,             // 执行JS代码
  GlobalFn,       // 执行全局函数
  Emit,           // 发送消息
  StartVideo,     // 播放视频
  PauseVideo,     // 暂停视频
  StopVideo,      // 停止视频
  SendPropData,   // 发送图元数据
  SendVarData,    // 发送绑定变量
}
export const LevelTypes = [
  {label:'高报1级',value:'g1'},
  {label:'高报2级',value:'g2'},
  {label:'高报3级',value:'g3'},
  {label:'低报1级',value:'d1'},
  {label:'低报2级',value:'d2'},
  {label:'低报3级',value:'d3'},
]

export interface Range  {
  level: string,
  start: string,
  end: string,
}
export interface Value  {
  background?: string,
  visible?:boolean,
  color?: string
}
export interface EventAttr {
    name: string,
    ranges:Range[]
    action: EventAction,
    value?:string
 }