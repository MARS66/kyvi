"use strict";var _=this&&this.__awaiter||function(e,n,h,l){return new(h=h||Promise)(function(i,t){function a(e){try{s(l.next(e))}catch(e){t(e)}}function r(e){try{s(l.throw(e))}catch(e){t(e)}}function s(e){var t;e.done?i(e.value):((t=e.value)instanceof h?t:new h(function(e){e(t)})).then(a,r)}s((l=l.apply(e,n||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});let u=require("./interface/calendar"),o=require("./basic/constants"),c=require("./basic/pointer"),w=require("./basic/panel"),v=require("./basic/layout"),e=require("./basic/drag"),g=require("./basic/annual"),p=require("./basic/printer"),t=require("./plugins/lunar"),i=require("./plugins/mark"),y=require("./basic/tools"),f=require("./utils/shared"),a=require("./utils/calc"),k=(0,y.middle)(o.CALENDAR_PANELS);Component({behaviors:["wx://component-export"],options:{pureDataPattern:o.PURE_PROPS},properties:{darkmode:{type:Boolean,value:!0},date:{type:Number,optionalTypes:[String],value:(new Date).getTime()},view:{type:String,value:o.VIEWS.MONTH},marks:{type:Array,value:[]},weekstart:{type:Number,value:0},vibrate:{type:Boolean,value:!0},font:{type:String,value:""},style:{type:String,value:""},sameChecked:{type:Boolean,value:!1},customNavBar:{type:Boolean,value:!0},viewGesture:{type:Boolean,value:!0},areas:{type:Array}},data:{renderer:"unknown",checked:null,panels:(0,y.InitPanels)("panel"),years:(0,y.InitPanels)("year"),weeks:(0,y.InitWeeks)(),current:k,currView:o.VIEWS.MONTH,initView:o.VIEWS.MONTH,transView:null,gesture:!1,annualCurr:null,annualTop:"-150vh",annualOpacity:0,annualDuration:300,offsetChange:!1,darkside:!0,areaHideCls:"",layout:null,pointer:null,fonts:o.FONT,info:""},lifetimes:{created(){v.Layout.initialize(),this.initializeShared(),this.initializeView()},attached(){return _(this,void 0,void 0,function*(){yield this.initializeRects(),this.initializeRender()})},detached(){var e;null!=(e=this._printer_)&&e.cancelThemeChange(),this._calendar_.service.dispatchEvent("detached")}},methods:{initializeShared(){var e=wx.worklet["shared"];this.$_swiper_trans=e(0),this.$_annual_trans=e(0),this.$_gesture=e(!1),this.$_calendar_width=e(0)},initializeView(){this._view_=(0,y.viewFlag)(this.data.view),(0,y.isSkyline)(this.renderer)&&(this._dragger_=new e.Dragger(this)),this._calendar_=new u.WxCalendar(this,[t.LunarPlugin])},initializeRender(){let e=(0,y.isSkyline)(this.renderer);this._pointer_=new c.Pointer(this),this._panel_=new w.PanelTool(this),this._annual_=new g.AnnualPanelSwitch(this),this._printer_=new p.YearPrinter(this),e||(this._swiper_accumulator_=0,this._swiper_flag_=!1);var t=(0,u.normalDate)(this.data.date)||u.WxCalendar.today,i=(0,y.InitWeeks)((0,u.sortWeeks)(this.data.weekstart)),a=this._view_&o.View.week,r=a?this._panel_.createWeekPanels(t):this._panel_.createMonthPanels(t),s=this._panel_.createYearPanels(t),n=s.map(({key:e,year:t,subinfo:i})=>({key:e,year:t,subinfo:i})),s=(this._years_=s.map(({year:e,months:t,marks:i})=>({year:e,months:t,marks:i})),this.data.font?(0,y.mergeStr)([this.data.font,o.FONT]):o.FONT),h=(0,y.flagView)(this._view_),l=(this.$_gesture.value=this.data.viewGesture,(0,f.omit)(v.Layout.layout,["windowWidth","windowHeight"])),d=(0,y.layoutHideCls)(this.data.areas),s={renderer:this.renderer,fonts:s,checked:t,weeks:i,panels:r,years:n,offsetChange:!(!a||e),layout:l,annualCurr:e?null:k,currView:h,initView:h,gesture:this.data.viewGesture,info:(0,u.getDateInfo)(t,a),pointer:(0,c.createPointer)(),darkside:this.data.darkmode&&v.Layout.darkmode,areaHideCls:d};this._pointer_.update(s),this._calendar_.service.dispatchEvent("attach",s),this.setData(s),this._loaded_=!0,wx.nextTick(()=>_(this,void 0,void 0,function*(){e&&this._dragger_.bindAnimations(),yield this._printer_.initialize(),this.trigger("load")}))},initializeRects(){return _(this,void 0,void 0,function*(){var e=(0,y.nodeRect)(this),[e,t]=yield(0,f.promises)([e(o.SELECTOR.CALENDAR),e(o.SELECTOR.WEEK_ITEM)]);let i=e[0].left.toFixed(1);this.$_calendar_width.value=e[0].width,this._centres_=t.map(({left:e,width:t})=>(0,a.sub)((0,a.add)(e.toFixed(1),(0,a.div)(t.toFixed(1),2)),i))})},refreshView(e){return _(this,arguments,void 0,function*({view:e}){this._view_&e||((0,y.isSkyline)(this.renderer)?(yield this._panel_.refreshView(e),this.trigger("viewchange",{view:(0,y.flagView)(e)})):this._view_=e)})},toToday(){this._panel_.toDate(u.WxCalendar.today)},toggleView(t){return _(this,void 0,void 0,function*(){var e=(0,y.isView)(t)?t:this._view_&o.View.week?o.View.month:o.View.week;(0,y.isSkyline)(this.renderer)&&(yield this._dragger_.toView(e,!0)),yield this._panel_.refreshView(e),this.trigger("viewchange",{view:(0,y.flagView)(this._view_)})})},calendarTransitionEnd(){return _(this,void 0,void 0,function*(){(0,y.isSkyline)(this.renderer)||(0,y.viewFlag)(this.data.currView)!==this._view_&&(yield this._panel_.refreshView(this._view_),this.trigger("viewchange",{view:(0,y.flagView)(this._view_)}))})},selDate(r){this._calendar_.service.interceptEvent("tap",r,()=>_(this,void 0,void 0,function*(){var e,t,{wdx:i,ddx:a}=r.mark,i=this.data.panels[this.data.current].weeks[i].days[a];this.trigger("click",{checked:i}),(0,u.isSameDate)(i,this.data.checked)||(a=(0,u.normalDate)(i),e=this._view_&o.View.week,"current"===i.kind?(t={info:(0,u.getDateInfo)(a,e),checked:a},e||this._panel_.refreshOffsets(t,this.data.current,a),this._pointer_.update(t,!0),this.setData(t),yield this._panel_.update()):e?yield this._panel_.toWeekAdjoin(i):yield this._panel_.refresh("last"===i.kind?-1:1,a,void 0,!0),this.trigger("change",{checked:a,source:"click"}))}))},handlePointerAnimated(){this._pointer_.animationEnd()},refreshPanels(...e){return _(this,void 0,void 0,function*(){yield this._panel_.refresh(...e),this.trigger("change",{source:"gesture"})})},refreshAnnualPanels(...e){this._panel_.refreshAnnualPanels(...e)},swiperTrans(e){var t;this._swiper_flag_||(this._swiper_flag_=!0,t=this.$_calendar_width.value,this._swiper_accumulator_=e.detail.dx>t/2?-k*t:0,e.detail.dx>t/2&&(this._swiper_accumulator_=-k*t)),this.$_swiper_trans.value=e.detail.dx},swiperTransEnd(e){var t,i;this._swiper_flag_=!1,"touch"===e.detail.source&&(this._swiper_accumulator_+=this.$_swiper_trans.value,this.$_swiper_trans.value=0,t=this._swiper_accumulator_%this.$_calendar_width.value,i=(i=this._swiper_accumulator_/this.$_calendar_width.value)<0?Math.floor(i):Math.ceil(i),0==t||this.$_calendar_width.value-Math.abs(t)<Math.abs(i))&&(this._swiper_accumulator_=0,i)&&("panel"===e.currentTarget.dataset.type?this.refreshPanels(i):this.refreshAnnualPanels(i))},workletSwiperTransEnd(e){"worklet";var e=this.$_swiper_trans.value+e.detail.dx,t=this.$_calendar_width.value,i=e%t,a=e/t,a=a<0?Math.floor(a):Math.ceil(a);0==i||t-Math.abs(i)<Math.abs(a)?(this.$_swiper_trans.value=0,a&&wx.worklet.runOnJS(this.refreshPanels.bind(this))(a)):this.$_swiper_trans.value=e},workletAnnualSwiperTransEnd(e){"worklet";var e=this.$_annual_trans.value+e.detail.dx,t=this.$_calendar_width.value,i=e%t,a=e/t,a=a<0?Math.floor(a):Math.ceil(a);0==i||t-Math.abs(i)<Math.abs(a)?(this.$_annual_trans.value=0,a&&wx.worklet.runOnJS(this.refreshAnnualPanels.bind(this))(a)):this.$_annual_trans.value=e},workletDragGesture(e){"worklet";var t,i,a,r,s,n;this.$_gesture.value&&0!==e.state&&(1===e.state?(wx.worklet.runOnJS(this.dragGestureStart.bind(this))(),this.$_drag_state.value=1):1===this.$_drag_state.value&&({dragMax:r,minHeight:t,maxHeight:i,mainHeight:a}=v.Layout.layout,s=(n=e.deltaY<0?-1:1)*Math.min(Math.abs(e.deltaY),10),s=this.$_drag_panel_height.value+.6*s,r=Math.min(r,Math.max(t,s)),this.$_drag_panel_height.value=r,s=.5*n+this.$_drag_bar_rotate.value,this.$_drag_bar_rotate.value=Math.max(-20,Math.min(s,20)),n=Math.max(0,Math.min(60,60*(a-r)/(a-t))),this.$_drag_view_bar_translate_.value=n,this.$_drag_schedule_opacity.value=Math.max(0,Math.min(1,(r-a)/(i-a))),2<e.state)&&(this.$_drag_state.value=0,wx.worklet.runOnJS(this.dragGestureEnd.bind(this))(e)))},dragGestureStart(){this._dragger_.bindScheduleAnimation()},dragGestureEnd(t){return _(this,void 0,void 0,function*(){var e=yield this._dragger_.dragout(.6*t.velocityY);wx.nextTick(this.refreshView.bind(this,{view:e}))})},selYear(){return _(this,void 0,void 0,function*(){var e,t;if(this.$_gesture.value||!(this._view_&o.View.week))return{year:e,month:t}=this.data.panels[this.data.current],this._annual_.switch(!0,{year:e,month:t})})},selMonth(a){return _(this,void 0,void 0,function*(){var e=a.currentTarget.dataset["ydx"],{x:t,y:i}=a.detail,e=yield this._printer_.getTapMonth(e,t,i);return this._annual_.switch(!1,e)})},trigger(e,t,i=!0){(t=t||{}).checked=t.checked||this.data.checked,t.view=t.view||this.data.currView,"change"!==e&&"load"!==e||(s=this.data.panels,a=((n=this.data.current)-(l=Math.floor(o.CALENDAR_PANELS/2))+o.CALENDAR_PANELS)%o.CALENDAR_PANELS,n=(n+l)%o.CALENDAR_PANELS,{year:l,month:a,day:r}=s[a].weeks[0].days[0],{year:s,month:n,day:h}=(n=(s=s[n].weeks)[s.length-1].days)[n.length-1],t.range=[{year:l,month:a,day:r},{year:s,month:n,day:h}]);var a,r,s,n,h,l=(0,y.onceEmiter)(this,e);i&&this._calendar_.service.dispatchEvent(e,t,l),l.emit(t)},selSchedule(e){var{wdx:t,ddx:i}=e.mark,{sdx:e,all:a}=e.currentTarget.dataset;let r=this.data.panels[this.data.current].weeks[t].days[i];a?(t=r.schedules.map(e=>(0,u.getScheduleDetail)(r,e,this._calendar_.service)),this.triggerEvent("schedule",{schedules:t,all:!0})):(i=(0,u.getScheduleDetail)(r,r.schedules[e],this._calendar_.service),this.triggerEvent("schedule",{schedule:i,all:!1}))}},pageLifetimes:{show:function(){var e;this._loaded_&&null!=(e=this._printer_)&&e.update()}},observers:{date:function(e){this._loaded_?this._panel_.toDate(e):this._dragger_.update()},marks:function(e){var t=this._calendar_.service.getPlugin(i.MARK_PLUGIN_KEY);null!=t&&t.update(this,e)},view:function(e){var e=(0,y.viewFlag)(e),t=(0,y.flagView)(e),i=(0,y.isSkyline)(this.renderer);this._loaded_?i?this.toggleView(e):this.setData({transView:t}):(i&&this._dragger_.toView(e,!1),this._view_=e)},viewGesture:function(e){this._loaded_&&e!==this.$_gesture.value&&(this.$_gesture.value=e,this.setData({gesture:e}))},darkmode:function(e){e||(v.Layout.theme="light"),this._loaded_&&(e=e&&v.Layout.darkmode)!==this.data.darkside&&(this.setData({darkside:e}),e?this._printer_.bindThemeChange():this._printer_.cancelThemeChange())}},export(){if(!this._loaded_)return null;let t=this;return{version:o.VERSION,checked(e){return t._panel_.toDate(e)},toggleView(e){e=(e?(0,y.viewFlag)(e):t._view_&o.View.week?o.View.month:o.View.week)||o.View.month;(0,y.isSkyline)(t.renderer)?t.toggleView(e):t.setData({transView:(0,y.flagView)(e)})},openAnuual(){return t.selYear()},getMarks(e){return t._calendar_.service.getEntireMarks(e)},getPlugin(e){return t._calendar_.service.getPlugin(e)},updateDates(e){return t._calendar_.service.updateDates(e)}}}});