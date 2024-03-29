import Vue from 'vue';
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import ShoppingAPI from "./api/ShoppingAPI"
import WeixinOpenAPI from "./api/WeixinOpenAPI"
import UJAPI from "./api/UJAPI"
import SupplyAndDemandAPI from "./api/SupplyAndDemandAPI"


Vue.use(Vuex);
export default new Vuex.Store({//store对象
  modules: {
    User: {
      state: {
        UserInfo: {},
        SingleTicket: "",
        CurrentLocation:{},
        viewHistory:[],//店铺浏览记录
        showHistory:true,
        myShop:{},
      },
      getters:{
        Logined: state =>{
          var b =  state.SingleTicket!=null&&state.SingleTicket.length>0&&state.UserInfo!=null &&state.UserInfo.UserId!=null &&state.UserInfo.UserId.length>0;
          return b;
        },
      },
      mutations: {
        Login(state, payload) {
          // 变更状态
          state.SingleTicket = payload.Ticket;
        },
        SetUserInfo(state, UserInfo) {
          state.UserInfo = UserInfo;
        },
        UpdateLocation(state,payload){
          state.CurrentLocation = payload;
        },
        
        viewHistory_push(state,viewlog){
          if(viewlog!=null)
          {
            // var obj =  state.viewHistory.find(item=>item.sId==viewlog.sId)//查找店铺是否浏览过
            // if(obj)
            // {
            //   if(state.viewHistory.length>1)
            //   {
            //     var _index =state.viewHistory.indexOf(obj)//找下标
            //     state.viewHistory.splice(_index,1);//先移除
            //     state.viewHistory.unshift(viewlog);//再插入首位
            //   }

            // }eles
            // {
            //   state.viewHistory.unshift(viewlog)
            // }
            var obj =  state.viewHistory.find(function(item){
              return item.sId==viewlog.sId;
            })//查找店铺是否浏览过
            if(obj!=null)
            {
              var _index =state.viewHistory.indexOf(obj);//找下标
               state.viewHistory.splice(_index,1);//先移除
            }
            
            state.viewHistory.unshift(viewlog);
            if(state.viewHistory.length>50)
              state.viewHistory.pop();
            state.showHistory=true;
          }

        },
        setshowHistory(state,isshow)
        {
          state.showHistory=isshow;
        },
        setMyShop(state,shopinfo)
        {
          state.myShop=shopinfo;
        }
      },
      actions:{
        async getMyShop(context){
          var rep = await ShoppingAPI.Shop_GetMy();
          if(rep.ret==0)
          {
            context.commit('setMyShop',rep.data.length>0?rep.data[0]:null);
          }
        }
      }
    },
    ShoppingCar: {
      state: {
        List: [
          // {
          //   sId:'',
          //   sName:'店铺名',
          //   goods:[
          //     {
          //       sId:'店铺标识',
          //       gId:'商品Id',
          //       gName:'商品名称',
          //       ItemId:'规格Id',
          //       ItemName:'规格名',
          //       Image:'商品首图',
          //       Number:'购物数量',
          //       Price:'单价',
          //       Stock:'库存',
          //     }
          //   ],
          //   Logistics: {
          //     Order_Address_Id
          //     LogisticsId: 0,
          //     Name: "双方协商",
          //     DistributionMode: {
          //       DistributionModeId: 1,
          //       DistributionModeText: "小轿车"
          //     },
          //     FreightInfo: {
          //       Freight: 1.0,
          //       distance: {
          //         text: "2.1公里",
          //         value: 2.1
          //       },
          //       duration: {
          //         text: "2小时",
          //         value: 2
          //       }
          //     }
          //   }
          // }
        ]
      },
      getters: {
        ///获取店铺购物车清单
        getShoppingCarBysId: state => (sId) => {
          return state.List.find(item => item.sId == sId);
        },
        ///获取店铺购物车清单总额
        getShoppingCarAmountBysId: state => (sId) => {
          var sum = 0
          var shoppingCar = state.List.find(item => item.sId == sId);
          if (shoppingCar && shoppingCar.goods.length > 0)
            shoppingCar.goods.forEach(element => {
              sum += element.Price* element.Number;
            });
          return sum;
        },
        ///获取店铺购物车清单商品总数量
        getShoppingCarCountBysId: state => (sId) => {
          var count = 0;
          var shoppingCar = state.List.find(item => item.sId == sId);
          if (shoppingCar && shoppingCar.goods.length > 0)
            shoppingCar.goods.forEach(element => {
              count += element.Number;
            });
          return count;
        },
        ///获取店铺购物车清单中某个商品数量
        getShoppingCarNumberByItemId: state => (sId,ItemId) => {
          var count = 0;
          var shoppingCar = state.List.find(item => item.sId == sId);
          if (shoppingCar && shoppingCar.goods.length > 0)
          {
            var goodItem = shoppingCar.goods.find(element => {
              return element.ItemId==ItemId;
            });
            return goodItem?goodItem.Number:0;
          }
          return count;
        }
      },
      mutations: {
        ShoppingCarPush(state, good) {//购买店铺商品放入购物车
          var shoppingcar = state.List.filter(item => item.sId == good.sId)[0];//先查找该店铺的购物车
          if (shoppingcar)//有购物
          {
            //查找购物清单是否有该商品
            var nowItem = shoppingcar.goods.find(item => item.ItemId == good.ItemId);
            if (nowItem) {
              //有商品替更新数量等信息
              var index = shoppingcar.goods.indexOf(nowItem);
              if (good.Number == 0)
                shoppingcar.goods.splice(index, 1);//数量0移除该商品
              else
                shoppingcar.goods.splice(index, 1, good);//更新
            } else {
              if (good.Number > 0)
                //无商品直接放入店铺购物车
                shoppingcar.goods.push(good);
            }
            var index = state.List.indexOf(shoppingcar);
            state.List.splice(index, 1, shoppingcar);//更新店铺购物车
          } else//没有购物
          {
            if (good.Number > 0)
              //push一个店铺购物车,并且放入商品
              state.List.push({ sId: good.sId,sName:good.sName, goods: [good] });
          }
        },
        ShoppingCarEmpty(state,good){//清空某店铺购物车清单
          var shoppingcar = state.List.filter(item => item.sId == good.sId)[0];//先查找该店铺的购物车
          if(shoppingcar)
          {
            var index = state.List.indexOf(shoppingcar);
            state.List.splice(index, 1);//清除该店铺购物清单
          }
        },
        SelectLogistics(state,payload){
          var shoppingcar = state.List.filter(item => item.sId == payload.sId)[0];//先查找该店铺的购物车
          if(shoppingcar)
          {
            shoppingcar.Logistics=payload.Logistics;
            var index = state.List.indexOf(shoppingcar);
            state.List.splice(index, 1,shoppingcar);//修改该店铺购物订单的物流配送方式
          }
        }
      }
    },
    UserAddress:{
      state:{
        UserAddressList:[],
      },
      getters:{
        UserAddressBysId: state => (Order_Address_Id) => {
          return state.UserAddressList.find(item => item.Order_Address_Id == Order_Address_Id);
        }
      },
      mutations:{
        GetUserAddressList(state,payload){
          state.UserAddressList=payload;
        },
        AddUserAddress(state,UserAddress){
          state.UserAddressList.push(UserAddress);
        },
        DeleteUserAddress(state,id){
          var finditem = state.UserAddressList.filter(item => item.Order_Address_Id == id)[0];//先查找项
          if(finditem)
          {
            var index = state.UserAddressList.indexOf(finditem);
            state.UserAddressList.splice(index, 1);//清除该项
          }
        },
        EditUserAddress(state,item){
          var finditem = state.UserAddressList.filter(item => item.Order_Address_Id == item.Order_Address_Id)[0];//先查找项
          if(finditem)
          {
            var index = state.UserAddressList.indexOf(finditem);
            state.UserAddressList.splice(index, 1,item);//更换该项
          }
        },
        SetDefault(state,item){
          state.UserAddressList.forEach((i,index)=>{
              if(i.IsDefault)
              i.IsDefault=false;
          });

          var finditem = state.UserAddressList.filter(i => i.Order_Address_Id == item.Order_Address_Id)[0];//先查找项
          if(finditem)
          {
            finditem.IsDefault=true;
            var index = state.UserAddressList.indexOf(finditem);
            state.UserAddressList.splice(index, 1,item);//更换该项
          }
        }
      },
      actions: {
        async GetUserAddressList (context) {
          var rep = await ShoppingAPI.OrderAddress_Get();
          if(rep.ret==0)
            context.commit('GetUserAddressList',rep.data);
        }
      }
    },
    Global:{
      state:{
        Config:{
          showBuy:true,
          //jssdk 调用config是否成功
        },
        Area:[],
        SensitiveWords:"",
        // wx_jssdk_config:{
        //   Enable:false,
        // },
      },
      getters:{
        getAreaCodeInfoById(state){
          return function(areaId){
            var _area= state.Area.find(item=>item.KeywordId==areaId);
            if(_area)
            {
              return _area.code
            }else
            {
              return 0;
            }
          }
        },
      },
      mutations:{
        setConfig(state,Config){
          state.Config=Config;
        },
        setSensitiveWords(state,data){
          state.SensitiveWords=data;
        },
        setArea(state,data){
          state.Area=data;
        }
        // wx_jssdk_config_result(state,result){
        //   state.wx_jssdk_config.Enable=result;
        // }
      },
      actions:{
        async GetConfig (context) {
          var rep = await WeixinOpenAPI.WXMP_Config();
          if(rep.ret==0)
            context.commit('setConfig',rep.data);
        },
        async GetSensitiveWords (context) {
          var rep = await UJAPI.SensitiveWords_GetWords();
          if(rep.ret==0)
            context.commit('setSensitiveWords',rep.data);
        },
        async chcekSensitiveWords(context,str){
          var words =[];
          var result;
          
          if(!context.state.SensitiveWords)
          {
            await context.dispatch('GetSensitiveWords')
          }
            var patt1 = new RegExp(context.state.SensitiveWords,"gi");
            while ((result = patt1.exec(str)) != null)  {
              words.push(result[0]);
            }
            //todo Update SensitiveWords
            var obj = {
              "Url": "U建商城微信小程序",
              "UserId": context.rootState.User.UserInfo.UserId,
              "sensitiveWords": str,
              "originalText": `[${words.join("][")}]`,
            };
            if(words.length>0)
            {
              UJAPI.SensitiveWords_SaveData(obj);
              return words
            }else
            {
              return null;
            }
        },
        async getArea(context){
          if(context.state.Area.length<=0)
          {
            var rep = await UJAPI.GetKeyword({TypeId:4});
            if(rep.ret==0)
            {
              context.commit("setArea",rep.data);
            }
          }
        }
      }
    },
    SupplyDemand:{
      state:{
        selectProject:null,
        selectCorp:null,
        selectGoods:[],
        PointsPrice:0,
        showTip:true,
      },
      mutations:{
        setSelectProject(state,item){
          state.selectProject=item;
        },
        setSelectCorp(state,item){
          state.selectCorp=item;
        },
        addSelecGoods(state,goods)
        {
          state.selectGoods.push(goods)
        },
        clearSelecGoods(state){
          state.selectGoods=[];
        },
        deleteSelecGoods(state,goods)
        {
          var index = state.selectGoods.indexOf(goods)
          state.selectGoods.splice(index, 1);
        },
        setPointsPrice(state,Price){
          state.PointsPrice=Price;
        },
        setShowTip(state,isShow){
          state.showTip=isShow;
        }
      },
      actions:{
        setSelecGoods(context,goods){
          var nowItem = context.state.selectGoods.filter(item => item.gId == goods.gId)[0];//先查找该店铺的购物车
          if(nowItem)//已有则移除
          {
            context.commit('deleteSelecGoods',nowItem);
            return true;
          }else{
            if(context.state.selectGoods.length>=3)//功能限制只能选择3个商品
              return false
            else
            {
              context.commit('addSelecGoods',goods);
              return true;
            }
          }
        },
        getPointsPrice(_point){
          SupplyAndDemandAPI.HallMoney_GetPrice({point:_point}).then(rep=>{
            if(rep.ret==0)
            {
              context.commit('setPointsPrice',rep.data);
            }
          })
        }
      }
    }
  }, plugins: [//vuex持久化
    mpvue_Mode === 'WX' ? createPersistedState({
      storage: {
        getItem: key => wx.getStorageSync(key),
        setItem: (key, value) => wx.setStorageSync(key, value),
        removeItem: key => { }
      }
    }) : createPersistedState({
      // reducer(obj) {
      //   // 选择需要持久化存储的 vuex module
      //   const { User, ShoppingCar, UserAddress} = obj;
      //   return {User,ShoppingCar,UserAddress}
      // }
    })
  ]
})