import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/prison";

// 查询用户列表
export function listPersonUser(query) {
  return request({
    url: '/person/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getPersonUser(userId) {
  return request({
    url: '/person/user/' + parseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addPersonUser(data) {
  return request({
    url: '/person/user',
    method: 'post',
    data: data
  })
}


// 修改用户
export function updatePersonUser(data) {
  return request({
    url: '/person/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delPersonUser(userId) {
  return request({
    url: '/person/user/' + userId,
    method: 'delete'
  })
}

// 用户密码重置
export function resetPersonUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/person/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changePersonUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/person/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getPersonUserProfile() {
  return request({
    url: '/person/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updatePersonUserProfile(data) {
  return request({
    url: '/person/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updatePersonUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/person/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadPersonAvatar(data) {
  return request({
    url: '/person/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 查询授权角色
export function getPersonAuthRole(userId) {
  return request({
    url: '/person/user/authRole/' + userId,
    method: 'get'
  })
}

// 保存授权角色
export function updatePersonAuthRole(data) {
  return request({
    url: '/person/user/authRole',
    method: 'put',
    params: data
  })
}

// 查询部门下拉树结构
export function deptTreePersonSelect() {
  return request({
    url: '/person/user/deptTree',
    method: 'get'
  })
}
