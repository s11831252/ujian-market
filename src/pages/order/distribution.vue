<template>
  <div>
    <div class="top-one">
      <span v-if="LogisticsMode&&LogisticsMode.length>0" :class="[LogisticsId==1||LogisticsId==2?'pitchOn':'']" @click="checktab(LogisticsMode[0].LogisticsId)">{{LogisticsMode[0].Name}}</span>
      <span v-if="LogisticsMode&&LogisticsMode.length>1" :class="{pitchOn:LogisticsId==0}" @click="checktab(LogisticsMode[1].LogisticsId)">{{LogisticsMode[1].Name}}</span>
    </div>
    <div v-show="LogisticsId==1||LogisticsId==2">
      <div class="top-two">
        <div class="content"  @click="checktab(2)">
          <!-- 选中 -->
          <img class="imgBr" v-if="LogisticsId==2" src="/static/img/check.png" alt>
          <!-- 未选中 -->
          <div class="tuoyuan" v-else></div>
          <!-- 尊享图 -->
          <img class="imgNr" :src="DistributionMode2.length>0?DistributionMode2[0].DistributionModeText:''" alt>
        </div>
        <div class="contentNr" v-if="LogisticsId==2">
          <img :src="DistributionMode2.length>1?DistributionMode2[1].DistributionModeText:''" alt>
          <div class="xinxibox">
            <div class="xinxi">
              <span class="spanBr">姓&#12288;&#12288;名:</span>
              <input v-model="contact.Name" type="text" placeholder="输入姓名">
              <span class="zhuyi">*</span>
            </div>
            <div class="xinxi">
              <span class="spanBr">联系电话:</span>
              <input v-model="contact.Phone" type="text" placeholder="输入手机号码">
              <span class="zhuyi">*</span>
            </div>
            <div class="xinxi">
              <span class="spanBr">收货地址:</span>
              <input v-model="contact.Address" type="text" placeholder="输入收货地址">
              <span class="zhuyi">*</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 计费配送 -->
      <div class="top-three">
        <div class="charging" @click="checktab(1)">
          <!--选中  -->
          <img class="bb" v-if="LogisticsId==1" src="/static/img/check.png" alt>
          <!-- 椭圆未选中 -->
          <div class="aa" v-else></div>
          <span>计费配送</span>
        </div>
        <div v-show="LogisticsId==1">
          <div class="car">
            <div class="carNr">
              <span>配送车辆</span>
              <my-drop :options="DistributionModeMap" :onSelected="DistributionSelected"></my-drop>
            </div>
            <p>※工程U派推荐使用“面包车”配送该商品</p>
          </div>
          <!-- 详细计费 -->
          <div class="money">
            <!-- 展开与隐藏 -->
            <div class="vvv icon" v-if="show" @click="Show">&#xe614;</div>
            <div class="vvv icon" v-else @click="Show">&#xe712;</div>
            <div class="moneyBox">
              <div class="moneyBox-one">
                <span class="qibuNr">起步价</span>
                <span class="shuzhi">￥{{DistributionModeSelected_Starting_Price}}/{{DistributionModeSelected.Starting_Road}}km</span>
              </div>
              <div class="moneyBox-one">
                <span class="qibuNr">超里程</span>
                <span class="shuzhi">￥{{DistributionModeSelected_Per_Kilometre}}/km</span>
              </div>
              <div v-show="show">
                <div class="hiddenBox">
                  <div class="moneyBox-one">
                    <span class="qibuNr">载重</span>
                    <span class="shuzhi">{{DistributionModeSelected.Load}}kg</span>
                  </div>
                  <div class="moneyBox-one">
                    <span class="qibuNr">长宽高</span>
                    <span class="shuzhi">{{DistributionModeSelected.Body_Length}}m x {{DistributionModeSelected.Body_Width}}m x {{DistributionModeSelected.Body_Height}}m</span>
                  </div>
                  <div class="moneyBox-one">
                    <span class="qibuNr">载货体积</span>
                    <span class="shuzhi">{{DistributionModeSelected.Body_Volume}}㎡</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 新建地址 -->
          <div class="newSite">
            <span>收货地址</span>
            <div class="site" @click="go({path:'/pages/my/address'})">+新建地址</div>
          </div>
          <div class="siteDetails" v-if="OrderAddress!=null">
            <div class="icon tubiao">&#xe64d;</div>
            <div class="details">
              <span class="name">{{OrderAddress.Name}}</span>
              <span class="tel">{{OrderAddress.Phone}}</span>
              <div class="xaingqing">
                <span>{{OrderAddress.Address}}<div v-if="OrderAddress.IsDefault" >默认</div></span>
                
              </div>
            </div>
            <div class="makeSite" @click="BeforeSite">使用以往地址</div>
          </div>
          <!-- 遮罩层 -->
          <div class="popContainer" v-show="beforeSite"></div>
          <!-- 点击以往地址 -->
          <div class="address-select" v-show="beforeSite" @click.stop="openaddress">
            <div class="shouhuo">
              收货地址
              <div class="icon tuichu" @click.stop="BeforeSite">&#xe613;</div>
              <!-- 二个三角形 -->
              <div class="t3"></div>
              <div class="t4"></div>
            </div>
            <ul class="address-list" @click.stop>
              <li class="itemNr" v-for="(item,index) in UserAddress" :key="index">
                <div class="xuanzhe" :class="{xuanzhong:item.Order_Address_Id==Order_Address_Id}" @click="addressChecked(item)">
                  <!-- 未选中 -->
                  <!-- <div class="weixuanzhong"></div> -->
                  <!-- 选中 -->
                  <div class="icon">&#xe604;</div>
                </div>
                <div class="address-item">
                  <span>
                    <i class="icon tt" style="float:left">&#xe615;</i>
                    {{item.Name}}&#12288;
                  </span>
                  <span>{{item.Phone}}</span>
                </div>
                <div class="address-item">
                  <i class="icon tt">&#xe627;</i>
                  {{item.Address}}
                </div>
              </li>
            </ul>
          </div>
          <!-- 结算 -->
          <div class="payment" v-if="Freight">
            <ul class="hang">
              <li>
                <span class="left">送货距离：</span>
                <span class="right">{{Freight.distance.text}}km</span>
              </li>
            </ul>
            <ul class="hang">
              <li>
                <span class="left">当前运费：</span>
                <span class="right">¥{{Freight.Freight}}</span>
              </li>
            </ul>
            <!-- <ul class="hang">
              <li style="display:none">
                <span class="left">配送优惠：</span>
                <div style="float:right">
                  <div class="icon rightNr">&#xe617; 30元优惠券</div>
                  <b class="icon b">&#xe601;</b>
                </div>
              </li>
            </ul> -->
            <ul class="hang">
              <li>
                <span class="left">实际支付：</span>
                <span class="right-r">¥{{Freight.Freight}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 自行取货 -->
    <div class="xinxiboxBr" v-show="LogisticsId==0">
      <div class="xinxi">
        <span class="spanBr">姓&#12288;&#12288;名:</span>
        <input type="text" v-model="contact2.Name" placeholder="输入姓名">
        <span class="zhuyi">*</span>
      </div>
      <div class="xinxi">
        <span class="spanBr">联系电话:</span>
        <input type="text" v-model="contact2.Phone" placeholder="输入手机号码">
        <span class="zhuyi">*</span>
      </div>
      <div class="xinxiBr">选择自取方式后，请您在付款后与店主协商自行取货，并出示订单详情页内的取货二维码或短信接收到的取货验证码，以便确认收货</div>
    </div>
    <!-- 确定 -->
    <button class="queding" @click="confirm">确定</button>
  </div>
</template>
<script>
import myDrop from "@/components/myDrop";
import { mapState,mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      sId: "",
      LogisticsMode: [],
      DistributionId: 0,
      LogisticsId: 2,
      DistributionMode: [],
      DistributionMode2:[],
      Order_Address_Id: "",
      activeIndex: 0,
      shopDetail: {},
      openAddress: false,
      Freight: null,
      show: false,
      beforeSite: false,
      // 联系人信息
      contact: {
        Order_Address_Id: "",
        Phone: "",
        Name: "",
        Address: "",
        Latitude: 0,
        Longitude: 0,
        IsDefault: false
      },
      contact2:{
        Order_Address_Id: "",
        Phone: "",
        Name: "",
        Address: "自提无视",
        Latitude: 0,
        Longitude: 0,
        IsDefault: false
      }
    };
  },
  methods: {
    ...mapMutations(["SelectLogistics"]),
    ...mapActions(["GetUserAddressList"]),
    // 头部切换
    async checktab(index) {
      this.LogisticsId = index;
      if (this.LogisticsId != 1) {
        // this.DistributionId = 0;
      } else {
        if(this.DistributionMode==null||this.DistributionMode.length==0)
        {
          var rep = await this.$ShoppingAPI.GetDistributionMode({
            LogisticsId:this.LogisticsId 
          });
          if (rep.ret == 0) {
            this.DistributionMode = rep.data;
          }
        }
      }
    },
    Show() {
      this.show = !this.show;
    },
    // 显示以往地址
    BeforeSite() {
      this.beforeSite = !this.beforeSite;
    },
    //确认按钮事件
    async confirm() {
        var _l = this.LogisticsMode.find(
          item => item.LogisticsId == this.LogisticsId
        );
        
        if (this.LogisticsId == 0) {
          //每次提交保存地址
          this.contact2.Address="自提无视";//Address必填...写入占位符不然会报错
          this.contact2.Latitude = this.CurrentLocation.latitude;
          this.contact2.Longitude = this.CurrentLocation.longitude;
          var rep = await this.$ShoppingAPI.OrderAddress_Add(this.contact2,this.LogisticsId);
          if(rep.ret!=0)
          {
            //请求失败
          }else{
            //请求成功把返回的data作为Order_Address_Id值保存
            this.SelectLogistics({
                sId: this.sId,
                Logistics: {
                  LogisticsId: _l.LogisticsId,
                  Order_Address_Id: rep.data,
                  Name: _l.Name,
                  DistributionMode: {
                    DistributionModeId: 0
                  },
                }
              });
          }
        }else if(this.LogisticsId == 2)
        {
          this.contact.Latitude = this.CurrentLocation.latitude;
          this.contact.Longitude = this.CurrentLocation.longitude;
          //每次提交保存地址
          var rep = await this.$ShoppingAPI.OrderAddress_Add(this.contact,this.LogisticsId);
          if(rep.ret!=0)
          {
            //请求失败
          }else{
            //请求成功把返回的data作为Order_Address_Id值保存
            this.SelectLogistics({
                sId: this.sId,
                Logistics: {
                  LogisticsId: _l.LogisticsId,
                  Order_Address_Id: rep.data,
                  Name: _l.Name,
                  DistributionMode: {
                    DistributionModeId: 0
                  },
                }
              });
          }
        }else if(this.LogisticsId == 1)
        {
          this.SelectLogistics({
              sId: this.sId,
              Logistics: {
                LogisticsId: _l.LogisticsId,
                Order_Address_Id: this.Order_Address_Id,
                Name: _l.Name,
                DistributionMode: {
                  DistributionModeId: this.DistributionModeSelected
                    .DistributionModeId,
                  DistributionModeText: this.DistributionModeSelected
                    .DistributionModeText
                },
                FreightInfo: this.Freight
              }
            });
        }

        this.$router.back();
    },
    // 地址
    tabClick(e) {
      if (e) this.activeIndex = e.currentTarget.id;
    },
    openaddress() {
      this.openAddress = !this.openAddress;
    },
    addressChecked(item) {
      this.Order_Address_Id = item.Order_Address_Id;
      this.openaddress();
      this.beforeSite = false;
    },
    DistributionSelected(selectitem) {
      if(this.DistributionId != selectitem.value)
      {
        this.DistributionId = selectitem.value;
        this.QueryFreight();
      }
    },
    async QueryFreight() {
      if (
        this.shopDetail &&
        this.shopDetail.Latitude &&
        this.shopDetail.Longitude &&
        this.OrderAddress &&
        this.OrderAddress.Latitude &&
        this.OrderAddress.Longitude
      ) {
        var rep = await this.$ShoppingAPI.QueryFreight({
          origin: [this.shopDetail.Latitude, this.shopDetail.Longitude],
          destinations: [
            this.OrderAddress.Latitude,
            this.OrderAddress.Longitude
          ],
          LogisticsMode: this.LogisticsId,
          DistributionModeId: this.DistributionId
        });
        if (rep.ret == 0) {
          this.Freight = rep.data;
        }
      }
    }
  },
  computed: {
    ...mapState({
      CurrentLocation: state => state.User.CurrentLocation
    }),
    DistributionModeSelected() {
      if (this.DistributionMode && this.DistributionMode.length > 0) {
        if (this.DistributionId == 0) return this.DistributionMode[0];
        return this.DistributionMode.find(
          item => item.DistributionModeId == this.DistributionId
        );
      } else
        return {
          DistributionModeId: 0,
          DistributionModeText: 0,
          Starting_Price: 0.0,
          Starting_Road: 0.0,
          Per_Kilometre: 0.0,
          Load: 0.0,
          Body_Length: 0.0,
          Body_Width: 0.0,
          Body_Height: 0.0,
          Body_Volume: 0.0
        };
    },
    DistributionModeSelected_Starting_Price() {
      return this.DistributionModeSelected.Starting_Price.toFixed(2);
    },
    DistributionModeSelected_Per_Kilometre() {
      return this.DistributionModeSelected.Per_Kilometre.toFixed(2);
    },
    OrderAddress() {
      if (this.UserAddress && this.UserAddress.length > 0) {
        if (this.Order_Address_Id && this.Order_Address_Id.length > 0)
          return this.UserAddress.find(
            item => item.Order_Address_Id == this.Order_Address_Id
          );
        else {
          this.Order_Address_Id = this.UserAddress[0].Order_Address_Id;
          return this.UserAddress[0];
        }
      } else {
        return {};
      }
    },
    UserAddress() {
      return this.$store.state.UserAddress.UserAddressList;
    },
    DistributionModeMap() {
      if (this.DistributionMode)
        return this.DistributionMode.map(item => {
          return {
            text: item.DistributionModeText,
            value: item.DistributionModeId
          };
        });
      else return [];
    }
  },
  components: {
    myDrop
  },
  async mounted() {
    if (this.$route.query && this.$route.query.sId.length > 0) {
      // 接收店铺id参数
      this.sId = this.$route.query.sId;

      // 物流参数接口
      var rep = await this.$ShoppingAPI.GetLogisticsMode({ sId: this.sId });
      this.LogisticsMode = rep.data;

      //物流模式数组大于2说明有尊享配送，默认选择
      if (this.LogisticsMode.length > 2) {
        //默认选中尊享配送
        this.checktab(2);

        //获取尊享配送的收货地址
        var rep = await this.$ShoppingAPI.OrderAddress_Get({ LogisticsId: 2 });
        if(rep.data&&rep.data.length>0)
          this.contact = rep.data[0];

        var rep = await this.$ShoppingAPI.GetDistributionMode({
            LogisticsId:2,
            sId:this.sId
          });
        if(rep.ret==0)
        {
          this.DistributionMode2=rep.data;
        }
      } else {
        //默认选中自行提取
        this.checktab(1);
      }

      //获取自行提取的联系方式
      var rep = await this.$ShoppingAPI.OrderAddress_Get({ LogisticsId: 0 });
        if(rep.data&&rep.data.length>0)
          this.contact2 = rep.data[0];

      //获取用户收货地址
       this.GetUserAddressList();

      //获取店铺详情,用于计算运费
      var rep3 = await this.$ShoppingAPI.Shop_GetDetails({
        sId: this.sId
      }); 
      if (rep3.ret == 0) {
        this.shopDetail = rep3.data;
      }
    }
  }
};
</script>
<style>
page {
  background-color: #f9f9f9;
  padding-bottom: 1rem;
}
.drop .drop-selected .drop-label ,.drop .drop-option{
  font-size: 0.36rem;
}
</style>
<style scoped>
.popContainer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9;
}
.top-one {
  width: 100%;
  height: 3rem;
  display: flex;
  background-color: #12b7f5;
  text-align: center;
}
.top-one span {
  flex: 1;
  color: #ffffff;
  font-size: 0.42rem;
  margin: 0.8rem 1.3rem 1.1rem;
  line-height: 1.2rem;
}
.pitchOn {
  font-size: 0.7rem !important;
  border-bottom: 0.1rem solid #ffffff;
}
.top-two {
  width: 10.2rem;
  background-color: #fff;
  border-radius: 0.2rem;
  margin: 0 0.3rem;
  margin-top: -0.9rem;
  z-index: 1;
}
.content {
  padding-top: 0.57rem;
  padding-bottom: 0.61rem;
  margin-left: 0.77rem;
  display: flex;
  align-items: center;
}
.imgBr {
  width: 0.4rem;
  height: 0.4rem;
}
.tuoyuan {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  border: 0.05rem solid #666666;
}
.imgNr {
  width: 8.55rem;
  height: 0.84rem;
  background-repeat: no-repeat;
  margin-left: 0.38rem;
}
.contentNr img {
  width: 100%;
  height: 3.8rem;
  background-repeat: no-repeat;
  margin-left: 0.25rem;
}
.contentNr p {
  margin-left: 0.75rem;
  font-size: 0.31rem;
  color: #666666;
  margin-top: 0.3rem;
  /* 让内容强制不换行 */
  white-space: nowrap;
}
.xinxibox {
  margin-top: 0.68rem;
  padding-bottom: 0.7rem;
}
/* 自行取货样式 */
.xinxiboxBr {
  margin: -0.9rem 0.3rem 0.7rem;
  background-color: #fff;
  border-radius: 0.2rem;
  overflow-x: hidden;
}
.xinxi {
  margin-left: 0.75rem;
  display: flex;
  align-items: center;
  margin-top: 0.6rem;
}
.xinxiBr {
  margin: 0.38rem 0.75rem;
  font-size: 0.31rem;
  color: #666666;
}
.spanBr {
  width: 2rem;
  font-size: 0.42rem;
  color: #535355;
  /* 让内容强制不换行 */
  white-space: nowrap;
}
.zhuyi {
  font-size: 0.24rem;
  color: #b51c1c;
  margin-left: 0.2rem;
}
.xinxi input {
  width: 3.5rem;
  border-radius: 0.1rem;
  border: solid 0.02rem #bfbfbf;
  padding: 0.28rem 0 0.28rem 0.38rem;
  font-size: 0.4rem;
}
.top-three {
  width: 10.2rem;
  background-color: #ffffff;
  border-radius: 0.2rem;
  margin: auto;
  margin-top: 0.5rem;
}
/* 计费配送样式 */
/* .top-three {
  position: absolute;
  top: 4.6rem !important;
} */
/* 椭圆未选中 */
.charging {
  width: 100%;
  height: 1.99rem;
  line-height: 1.99rem;
  display: flex;
  align-items: center;
}
.aa {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  border: 0.05rem solid #666666;
  margin-left: 0.77rem;
}
/* 选中 */
.bb {
  width: 0.4rem;
  height: 0.4rem;
  margin-left: 0.77rem;
}
.charging span {
  font-size: 0.48rem;
  color: #1a1a1a;
  margin-left: 0.25rem;
}
.car {
  margin-left: 0.32rem;
  margin-right: 0.32rem;
  border-top: 0.02rem solid #ecf0f1;
  border-bottom: 0.02rem solid #ecf0f1;
}
.carNr {
  display: flex;
  align-items: center;
  margin-top: 0.37rem;
  margin-left: 0.45rem;
}
.carNr span {
  font-size:0.4rem;
  margin-right: 2.69rem;
}
.car p {
  font-size: 0.3rem;
  color: #b55480;
  /* 让内容强制不换行 */
  white-space: nowrap;
  margin: 0.4rem auto;
  margin-left: 0.45rem;
}
.money {
  margin: 0.32rem;
  background-color: #f9f9f9 !important;
  position: relative;
}
.moneyBox {
  margin-left: 0.61rem;
  margin-right: 1.57rem;
  padding-top: 0.4rem;
}
.moneyBox-one {
  padding-bottom: 0.4rem;
  font-size: 0.32rem;
  color: #999999;
}
.shuzhi {
  display: flex;
  align-items: center;
  float: right;
}
.vvv {
  width: 0.7rem;
  height: 0.55rem;
  text-align: center;
  line-height: 0.55rem;
  font-size: 0.3rem;
  background-color: #bdbdbd;
  border-radius: 0.18rem;
  opacity: 0.3;
  position: absolute;
  top: 0rem;
  right: 0rem;
}
.newSite {
  margin: 0.24rem 0.32rem auto;
  display: flex;
  align-items: center;
  height: 1.49rem;
  border-top: 0.02rem solid #ecf0f1;
  border-bottom: 0.02rem solid #ecf0f1;
}
.newSite span {
  font-size: 0.4rem;
  color: #333333;
  margin-left: 0.27rem;
}
.site {
  font-size: 0.32rem;
  color: #12b7f5;
  padding: 0.1rem;
  border-radius: 0.05rem;
  border: solid 0.05rem #12b7f5;
  margin-left: 5.7rem;
}
/* .addSite {
  background-color:#f9f9f9;
  border-radius: 0.2rem;
  padding: 0.3rem
} */
.dingwei {
  color: #12b7f5;
  font-size: 0.4rem;
}
.Add {
  width: 2.4rem;
  height: 0.83rem;
  font-size: 0.36rem;
  line-height: 0.83rem;
  text-align: center;
  background-color: #12b7f5;
  border-radius: 0.16rem;
  color: #ffffff;
  margin-top: 0.5rem !important;
  margin: auto;
}
.siteDetails {
  margin: 0.4rem 0.32rem auto;
  overflow: hidden;
  border-bottom: 0.02rem solid #ecf0f1;
}
.tubiao {
  width: 0.76rem;
  height: 0.76rem;
  border-radius: 50%;
  background-color: #12b7f5;
  text-align: center;
  line-height: 0.76rem;
  color: #ffffff;
  font-size: 0.6rem;
  float: left;
  margin-top: 0.37rem;
  margin-left: 0.16rem;
}
.details {
  margin-left: 1.42rem;
  margin-right: 0.27rem;
}
.name {
  font-family: MicrosoftYaHei;
  font-size: 0.42rem;
  color: #323232;
}
.tel {
  font-family: MicrosoftYaHei;
  font-size: 0.36rem;
  color: #8c8c8c;
  margin-left: 0.3rem;
}
.xaingqing {
  letter-spacing: 0.03rem;
  font-size: 0.33rem;
  color: #333333;
  margin-top: 0.3rem;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.xaingqing span{
line-height: 0.49rem;
}
.xaingqing div {
  padding: 0.07rem 0.18rem;
  text-align: center;
  background-color: #e7e8e8;
  color: #8c8c8c;
  display: inline-block;
}
.makeSite {
  width: 2.3rem;
  height: 0.55rem;
  background-color: #f7fff5;
  border-radius: 0.05rem;
  border: solid 0.05rem #59d178;
  font-size: 0.32rem;
  line-height: 0.55rem;
  text-align: center;
  color: #59d178;
  float: right;
  margin-right: 0.27rem;
  margin-bottom: 0.44rem;
  margin-top: 0.24rem;
}
.address-select {
  font-size: 0.4rem;
  color: #333333;
  overflow: hidden;
  margin-left: 0.7rem;
  position: fixed;
  top: 5rem;
  z-index: 100;
}
.shouhuo {
  font-size: 0.4rem;
  color: #fffefe;
  width: 8.8rem;
  height: 1rem;
  background-color: #12b7f5;
  border-radius: 0.1rem 0.1rem 0rem 0rem;
  text-align: center;
  line-height: 1rem;
  position: relative;
}
.t3 {
  height: 0;
  width: 0;
  border-top: solid 0.4rem #12b7f5;
  border-right: solid 0.4rem rgba(0, 0, 0, 0);
  position: absolute;
  right: 0rem;
  bottom: -0.37rem;
}
.t4 {
  margin: 0;
  height: 0;
  width: 0px;
  border-top: solid 0.4rem #12b7f5;
  border-left: solid 0.4rem rgba(0, 0, 0, 0);
  position: absolute;
  left: 0rem;
  bottom: -0.37rem;
}
.tuichu {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  border: 0.05rem solid #fff;
  line-height: 0.6rem;
  color: #fff;
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
}
.address-list {
  height: 5rem;
  width: 8.1rem;
  background-color: #fff;
  margin-left: 0.35rem;
  margin-bottom: 0.4rem;
  overflow: auto;
}
.itemNr {
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  margin-left: 0.8rem;
  margin-right: 0.8rem;
  border-bottom: 0.02rem solid #ecf0f1;
}
.xuanzhe {
  float: left;
  height: 100%;
  padding-top: 10%;
}
.weixuanzhong {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  border: solid 0.02rem #b4b4b4;
  display: none;
}
.xuanzhong {
  color: #12b7f5;
}
.address-item {
  display: flex;
  align-items: center;
  padding-left: 0.6rem;
  margin-top: 0.2rem;
}
.tt {
  margin-right: 0.2rem;
}
.payment {
  overflow: hidden;
  margin: 0.71rem 0.59rem 0.7rem;
}
.hang {
  padding-bottom: 0.9rem;
  overflow: hidden;
}
.left {
  font-size: 0.32rem;
  color: #333333;
}
.right {
  font-size: 0.32rem;
  color: #999999;
  float: right;
}
.rightNr {
  padding: 0.2rem;
  font-size: 0.3rem;
  color: #ffffff;
  background-image: linear-gradient(270deg, #fe3c16 0%, #fe7316 100%);
  border-radius: 0.05rem;
  float: left;
}
.b {
  font-size: 0.6rem;
  color: #999999;
  float: right;
}
.right-r {
  font-size: 0.43rem;
  color: #333333;
  float: right;
}
.queding {
  position: relative;
  display: block;
  width: 5rem;
  height: 1rem;
  font-size: 0.5rem;
  text-align: center;
  line-height: 1rem;
  background-color: #12b7f5;
  color:#fff;
  border:none;
  border-radius: 0.2rem;
  margin: 1rem auto;
}
</style>