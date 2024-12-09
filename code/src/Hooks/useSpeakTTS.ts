
import Speech from 'speak-tts';
// Say.speak('高报一级')


export default  function  useSpeakTTS() {
  const speech = new Speech()
  speech.init({
    lang: 'zh-CN',
    rate: 1,
    pitch: 2,
    // voice:'Google UK English Male',
    splitSentences: true
  }).then(() => {
    console.log('语音报警初始化成功')
  })
  let delay;
  // 执行说话
  const Say = (text='') => {
    if (!text) {
      speech.cancel()
      return;
    }
   speech.speak({
      text,
      queue: false,
      listeners: {
        onend: () => {
          delay = setTimeout(() => {
            Say(text)
          }, 1000)
        },
      }
    }).catch(e => {
        console.error("An error occurred :", e)
    })
  }
  return {
    Say
  }

}