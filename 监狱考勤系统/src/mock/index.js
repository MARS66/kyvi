/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-05-18 16:52:06
 * @LastEditors: Kevin
 * @LastEditTime: 2024-05-24 11:18:53
 */
import Mock from 'mockjs'
import { workTypes } from "@/utils/work-type";
import {
  addReport
} from "@/api/attendance/report";
import dayjs from "dayjs";
// const dates = [];
// for (let i = 1; i <= 31; i++) {
//   dates.push(`2024-05-${i < 10 ? '0' + i : i}`);
// }
// dates.forEach((item => {
//   addReport({
//     attDate: item,
//     userId: 106,
//     timeType: '晚上',
//     attType:'双休及节假日'
//   })
// }))
Mock.mock("/annual/list", 'post',(data)=>Mock.mock({
  code: 0,
  total:50,
'rows|50' :[
    {
      name: "@cname",
      deptName: "政治处",
      userId:1,
      'leaved|1-4': 1,
      'plans|12': [
        {
          year: '2024',
          userId: 233,
          'month|1-12':5,
          'days|1-3':5,
        }
      ],
    }
  ]
}))
Mock.mock("/leave/list", 'post',()=>Mock.mock({
  code: 0,
  total:50,
  'rows|50': [
    {
      name: "@cname",
      deptName: '看守大队',
      reason: "年休",
      days: 2,
      status: 0,
      startTime:Mock.Random.date('yyyy-MM-dd'),
      endTime:Mock.Random.date('yyyy-MM-dd'),
      remark:'备注',
      leaveType: '年休',
      "timeType|1": ['早上','下午','晚上'],
    }
  ]
}))