import Guid from './guid.js'

function setCookie(c_name, value, expire) {
  var date = new Date()
  date.setSeconds(date.getSeconds() + expire)
  document.cookie = c_name + "=" + escape(value) + "; expires=" + date.toGMTString()
  //console.log(document.cookie)
}

function getCookie(c_name) {
  if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + "=")
      if (c_start != -1) {
          c_start = c_start + c_name.length + 1
          let c_end = document.cookie.indexOf(";", c_start)
          if (c_end == -1) c_end = document.cookie.length
          return unescape(document.cookie.substring(c_start, c_end))
      }
  }
  return ""
}

function delCookie(c_name) {
  setCookie(c_name, "", -1)
}

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

function formatTime(date,fmt) {
  var o = {
      "M+" : date.getMonth() + 1,
      "d+" : date.getDate(),
      "h+" : date.getHours(),
      "m+" : date.getMinutes(),
      "s+" : date.getSeconds(),
      "q+" : Math.floor((date.getMonth() + 3) / 3),
      "S" : date.getMilliseconds()
  };
  if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/**
 * 设置缓存项
 *
 * @param {*} key 缓存键名
 * @param {*} value 缓存值
 */
function setItem(key,value){
  // 存储
  if(mpvue_Mode === 'WX')
     wx.setStorageSync(key, value)
  else
  {
    localStorage.setItem(key,JSON.stringify(value));
  }
}


/**
 *获取缓存值
 *
 * @param {*} key 缓存键名
 * @returns 返回缓存值
 */
function getItem(key)
{
    if(mpvue_Mode === 'WX')
      return wx.getStorageSync(key)
    else
    {
      return JSON.parse(localStorage.getItem(key));
    }
}

/**
 *移除缓存键
 *
 * @param {*} key 缓存键名
 */
function removeItem(key)
{
  if(mpvue_Mode === 'WX')
     wx.removeStorageSync(key)
  else
    localStorage.removeItem(key);
}

var regexp = {
  phone(phoneStr){
   var patt1 = /^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6-7])|(17[1-8])|(18[0-9])|(19[1|3])|(19[5|6])|(19[8|9]))\d{8}$/;
   return patt1.test(phoneStr)
  }
}


export default {
  regexp,
  Guid,
  formatNumber,
  formatTime,
  setCookie,
  getCookie,
  delCookie,
  setItem,
  getItem,
  removeItem,
}
