import http_axios from '../utils/http/axios'
import http_wx from '../utils/http/wxhttp'
const http = mpvue_Mode === 'WX' ? http_wx : http_axios;

let BaseHost = "http://app.ujianchina.net:811/";
//let BaseHost = "http://192.168.0.86:811/";


export default {
    Market_Get: param => {
        return http.get(BaseHost + "api/Market/Get", param)
    },
    Shop_Get: param => {
        return http.get(BaseHost + "api/Shop/Get", param)
    },
    Shop_GetDetails: param => {
        return http.get(BaseHost + "api/Shop/GetDetails", param)
    },
    CustomGoodsType_Get: param => {
        return http.get(BaseHost + "api/CustomGoodsType/Get", param)
    },
    Goods_GetByShop: param => {
        return http.get(BaseHost + "api/Goods/GetByShop", param)
    },
    Goods_Get: param => {
        return http.get(BaseHost + "api/Goods/Get", param)
    },
    GetLogisticsMode: param => {
        return http.get(BaseHost + "api/LogisticsDistribution/GetLogisticsMode", param)
    },
    GetDistributionMode: param => {
        return http.get(BaseHost + "api/LogisticsDistribution/GetDistributionMode", param)
    },
    OrderAddress_Get: param => {
        return http.get(BaseHost + "api/OrderAddress/Get", param)
    },
    QueryFreight: param => {
        return http.post(BaseHost + "api/LogisticsDistribution/QueryFreight", param)
    },
    Order_Create: param => {
        return http.post(BaseHost + "api/Order/Create", param)
    },
    Order_Get: param => {
        return http.get(BaseHost + "api/Order/Get", param)
    },
}