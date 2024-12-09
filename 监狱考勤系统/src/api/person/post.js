import request from '@/utils/request'

// 查询岗位列表
export function listPersonPost(query) {
  return request({
    url: '/person/post/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getPersonPost(postId) {
  return request({
    url: '/person/post/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addPersonPost(data) {
  return request({
    url: '/person/post',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePersonPost(data) {
  return request({
    url: '/person/post',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delPersonPost(postId) {
  return request({
    url: '/person/post/' + postId,
    method: 'delete'
  })
}
