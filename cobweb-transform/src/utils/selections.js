/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-10-29 09:22:39
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-29 11:28:13
 */

const selections = ({
  // 选中对象类型：0 - 画布；1 - 单个图元
  mode: 1,
  pen: undefined,
});

export const useSelection = () => {
  const select = (pens=[]) => {
    if (!pens || pens.length !== 1) {
      selections.mode = 0;
      selections.pen = undefined;
      return;
    }

    selections.mode = 1;
    selections.pen = pens[0];
  };

  return {
    selections,
    select,
  };
};
