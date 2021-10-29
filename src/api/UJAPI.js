
import http_axios from '../utils/http/axios'
import http_wx from '../utils/http/wxhttp'
const http = mpvue_Mode === 'WX' ? http_wx : http_axios;

let BaseHost = process.env.NODE_ENV != 'development'?"http://192.168.0.119:801/":"https://app.ujianchina.net/";
// let BaseHost = process.env.NODE_ENV == 'development'?"http://www.luozuzhan.top:801/":"https://app.ujianchina.net/";

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
    },
    Error_upload:param=>{
        return http.post(BaseHost+ "api/Error/upload",param) 
    },
    BusinessCard_GetJSapi_ticket:(url,timespan,noncestr)=>{
        return http.get(BaseHost+ `api/BusinessCard/GetJSapi_ticket?url=${url}&timespan=${timespan}&noncestr=${noncestr}`) 
    },
    SensitiveWords_GetWords:()=>{
        return http.get(BaseHost+ `api/SensitiveWords/GetWords`) 
    },
    SensitiveWords_SaveData:param=>{
        return http.post(BaseHost+ "api/SensitiveWords/SaveData",param) 
    },
    Enterprise_Get:param=>{
        return http.get(BaseHost+ "api/Enterprise/Get") 
    },
    Project_GetList:param=>{
        return http.get(BaseHost+ "api/Project/GetList",param) 
    },
    
    
}