/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-09-06 09:43:43
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-14 15:22:13
 */
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/project',
    component: () => import('@/views/home/index.vue'),
    children: [
      {
        path: 'project',
        name: 'MyProject',
        component: () => import('@/views/my-project/index.vue'),
        meta: { title: '我的可视化' },
      },
      {
        path: 'data',
        name: 'MyData',
        component: () => import('@/views/my-data/index.vue'),
        meta: { title: '我的数据' },
      },
      {
        path: 'com',
        name: 'MyCom',
        component: () => import('@/views/my-data/index.vue'),
        meta: { title: '我的组件' },
      },
      {
        path: 'case',
        name: 'MyCase',
        component: () => import('@/views/my-data/index.vue'),
        meta: { title: '教程' },
      },
    ],
  },
  {
    name:'Edit',
    path: '/edit',
    component: () => import('@/views/editor/index.vue')
  },
  {
    name:'Preview',
    path: '/preview',
    component: () => import('@/views/preview/index.vue')
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;
