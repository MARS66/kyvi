/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-05-24 14:14:20
 * @LastEditors: Kevin
 * @LastEditTime: 2024-05-25 08:51:14
 */
export const  basic=[
  {
    label: "出勤天数",
    value: "attDays",
  },
  {
    label: "请假天数",
    value: "leaveDays",
  },
  {
    label: "出差已享受补助天数",
    value: "hasSubsidy",
  },
  {
    label: "岗位类别",
    value: "category",
  },
  {
    label: "实际发放执勤津贴天数",
    value: "realSubsidy",
  },
  {
    label: "加班总天数",
    value: "overtimeDays",
  },
  {
    label: "实际发放加班补贴天数",
    value: "overtimeSubsidy",
  },
  {
    label: "单位名称",
    value: "deptId",
  },
  {
    label: "姓名",
    value: "userId",
  },
  {
    label: "状态",
    value: "status",
  },
  {
    label: "月份",
    value: "sumMonth",
  },
  {
    label: "当月法定工作日出勤天数",
    value: "workDays",
  },
  {
    label: "工作日出勤天数",
    value: "attDays",
  },
  {
    label: "工作日出差已享受补助天数",
    value: "hasSubsidy",
  },
  {
    label: "实际发放执勤津贴天数",
    value: "realSubsidy",
  },
  {
    label: "督察班",
    value: "supervisionShift",
  },
  {
    label: "外医备勤班",
    value: "medicalStandbyShift",
  },
  {
    label: "外医班",
    value: "medicalShift",
  },
  {
    label: "监控班",
    value: "monitoringShift",
  },
  {
    label: "临时加班",
    value: "temporaryOvertime",
  },
  {
    label: "机关标准",
    value: "standardInOffice",
  },
  {
    label: "监区标准",
    value: "standardInCorrectionalUnit",
  },
]
const obj={}
basic.forEach(item => {
  obj[item.value]=item.label
})
console.log(99,obj);