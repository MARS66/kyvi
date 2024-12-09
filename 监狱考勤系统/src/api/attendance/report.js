/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-04-09 11:14:47
 * @LastEditors: Kevin
 * @LastEditTime: 2024-06-17 10:44:49
 */
import request from '@/utils/request'
// 查询考勤数据填报列表
export function summaryAttendance(data) {
  return request({
    url: '/attendance/type/summary',
    method: 'post',
    data,
  })
}
// 批量修改
export function batchAttendance(data) {
  return request({
    url: '/attendance/type/batch',
    method: 'post',
    data,
  })
}
//  获取打卡机打卡记录
export function listHnc(data) {
  return request({
    url: '/attendance/type/listHnc',
    method: 'post',
    data,
  })
}
// 查询考勤数据填报列表
export function listReport(data) {
  return request({
    url: '/attendance/type/list',
    // mock:true,
    method: 'post',
    data,
  })
}

// 新增考勤数据填报
export function addReport(data) {
  return request({
    url: '/attendance/type/add',
    method: 'post',
    data
  })
}

// 修改考勤数据填报
export function updateReport(data) {
  return request({
    url: '/attendance/type/edit',
    method: 'post',
    data
  })
}
// 查询考勤数据填报列表
export function listApprove(data) {
  return request({
    url: '/system/approve/list',
    // mock:true,
    method: 'post',
    data,
  })
}


// 新增考勤数据填报
export function addApprove(data) {
  return request({
    url: '/system/approve/add',
    method: 'post',
    data
  })
}

// 修改考勤数据填报
export function updateApprove(data) {
  return request({
    url: '/system/approve/edit',
    method: 'post',
    data
  })
}
