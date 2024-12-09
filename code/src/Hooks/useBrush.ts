/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-09-10 09:55:05
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-26 15:12:00
 */
import {  ref, onUnmounted, watch} from 'vue';
import { useSelection } from '@/services/selections';

export default function useBrush() {

  const { selections } = useSelection();
  const lineDash = [undefined, [5, 5]];
  const brush = ref<any>();
  const block = ref<any>();


  const getPen = () => {
    brush.value = selections.pen;
    if (brush.value.globalAlpha == undefined) {
      brush.value.globalAlpha = 1;
    }
    if (brush.value.tags == undefined) {
      brush.value.tags = [];
    } 
    block.value = cobweb.getPenRect(brush.value);
  };

  
  const changeBrush = (prop: string) => {
    const v: any = { id: brush.value.id };
    v[prop] = brush.value[prop];
    if (prop === 'dash') {
      v.lineDash = lineDash[v[prop]];
    }
    if (prop === "animateLineDash") {
          v.animateLineDash = v.animateLineDash.value
            .split(",")
            .map((i: any) => parseInt(i));
      }
    cobweb.setValue(v, { render: true });
  };

  const changeBlock = (prop: string) => {
    const v: any = { id: brush.value.id };
    v[prop] = block.value[prop];
    cobweb.setValue(v, { render: true });
  };

  // 选中对象变化
  const watcher = watch(() => selections.pen, (val) => {
    if (val?.id) getPen()
  });
  
  // 销毁监听
  onUnmounted(() => watcher());

  // 初始化
  getPen()

  // 返回
  return {
    brush,
    block,
    lineDash,
    changeBlock,
    changeBrush,
  }

}