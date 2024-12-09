<template>
  <div>
    <div v-if="selectedGroupId !==-1" class="new-projects-title">选择下面的方式进行创建</div>
    <div class="new-projects" v-if="selectedGroupId !==-1">
      <div
        class="new-project"
        @click="confirmCreate"
      >
        <img src="/images/new-project.png">
        <span class="project-type ellipsis">PC端创建</span>
      </div>
    </div>
    <div class="project-header">
      <div class="project-title">
        <h2>{{ group ? group.name : '' }}</h2>
      </div>
      <div class="header-manager">
        <div class="search">
          <input v-model.trim="searchText" class="search-input" placeholder="搜索">
        </div>
        <n-icon class="icon-search">
          <IconSearch />
        </n-icon>

        <n-dropdown
          :options="sortOpts"
          :show-arrow="true"
          @select="handleSortChange"
        >
          <div class="sort-type">
            <span class="sort-text" :title="sorts[sort]">
              {{ sorts[sort] }}
            </span>
            <n-icon class="icon-arrow">
              <IconArrowDown />
            </n-icon>
          </div>
        </n-dropdown>
      </div>
    </div>
    <div class="main-screen">
      <div v-for="screen in screens" :key="screen.id">
        <my-screen :screen="screen" />
      </div>
    </div>
    <publish-screen v-model="visiblePublish" :project-id="publishAppId" />
  </div>

  <n-modal
    v-model:show="visibleCreateDialog"
    preset="dialog"
    :show-icon="false"
    title="创建可视化数据应用"
    style="width: 400px;"
  >
    <div class="create-dialog">
      <p class="name-title">
        <span class="required">*</span>数据应用名称
      </p>
      <new-input
        v-model="projectName"
        placeholder="请输入大屏名称"
        spellcheck="false"
        class="name-input"
      />
    </div>
    <template #action>
      <n-button
        :focusable="false"
        @click="visibleCreateDialog = false"
      >
        取消
      </n-button>

      <n-button
        type="primary"
        :focusable="false"
        :loading="saveLoading"
        @click="doCreate"
      >
        创建
      </n-button>
    </template>
  </n-modal>
</template>

<script lang='ts'>
import {
  defineComponent, ref, PropType,
  computed, toRef, provide,
} from 'vue'
import { sortBy } from 'lodash-es'
import { ProjectGroup } from '@/domains/project'
import { IconSearch, IconArrowDown } from '@/icons'
import MyScreen from './my-screen.vue'
import PublishScreen from './publish-screen.vue'
import { projectListInjectionKey } from './config'
import { MessagePlugin } from 'tdesign-vue-next';
import { createProject } from '@/api/project'
import { useRouter } from 'vue-router'
import NewInput from '@/components/Input/src/new-input.vue'
import { generateId } from "@/utils/util.ts"
export default defineComponent({
  name: 'ProjectList',
  components: {
    MyScreen,
    NewInput,
    PublishScreen,
    IconSearch,
    IconArrowDown,
  },
  props: {
    group: Object as PropType<ProjectGroup>,
    selectedGroupId:[String,Number]
  },
  setup(props) {
    const router = useRouter()
    const saveLoading = ref(false)
    const visibleCreateDialog = ref(false)
    const projectName = ref('')
    const searchText = ref('')
    const sort = ref('name')
    const sorts = {
      name: '按名称排序',
      createAt: '按创建时间排序',
      updateAt: '按修改时间排序',
    }
    const sortOpts = Object.entries(sorts).map(([key, label]) => ({ key, label }))
    const visiblePublish = ref(false)
    const publishAppId = ref(0)

    const group = toRef(props, 'group')
    const selectedGroupId = toRef(props, 'selectedGroupId')

    const handleSortChange = (key: string) => {
      sort.value = key
    }

    const screens = computed(() => {
      let list = group.value ? group.value.children : []
      if (searchText.value) {
        const text = searchText.value.toLowerCase()
        list = list.filter(m => m.name.toLowerCase().includes(text))
      }
      return sortBy(list, sort.value)
    })

    provide(projectListInjectionKey, {
      publish(appId: number) {
        visiblePublish.value = true
        publishAppId.value = appId
      },
    })
    const doCreate = async () => {
      try {
        if (!projectName.value) {
          MessagePlugin.error('请输入大屏名称')
          return
        }
        saveLoading.value = true
        const params={
          id: generateId(),
          name: projectName.value,
          share: "",
          groupId: selectedGroupId.value,
          createAt: "1976-09-09 19:43:49",
          updateAt: "1974-06-16 09:41:48",
          thumbnail: ""
        }
        const projects = JSON.parse(localStorage.getItem('PROJECTS') || '[]')
        projects.unshift({ ...params })
        localStorage.setItem('PROJECTS', JSON.stringify(projects))
        const res = await createProject(params)
        if (res?.data.code === 0) {
          visibleCreateDialog.value = false
          router.push({
            name: 'Edit',
            query: {
              projectId: params.id,
            }
          })
        } else {
          throw Error(res.data.message)
        }
      } catch (error:any) {
        MessagePlugin.error(error.message)
      } finally {
        saveLoading.value = false
      }
    }
    const confirmCreate = () => { 
      visibleCreateDialog.value=true
    }
    return {
      searchText,
      sort,
      sorts,
      sortOpts,
      visiblePublish,
      publishAppId,
      screens,
      visibleCreateDialog,
      selectedGroupId,
      projectName,
      saveLoading,
      doCreate,
      confirmCreate,
      handleSortChange,
    }
  },
})
</script>

<style lang="postcss" scoped>
.ellipsis {
  @include utils-ellipsis;

  display: block;
}
.create-dialog {
  .required {
    display: inline-block;
    margin-right: 6px;
    color: var(--datav-red-color);
  }

  .template-desc {
    margin-bottom: 20px;
    opacity: 0.8;
    overflow: hidden;
    -webkit-line-clamp: 3;
    display: block;
    -webkit-box-orient: vertical;
  }

  .name-title {
    margin-bottom: 10px;
    line-height: 20px;
  }

  .name-input {
    margin-bottom: 15px;
    height: 28px;
    line-height: 26px;
  }
}
.new-projects-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--datav-main-color);
  padding: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.new-projects {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-right: -32px;

  .new-project {
    width: 258px;
    height: 78px;
    margin: 16px 32px 16px 0;
    vertical-align: middle;
    border: 1px solid #39414d;
    background: #22272e;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    cursor: pointer;
    color: #fff;

    img {
      width: 150px;
      height: 100%;
    }

    &:hover {
      border-color: var(--datav-main-color);

      &::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgb(36 131 255 / 8%);
      }
    }
  }

  .project-type {
    padding-left: 8px;
    flex: 1;
    font-size: 14px;
  }
}

.project-header {
  position: sticky;
  top: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--datav-border-color);
  padding-bottom: 5px;
  padding-top: 10px;
  height: 56px;
  background: var(--datav-body-bg);
  z-index: 1;
  min-width: 1024px;

  .project-title {
    display: flex;
    align-items: center;
    padding: 5px 0;

    h2 {
      @include utils-ellipsis;

      max-width: 200px;
      font-size: 14px;
      color: var(--datav-main-color);
      padding: 0 10px;
      border-left: 2px solid var(--datav-main-color);
    }
  }

  .header-manager {
    display: flex;
    align-items: center;
    font-size: 14px;

    .search {
      transform: translateX(30px);

      .search-input {
        @include utils-ellipsis;

        background: var(--datav-bgcolor-2);
        color: #fff;
        padding: 0 10px;
        line-height: 30px;
        height: 30px;
        padding-right: 30px;
        border: 1px solid transparent;
        transition: 0.2s;

        &:hover,
        &:focus {
          border: var(--datav-border-primary);
          box-shadow: var(--datav-shadow);
        }
      }
    }

    .icon-search {
      padding: 0 40px 0 4px;
      color: var(--datav-font-color);
      cursor: pointer;
      z-index: 1;
    }

    .sort-type {
      @include utils-ellipsis;

      display: inline-block;
      color: var(--datav-font-color);
      line-height: 30px;
      cursor: pointer;
      font-size: 14px;
      min-width: 100px;

      .icon-arrow {
        font-size: 14px;
        margin-left: 4px;
      }

      &:hover {
        color: var(--datav-main-color);
      }
    }
  }
}

.main-screen {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding-top: 8px;
  user-select: none;
  padding-bottom: 50px;
  margin-right: -32px;
}
</style>
