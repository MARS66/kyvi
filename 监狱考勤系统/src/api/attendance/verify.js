import request from '@/utils/request'

// 查询月度考勤报告列表
export function listVerify(query) {
  return request({
    url: '/attendance/verify/list',
    method: 'get',
    params: query
  })
}

// 查询月度考勤报告详细
export function getVerify(id) {
  return request({
    url: '/attendance/verify/' + id,
    method: 'get'
  })
}

// 新增月度考勤报告
export function addVerify(data) {
  return request({
    url: '/attendance/verify',
    method: 'post',
    data: data
  })
}

// 修改月度考勤报告
export function updateVerify(data) {
  return request({
    url: '/attendance/verify',
    method: 'put',
    data: data
  })
}

// 删除月度考勤报告
export function delVerify(id) {
  return request({
    url: '/attendance/verify/' + id,
    method: 'delete'
  })
}
