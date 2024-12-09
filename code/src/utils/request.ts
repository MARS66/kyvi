/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-09-14 08:35:11
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-19 09:09:05
 */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import MockApi from '@/api/mock'

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_PROD ? '/' : import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
  withCredentials: true,
})

// request interceptor
instance.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// response interceptor
instance.interceptors.response.use(
  response => {
    const res = response.data

    // 如果自定义code不为0，则将其判断为错误。
    if (res.code !== undefined && res.code !== 0) {
      // TODO

      // 50008: 非法的token; 50012: 其他客户端登录了; 50014: Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // TODO
      }
      return Promise.reject(new Error(res.message || 'System Error'))
    }

    return response
  },
  error => {
    return error
  },
)

if (import.meta.env.VITE_APP_PROD) {
  const mockAdapter = new MockAdapter(instance, { delayResponse: 500 })
  MockApi(mockAdapter)
}

export default instance
