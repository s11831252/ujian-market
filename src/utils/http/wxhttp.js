//import wx from 'wx';//引用微信小程序wx对象
//import { bmobConfig } from '../config/bmob';//bmob配置文件
import store from '../../store'
let bmobConfig={
    applicationId:"",
    restApiKey:""
}
const accountInfo = mpvue_Mode === 'WX' ? wx.getAccountInfoSync() : {}
const net = {
  showAuthModal:true,
    /**
   * @description: 'get请求'
   * @param {*} url 请求url地址
   * @param {*} data uri参数,get请求会将data拼接在url中
   * @param {*} SingleTicket 请求是否携带u建的SingleTicket(默认true)
   * @return {*} 返回Promise的请求结果
   */
  get(url, data,SingleTicket=true) {
    var that = this;
    wx.showLoading({
      title: '加载中',//数据请求前loading，提高用户体验
      mask:true
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: data,
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          // 'X-Bmob-Application-Id': bmobConfig.applicationId,
          // 'X-Bmob-REST-API-Key': bmobConfig.restApiKey,
          'Content-Type': 'application/json',
          'Device':"WXMP",
          'DisplayVersion':"2.0.11",
          'SingleTicket':SingleTicket?store.state.User.SingleTicket:'',
          ...accountInfo.miniProgram
        }, // 设置请求的 header
        success: function (res) {
          wx.hideLoading();
          if(res.statusCode!=200){
            wx.showToast({
              title: "网络出错，稍后再试",
              icon: "none"
            });
            return false;
          }
          if(res.data&&res.data.ret)
          {
            if(res.data.ret==10000||res.data.ret==10001||res.data.ret==10002)
            {
              // if(!that.showing)
              wx.hideLoading(); 
              //防止多个请求弹出授权提示框
              if(!that.showAuthModal)
                return;
              that.showAuthModal=false;

              store.commit("Login", { Ticket: "" }); //清空Ticket
              // store.commit("SetUserInfo", {});//清空userinfo

              wx.showModal({
                confirmText:"重新登陆",
                cancelText:"刷新",
                title:"登录授权已失效",
                content:"您当前的登录授权信息已失效或已过期",
                success (res2) {
                  if (res2.confirm) {
                    var pages = getCurrentPages();    //获取加载的页面
                    var currentPage = pages[pages.length-1];    //获取当前页面的对象
                    var url = `/pages/index/index?redirect=/${currentPage.route}`;    //当前页面url
  
                    //拼接页面参数
                    var parms=[];
                    for(var key in currentPage.options)
                    {
                      parms.push(`${key}=${currentPage.options[key]}`);
                    }
                    if(parms.length>0)
                    {
                      //url转码
                      var parmsStr = parms.join("&")
                      let encodeparms = encodeURIComponent(`?${parmsStr}`);
                      url=url+encodeparms;
                    }
                    wx.redirectTo({url:`${url}`});
                  } else if (res2.cancel) {
                    var pages = getCurrentPages();    //获取加载的页面
                    var currentPage = pages[pages.length-1];    //获取当前页面的对象
                    var url = `/${currentPage.route}`;    //当前页面url
  
                    //拼接页面参数
                    var parms=[];
                    for(var key in currentPage.options)
                    {
                      parms.push(`${key}=${currentPage.options[key]}`);
                    }
                    if(parms.length>0)
                    {
                      //url转码
                      var parmsStr = parms.join("&")
                      let encodeparms = `?${parmsStr}`;
                      url=url+encodeparms;
                    }
                    wx.reLaunch({url:`${url}`})
                  }
                }
              })
              return false;
            }else if(res.data.ret!=0)
            {
              if(res.data.msg)
                wx.showToast({
                  title: res.data.msg,
                  icon: "none"
                });
              reject(res.data.msg)
              return false;
            }
          }
          that.showAuthModal=true;
          resolve(res.data);
        },
        fail: function (error) {
          // fail
          wx.hideLoading();
          reject(error);//请求失败
        },
        complete: function () {
        }
      })
    })
  },
  /**
   * @description: 'post请求'
   * @param {*} url 请求url地址
   * @param {*} data post请求中的body,如需携带uri参数请拼接在url中
   * @param {*} SingleTicket 请求是否携带u建的SingleTicket(默认true)
   * @return {*} 返回Promise的请求结果
   */
  post(url, data,SingleTicket=true) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: data,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Content-Type': 'application/json',
          'Device':"WXMP",
          'DisplayVersion':"2.0.11",
          'SingleTicket':SingleTicket?store.state.User.SingleTicket:'',
          ...accountInfo.miniProgram
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
            // if(!that.showing)
            wx.hideLoading(); 
            //防止多个请求弹出授权提示框
            if(!that.showAuthModal)
              return;
            that.showAuthModal=false;

            store.commit("Login", { Ticket: "" }); //清空Ticket
            store.commit("SetUserInfo", {});//清空userinfo

            wx.showModal({
              confirmText:"重新登陆",
              cancelText:"刷新",
              title:"登录授权已失效",
              content:"您当前的登录授权信息已失效或已过期",
              success (res2) {
                if (res2.confirm) {
                  var pages = getCurrentPages();    //获取加载的页面
                  var currentPage = pages[pages.length-1];    //获取当前页面的对象
                  var url = `/pages/index/index?redirect=/${currentPage.route}`;    //当前页面url

                  //拼接页面参数
                  var parms=[];
                  for(var key in currentPage.options)
                  {
                    parms.push(`${key}=${currentPage.options[key]}`);
                  }
                  if(parms.length>0)
                  {
                    //url转码
                    var parmsStr = parms.join("&")
                    let encodeparms = encodeURIComponent(`?${parmsStr}`);
                    url=url+encodeparms;
                  }
                  wx.redirectTo({url:`${url}`});
                } else if (res2.cancel) {
                  var pages = getCurrentPages();    //获取加载的页面
                  var currentPage = pages[pages.length-1];    //获取当前页面的对象
                  var url = `/${currentPage.route}`;    //当前页面url

                  //拼接页面参数
                  var parms=[];
                  for(var key in currentPage.options)
                  {
                    parms.push(`${key}=${currentPage.options[key]}`);
                  }
                  if(parms.length>0)
                  {
                    //url转码
                    var parmsStr = parms.join("&")
                    let encodeparms = `?${parmsStr}`;
                    url=url+encodeparms;
                  }
                  wx.reLaunch({url:`${url}`})
                }
              }
            })
            return false;
          }else if(res.data.ret!=0){
            if(res.data.msg)
              wx.showToast({
                title: res.data.msg,
                icon: "none"
              });
            reject(res.data.msg)
            return false;
          }
          resolve(res.data);
        },
        fail: function (error) {
          // fail
          wx.hideLoading();
          console.log(error)
          reject(error);
        },
        complete: function () {
        }
      })
    })
  },
  put(url, data,SingleTicket=true) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: data,
        method: 'PUT', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Content-Type': 'application/json',
          'Device':"WXMP",
          'DisplayVersion':"2.0.11",
          'SingleTicket':SingleTicket?store.state.User.SingleTicket:'',
          ...accountInfo.miniProgram
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
            // if(!that.showing)
            wx.hideLoading(); 
            //防止多个请求弹出授权提示框
            if(!that.showAuthModal)
              return;
            that.showAuthModal=false;

            store.commit("Login", { Ticket: "" }); //清空Ticket
            store.commit("SetUserInfo", {});//清空userinfo

            wx.showModal({
              confirmText:"重新登陆",
              cancelText:"刷新",
              title:"登录授权已失效",
              content:"您当前的登录授权信息已失效或已过期",
              success (res2) {
                if (res2.confirm) {
                  var pages = getCurrentPages();    //获取加载的页面
                  var currentPage = pages[pages.length-1];    //获取当前页面的对象
                  var url = `/pages/index/index?redirect=/${currentPage.route}`;    //当前页面url

                  //拼接页面参数
                  var parms=[];
                  for(var key in currentPage.options)
                  {
                    parms.push(`${key}=${currentPage.options[key]}`);
                  }
                  if(parms.length>0)
                  {
                    //url转码
                    var parmsStr = parms.join("&")
                    let encodeparms = encodeURIComponent(`?${parmsStr}`);
                    url=url+encodeparms;
                  }
                  wx.redirectTo({url:`${url}`});
                } else if (res2.cancel) {
                  var pages = getCurrentPages();    //获取加载的页面
                  var currentPage = pages[pages.length-1];    //获取当前页面的对象
                  var url = `/${currentPage.route}`;    //当前页面url

                  //拼接页面参数
                  var parms=[];
                  for(var key in currentPage.options)
                  {
                    parms.push(`${key}=${currentPage.options[key]}`);
                  }
                  if(parms.length>0)
                  {
                    //url转码
                    var parmsStr = parms.join("&")
                    let encodeparms = `?${parmsStr}`;
                    url=url+encodeparms;
                  }
                  wx.reLaunch({url:`${url}`})
                }
              }
            })
            return false;
          }else if(res.data.ret!=0){
            if(res.data.msg)
              wx.showToast({
                title: res.data.msg,
                icon: "none"
              });
            reject(res.data.msg)
            return false;
          }
          resolve(res.data);
        },
        fail: function (error) {
          // fail
          wx.hideLoading();
          console.log(error)
          reject(error);
        },
        complete: function () {
        }
      })
    })
  },
  upload (url,data,filePath,names,header){
    var that = this;
    // var  i = data.i ? data.i : 0,
    // success = data.success ? data.success : 0,
    // fail = data.fail ? data.fail : 0;
    //  console.log(url,data,filePath,names);

    //  return new Promise((resolve, reject) => {
    //   wx.uploadFile({
    //     url: url,
    //     filePath: filePath[0],
    //     name: `${name}[${0}]`,
    //     formData: data,
    //     header: {
    //       'Content-Type': 'application/json',
    //       'Device':"WebApp",
    //       'DisplayVersion':"2.0.11",
    //       'SingleTicket':store.state.User.SingleTicket
    //     }, // 设置请求的 header
    //     success: (resp) => {


    //       resolve(resp.data);
    //     },
    //     fail: (res) => {
    //     },
    //     complete: () => {
    //     }
    //   });

    // })
    wx.showLoading({
      title: '上传中',
      mask:true
    })
    var promiseList=[];
    var _header={
      'dataType-Type': 'application/json',
      'Device':"WebApp",
      'DisplayVersion':"2.0.11",
      'SingleTicket':store.state.User.SingleTicket,
      ...header
    };
    for (let index = 0; index < filePath.length; index++) {
      promiseList[index]=new Promise((resolve, reject) => {
          wx.uploadFile({
            url: url,
            filePath: filePath[index],
            name:names instanceof Array?names[index]:`${names}[${index}]`,
            formData: data,
            header: _header, // 设置请求的 header
            success: (resp) => {
              console.log(resp)
              if(resp.statusCode!=200){
                wx.showToast({
                  title: "网络出错，稍后再试",
                  icon: "none"
                });
                return false;
              }
              
              var res=JSON.parse(resp.data);
              // console.log(res)
              if(res.ret!=0){
                if(res.msg)
                  wx.showToast({
                    title: res.msg,
                    icon: "none"
                  });
              }
              resolve(res);

            },
            fail: (res) => {
            },
            complete: () => {
              wx.hideLoading();
            }
          });
        })
    }
   return Promise.all(promiseList);
    // .then(function (result){
    //   resolve(result[result.length-1]);
    // })
    // .then(function(error){
    //   reject(error);
    // })
   

    // return new Promise((resolve, reject) => {

    //   wx.uploadFile({
    //     url: url,
    //     filePath: filePath[i],
    //     name: `${name}[${i}]`,
    //     formData: data,
    //     header: {
    //       'Content-Type': 'application/json',
    //       'Device':"WebApp",
    //       'DisplayVersion':"2.0.11",
    //       'SingleTicket':store.state.User.SingleTicket
    //     }, // 设置请求的 header
    //     success: (resp) => {
    //       success++;
    //       console.log(resp)
    //       console.log(data);
    //       //这里可能有BUG，失败也会执行这里
    //       resolve(resp.data);
    //     },
    //     fail: (res) => {
    //       fail++;
    //       console.log('fail:' + i + "fail:" + fail);
    //     },
    //     complete: () => {
    //       console.log(i);
    //       i++;
    //       if (i == filePath.length) { //当图片传完时，停止调用   
    //         console.log('执行完毕');
    //         console.log('成功：' + success + " 失败：" + fail);
    //       } else {//若图片还没有传完，则继续调用函数
    //         console.log(i);
    //         data.i = i;
    //         data.success = success;
    //         data.fail = fail;
    //         that.upload(url,data,filePath);
    //       }
    //     }
    //   });
    // })
  }
}

export default net;//暴露出来供其他文件引用