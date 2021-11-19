/*
 * @Author: SuChonghua
 * @Date: 2021-11-05 19:05:33
 * @LastEditTime: 2021-11-19 18:31:33
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\api\SupplyAndDemandAPI.js
 */
import http_axios from '../utils/http/axios'
import http_wx from '../utils/http/wxhttp'
const http = mpvue_Mode === 'WX' ? http_wx : http_axios;

let BaseHost = process.env.NODE_ENV == 'development'?"http://test.yz.com/SupplyAndDemand":"https://assemble.ujianchina.net/SupplyAndDemand";

export default{
    SupplyAndDemand_Create:param=>{
        return http.post(BaseHost + "/api/SupplyAndDemand/Create", param)
    },
    SupplyAndDemand_GetList:param=>{
        return http.get(BaseHost + "/api/SupplyAndDemand/GetList", param)
    }
}