"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.MARK_PLUGIN_KEY=exports.MarkPlugin=void 0;let n=require("../interface/calendar");class e{update(e,t){let r=new Map;for(let e=0;e<t.length;e++){var a=t[e],l=a.date?(0,n.normalDate)(a.date):(0,n.normalDate)(+a.year,+a.month,+a.day),l=`${l.year}_${l.month}_`+l.day,s=r.get(l);s?"schedule"===a.type?s.schedule?s.schedule.push(a):s.schedule=[a]:s[a.type]=a:(s="schedule"===a.type?{schedule:[a]}:{[a.type]:a},r.set(l,s))}var o=this._marks_?[...this._marks_.entries()].flatMap(([e])=>r.has(e)?[]:(0,n.formDateByStrKey)(e)):[],_=[...r.keys()].map(e=>(0,n.formDateByStrKey)(e));this._marks_=r,e._loaded_&&e._calendar_.service.updateDates([..._,...o])}PLUGIN_TRACK_DATE(e){if(!this._marks_)return null;let r=`${e.year}_${e.month}_`+e.day;var t,e=this._marks_.get(r);return e?(t={},e.style&&(t.style=e.style.style),e.corner&&(t.corner={text:e.corner.text,color:e.corner.color}),e.festival&&(t.festival={text:e.festival.text,color:e.festival.color}),e.schedule&&(t.schedule=e.schedule.map((e,t)=>({text:e.text,color:e.color,bgColor:e.bgColor,key:(0,n.getMarkKey)(r,exports.MARK_PLUGIN_KEY)}))),t):null}PLUGIN_TRACK_SCHEDULE(e,t){return t?(t=e.month-1,{dtStart:new Date(e.year,t,e.day),dtEnd:new Date(e.year,t,e.day+1),origin:"component_prop_marks"}):null}}(exports.MarkPlugin=e).KEY="mark",exports.MARK_PLUGIN_KEY=e.KEY;