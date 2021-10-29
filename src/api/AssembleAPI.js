/*
 * @Author: SuChonghua
 * @Date: 2021-10-25 17:59:40
 * @LastEditTime: 2021-10-25 18:28:57
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\api\AssembleAPI.js
 */
import http_axios from '../utils/http/axios'
import http_wx from '../utils/http/wxhttp'
const http = mpvue_Mode === 'WX' ? http_wx : http_axios;

let BaseHost = process.env.NODE_ENV == 'development'?"http://test.yz.com/file_web":"https://assemble.ujianchina.net/file_web";

export default{
    UpLoad:param=>{
        return http.post(BaseHost + "/api/UpLoad/UpLoadFile", param)
    }
}