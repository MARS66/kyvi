/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-05-25 11:37:30
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-29 16:34:14
 */
import request from '@/utils/request'
// 注册方法
export function querySummary(data) {
  return request({
    url: '/system/summary/list',
    method: 'post',
    data: data
  })
}
// 注册方法
export function updateSummary(data) {
  return request({
    url: '/system/summary/add',
    method: 'post',
    data: data
  })
}
