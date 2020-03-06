import http_axios from '../utils/http/axios'
import http_wx from '../utils/http/wxhttp'
const http = mpvue_Mode === 'WX' ? http_wx : http_axios;

let BaseHost = process.env.NODE_ENV != 'development'?"http://localhost:49814/":"https://group.ujianchina.net/";

export default {
    groupChat_Create:(groupname,owner,members,desc="",isPublic=false,approval=true)=>{
       return  http_wx.get(BaseHost+`groupChat/Create?groupname=${groupname}&members=${members}&owner=${owner}&desc=${desc}&isPublic=${isPublic}&approval=${approval}`)
    },
    groupChat_ModifyDescription:(groupid,description)=>
    {
        return http_wx.get(BaseHost+`groupChat/ModifyDescription?groupid=${groupid}&description=${description}`)
    }
}