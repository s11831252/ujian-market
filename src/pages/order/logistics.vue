<template>
    <div class="logistics">
        <div class="logistics-logo">
            <img src="/static/img/Login_UPai_Icon@3x.png" mode="widthFix">
            <p>“工程U派” 为您服务</p>
        </div>
        <div class="distribution-param">
            <div class="param-item distribution-model">配送方式：
                <my-drop :options="LogisticsModeMap" :onSelected="LogisticsSelected"></my-drop>
                <my-drop v-if="LogisticsId>0" :options="DistributionModeMap" :onSelected="DistributionSelected"></my-drop>
            </div>
            <div class="param-item ">
                <span class="starting-price">起步价：￥{{DistributionModeSelected_Starting_Price}}/{{DistributionModeSelected.Starting_Road}}km</span>
                <span class="per-kilometre right undertone">超里程：￥{{DistributionModeSelected_Per_Kilometre}}/km</span>
            </div>
            <div class="param-item ">
                <span class="load">
                    <p class="param-item-value">{{DistributionModeSelected.Load}}</p>
                    <p class="param-item-text undertone">载重</p>
                </span>
                <span class="body-length-width-height">
                    <p class="param-item-value">{{DistributionModeSelected.Body_Length}}m x {{DistributionModeSelected.Body_Width}}m x {{DistributionModeSelected.Body_Height}}m</p>
                    <p class="param-item-text undertone">长宽高</p>
                </span>
                <span class="body-volume">
                    <p class="param-item-value">{{DistributionModeSelected.Body_Volume}}㎡</p>
                    <p class="param-item-text undertone">载货体积</p>
                </span>
            </div>
            <div v-if="Freight" class="param-item">距离：
                <span class="undertone right">{{Freight.distance.text}}</span>
            </div>
            <div v-if="Freight" class="param-item">预计运费：
                <span class="highlight right">￥{{Freight.Freight}}</span>
            </div>
        </div>
        <div class="address" v-if="OrderAddress">
            <p class="address-title">收货地址</p>
            <ul class="navbar">
                <li :id='0' :class="{action:activeIndex==0}" @click="tabClick">
                    <div class="navbar_title">
                        <i class="icon">&#xe604;</i>原有地址</div>
                </li>
                <li :id='1' :class="{action:activeIndex==1}" @click="tabClick">
                    <div class="navbar_title">
                        <i class="icon">&#xe604;</i>新建地址</div>
                </li>
            </ul>
            <div :hidden="activeIndex != 0" :class="{'modal-open':openAddress}">
                <div class="address-item">
                    <span>
                        <i class="icon icon-order-user">&#xe615;</i>收货人：{{OrderAddress.Name}}</span>
                    <span class="right">
                        <i class="icon icon-order-phone">&#xe608;</i>{{OrderAddress.Phone}}</span>
                </div>
                <div class="address-item">
                    <i class="icon">&#xe627;</i>收货地址：{{OrderAddress.Address}}</div>
                <div class="address-item address-other undertone" @click="openaddress">其他地址
                    <i class="icon right">&#xe601;</i>
                </div>
                <div class="address-select" @click.stop="openaddress">
                    <ul class="address-list" @click.stop>
                        <li v-for="(item,index) in UserAddress" :key="index" :class="{checked:item.Order_Address_Id==Order_Address_Id}" @click="addressChecked(item)">
                            <div class="address-item">
                                <span>
                                    <i class="icon icon-order-user">&#xe615;</i>收货人：{{item.Name}}</span>
                                <span>
                                    <i class="icon icon-order-phone">&#xe608;</i>{{item.Phone}}</span>
                            </div>
                            <div class="address-item">
                                <i class="icon icon-order-address">&#xe627;</i>收货地址：{{item.Address}}
                                <div class="icon checkbox">&#xe606;</div>
                            </div>

                        </li>
                    </ul>
                </div>
            </div>
            <div :hidden="activeIndex != 1">

            </div>
        </div>
        <div class="logistics-confirm">
            <button @click="confirm" class="btn-ok">确&nbsp;&nbsp;&nbsp;&nbsp;定</button>
        </div>
    </div>
</template>
<script>
import myDrop from "@/components/myDrop";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      sId: "",
      LogisticsMode: [],
      DistributionMode: [],
      UserAddress: [],
      Order_Address_Id: "",
      LogisticsId: 0,
      DistributionId: 0,
      activeIndex: 0,
      openAddress: false,
      shopDetail: {},
      Freight: null
    };
  },
  methods: {
    ...mapMutations(["SelectLogistics"]),
    confirm() {
      if (this.Freight) {
        var _l = this.LogisticsMode.find(
          item => item.LogisticsId == this.LogisticsId
        );
        this.SelectLogistics({
          sId: this.sId,
          Logistics: {
            LogisticsId: _l.LogisticsId,
            Order_Address_Id:this.Order_Address_Id,
            Name: _l.Name,
            DistributionMode: {
              DistributionModeId: this.DistributionModeSelected.DistributionModeId,
              DistributionModeText: this.DistributionModeSelected.DistributionModeText
            },
            FreightInfo: this.Freight
          }
        });
        this.$router.back();
      }
    },
    tabClick(e) {
      if (e) this.activeIndex = e.currentTarget.id;
    },
    openaddress() {
      this.openAddress = !this.openAddress;
    },
    addressChecked(item) {
      this.Order_Address_Id = item.Order_Address_Id;
      this.openaddress();
    },
    async LogisticsSelected(selectitem) {
      this.LogisticsId = selectitem.value;
      if (this.LogisticsId == 0) {
        this.DistributionMode = 0;
        this.QueryFreight();
      } else {
        var rep = await this.$ShoppingAPI.GetDistributionMode({
          LogisticsId: selectitem.value
        });
        if (rep.ret == 0) {
          this.DistributionMode = rep.data;
        }
      }
    },
    DistributionSelected(selectitem) {
      this.DistributionId = selectitem.value;
      this.QueryFreight();
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
      }
    },
    LogisticsModeMap() {
      if (this.LogisticsMode)
        return this.LogisticsMode.map(item => {
          return { text: item.Name, value: item.LogisticsId };
        });
      else return [];
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
  async mounted() {
    if (this.$route.query && this.$route.query.sId.length > 0) {
      this.sId = this.$route.query.sId;
      var rep = await this.$ShoppingAPI.GetLogisticsMode();
      this.LogisticsMode = rep.data;
      var rep2 = await this.$ShoppingAPI.OrderAddress_Get();
      this.UserAddress = rep2.data;
      var rep3 = await this.$ShoppingAPI.Shop_GetDetails({
        sId: this.sId
      }); //获取店铺详情
      if (rep3.ret == 0) {
        this.shopDetail = rep3.data;
      }
    }
  },
  components: {
    myDrop
  }
};
</script>
<style lang="less" scoped>
@undertone: #9b9b9b;
@highlight: #ff5252;
.logistics {
  font-size: 14px;
  background: #ecf0f1;
  & > div {
    background-color: #fff;
  }
}
.undertone {
  color: @undertone;
}
.highlight {
  color: @highlight;
}
.logistics-logo {
  text-align: center;
  font-size: 15px;
  color: #f0b91f;
  padding: 10px 10px 0px 10px;
  border-bottom: 1px solid #ecf0f1;
  img {
    width: 146px;
  }
  p {
    margin: 10px 0;
  }
}
.distribution-param {
  padding: 10px 10px 0 10px;
  color: #5c5c5c;
  .param-item {
    border-bottom: 1px solid #ecf0f1;
    padding: 10px 0;
    .load,
    .body-volume {
      width: 25%;
      display: inline-block;
      vertical-align: top;
      text-align: center;
    }
    .body-length-width-height {
      width: 45%;
      display: inline-block;
      vertical-align: top;
      text-align: center;
      border-left: 1px solid #616161;
      border-right: 1px solid #616161;
    }
    .param-item-value {
      margin-bottom: 5px;
    }
  }
}
.address {
  color: #5c5c5c;
  margin-top: 10px;
  padding: 10px;
  .address-title {
    border-bottom: 1px solid #ecf0f1;
    padding-bottom: 5px;
  }
  .address-item {
    padding: 5px 0;
    span {
      display: inline-block;
    }

    i {
      font-size: 19px;
      display: inline-block;
      vertical-align: top;
      color: #12b7f5;
    }
  }
  .address-other {
    padding-top: 5px;
    border-top: 1px solid #ecf0f1;
    i {
      font-size: 28px;
      font-weight: bold;
      color: #616161;
    }
  }
}
.logistics-confirm {
  text-align: center;
  .btn-ok {
    line-height: initial;
    background-color: #12b7f5;
    font-size: 16px;
    font-weight: bold;
    padding: 4px 16px;
    border: 0;
    color: #ffffff;
    border-radius: 5px;
    display: inline-block;
  }
}

.address-select {
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  z-index: 1050;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  outline: 0;
  display: none;
  overflow: hidden;
  .address-list {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    li {
      padding: 8px;
      position: relative;
      .checkbox {
        display: inline-block;
        right: 10%;
        position: absolute;
        font-size: 20px;
      }
    }
    li.checked {
      .checkbox {
        color: #12b7f5;
      }
    }
  }
  .address-item {
    padding: 0;
  }
}
.modal-open .address-select {
  display: block;
  overflow-x: hidden;
  overflow-y: auto;
}
.navbar {
  li {
    display: inline-block;
    padding: 0 10px;
    i {
      margin-right: 10px;
      color: #b4b4b4;
      display: inline-block;
    }
  }
  li.action {
    i {
      color: #12b7f5;
    }
  }
}
</style>
