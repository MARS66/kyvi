/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-05-23 17:01:15
 * @LastEditors: Kevin
 * @LastEditTime: 2024-05-24 14:56:04
 */
import request from '@/utils/request'
// 注册方法
export function queryPlans(data) {
  return request({
    url: '/system/annual/list',
    // mock:true,
    method: 'post',
    data,
  })
}
// 注册方法
export function addPlan(data) {
  return request({
    url: '/system/annual/add',
    method: 'post',
    data,
  })
}
// 注册方法
export function editPlan(data) {
  return request({
    url: '/system/annual/edit',
    method: 'post',
    data,
  })
}
