
'use strict'

const _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
const { error: _error } = console
/**
 * @class Base64Class 帮助基类
 */
class Base64Class {
  static init() {
    return new Base64Class()
  }

  // public method for encoding
  static encode(input) {
    let output = ''
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4
    let i = 0

    input = Base64Class._utf8_encode(input)

    while (i < input.length) {
      chr1 = input.charCodeAt(i++)
      chr2 = input.charCodeAt(i++)
      chr3 = input.charCodeAt(i++)

      enc1 = chr1 >> 2
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      enc4 = chr3 & 63

      if (isNaN(chr2)) {
        enc3 = enc4 = 64
      } else if (isNaN(chr3)) {
        enc4 = 64
      }

      output += _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4)
    }

    return output
  }

  // public method for decoding
  static decode(input) {
    let output = ''
    let chr1, chr2, chr3
    let enc1, enc2, enc3, enc4
    let i = 0

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')// eslint-disable-line

    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++))
      enc2 = _keyStr.indexOf(input.charAt(i++))
      enc3 = _keyStr.indexOf(input.charAt(i++))
      enc4 = _keyStr.indexOf(input.charAt(i++))

      chr1 = (enc1 << 2) | (enc2 >> 4)
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      chr3 = ((enc3 & 3) << 6) | enc4

      output = output + String.fromCharCode(chr1)

      if (enc3 !== 64) {
        output = output + String.fromCharCode(chr2)
      }
      if (enc4 !== 64) {
        output = output + String.fromCharCode(chr3)
      }
    }

    output = this._utf8_decode(output)

    return output
  }
  static encode64(input) {
    let output = ''
    let chr1; let chr2; let chr3 = ''
    let enc1; let enc2; let enc3; let enc4 = ''
    let i = 0

    do {
      chr1 = input.charCodeAt(i++)
      chr2 = input.charCodeAt(i++)
      chr3 = input.charCodeAt(i++)

      enc1 = chr1 >> 2
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      enc4 = chr3 & 63

      if (isNaN(chr2)) {
        enc3 = enc4 = 64
      } else if (isNaN(chr3)) {
        enc4 = 64
      }

      output = output +
            _keyStr.charAt(enc1) +
            _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) +
            _keyStr.charAt(enc4)
      chr1 = chr2 = chr3 = ''
      enc1 = enc2 = enc3 = enc4 = ''
    } while (i < input.length)

    return output
  }
  static decode64(input) {
    let output = ''
    let chr1; let chr2; let chr3 = ''
    let enc1; let enc2; let enc3; let enc4 = ''
    let i = 0

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    const base64test = /[^A-Za-z0-9\+\/\=\n]/g // eslint-disable-line
    if (base64test.exec(input)) {
      _error('There were invalid base64 characters in the input text.\n' +
                  "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                  'Expect errors in decoding.')
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')// eslint-disable-line

    do {
      enc1 = _keyStr.indexOf(input.charAt(i++))
      enc2 = _keyStr.indexOf(input.charAt(i++))
      enc3 = _keyStr.indexOf(input.charAt(i++))
      enc4 = _keyStr.indexOf(input.charAt(i++))

      chr1 = (enc1 << 2) | (enc2 >> 4)
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      chr3 = ((enc3 & 3) << 6) | enc4

      output = output + String.fromCharCode(chr1)

      if (enc3 !== 64) {
        output = output + String.fromCharCode(chr2)
      }
      if (enc4 !== 64) {
        output = output + String.fromCharCode(chr3)
      }

      chr1 = chr2 = chr3 = ''
      enc1 = enc2 = enc3 = enc4 = ''
    } while (i < input.length)

    return output
  }
  // private method for UTF-8 encoding
  static _utf8_encode(string) {
    string = string.replace(/\r\n/g, '\n')
    let utftext = ''

    for (let n = 0; n < string.length; n++) {
      const c = string.charCodeAt(n)

      if (c < 128) {
        utftext += String.fromCharCode(c)
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192)
        utftext += String.fromCharCode((c & 63) | 128)
      } else {
        utftext += String.fromCharCode((c >> 12) | 224)
        utftext += String.fromCharCode(((c >> 6) & 63) | 128)
        utftext += String.fromCharCode((c & 63) | 128)
      }
    }

    return utftext
  }

  // private method for UTF-8 decoding
  static _utf8_decode(utftext) {
    let string = ''
    let i = 0
    let c = 0
    // let c1 = 0;
    let c2 = 0
    let c3 = 0

    while (i < utftext.length) {
      c = utftext.charCodeAt(i)

      if (c < 128) {
        string += String.fromCharCode(c)
        i++
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1)
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
        i += 2
      } else {
        c2 = utftext.charCodeAt(i + 1)
        c3 = utftext.charCodeAt(i + 2)
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
        i += 3
      }
    }

    return string
  }

}

/**
 * @class UtfParserClass类
 */
class UtfParserClass {
  /**
    * 用于对象实例化
    * @param {String} privateKey 用于加密的私钥
    * @returns {Object} 返回已经实例化完成的对象
    */
  static init() {
    const res = new UtfParserClass()
    return res
  }

  // parms(str):string that you want to change
  static utf16to8(str) {
    let out, i, c
    const len = str.length

    out = ''
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i)
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i)
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
      } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
      }
    }
    return out
  }

  // function:change utf8 to utf16
  // parms(str):string that you want to change
  static utf8to16(str) {
    str = str.toString()

    const len = str.length
    let out, i, c
    let char2, char3

    out = ''
    i = 0
    while (i < len) {
      c = str.charCodeAt(i++)
      switch (c >> 4) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          // 0xxxxxxx
          out += str.charAt(i - 1)
          break
        case 12: case 13:
          // 110x xxxx  10xx xxxx
          char2 = str.charCodeAt(i++)
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))
          break
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = str.charCodeAt(i++)
          char3 = str.charCodeAt(i++)
          out += String.fromCharCode(((c & 0x0F) << 12) |
               ((char2 & 0x3F) << 6) |
               ((char3 & 0x3F) << 0))
          break
      }
    }

    return out
  }

  static utf8Encode(str) {
    // eslint-disable-next-line no-control-regex
    if (/^[\x00-\x7f]*$/.test(str)) {
      return str
    }
    var buf = []
    var n = str.length
    for (var i = 0, j = 0; i < n; ++i, ++j) {
      var codeUnit = str.charCodeAt(i)
      if (codeUnit < 0x80) {
        buf[j] = str.charAt(i)
      } else if (codeUnit < 0x800) {
        buf[j] = String.fromCharCode(0xC0 | (codeUnit >> 6),
          0x80 | (codeUnit & 0x3F))
      } else if (codeUnit < 0xD800 || codeUnit > 0xDFFF) {
        buf[j] = String.fromCharCode(0xE0 | (codeUnit >> 12),
          0x80 | ((codeUnit >> 6) & 0x3F),
          0x80 | (codeUnit & 0x3F))
      } else {
        if (i + 1 < n) {
          var nextCodeUnit = str.charCodeAt(i + 1)
          if (codeUnit < 0xDC00 && nextCodeUnit >= 0xDC00 && nextCodeUnit <= 0xDFFF) {
            var rune = (((codeUnit & 0x03FF) << 10) | (nextCodeUnit & 0x03FF)) + 0x010000
            buf[j] = String.fromCharCode(0xF0 | ((rune >> 18) & 0x3F),
              0x80 | ((rune >> 12) & 0x3F),
              0x80 | ((rune >> 6) & 0x3F),
              0x80 | (rune & 0x3F))
            ++i
            continue
          }
        }
        throw new Error('Malformed string')
      }
    }
    return buf.join('')
  }

  static utf8DecodeShortString(bs, n) {
    var charCodes = new Array(n)
    var i = 0; var off = 0
    for (var len = bs.length; i < n && off < len; i++) {
      var unit = bs.charCodeAt(off++)
      switch (unit >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          charCodes[i] = unit
          break
        case 12:
        case 13:
          if (off < len) {
            charCodes[i] = ((unit & 0x1F) << 6) |
                            (bs.charCodeAt(off++) & 0x3F)
          } else {
            throw new Error('Unfinished UTF-8 octet sequence')
          }
          break
        case 14:
          if (off + 1 < len) {
            charCodes[i] = ((unit & 0x0F) << 12) |
                            ((bs.charCodeAt(off++) & 0x3F) << 6) |
                            (bs.charCodeAt(off++) & 0x3F)
          } else {
            throw new Error('Unfinished UTF-8 octet sequence')
          }
          break
        case 15:
          if (off + 2 < len) {
            var rune = (((unit & 0x07) << 18) |
                            ((bs.charCodeAt(off++) & 0x3F) << 12) |
                            ((bs.charCodeAt(off++) & 0x3F) << 6) |
                            (bs.charCodeAt(off++) & 0x3F)) - 0x10000
            if (rune >= 0 && rune <= 0xFFFFF) {
              charCodes[i++] = (((rune >> 10) & 0x03FF) | 0xD800)
              charCodes[i] = ((rune & 0x03FF) | 0xDC00)
            } else {
              throw new Error('Character outside valid Unicode range: 0x' + rune.toString(16))
            }
          } else {
            throw new Error('Unfinished UTF-8 octet sequence')
          }
          break
        default:
          throw new Error('Bad UTF-8 encoding 0x' + unit.toString(16))
      }
    }
    if (i < n) {
      charCodes.length = i
    }
    return String.fromCharCode.apply(String, charCodes)
  }

  static utf8DecodeLongString(bs, n) {
    var buf = []
    var charCodes = new Array(0x8000)
    var i = 0; var off = 0
    for (var len = bs.length; i < n && off < len; i++) {
      var unit = bs.charCodeAt(off++)
      switch (unit >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          charCodes[i] = unit
          break
        case 12:
        case 13:
          if (off < len) {
            charCodes[i] = ((unit & 0x1F) << 6) |
                            (bs.charCodeAt(off++) & 0x3F)
          } else {
            throw new Error('Unfinished UTF-8 octet sequence')
          }
          break
        case 14:
          if (off + 1 < len) {
            charCodes[i] = ((unit & 0x0F) << 12) |
                            ((bs.charCodeAt(off++) & 0x3F) << 6) |
                            (bs.charCodeAt(off++) & 0x3F)
          } else {
            throw new Error('Unfinished UTF-8 octet sequence')
          }
          break
        case 15:
          if (off + 2 < len) {
            var rune = (((unit & 0x07) << 18) |
                            ((bs.charCodeAt(off++) & 0x3F) << 12) |
                            ((bs.charCodeAt(off++) & 0x3F) << 6) |
                            (bs.charCodeAt(off++) & 0x3F)) - 0x10000
            if (rune >= 0 && rune <= 0xFFFFF) {
              charCodes[i++] = (((rune >> 10) & 0x03FF) | 0xD800)
              charCodes[i] = ((rune & 0x03FF) | 0xDC00)
            } else {
              throw new Error('Character outside valid Unicode range: 0x' + rune.toString(16))
            }
          } else {
            throw new Error('Unfinished UTF-8 octet sequence')
          }
          break
        default:
          throw new Error('Bad UTF-8 encoding 0x' + unit.toString(16))
      }
      if (i >= 0x7FFF - 1) {
        var size = i + 1
        charCodes.length = size
        buf[buf.length] = String.fromCharCode.apply(String, charCodes)
        n -= size
        i = -1
      }
    }
    if (i > 0) {
      charCodes.length = i
      buf[buf.length] = String.fromCharCode.apply(String, charCodes)
    }
    return buf.join('')
  }

  // n is UTF16 length
  static utf8Decode(bs, n) {
    if (n === undefined || n === null || (n < 0)) n = bs.length
    if (n === 0) return ''
    // eslint-disable-next-line no-control-regex
    if (/^[\x00-\x7f]*$/.test(bs) || !(/^[\x00-\xff]*$/.test(bs))) {
      if (n === bs.length) return bs
      return bs.substr(0, n)
    }
    return ((n < 0x7FFF)
      ? UtfParserClass.utf8DecodeShortString(bs, n)
      : UtfParserClass.utf8DecodeLongString(bs, n))
  }

}

/**
 * @class XxteaClass类
 */
 class XxteaClass {
  constructor(privateKey) {
    this._keyString = privateKey||_keyStr
  }
  /**
    * 用于对象实例化
    * @param {String} privateKey 用于加密的私钥
    * @returns {Object} 返回已经实例化完成的对象
    */
  static init(privateKey) {
    const res = new XxteaClass(privateKey)
    return res
  }
  _long2str(v, w) {
    const vl = v.length
    let n = (vl - 1) << 2
    if (w) {
      const m = v[vl - 1]
      if ((m < n - 3) || (m > n)) return null
      n = m
    }
    for (let i = 0; i < vl; i++) {
      v[i] = String.fromCharCode(v[i] & 0xff,
        v[i] >>> 8 & 0xff,
        v[i] >>> 16 & 0xff,
        v[i] >>> 24 & 0xff)
    }
    if (w) {
      return v.join('').substring(0, n)
    } else {
      return v.join('')
    }
  }

  _str2long(s, w) {
    const len = s.length
    const v = []
    for (let i = 0; i < len; i += 4) {
      v[i >> 2] = s.charCodeAt(i) |
              s.charCodeAt(i + 1) << 8 |
              s.charCodeAt(i + 2) << 16 |
              s.charCodeAt(i + 3) << 24
    }
    if (w) {
      v[v.length] = len
    }
    return v
  }

  xxtea_encrypt(str) {
    if (!str) {
      return ''
    }
    str = Base64Class.encode64(UtfParserClass.utf8Encode(str))
    const v = this._str2long(str, true)
    const k = this._str2long(this._keyString, false)
    if (k.length < 4) {
      k.length = 4
    }
    const n = v.length - 1

    let z = v[n]; let y = v[0]; const delta = 0x9E3779B9
    let mx; let e; let p; let q = Math.floor(6 + 52 / (n + 1)); let sum = 0
    while (q-- > 0) {
      sum = sum + delta & 0xffffffff
      e = sum >>> 2 & 3
      for (p = 0; p < n; p++) {
        y = v[p + 1]
        mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z)
        z = v[p] = v[p] + mx & 0xffffffff
      }
      y = v[0]
      mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z)
      z = v[n] = v[n] + mx & 0xffffffff
    }

    return Base64Class.encode64(this._long2str(v, false))
  }

  xxtea_decrypt(str) {
    if (!str) {
      return ''
    }
    str = Base64Class.decode64(str)
    const v = this._str2long(str, false)
    const k = this._str2long(this._keyString, false)
    if (k.length < 4) {
      k.length = 4
    }
    const n = v.length - 1

    let z = v[n - 1]; let y = v[0]; const delta = 0x9E3779B9
    let mx; let e; let p; const q = Math.floor(6 + 52 / (n + 1)); let sum = q * delta & 0xffffffff
    while (sum !== 0) {
      e = sum >>> 2 & 3
      for (p = n; p > 0; p--) {
        z = v[p - 1]
        mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z)
        y = v[p] = v[p] - mx & 0xffffffff
      }
      z = v[n]
      mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z)
      y = v[0] = v[0] - mx & 0xffffffff
      sum = sum - delta & 0xffffffff
    }
    return UtfParserClass.utf8Decode(Base64Class.decode64(this._long2str(v, true)))
  }
 
}
 
export default new XxteaClass;