import http_axios from '../utils/http/axios'
import http_wx from '../utils/http/wxhttp'
const http = mpvue_Mode === 'WX' ? http_wx : http_axios;

let BaseHost =process.env.NODE_ENV != 'development'? "http://192.168.0.168:8065/":"https://money.ujianchina.net/"; 

export default {
    BaseHost,
    http,
    Recharge_RechargeWX_Json:(UserId,Money=0.01,OpenId,title="U建-广西越知平台服务费用")=>{
        // var opt = {

        // }
        return http.get(BaseHost + `Recharge/RechargeWX_Json?UserId=${UserId}&Money=${Money}&Event=1&title=${title}&appid=wx443ed32fe34ba2f0&OpenId=${OpenId}`)
    }
}