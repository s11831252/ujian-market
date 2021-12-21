/*
 * @Author: SuChonghua
 * @Date: 2021-11-05 19:05:33
 * @LastEditTime: 2021-12-13 16:18:45
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
    SupplyAndDemand_Modify:param=>{
        return http.put(BaseHost + "/api/SupplyAndDemand/Modify", param)
    },
    
    SupplyAndDemand_GetList:param=>{
        return http.get(BaseHost + "/api/SupplyAndDemand/GetList", param)
    },
    SupplyAndDemand_Detail:listId=>{
        return http.get(BaseHost + `/api/SupplyAndDemand/Detail?listId=${listId}`)
    },
    SupplyAndDemand_SendPayCode:()=>{
        return http.get(BaseHost + "/api/SupplyAndDemand/SendPayCode")
    },
    HallMoney_Balance:()=>{
        return http.get(BaseHost + "/api/HallMoney/Balance")
    },
    SupplyAndDemand_Pay:param=>{
        return http.post(BaseHost + "/api/SupplyAndDemand/Pay",param)
    },
    SupplyAndDemand_RefreshTime:listId=>{
        return http.put(BaseHost + `/api/SupplyAndDemand/RefreshTime?listId=${listId}`)
    },
    SupplyAndDemand_AddShowDays:(listId,days)=>{
        return http.post(BaseHost + `/api/SupplyAndDemand/AddShowDays?listId=${listId}&days=${days}`)
    },
    SupplyAndDemand_Stop:(listId,isStop,sendUserId)=>{
        return http.put(BaseHost + `/api/SupplyAndDemand/Stop?listId=${listId}&isStop=${isStop}&sendUserId=${sendUserId}`)
    },
    Home_GetBanner:()=>{
        return http.get(BaseHost + `/api/Home/GetBanner`)
    },
    Home_GetShop:()=>{
        return http.get(BaseHost + `/api/Home/GetShop`)
    }
}