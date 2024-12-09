<template>
  <t-tabs default-value="page" theme="card">
    <!-- <t-tab-panel value="test" label="测试">
      <Test></Test>
    </t-tab-panel> -->
    <t-tab-panel value="page" label="全局">
      <!-- <template #label>
        <t-tooltip content="全局设置" theme="primary">
          <t-icon name="home" class="tabs-icon-margin" />全局
        </t-tooltip>   
      </template> -->
      <t-collapse :default-value="[0, 1]" expand-icon-placement="right">
        <t-collapse-panel header="画布设置">
          <div class="props-panel">
            <t-form label-align="left">
              <t-form-item label="图纸名称" name="name">
                <t-input v-model="data.name" @change="onChangeData" />
              </t-form-item>
              <t-divider />
              <t-form-item label="网格" name="grid">
                <t-switch v-model="options.grid" @change="onChangeOptions" />
              </t-form-item>
              <t-form-item v-if="options.grid" label="网格大小" name="gridSize">
                <t-input
                  v-model.number="options.gridSize"
                  @change="onChangeOptions"
                />
              </t-form-item>
              <!-- <t-form-item v-if="options.grid" label="网格角度" name="gridRotate">
                <t-input
                  v-model.number="options.gridRotate"
                  @change="onChangeOptions"
                />
              </t-form-item> -->
              <t-form-item
                v-if="options.grid"
                label="网格颜色"
                name="gridColor"
              >
                <t-color-picker
                  class="w-full"
                  enableAlpha
                  v-model="options.gridColor"
                  :show-primary-color-preview="false"
                  format="CSS"
                  :color-modes="['monochrome']"
                  @change="onChangeOptions"
                />
              </t-form-item>

              <t-divider />

              <t-form-item label="标尺" name="rule">
                <t-switch v-model="options.rule" @change="onChangeOptions" />
              </t-form-item>

              <t-divider />

              <t-form-item label="背景颜色" name="background">
                <t-color-picker
                  enableAlpha
                  class="w-full"
                  v-model="data.background"
                  :show-primary-color-preview="false"
                  format="CSS"
                  :color-modes="['monochrome']"
                  @change="onChangeData"
                />
              </t-form-item>
              <t-form-item label="背景图片" name="bkImage">
                <t-upload
                  ref="uploadRef1"
                  v-model="bkImage"
                  :image-viewer-props="imageViewerProps"
                  :size-limit="sizeLimit"
                  action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
                  theme="image"
                  accept="image/*"
                  :auto-upload="true"
                  :show-image-file-name="false"
                  :upload-all-files-in-one-request="false"
                  :locale="{
                    triggerUploadText: {
                      image: '请选择图片',
                    },
                  }"
                  @fail="handleFail"
                  @success="handleSuccess"
                  @remove="handleRemove"
                >
                </t-upload>
              </t-form-item>
              <t-form-item label="图元默认颜色" name="color">
                <t-color-picker
                  enableAlpha
                  class="w-full"
                  v-model="data.color"
                  :show-primary-color-preview="false"
                  format="CSS"
                  :color-modes="['monochrome']"
                  @change="onChangeData"
                />
              </t-form-item>
            </t-form>
          </div>
        </t-collapse-panel>
      </t-collapse>
    </t-tab-panel>
    <t-tab-panel value="message" label="通讯">
      <t-collapse :default-value="[0]" expand-icon-placement="right">
        <t-collapse-panel header="MQTT">
          <div class="props-panel">
            <t-form label-align="left">
              <t-form-item label="url地址" name="mqtt">
                <t-input v-model="data.mqtt" @change="onChangeData" />
              </t-form-item>
              <t-form-item label="主题" name="mqttTopics">
                <t-input v-model="data.mqttTopics" @change="onChangeData" />
              </t-form-item>
              <t-form-item label="用户名" name="username">
                <t-input
                  v-model="data.mqttOptions.username"
                  @change="onChangeData"
                />
              </t-form-item>
              <t-form-item label="密码" name="password">
                <t-input
                  v-model="data.mqttOptions.password"
                  @change="onChangeData"
                />
              </t-form-item>
            </t-form>
          </div>
        </t-collapse-panel>
      </t-collapse>
    </t-tab-panel>
    <t-tab-panel value="api" label="趋势API">
      <TrendConfig></TrendConfig>
    </t-tab-panel>
  </t-tabs>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { MessagePlugin, UploadProps } from 'tdesign-vue-next';
import TrendConfig from'./src/ApiEdit.vue'
import Test from'./src/Test.vue'
// 背景上传功能
const bkImage = ref<UploadProps['value']>([]);
const sizeLimit = ref<UploadProps['sizeLimit']>({ size: 500, unit: 'KB' });
const imageViewerProps = ref({
  closeOnEscKeydown: false,
});
// 上传失败

const handleFail: UploadProps['onFail'] = ({ file }) => {
  MessagePlugin.error(`背景 ${file.name} 上传失败`);
};
// 背景上传成功刷新操作区域
const handleSuccess: UploadProps['onSuccess'] = ({ file }) => {
  Object.assign(cobweb.store.data, {bkImage:file?.url});
  cobweb.store.patchFlagsBackground = true;
  cobweb.open(cobweb.store.data);
};
const handleRemove: UploadProps['onSuccess'] = () => {
  Object.assign(cobweb.store.data, {bkImage:''});
  cobweb.store.patchFlagsBackground = true;
  cobweb.open(cobweb.store.data);
};
// 图纸数据
const data = reactive<any>({
  name: "",
  background: "#0D2A4300",
  color: "#266fe8",
  mqtt: "ws://10.128.9.253:8085",
  mqttTopics: "$ICS/MonitorConfigure/Wind",
  bkImage:'',
  // width: 1920,
  // height: 1080,
  mqttOptions: {
    username: "mica-mqtt",
    password: "Admin123*#",
    customClientId: false,
  },
});
// 

// 画布选项
const options = reactive<any>({
  grid: false,
  gridSize: 10,
  gridRotate: undefined,
  gridColor: "#5c6366",
  rule: true,
});

const socketCbJs =`
  const { data }= JSON.parse(e);
  const arr=Object.values(data).map(item=>{
      item.dataId=item.itemCode
      item.value=item.value.toFixed(2)
      return item
  });
  window.dataSource=arr;
  return arr; ` 
onMounted(() => {
  Object.assign(data, cobweb.store.data);
  Object.assign(cobweb.store.data, data, { socketCbJs });
  cobweb.store.patchFlagsBackground = true;
  Object.assign(options, cobweb.getOptions());
  cobweb.render();
  bkImage.value=[{
    status: 'success',
    url: cobweb.store.data.bkImage,
    size: 1000,
  }]
});

const onChangeData = () => {
  Object.assign(cobweb.store.data, data);
  cobweb.store.patchFlagsBackground = true;
  cobweb.render(true);
};

const onChangeOptions = () => {
  cobweb.setOptions(options);
  cobweb.store.patchFlagsTop = true;
  cobweb.store.patchFlagsBackground = true;
  cobweb.render();
};
</script>
<style lang="postcss" scoped>
.tabs-icon-margin {
  margin-right: 4px;
}
</style>
