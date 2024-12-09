/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-10-16 11:26:37
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-17 14:02:56
 */

export const defaultIcons =[
  {
      name: '基本形状',
      show: true,
      list: [
          {
              name: 'square',
              icon: 'l-rect',
              id: 1,
              data: {
                  text: '正方形',
                  width: 100,
                  height: 100,
                  tag:'mind',
                  name: 'square',
                  form: [
                      {
                          key: 'text',
                          type: 'text',
                          name: '文本',
                      },
                  ]
              },
          },
          {
              name: 'rectangle',
              icon: 'l-rectangle',
              id: 2,
              data: {
                  text: '圆角矩形',
                  width: 200,
                  height: 50,
                  tag:'mind',
                  borderRadius: 0.1,
                  name: 'rectangle',
              },
          },
          {
              name: 'circle',
              icon: 'l-circle',
              id: 3,
              data: {
                  text: '圆',
                  width: 100,
                  height: 100,
                  name: 'circle',
              },
          },
          {
              name: 'triangle',
              icon: 'l-triangle',
              id: 4,
              data: {
                  text: '三角形',
                  width: 100,
                  height: 100,
                  name: 'triangle',
              },
          },
          {
              name: 'diamond',
              icon: 'l-diamond',
              id: 5,
              data: {
                  text: '菱形',
                  width: 100,
                  height: 100,
                  name: 'diamond',
              },
          },
          {
              name: 'pentagon',
              icon: 'l-pentagon',
              id: 6,
              data: {
                  text: '五边形',
                  width: 100,
                  height: 100,
                  name: 'pentagon',
              },
          },
          {
              name: 'hexagon',
              icon: 'l-hexagon',
              id: 7,
              data: {
                  text: '六边形',
                  width: 100,
                  height: 100,
                  name: 'hexagon',
              },
          },
          {
              name: 'pentagram',
              icon: 'l-pentagram',
              id: 8,
              data: {
                  text: '五角星',
                  width: 100,
                  height: 100,
                  name: 'pentagram',
              },
          },
          {
              name: 'leftArrow',
              icon: 'l-arrow-left',
              id: 9,
              data: {
                  text: '左箭头',
                  width: 120,
                  height: 60,
                  name: 'leftArrow',
              },
          },
          {
              name: 'rightArrow',
              icon: 'l-arrow-right',
              id: 10,
              data: {
                  text: '右箭头',
                  width: 120,
                  height: 60,
                  name: 'rightArrow',
              },
          },
          {
              name: 'twowayArrow',
              icon: 'l-twoway-arrow',
              id: 11,
              data: {
                  text: '双向箭头',
                  width: 150,
                  height: 60,
                  name: 'twowayArrow',
              },
          },
          {
              name: 'line',
              icon: 'l-line',
              id: 12,
              data: {
                  anchors: [
                      {
                          x: 0,
                          y: 0.5,
                          id: '0',
                      },
                      {
                          x: 1,
                          y: 0.5,
                          id: '1',
                      },
                  ],
                  width: 200,
                  height: 5,
                  name: 'rectangle',
                  lineWidth: 0,
                  background: '#222222',
              },
          },
          {
              name: 'cloud',
              icon: 'l-cloud',
              id: 13,
              data: {
                  text: '云',
                  width: 100,
                  height: 100,
                  name: 'cloud',
              },
          },
          {
              name: 'message',
              icon: 'l-msg',
              id: 14,
              data: {
                  textTop: -0.1,
                  text: '消息框',
                  width: 100,
                  height: 100,
                  name: 'message',
              },
          },
          {
              name: 'file',
              icon: 'l-file',
              id: 15,
              data: {
                  text: '文档',
                  width: 80,
                  height: 100,
                  name: 'file',
              },
          },
          {
              name: 'text',
              icon: 'l-text',
              id: 16,
              data: {
                  text: `meta2d`,
                  width: 160,
                  height: 30,
                  name: 'text',
              },
          },
          {
              name: 'cube',
              icon: 'l-cube',
              id: 18,
              data: {
                  width: 60,
                  height: 100,
                  name: 'cube',
                  z: 0.25,
                  form: [
                      {
                          key: 'z',
                          name: 'z',
                          type: 'number',
                          min: 0,
                          step: 0.1,
                          placeholder: '<= 1 即宽度的比例',
                      },
                      {
                          key: 'backgroundFront',
                          name: '前背景色',
                          type: 'color',
                      },
                      {
                          key: 'backgroundUp',
                          name: '顶背景色',
                          type: 'color',
                      },
                      {
                          key: 'backgroundRight',
                          name: '右背景色',
                          type: 'color',
                      },
                  ]
              },
          },
          {
              name: 'people',
              icon: 'l-people',
              id: 19,
              data: {
                  width: 70,
                  height: 100,
                  name: 'people',
              },
          },
      ],
  }
]