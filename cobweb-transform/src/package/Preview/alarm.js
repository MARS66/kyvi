/*
 * @Description:
 * @Author: Kevin
 * @Date: 2023-08-04 08:51:20
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-24 15:28:38
 */

import Speech from 'speak-tts'
export default {
  data() {
    return {
      TIME: 1000 * 60 * 5,
      isFree: true, // 语音播报是否空闲
      warnObject: {}, 
      WarnMark: {},
      LevelTypes: [
        {label:'高报1级',value:'g1'},
        {label:'高报2级',value:'g2'},
        {label:'高报3级',value:'g3'},
        {label:'低报1级',value:'d1'},
        {label:'低报2级',value:'d2'},
        {label:'低报3级',value:'d3'},
      ]
    }
  },
  async created() {
    this.$notify.closeAll()
    this.speechInit()
    const that = this;
    window.warning = (id, warn) => {
      if (that.isFree && (!that.WarnMark[id] || (Math.round(new Date()) - that.WarnMark[id] > that.TIME))) {
        that.WarnMark[id] = Math.round(new Date())
        that.isFree = false;
        that.doWarn(id, warn)
      }
    }
  },
  methods: {
    doWarn (id, warn) { 
    this.warnObject=warn
    const pen = window.cobweb.findOne(id)
    this.warnObject.val = pen?.text;
    const level =this.LevelTypes.find(item=>item.value===warn.level)?.label
    this.warnObject.label = level;
    this.warnObject.point = pen?.form?.length ? pen.form[0].dataIds?.name : ''
    this.warning()
  },
    warning(key) {
      const _this = this
      const { point, label, val, start,end } = this.warnObject
      const text = point + label
      this.isFree = false
      this.speakTtsSpeech(text.replace('_', ''), point)
      this.$notify({
        showClose: true,
        title: '报警提示',
        message: `报警点位：${point}; 报警等级：${label}；报警值：${val}；标准值：${start}-${end}`,
        position: 'top-right',
        type: 'warning',
        offset: 80,
        duration: 0,
        onClose() {
          _this.cancelSpeech(key)
        }
      })
    },
    // 语音读取报错信息
    speakTtsSpeech(text, key) {
      this.speech.speak(
        {
          text: text.replace('#', '号'),
          listeners: {
            onend: () => {
              if (this.warnObject.point===key) {
                this.time = setTimeout(() => {
                  this.speakTtsSpeech(text, key)
                }, 1000)
              }
            }
          }
        }).then(() => {
        console.log('读取成功')
      }).catch(e => {
        console.error('语音报警错误:', e)
      })
    },
    // 取消报警
    cancelSpeech() {
      this.isFree = true
      this.speech.cancel()
    },
    // 语音报警初始化
    speechInit() {
      this.speech = new Speech()
      // this.speech.setLanguage('zh-CN')
      this.speech.init({
        'lang': 'zh-CN',
        'rate': 1.5,
        'pitch': 2,
        'splitSentences': true
      }).then(() => {
        // console.log('语音报警初始化成功')
      })
    }
  }
}
