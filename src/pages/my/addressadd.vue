<template>
  <form>
    <div class="form-group">
      <label>联系人:</label>
      <input type="text" v-model="AddressInfo.Name" placeholder="请填写联系人姓名">
    </div>
    <div class="form-group">
      <label>联系电话:</label>
      <input type="text" v-model="AddressInfo.Phone" maxlength="11" minlength="11" placeholder="请填写联系人手机号码">
    </div>
    <div class="form-group" @click="chooseLocation">
      <label>联系地址:</label>
      <p>
        <i class="icon">&#xe627;</i>
        {{Area}}
      </p>
      <i class="icon right">&#xe601;</i>
    </div>
    <div class="form-group">
      <label>详细地址:</label>
      <input type="text" v-model="AddressInfo.Address" placeholder="如:街道、小区、单元楼、门牌号等">
    </div>
    <div class="bottom">
      <a v-if="!AddressInfo.Order_Address_Id" @click="Add">确定添加</a>
      <a v-else @click="Edit">修改</a>
    </div>
  </form>
</template>
<script>
import { mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
    //   AddressInfo: {
    //     Order_Address_Id: "",
    //     Phone: "",
    //     Name: "",
    //     Address: "",
    //     Latitude: 0,
    //     Longitude: 0
    //   },
      id:null,
      Area: "点击选择位置"
    };
  },
  computed: {
    AddressInfo() {
      if (this.id)
        return this.$store.getters.UserAddressBysId(this.$route.query.id);
      else
        return {
          Order_Address_Id: "",
          Phone: "",
          Name: "",
          Address: "",
          Latitude: 0,
          Longitude: 0
        };
    }
  },
  methods: {
    chooseLocation() {
      var that = this;
      wx.chooseLocation({
        success(res) {
          that.AddressInfo.Latitude = res.latitude;
          that.AddressInfo.Longitude = res.longitude;
          that.Area = res.address;
        }
      });
    },
    async Edit() {
      if (!this.AddressInfo.Latitude || !this.AddressInfo.Latitude) {
        this.toast("请选择位置");
        return;
      }
      if (
        !this.AddressInfo.Phone ||
        !this.AddressInfo.Name ||
        !this.AddressInfo.Address
      ) {
        this.toast("请填写完整信息");
        return;
      }
      // console.log(this.AddressInfo);
      // debugger;
      this.AddressInfo.Address = (this.Area=='点击选择位置'?'':this.Area) + this.AddressInfo.Address;
      var rep = await this.$ShoppingAPI.OrderAddress_Edit(this.AddressInfo);
      if (rep.ret == 0) {
        // this.EditUserAddress(this.AddressInfo);
        this.$router.back();
      }
    },
    async Add() {
      if (!this.AddressInfo.Latitude || !this.AddressInfo.Latitude) {
        this.toast("请选择位置");
        return;
      }
      if (
        !this.AddressInfo.Phone ||
        !this.AddressInfo.Name ||
        !this.AddressInfo.Address
      ) {
        this.toast("请填写完整信息");
        return;
      }
      this.AddressInfo.Address = this.Area + this.AddressInfo.Address;
      var rep = await this.$ShoppingAPI.OrderAddress_Add({
        Phone: this.AddressInfo.Phone,
        Name: this.AddressInfo.Name,
        Address: this.AddressInfo.Address,
        Latitude: this.AddressInfo.Latitude,
        Longitude: this.AddressInfo.Longitude
      });
      if (rep.ret == 0) {
        this.AddressInfo.Order_Address_Id = rep.data;
        this.AddUserAddress(this.AddressInfo);
        this.$router.back();
      }
    },
    ...mapMutations([
      "AddUserAddress" //`this.$store.commit('AddUserAddress')`
    ])
  },mounted(){
    if(this.$route.query&& this.$route.query.id)
    {
      this.id=this.$route.query.id;
    }
  }
};
</script>
<style lang="less" scoped>
.form-group {
  border-bottom: 1px solid #ecf0f1;
  margin: 0 0.41rem;
  padding: 0.51rem 0;
  line-height: 0.42rem;
  label,
  input,
  p {
    font-size: 0.42rem;
    line-height: 0.42rem;
    vertical-align: middle;
    margin-right: 0 0.41rem;
    display: inline-block;
    width: 60%;
  }
  label {
    color: #5c5c5c;
    width: 1.92rem;
  }
  i {
    display: inline-block;
  }
  input {
    color: #a2a2a2;
    width: 70%;
  }
}
.bottom {
  position: fixed;
  bottom: 0;
  text-align: center;
  width: 100%;
  padding-bottom: 10px;
  a {
    border-radius: 15px;
    padding: 8px;
    display: inline-block;
    width: 80%;
    background-color: #12b7f5;
    border: 0;
    color: #fff;
    font-size: 0.5rem;
  }
}
</style>

