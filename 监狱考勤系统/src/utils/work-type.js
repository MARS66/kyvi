/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-05-18 14:50:32
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-25 10:18:07
 */
export const workTypes = [
  {
    name: '出勤',
    mark: '√',
    type:'h',
  },
  {
    name: '仅记录出勤',
    mark: '√',
    type:'hh',
  },
  {
    name: '探亲假',
    mark: '—',
    type:'a',
  },
  {
    name: '年休假',
    mark: '=',
    type:'a',
  },
  {
    name: '婚假',
    mark: '*',
    type:'a',
  },
  {
    name: '产假',
    mark: '^',
    type:'a',
  },
  {
    name: '丧假',
    mark: '≡',
    type:'a',
  },
  {
    name: '病假',
    mark: '0',
    type:'a',
  },
  {
    name: '事假',
    mark: 'T',
    type:'a',
  },
  {
    name: '育儿假',
    mark: '#',
    type:'a',
  },
  {
    name: '护理假',
    mark: '◊',
    type:'a',
  },
  {
    name: '学习',
    mark: 'Δ',
    type:'h',
  },
  {
    name: '补休',
    mark: 'W',
    type:'h',
  },
  {
    name: '公差',
    mark: 'G',
    type:'b',
  },
  {
    name: '哺乳假',
    mark: 'B',
    type:'i',
  },
  {
    name: '陪护假',
    mark: 'P',
    type:'a',
  },
  {
    name: '体检',
    mark: 'J',
    type:'h',
  },
  {
    name: '外医',
    mark: 'Y',
    type:'e',
  },
  {
    name: '外医备勤',
    mark: 'Y备',
    type:'d',
  },
  {
    name: '督察班',
    mark: 'D',
    type:'c',
  },
  {
    name: '监控班',
    mark: 'K',
    type:'f',
  },
  {
    name: 'AB门',
    mark: 'AB',
    type:'f',
  },
  {
    name: '加强班',
    mark: '强',
    type:'f',
  },
  {
    name: '加班',
    mark: '※',
    type:'g',
  },
  {
    name: '缺勤',
    mark: '☐',
    type:'error',
  },
  {
    name: '迟到',
    mark: '▣',
    type:'error',
  },
  {
    name: '早退',
    mark: 'Z',
    type:'error',
  },
  {
    name: '活动',
    mark: 'H',
    type:'h',
  },
  {
    name: '监内24小时',
    mark: '24H',
    type:'e',
  },
  {
    name: '双休及节假日',
    mark: '╳',
    type:'Non',
  },
]
export function markToName(mark) {
  return workTypes.find(item=>item.mark===mark)?.name
}
export function nameToMark(name) {
  return workTypes.find(item=>item.name===name)?.mark
}
export function getTypeByName(name) {
  return workTypes.find(item=>item.name===name)?.type
}
export function getTypeByMark(mark) {
  return workTypes.find(item=>item.mark===mark)?.type
}
