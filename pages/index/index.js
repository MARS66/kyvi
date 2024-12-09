// index.js
let calendar;
const dayjs = require("./dayjs");
const { getYiZuCalendar } =require ('../../utils/yiZuCalendar.js')
const { concatAudio,destroyAudio,createAudio } = require('../../utils/howler.js');
const {getFestival,isHoliday } = require('chinese-workday');
Page({
  data: {
    date:new Date().getTime(),
    dateVisible:false,
    calendar:undefined,
    value: 'index',
    playUrlIndex:0,
    padding: 0,
    markers: [],
    sumDate:{},
  },
  onLoad() {
    const { bottom } = wx.getMenuButtonBoundingClientRect();
    this.setData({
      padding: bottom
    });
  },
  showPicker(e) {
    this.setData({
      dateVisible: true,
    });
  },
  handleLoad({detail}) {
     calendar = this.selectComponent('#calendar');
    this.setMarks(detail.range)
    this.setSumDate(detail.checked)
  },
  // 标记彝族日历
  setMarks([start,end]){
   const len= dayjs(`${end.year}-${end.month}-${end.day}`).diff(dayjs(`${start.year}-${start.month}-${start.day}`), 'day')
    const markers=[]
    for (let index = 0; index <= len; index++) {
      const date=dayjs(`${start.year}-${start.month}-${start.day}`).add(index,'day').format('YYYY-MM-DD')
      const yiZuCalendar=getYiZuCalendar({date})
      markers.push(
        { 
          date, 
          type: 'festival', 
          text:yiZuCalendar.zodiacDay.join(''), 
          // color:"#000"
        },{
          date, 
          type: 'corner', 
          text:yiZuCalendar.day[0], 
          // color:"#000"
        },
      )
      if (yiZuCalendar.solarTerm){
        markers.push({
          date, 
          type: 'festival', 
          text:yiZuCalendar.solarTerm,
          color:"#eb3333"
        })
     }
     const Festival= getFestival(date)
      if (isHoliday(date) &&Festival!=='周末') {
        markers.push(
          {
          date, 
          type: 'corner', 
          text:'休', 
          color:"#eb3333"
        })
      }
      if (Festival.includes('补')) {
        markers.push(
          {
          date, 
          type: 'corner', 
          text:'班', 
          color:"#eb3333"
        })
      }
      if (!['工作日','周末'].includes(Festival)&&!Festival.includes('补')) {
        markers.push(
          { 
            date, 
            type: 'festival', 
            text:Festival,
            color:"#eb3333" 
          },
          )
      }
    }
    this.setData({ markers })
  },
  // 选中日期汇总
async setSumDate(param){
    const {day,year,tb,month,zodiacDay,sound}=getYiZuCalendar(param)
    concatAudio(sound)
    // play(buffer) 
    this.setData({
      playUrlIndex:0,
      sumDate:{
        sound,
        tb:`ꄤꁨꌺ${tb[0]}ꐥ 塔博惹在${tb[1]}`,
        yw:`${year[0]}ꈎ${month[0]}ꆪ${zodiacDay[0]}ꑍ`,
        moon:day[0],
        cn:`${year[1]}年${month[1]}月${zodiacDay[1]}日`,
        gl:`${param.year}年${param.month}月${param.day}日`
      }
    })
  },
  handleClick({ detail }) {
    // console.log('calendar-date-click', detail);
  },
  handleChange({ detail }) {
    this.setMarks(detail.range)
    this.setSumDate(detail.checked)
  },
  handleViewChange({ detail }) {
    // console.log('calendar-view-change', detail);
  },
  onConfirm(e){
    const { value } = e.detail;
    calendar.checked(value)
  },
});
