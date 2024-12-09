/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-09-06 11:19:17
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-19 15:34:57
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
export const EventTypes = [
  {label:'点击',value:'click'},
  {label:'双击',value:'dblclick'},
  {label:'鼠标进入',value:'enter'},
  {label:'鼠标离开',value:'leave'},
  // {label:'选中',value:'active'},
  // {label:'取消选中',value:'inactive'},
  // {label:'鼠标按下',value:'mousedown'},
  // {label:'鼠标抬起',value:'mouseup'},
  // {label:'值变化',value:'valueUpdate'},
]
export interface Attr  {
  key: string,
  value: string
}
export interface Value  {
  background?: string,
  visible?:boolean,
  color?: string
}
export interface eventAttr {
    name: string,
    params: string,
    fn:null,
    action: EventAction,
    attrs: Attr[],
    value?:Value|string
 }