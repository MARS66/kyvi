import request from '@/utils/request'

// 查询角色列表
export function listPersonRole(query) {
  return request({
    url: '/person/role/list',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getPersonRole(roleId) {
  return request({
    url: '/person/role/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addPersonRole(data) {
  return request({
    url: '/person/role',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updatePersonRole(data) {
  return request({
    url: '/person/role',
    method: 'put',
    data: data
  })
}

// 角色数据权限
export function dataPersonScope(data) {
  return request({
    url: '/person/role/dataScope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changePersonRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/person/role/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delPersonRole(roleId) {
  return request({
    url: '/person/role/' + roleId,
    method: 'delete'
  })
}

// 查询角色已授权用户列表
export function allocatedPersonUserList(query) {
  return request({
    url: '/person/role/authUser/allocatedList',
    method: 'get',
    params: query
  })
}

// 查询角色未授权用户列表
export function unallocatedPersonUserList(query) {
  return request({
    url: '/person/role/authUser/unallocatedList',
    method: 'get',
    params: query
  })
}

// 取消用户授权角色
export function authUserPersonCancel(data) {
  return request({
    url: '/person/role/authUser/cancel',
    method: 'put',
    data: data
  })
}

// 批量取消用户授权角色
export function authUserPersonCancelAll(data) {
  return request({
    url: '/person/role/authUser/cancelAll',
    method: 'put',
    params: data
  })
}

// 授权用户选择
export function authUserPersonSelectAll(data) {
  return request({
    url: '/person/role/authUser/selectAll',
    method: 'put',
    params: data
  })
}

// 根据角色ID查询部门树结构
export function deptTreePersonSelect(roleId) {
  return request({
    url: '/person/role/deptTree/' + roleId,
    method: 'get'
  })
}
