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

function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
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
