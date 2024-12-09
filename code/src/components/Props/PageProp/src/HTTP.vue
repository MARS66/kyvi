<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-09-23 16:34:32
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-23 16:55:14
-->
<template>
  <div class="ds-api">
    <p>请求方式</p>
    <div class="datav-new-select-wp">
      <n-select
        v-model:value="trendApiConfig.apiMethod"
        :options="apiMethods"
        class="datav-new-select"
      />
    </div>
    <p class="url-info">
      <label class="prefix-label textarea-label">请求地址URL：</label>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
        class="api-help"
      >重要：跨域问题解决方案</a>
    </p>
    <p class="url-info-text">
      将回调参数配置到url中, 例: http://api.test?id=:value
    </p>
    <monaco-editor
      language="plaintext"
      line-numbers="off"
      :height="120"
      :code="trendApiConfig.api"
      :completions="variables"
      @blur="updateData"
    />
    <div class="post-request-data">
      <p class="url-info-text">请求头： Headers (Optional)</p>
      <monaco-editor
        language="json"
        :height="120"
        :auto-format="true"
        :code="trendApiConfig.apiHeaders"
        @blur="updateApiHeaders"
      />
    </div>
    <div v-if="trendApiConfig.apiMethod === ApiRequestMethod.POST" class="post-request-data">
      <p class="url-info-text">POST 请求参数</p>
      <monaco-editor
        language="json"
        :height="120"
        :auto-format="true"
        :code="trendApiConfig.apiBody"
        @blur="updateApiBody"
      />
    </div>
    <n-checkbox v-model:checked="trendApiConfig.local" class="ds-checkbox">
      服务器代理请求 (因跨域无法访问时可勾选)
    </n-checkbox>
  </div>
</template>

<script lang='ts'>
import { defineComponent, Ref,ref,onMounted } from 'vue'
import { ApiRequestMethod,ApiTrendConfig } from '@/components/_models/data-source'
import { useEventStore } from '@/store/event'
import MonacoEditor from '@/components/MonacoEditor'
export default defineComponent({
  name: 'DsApiEditor',
  components: {MonacoEditor},
  setup() {
    const eventStore = useEventStore()
    const  trendApiConfig:Ref<ApiTrendConfig> = ref( {apiMethod:ApiRequestMethod.GET,api:'',apiHeaders:'',apiBody:'',local:false,})
    const apiMethods = Object.keys(ApiRequestMethod).map(value => ({ label: value, value }))
    const variables = Object.keys(eventStore.publishersView)

    const updateData = (data:any) => {
      trendApiConfig.value.api = data.value
      Object.assign(cobweb.store.data.trendApiConfig, trendApiConfig.value );
    }
    const updateApiBody = (data:any) => {
      trendApiConfig.value.apiBody = data.value
      Object.assign(cobweb.store.data.trendApiConfig, trendApiConfig.value );
    }

    const updateApiHeaders = (data:any) => {
      trendApiConfig.value.apiHeaders = data.value
      Object.assign(cobweb.store.data.trendApiConfig, trendApiConfig.value );
    }
    
    onMounted(() => {
      Object.assign(trendApiConfig.value,   cobweb.store.data?.trendApiConfig);
    })
    return {
      ApiRequestMethod,
      trendApiConfig,
      apiMethods,
      variables,
      updateData,
      updateApiHeaders,
      updateApiBody,
    }
  },
})
</script>

<style lang="postcss" scoped>
.ds-api {
  padding: 15px;
  .url-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .api-help {
      color: var(--datav-main-color);
    }
  }

  .url-info-text {
    margin-bottom: 10px;
  }

  .ds-checkbox {
    line-height: 18px;
    margin-bottom: 10px;
  }

  ::v-deep(.datav-editor) {
    margin-bottom: 10px;
  }
}
</style>
