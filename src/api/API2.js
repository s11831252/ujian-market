import http_axios from '../utils/http/axios'
import http_wx from '../utils/http/wxhttp'
const http = mpvue_Mode === 'WX' ? http_wx : http_axios;

let BaseHost = process.env.NODE_ENV == 'development'?"http://192.168.0.119:809/":"https://group.ujianchina.net/";

export default {
    groupChat_Create:(groupname,owner,members,desc="",isPublic=false,approval=true)=>{
       return  http.post(BaseHost+`groupChat/Create`,{groupname,owner,members,desc,isPublic,approval})
    },
    groupChat_ModifyDescription:(groupid,description)=>
    {
        return http.post(BaseHost+`groupChat/ModifyDescription`,{groupid,description})
    }
}