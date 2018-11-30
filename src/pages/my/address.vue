<template>
  <div class="page">
    <ul class="address-list">
      <li v-for="(item,index) in UserAddress" :key="index" :class="{checked:item.IsDefault}">
        <div class="address-item underline">
          <span>{{item.Name}}</span>
          <span class="address-item-phone">{{item.Phone}}</span>
          <p>{{item.Address}}</p>
        </div>
        <div class="address-item">
          <span @click="setDefault(item)">
            <i class="icon checkbox">&#xe604;</i>设为默认地址
          </span>
          <span class="address-item-edit" @click="go({path:'/pages/my/addressadd',query:{id: item.Order_Address_Id}})">
            <i class="icon">&#xe64c;</i>编辑
          </span>
          <span class="address-item-edit" @click="deleteAddress(item.Order_Address_Id)">
            <i class="icon ">&#xe612;</i>删除
          </span>
        </div>
      </li>
    </ul>
    <div class="bottom">
      <a @click="go({path:'/pages/my/addressadd'})">新增收货地址</a>
    </div>
  </div>
</template>
<script>
import { mapActions,mapMutations } from 'vuex'
export default {
  data() {
    return {
      // UserAddress: []
    };
  },
  computed:{
    UserAddress(){
      return this.$store.state.UserAddress.UserAddressList;
    }
  },
  methods: {
    async deleteAddress(Order_Address_Id) {
      var that = this;
      this.modal("提示", "确定删除该收货地址?", () => {
        that.$ShoppingAPI.OrderAddress_Delete(Order_Address_Id).then(rep => {
          if (rep.ret == 0) {
             that.DeleteUserAddress(Order_Address_Id);
          }
        });
      });
    },
    async setDefault(item) {
      var that = this;
      this.modal("提示", "是否要更换默认收货地址?", () => {
        that.$ShoppingAPI.OrderAddress_SetDefault(item.Order_Address_Id).then(rep => {
          if (rep.ret == 0) {
             that.SetDefault(item);
          }
        });
      });
    },
    ...mapMutations([
      'DeleteUserAddress', //`this.$store.commit('DeleteUserAddress')`
      'SetDefault',
    ]),
    ...mapActions(['GetUserAddressList'])//`this.$store.dispatch('GetUserAddressList')`
  },
  mounted(){
    this.GetUserAddressList();
  }
};
</script>
<style lang="less" scoped >
.body {
  background: #ecf0f1;
}
.page {
  padding-bottom: 60px;
}
.address-list {
  width: 100%;
  background-color: #ecf0f1;
  li {
    padding: 0 8px;
    margin: 8px 0;
    position: relative;
    background: #fff;
  }
  li.checked {
    .checkbox {
      color: #12b7f5;
    }
  }
}
.underline {
  border-bottom: 1px solid #ecf0f1;
}
.address-item {
  padding: 0.41rem 0;
  font-size: 0.42rem;

  span {
    display: inline-block;
    margin-left: 0.45rem;
  }
  p {
    margin-left: 0.45rem;
    margin-top: 0.42rem;
  }
  i {
    margin-right: 0.31rem;
    display: inline-block;
  }
  .address-item-edit {
    float: right;
  }
  .address-item-phone {
    font-size: 0.36rem;
    color: #a2a2a2;
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
