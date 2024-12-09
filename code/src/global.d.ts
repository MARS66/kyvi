/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2023-10-31 17:14:18
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-13 13:55:26
 */
import { Meta2d } from '@kyvi/cobweb';
export { };
  const GlobalFn=  () => {}
declare global {
  var cobweb: Meta2d;
  var C2S: any;
  var dataSource: Array;
  var warning:GlobalFn;
}
