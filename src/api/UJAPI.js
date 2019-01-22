import http_axios from '../utils/http/axios'
import http_wx from '../utils/http/wxhttp'
const http = mpvue_Mode === 'WX' ? http_wx : http_axios;

// let BaseHost = "http://192.168.0.119:801/";
let BaseHost = "https://app.ujianchina.net/";

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
}