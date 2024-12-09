/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-04-09 11:14:48
 * @LastEditors: Kevin
 * @LastEditTime: 2024-05-25 16:26:16
 */
const getters = {
  group:state => state.user.group,
  sidebar: state => state.app.sidebar,
  user: state => state.user.userInfo,
  size: state => state.app.size,
  device: state => state.app.device,
  dict: state => state.dict.dict,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  topbarRouters:state => state.permission.topbarRouters,
  defaultRoutes:state => state.permission.defaultRoutes,
  sidebarRouters:state => state.permission.sidebarRouters,
}
export default getters
