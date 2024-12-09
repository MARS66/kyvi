/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-05-21 14:24:41
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-29 16:34:26
 */
import request from '@/utils/request'
// 注册方法
export function queryLeaves(data) {
  return request({
    url: '/system/leave/list',
    method: 'post',
    data: data
  })
}
// 注册方法
export function addLeave(data) {
  return request({
    url: '/system/leave/add',
    method: 'post',
    data: data
  })
}
// 注册方法
export function editLeave(data) {
  return request({
    url: '/system/leave/edit',
    method: 'post',
    data: data
  })
}
export function deleteLeave(id) {
  return request({
    url: '/system/leave/delete',
    method: 'post',
    data: {id}
  })
}
