import http_axios from '../utils/http/axios'
import http_wx from '../utils/http/wxhttp'
const http = mpvue_Mode === 'WX' ? http_wx : http_axios;

// let BaseHost = "http://192.168.0.86:801/";
let BaseHost = process.env.NODE_ENV == 'development'?"http://192.168.0.119:801/":"https://app.ujianchina.net/";
// let BaseHost = "http://192.168.0.119:801/";



export default {
    Account_Login: param => {
        return http.post(BaseHost + "api/Account/Login", param)
    },
    User_Get: param => {
        return http.get(BaseHost + "api/User/Get", param)
    },
    Balance_Purse: () => {
        return http.get(BaseHost + "api/Purse/Balance")
    },
    GetKeyword:param=>{
        return http.get(BaseHost+ "api/CommonInfo/GetKeyword",param) 
     }
}