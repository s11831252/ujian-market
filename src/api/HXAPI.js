import http_axios from '../utils/http/axios'
import http_wx from '../utils/http/wxhttp'
const http = mpvue_Mode === 'WX' ? http_wx : http_axios;

let BaseHost="https://a1.easemob.com/"

export default {
    chatfiles:(username,appname,filePath,names,header)=>{
       return  http_wx.upload(BaseHost+`${username}/${appname}/chatfiles`,null,filePath,names,header)
    },
}