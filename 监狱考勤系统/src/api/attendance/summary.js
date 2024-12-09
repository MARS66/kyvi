import request from '@/utils/request'

// 查询基层民警加班汇总列表
export function listBasicSummary(query) {
  return request({
    url: '/attendance/basic/summary/list',
    method: 'get',
    params: query
  })
}

// 查询基层民警加班汇总详细
export function getBasicSummary(id) {
  return request({
    url: '/attendance/basic/summary/' + id,
    method: 'get'
  })
}

// 新增基层民警加班汇总
export function addBasicSummary(data) {
  return request({
    url: '/attendance/basic/summary',
    method: 'post',
    data: data
  })
}

// 修改基层民警加班汇总
export function updateBasicSummary(data) {
  return request({
    url: '/attendance/basic/summary',
    method: 'put',
    data: data
  })
}

// 删除基层民警加班汇总
export function delBasicSummary(id) {
  return request({
    url: '/attendance/basic/summary/' + id,
    method: 'delete'
  })
}

// 同步月度考勤数据
export function syncBasicVerify() {
  return request({
    url: '/attendance/basic/summary/sync',
    method: 'get'
  })
}

// 查询机关民警加班汇总列表
export function listSocietySummary(query) {
  return request({
    url: '/attendance/society/summary/list',
    method: 'get',
    params: query
  })
}

// 查询机关民警加班汇总详细
export function getSocietySummary(id) {
  return request({
    url: '/attendance/society/summary/' + id,
    method: 'get'
  })
}

// 新增机关民警加班汇总
export function addSocietySummary(data) {
  return request({
    url: '/attendance/society/summary',
    method: 'post',
    data: data
  })
}

// 修改机关民警加班汇总
export function updateSocietySummary(data) {
  return request({
    url: '/attendance/society/summary',
    method: 'put',
    data: data
  })
}

// 删除机关民警加班汇总
export function delSocietySummary(id) {
  return request({
    url: '/attendance/society/summary/' + id,
    method: 'delete'
  })
}

// 同步月度考勤数据
export function syncSocietyVerify() {
  return request({
    url: '/attendance/society/summary/sync',
    method: 'get'
  })
}