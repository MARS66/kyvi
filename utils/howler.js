// 拼接音频的方法
let audioContext = wx.createWebAudioContext();
let source=null
export const  concatAudio = async (audioSrc) => {
  const arrBufferList= await Promise.all(audioSrc.map(src => getAudioBuffer(src)));
  // 获得 AudioBuffer
  const audioBufferList = arrBufferList;
  // 最大通道数
  const maxChannelNumber = Math.max(...audioBufferList.map(audioBuffer => audioBuffer.numberOfChannels));
  // 总长度
  const totalLength = audioBufferList.map((buffer) => buffer.length).reduce((lenA, lenB) => lenA + lenB, 0);

  // 创建一个新的 AudioBuffer
  const newAudioBuffer = audioContext.createBuffer(maxChannelNumber, totalLength, audioBufferList[0].sampleRate);
  // 将所有的 AudioBuffer 的数据拷贝到新的 AudioBuffer 中
  let offset = 0;

  audioBufferList.forEach((audioBuffer, index) => {
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
          newAudioBuffer.getChannelData(channel).set(audioBuffer.getChannelData(channel), offset);
      }

      offset += audioBuffer.length;
  });
  if (source) {
    source.stop()
    source=null
  }
  source = audioContext.createBufferSource()
  source.buffer = newAudioBuffer
  source.connect(audioContext.destination)
  source.start()
  return newAudioBuffer;
}
export const destroyAudio=()=>{
  audioContext=null
  source=null
}
export const createAudio=()=>{
  audioContext=wx.createWebAudioContext()
}
export const  getAudioBuffer = (url) => {
  const res= wx.getFileSystemManager().readFileSync(url)
  return new Promise((resolve,reject)=>{
    audioContext.decodeAudioData(res, buffer => {
      resolve(buffer)
    }, err => {
      console.error('decodeAudioData fail', err)
      reject()
    })
})
}
