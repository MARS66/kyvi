<template>
  <t-row class="app-header">
   
    <t-col flex="300px">
      <t-row align="center" style="gap: 20px">
        <span class="logo">
          <img src="/logo.png" />
          <span>蛛网</span>
        </span>
        <t-dropdown
          :minColumnWidth="200"
          :maxHeight="560"
          overlayClassName="header-dropdown"
        >
          <span class="l-icon">
            <svg-icon name="file"></svg-icon>
          </span>
          <t-dropdown-menu>
            <t-dropdown-item @click="openFile" divider="true">
              <span>打开文件</span>
            </t-dropdown-item>
            <!-- <t-dropdown-item @click="newFile">
              <span>新建文件</span>
            </t-dropdown-item> -->
            <t-dropdown-item>
              <span @click="downloadPng">下载为PNG</span>
            </t-dropdown-item>
            <t-dropdown-item>
              <span @click="downloadSvg">下载为SVG</span>
            </t-dropdown-item>
            <t-dropdown-item >
              <span @click="downloadJson">下载JSON文件</span>
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
      </t-row>
    </t-col>
    <t-col flex="auto" >
      <t-row align="center" class="header-center">
        <t-tooltip content="撤销">
          <span class="l-icon"  @click="onUndo">
            <svg-icon  name="undo" prefix="l" size="16"></svg-icon>
          </span>
        </t-tooltip>
        <t-tooltip content="重做">
          <span class="l-icon"  @click="onRedo">
            <svg-icon  name="redo" prefix="l" size="16"></svg-icon>
          </span>
        </t-tooltip>
        <t-tooltip content="删除">
          <span class="l-icon" @click="onDelete">
            <svg-icon name="delete" size="16"></svg-icon>
          </span>
        </t-tooltip>
        <t-tooltip content="剪切">
          <span class="l-icon" @click="onCut">
            <svg-icon name="cut" size="16"></svg-icon>
          </span>
        </t-tooltip>
        <t-tooltip content="复制">
          <span class="l-icon" @click="onCopy">
            <svg-icon name="copy" size="16"></svg-icon>
          </span>
        </t-tooltip>
        <t-tooltip content="粘贴">
          <span class="l-icon" @click="onPaste">
            <svg-icon name="paste" size="16"></svg-icon>
          </span>
        </t-tooltip>
        <t-tooltip content="文字">
          <span class="l-icon"  @click="onAddShape($event, 'text')">
            <svg-icon  name="text" prefix="l" size="16"></svg-icon>
          </span>
        </t-tooltip>

        <t-tooltip content="画线">
          <span class="l-icon" @click="drawLine">
            <svg-icon name="drawLine" size="16"></svg-icon>
          </span>
        </t-tooltip>
        <t-dropdown
          :minColumnWidth="160"
          :maxHeight="560"
          overlayClassName="header-dropdown"
        >
          <span class="l-icon">
            <svg-icon prefix="l"  :name="lineTypes.find((item) => item.value === currentLineType)?.icon" size="16"></svg-icon>
          </span>
          <t-dropdown-menu>
            <t-dropdown-item v-for="item in lineTypes" :key="item.value">
              <div class="flex middle" @click="changeLineType(item.value)">
                {{ item.name }} <span class="flex-grow"></span>
                <svg-icon prefix="l" :name="item.icon" size="16"></svg-icon>
              </div>
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
        <t-tooltip content="添加/删除锚点">
          <span class="l-icon" @click="toggleAnchorMode">
            <svg-icon name="anchor" size="16"></svg-icon>
          </span>
        </t-tooltip>
        <t-tooltip content="添加手柄">
          <span class="l-icon" @click="addAnchorHand">
            <svg-icon name="add-anchor" size="16"></svg-icon>
          </span>
        </t-tooltip>
        <t-tooltip content="删除手柄">
          <span class="l-icon" @click="removeAnchorHand">
            <svg-icon name="delete-anchor" size="16"></svg-icon>
          </span>
        </t-tooltip>
      </t-row>
    </t-col>
    <t-col flex="300px">
      <t-row align="center">
        <t-tooltip content="保存">
          <span class="l-icon" @click="onSave">
            <svg-icon prefix="l" name="save" size="16"></svg-icon>
          </span>
        </t-tooltip>
        <t-tooltip content="运行查看">
          <span class="l-icon" @click="onView">
            <svg-icon name="preview" size="18"></svg-icon>
          </span>
        </t-tooltip>
      </t-row>
    </t-col>
  </t-row>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { deepClone } from "@kyvi/cobweb";
import FileSaver from "file-saver";
import { MessagePlugin } from "tdesign-vue-next";
import SvgIcon from "@/components/SvgIcon";
import { useRoute } from "vue-router";

const uRoute = useRoute()
const STORE_KEY=''+uRoute.query.projectId

const router = useRouter();
const isDrawLine = ref<boolean>(false);

const drawLine = () => {
  if (isDrawLine.value) {
    isDrawLine.value = false;
    cobweb.finishDrawLine();
    cobweb.drawLine();
    cobweb.store.options.disableAnchor = true;
  } else {
    isDrawLine.value = true;
    cobweb.drawLine(cobweb.store.options.drawingLineName);
    cobweb.store.options.disableAnchor = false;
  }
};

const lineTypes = reactive([
  { name: "折线", icon: "polyline", value: "polyline" },
  { name: "直线", icon: "line", value: "line" },
  // { name: "曲线", icon: "curve2", value: "curve" },
  // { name: "脑图曲线", icon: "mind", value: "mind" },
]);

const currentLineType = ref("polyline");
const changeLineType = (value: string) => {
  currentLineType.value = value;
  if (cobweb) {
    cobweb.store.options.drawingLineName = value;
    cobweb.canvas.drawingLineName && (cobweb.canvas.drawingLineName = value);
    cobweb.store.active?.forEach((pen) => {
      cobweb.updateLineType(pen, value);
    });
  }
};


const newFile = () => {
  cobweb.open({ name: "新建项目", pens: [] } as any);
};

function readFile(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

const openFile = () => {
  // 1. 显示选择文件对话框
  const input = document.createElement("input");
  input.type = "file";
  input.onchange = async (event) => {
    const elem = event.target as HTMLInputElement;
    if (elem.files && elem.files[0]) {
      // 2. 读取文件字符串内容
      const text = await readFile(elem.files[0]);
      try {
        // 3. 打开文件内容
        cobweb.open(JSON.parse(text));

        // 可选：缩放到窗口大小展示
        cobweb.fitView();
      } catch (e) {
        console.log(e);
      }
    }
  };
  input.click();
};

const downloadJson = () => {
  const data: any = cobweb.data();
  FileSaver.saveAs(
    new Blob([JSON.stringify(data)], {
      type: "text/plain;charset=utf-8",
    }),
    `${data.name || "export"}.json`
  );
};

const downloadPng = () => {
  let name = (cobweb.store.data as any).name;
  if (name) {
    name += ".png";
  }
  cobweb.downloadPng(name);
};

// 判断该画笔 是否是组合为状态中 展示的画笔
function isShowChild(pen: any, store: any) {
  let selfPen = pen;
  while (selfPen && selfPen.parentId) {
    const oldPen = selfPen;
    selfPen = store.pens[selfPen.parentId];
    const showChildIndex = selfPen?.calculative?.showChild;
    if (showChildIndex != undefined) {
      const showChildId = selfPen.children[showChildIndex];
      if (showChildId !== oldPen.id) {
        return false;
      }
    }
  }
  return true;
}

const downloadSvg = () => {
  if (!C2S) {
    MessagePlugin.error("请先下载@kyvi/cobweb-svg.js依赖包");
    return;
  }
  const rect: any = cobweb.getRect();
  rect.x -= 10;
  rect.y -= 10;
  const ctx = new C2S(rect.width + 20, rect.height + 20);
  ctx.textBaseline = "middle";
  for (const pen of cobweb.store.data.pens) {
    if (pen.visible == false || !isShowChild(pen, cobweb.store)) {
      continue;
    }
    cobweb.renderPenRaw(ctx, pen, rect);
  }

  let mySerializedSVG = ctx.getSerializedSvg();
  if (cobweb.store.data.background) {
    mySerializedSVG = mySerializedSVG.replace("{{bk}}", "");
    mySerializedSVG = mySerializedSVG.replace(
      "{{bkRect}}",
      `<rect x="0" y="0" width="100%" height="100%" fill="${cobweb.store.data.background}"></rect>`
    );
  } else {
    mySerializedSVG = mySerializedSVG.replace("{{bk}}", "");
    mySerializedSVG = mySerializedSVG.replace("{{bkRect}}", "");
  }

  mySerializedSVG = mySerializedSVG.replace(/--le5le--/g, "&#x");

  const urlObject: any = (window as any).URL || window;
  const export_blob = new Blob([mySerializedSVG]);
  const url = urlObject.createObjectURL(export_blob);

  const a = document.createElement("a");
  a.setAttribute(
    "download",
    `${(cobweb.store.data as any).name || "le5le.cobweb"}.svg`
  );
  a.setAttribute("href", url);
  const evt = document.createEvent("MouseEvents");
  evt.initEvent("click", true, true);
  a.dispatchEvent(evt);
};

const onUndo = () => {
  cobweb.undo();
};

const onRedo = () => {
  cobweb.redo();
};

const onCut = () => {
  cobweb.cut();
};

const onCopy = () => {
  cobweb.copy();
};

const onPaste = () => {
  cobweb.paste();
};

const onSave = () => {
  const data: any = cobweb.data();
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
  const arr = JSON.parse(localStorage.getItem('PROJECTS') ?? '[]').map((element:any) => {
    if (`${element.id}` === STORE_KEY) {
      element.thumbnail= cobweb.canvas.toPng()
    }
    return element
  });
  localStorage.setItem('PROJECTS', JSON.stringify(arr));
  MessagePlugin.success("已保存");
};

const onDelete = () => {
  cobweb.delete();
};

const onAddShape = (event: DragEvent | MouseEvent, name: string) => {
  event.stopPropagation();
  let data: any;
  if (name === "text") {
    // 构建一个文本图元
    data = {
      text: "text",
      width: 100,
      height: 20,
      name: "text",
    };
  } else if (name === "line") {
    // 构建一个直线图元
    data = {
      anchors: [
        { id: "0", x: 1, y: 0 },
        { id: "1", x: 0, y: 1 },
      ],
      width: 100,
      height: 100,
      name: "line",
      lineName: "line",
      type: 1,
    };
  }
  if (!(event as DragEvent).dataTransfer) {
    // 支持点击画布添加
    cobweb.canvas.addCaches = deepClone([data]);
  } else {
    // 支持拖拽添加
    (event as DragEvent).dataTransfer?.setData("Meta2d", JSON.stringify(data));
  }
};

const onView = () => {
  // 先停止动画，避免数据波动
  cobweb.stopAnimate();
  // 本地存储
  const data: any = cobweb.data();
  localStorage.setItem("cobweb", JSON.stringify(data));
  // 跳转到预览页面
  router.push({
    path: "/preview",
    query: {
      projectId:STORE_KEY,
    },
  });
};
// 添加/删除锚点
const toggleAnchorMode = () => {
  cobweb.toggleAnchorMode();
};
// 添加
const addAnchorHand = () => {
  cobweb.addAnchorHand();
};
// 删除手柄
const removeAnchorHand = () => {
  cobweb.removeAnchorHand();
};
</script>
<style lang="postcss" scoped>
.app-header {
  display: flex;
  height: 40px;
  position: relative;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  z-index: 2;
  .logo {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 500;
    padding-left: 15px;
    color: #22d5fe;
    img {
      height: 30px;
      margin-right: 6px;
    }
  }

  .header-center{
    width:calc(100vw - 600px);
    flex-wrap: nowrap;
    overflow-x: auto;
  }
  a {
    color: var(--color);
  }
  .l-icon {
    display: inline-block;
    margin: 0 8px;
    align-items: center;
    color: var(--color);
    text-decoration: none;
    white-space: nowrap;
    width: 40px;
    height: 24px;
    flex: none;
    text-align: center;
    line-height: 24px;
    padding: 4px 0;
    text-align: center;
    cursor: pointer;
    background: #303640;
    box-shadow: inset 0 0 0 1px #ffebeb1a, 0 0 0 1px #181818;
    transition: 0.2s;
    &:hover {
      background: #2681ff;
    }
    &.active {
      background: #2681ff;
    }
  }
}
</style>
