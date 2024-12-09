import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { ProjectGroupType, ProjectGroup } from '@/domains/project'
import * as api from '@/api/project'
import { getSysTemplate } from '@/api/templates'

export interface IProjectState {
  allGroups: ProjectGroup[]
}

export const useProjectStore = defineStore('project', {
  state: (): IProjectState => ({
    allGroups: [],
  }),
  getters: {
    group(state) {
      const list = state.allGroups.flatMap(m => m.children)
      return new ProjectGroup(-1, '全部应用', list)
    },
    groups(state) {
      return state.allGroups
    },
  },
  actions: {
    async request() {
      try {
        const res = await api.getProjects()
        if (res.data.code === 0) {
          const list: ProjectGroup[] = res.data.data || []
          list.forEach(item => {
            item.children.forEach(subitem => {
                subitem.groupId = 0
            })
          })
          // localStorage.setItem('PROJECTS', JSON.stringify(list.flatMap(item=>item.children)))
          const data = JSON.parse(localStorage.getItem('PROJECTS') ?? '[]')
          this.allGroups = JSON.parse(localStorage.getItem('GROUPS') ?? '[]').map((item:any) => {
            item.children = data.filter((m: any) => m.groupId === item.id)
            return item
          })
          
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async delete(pid: number, gid: number) {
      try {
        const res = await api.deleteProject(pid)
        if (res.data.code === 0) {
          const g = this.allGroups.find(m => m.id === gid)
          if (g) {
            g.children = g.children.filter(m => m.id !== pid)
          }
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async updateName(id: number, newName: string) {
      try {
        const res = await api.updateProjectName(id, newName)
        if (res.data.code !== 0) {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async move(pid: number, fromId: number, toId: number) {
      try {
        const res = await api.moveProject(pid, fromId, toId)
        if (res.data.code === 0) {
          const formG = this.allGroups.find(m => m.id === fromId)
          const toG = this.allGroups.find(m => m.id === toId)
          if (formG && toG) {
            const idx = formG.children.findIndex(m => m.id === pid)
            const p = formG.children.splice(idx, 1)[0]
            p.groupId = toId
            toG.children.push(p)
          }
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async copy(pid: number, gid: number) {
      try {
        const res = await api.copyProject(pid)
        if (res.data.code === 0) {
          const g = this.allGroups.find(m => m.id === gid)
          if (g) {
            // TODO: 这里只是简单 cloneDeep，实际应该在后端完成
            const p = g.children.find(m => m.id === pid)
            const copy_p = cloneDeep(p)
            copy_p.id = Math.round(Math.random() * 1000)
            copy_p.name += '_copy'
            g.children.push(copy_p)
          }
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async createGroup(name: string) {
      try {
        const groups = JSON.parse( localStorage.getItem('GROUPS') || '[]') 
        groups.push({name,id:groups.length})
        localStorage.setItem('GROUPS', JSON.stringify(groups))
        this.request()
      } catch (error) {
        throw error
      }
    },
    async deleteGroup(id: number) {
      try {
        const res = await api.deleteProjectGroup(id)
        if (res.data.code === 0) {
          const idx = this.allGroups.findIndex(m => m.id === id)
          const ungroup = this.allGroups.find(m => m.type === ProjectGroupType.ungroup)
          if (idx > -1 && ungroup) {
            const [group] = this.allGroups.splice(idx, 1)
            group.children.forEach(item => {
              item.groupId = ungroup.id
              ungroup.children.push(item)
            })
          }
        } else {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
    async updateGroupName(id: number, newName: string) {
      try {
        const res = await api.updateProjectGroupName(id, newName)
        if (res.data.code !== 0) {
          throw Error(res.data.message)
        }
      } catch (error) {
        throw error
      }
    },
  },
})
