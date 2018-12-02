//import wx from 'wx';//引用微信小程序wx对象
//import { bmobConfig } from '../config/bmob';//bmob配置文件
import store from '../../store'
let bmobConfig={
    applicationId:"",
    restApiKey:""
}
const net = {
  get(url, data) {
    wx.showLoading({
      title: '加载中',//数据请求前loading，提高用户体验
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: data,
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'X-Bmob-Application-Id': bmobConfig.applicationId,
          'X-Bmob-REST-API-Key': bmobConfig.restApiKey,
          'Content-Type': 'application/json',
          'Device':"WebApp",
          'SingleTicket':store.state.User.SingleTicket
        }, // 设置请求的 header
        success: function (res) {
          // success
          wx.hideLoading();
          if(res.statusCode!=200){
            wx.showToast({
              title: "网络出错，稍后再试",
              icon: "none"
            });
            return false;
          }
          if(res.data&&res.data.ret)
            if(res.data.ret==10000||res.data.ret==10001||res.data.ret==10002)
            {
              store.state.User.SingleTicket="";
              wx.redirectTo({url:"/pages/index/index"});
            }else if(res.data.ret!=0)
            {
              wx.showToast({
                title: res.data.msg,
                icon: "none"
              });
              return false;
            }
          resolve(res.data);
        },
        fail: function (error) {
          // fail
          wx.hideLoading();
          reject(error);//请求失败
        },
        complete: function () {
          wx.hideLoading();
          // complete
        }
      })
    })
  },
  post(url, data) {
    wx.showLoading({
      title: '加载中',
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: data,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'X-Bmob-Application-Id': bmobConfig.applicationId,
          'X-Bmob-REST-API-Key': bmobConfig.restApiKey,
          'Content-Type': 'application/json',
          'SingleTicket':store.state.User.SingleTicket
        }, // 设置请求的 header
        success: function (res) {
          // success
          wx.hideLoading();
          if(res.statusCode!=200){
            wx.showToast({
              title: "网络出错，稍后再试",
              icon: "none"
            });
            return false;
          }
          if(res.data.ret!=0){
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            });
            return false;
          }
          resolve(res.data);
        },
        fail: function (error) {
          // fail
          wx.hideLoading();
          reject(error);
        },
        complete: function () {
          // complete
          wx.hideLoading();
        }
      })
    })
  }
}

export default net;//暴露出来供其他文件引用