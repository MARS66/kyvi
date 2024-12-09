import request from '@/utils/request'

// 查询部门列表
export function listPersonDept(query) {
  return request({
    url: '/person/dept/list',
    method: 'get',
    params: query
  })
}

// 查询部门列表（排除节点）
export function listPersonDeptExcludeChild(deptId) {
  return request({
    url: '/person/dept/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询部门详细
export function getPersonDept(deptId) {
  return request({
    url: '/person/dept/' + deptId,
    method: 'get'
  })
}

// 新增部门
export function addPersonDept(data) {
  return request({
    url: '/person/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updatePersonDept(data) {
  return request({
    url: '/person/dept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delPersonDept(deptId) {
  return request({
    url: '/person/dept/' + deptId,
    method: 'delete'
  })
}