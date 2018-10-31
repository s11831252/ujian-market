<template>
    <div>
        <div class="my-head">
            <div class="my-head-tool"><i class="icon"></i><i class="icon"></i></div>
            <img :src="UserInfo.Portrait">
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
        'UserInfo':state=>state.User.UserInfo
    })
  },
  components: {},
  mounted(){
     console.log(this.UserInfo);
  }
};
</script>
<style lang="less" scoped>
.my-head{
    margin: 0 auto;
    padding: 0 auto;
    text-align: center;
    .my-head-tool{
        i{
            display: inline-block;
            float: right;
        }
    }
    img{
        width:80px;
        height: 80px;
        border-radius: 50%;
    }
}
</style>
