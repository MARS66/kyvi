/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-05-20 14:01:44
 * @LastEditors: Kevin
 * @LastEditTime: 2024-11-12 23:16:08
 */
import { getTypeByName,nameToMark } from "@/utils/work-type";
import { isWorkday } from "chinese-workday";
// 考勤表结尾计算
export const summary = (data, key) => {
  let sum = 0
  // data[0].attendance.forEach((item, index) => {
  //   if (key.includes('出勤')&&['公差','学习','出勤','补休','体检'].includes(item.attType)) {
  //     console.log(item.attType);
  //      switch (item.attType) {
  //        case '出勤':
  //          const after=data[1]?.find(att=>att.attDate===item.attDate)?.attType
  //          const night=data[2]?.find(att=>att.attDate===item.attDate)?.attType
  //          console.log(88,after,night);
           
  //         break;
       
  //       default:
  //         break;
  //      }
  //   }
  // })
  if (key ==='学习') console.log(key);
  
  data.forEach((item) => {
    const arr =key.includes('出勤') ? item.attendance.filter((att) => {
      return att.attType&&['公差','学习','出勤','补休','体检'].includes(att.attType);
    }) : item.attendance.filter((att) => {
      return att.attType&&att.attType.includes(key);
    });
    if (arr.length&&item.timeType === '晚上') {
      if (key ==='学习')  console.log(arr);
      item.attendance.forEach((i) => {
        if (i.attType==='出勤') {
          const morning = data[0]?.attendance?.find(att => att.attDate === i.attDate)?.attType;
          const after = data[1]?.attendance?.find(att => att.attDate === i.attDate)?.attType;
          if (morning==='出勤'&&after ==='出勤') {
            sum += 2
          } else if((!morning && !after) || ['公差','学习','出勤','补休','体检'].includes(morning)|| ['公差','学习','出勤','补休','体检'].includes(after)) {
            sum += 0
          } else {
            sum += 0.5
          }
        }
        if (i.attType === '公差') {
          const morning = data[0]?.attendance?.find(att => att.attDate === i.attDate)?.attType;
          const after = data[1]?.attendance?.find(att => att.attDate === i.attDate)?.attType;
          if ((morning==='公差' && after==='公差')|| ['公差','学习','出勤','补休','体检'].includes(morning)|| ['公差','学习','出勤','补休','体检'].includes(after) ) {
            sum += 0
          } else {
            sum += 0.5
          };
        }
      })

      // const xs= ['公差','出勤'].includes(key)?2:1
      // sum+=xs*arr.length
    } else {
      sum+=0.5*arr.length
    }
  })
  return sum
}
export const breakSummary = (data, key) => { 
  let sum=0
  data.forEach((item,index) => {
    const arr = item.attendance.filter((att) => {
      return  getTypeByName(att.attType)==='a'&&att.attType.includes(key)&&isWorkday(att.attDate)
   });
    // if (index>1) {
    //   sum+=2*arr.length
    // } else {
      // sum+=0.5*arr.length
    // }
    if (index < 2) sum += 0.5 * arr.length;
  })
  return sum
}
// 获取请假总天数
export const leaveSummary = (data) => { 
  let sum=0
  data.forEach((item,index) => {
    const arr = item.attendance.filter((att) => {
      return  getTypeByName(att.attType)==='a'&&isWorkday(att.attDate)
   });
    // if (index>1) {
    //   sum+=2*arr.length
    // } else {
      // sum+=0.5*arr.length
    // }
    if (index < 2) sum += 0.5 * arr.length;
  })
  return sum
}
// 根据类型统计
export const summaryByType = (data,type,hasNight=false,onlyNight=false) => { 
  let sum=0
  data.forEach((item) => {
   const arr= item.attendance.filter((att) => {
      return  getTypeByName(att.attType)===type
   });
    if (onlyNight && item.timeType === '晚上') {
      sum += 1 * arr.length
      return true
    }
    if (hasNight && item.timeType === '晚上') {
      sum+=1*arr.length
    } else {
      sum+=0.5*arr.length
    }
  })
  return sum
}

// 工作日出差已享受补助
export const sumHasSubsidy = (data) => { 
  return data.find(item=>item.timeType === '晚上').attendance?.filter((att) => {
    return isWorkday(att.attDate) &&  getTypeByName(att.attType)==='b'
 })?.length ?? 0
}
// 根据标记统计
export const summaryByMark = (data,type) => { 
  let sum=0
  data.forEach((item) => {
   const arr= item.attendance.filter((att) => {
      return  nameToMark(att.attType)=== type&&isWorkday(att.attDate)
   });
    if (item.timeType === '晚上') {
      sum+=arr.length
    } else {
      sum+=0.5*arr.length
    }
  })
  return sum
}
