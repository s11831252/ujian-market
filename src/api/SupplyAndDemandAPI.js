/*
 * @Author: SuChonghua
 * @Date: 2021-11-05 19:05:33
 * @LastEditTime: 2022-01-07 17:34:52
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\api\SupplyAndDemandAPI.js
 */
import http_axios from '../utils/http/axios'
import http_wx from '../utils/http/wxhttp'
const http = mpvue_Mode === 'WX' ? http_wx : http_axios;
// let BaseHost = process.env.NODE_ENV == 'development'?"http://192.168.0.95:821":"https://assemble.ujianchina.net/SupplyAndDemand";

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
    //发送支付验证码
    SupplyAndDemand_SendPayCode:()=>{
        return http.get(BaseHost + "/api/SupplyAndDemand/SendPayCode")
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
    },
    //U币购买发布点
    HallMoney_Buy:(param)=>{
        return http.post(BaseHost + `/api/HallMoney/Buy`,param)
    },
    //金融充值成功回调事件
    HallMoney_CallBack:()=>{
        return http.get(BaseHost + `/api/HallMoney/CallBack`)
    },
    //获取发布点余额
    HallMoney_Balance:()=>{
        return http.get(BaseHost + "/api/HallMoney/Balance")
    },
    //获取发布点使用记录，使用年月来查询，一次查询一月数据
    HallMoney_GetBooks:(param)=>{
        return http.get(BaseHost + `/api/HallMoney/GetBooks`,param)
    },
    //返回发布点价格
    HallMoney_GetPrice:(param)=>{
        return http.get(BaseHost + `/api/HallMoney/GetPrice`,param)
    },
    //发送打折码
    Rank_SendCode:(phone,point)=>{
        return http.post(BaseHost + `/api/Rank/SendCode?phone=${phone}&point=${point}`)
    },
    //获取打折率
    Rank_GetDiscountMoney:(key,code)=>{
        return http.post(BaseHost + `/api/Rank/GetDiscountMoney?key=${key}&code=${code}`)
    }
}