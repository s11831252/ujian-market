<template>
    <div class="search">
        <div class="top">
            <div class="sousuo">
                <i  class="icon ss" alt="" >&#xe6e3;</i>
                <input class="shuru" v-model="keyword" auto-focus focus="true" placeholder="输入商品关键词" placeholder-style="color:#d0f1fd;" />
                <i class="icon false" alt="" @click="clearKeyword" >&#xe603;</i>
            </div>
            <span class="more" @click="gosearch">搜索</span>
        </div>
        <div class="content">
            <div class="hot">
                <p class="title">热门搜索</p>
                <ul>
                    <li v-for="(item,index) in hotList" :key="index"  @click="selectKeyword(item)" >
                        <p>{{item}}</p>
                    </li>
                </ul>
            </div>
            <div class="history">
                <p class="bt">历史搜索</p>
                <ul>
                    <li v-for="(item,index) in searchList" :key="index" @click="selectKeyword(item)">
                        <!-- <img src="img/history.png" class="liulan" alt="" /> -->
                        <p>{{item}}</p>
                        <i class="icon err">&#xe603;</i>
                    </li>
                </ul>
            </div>
            <div class="btn">
                <div class="clearbtn">
                    <p>清除搜索历史</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            hotList:[],
            searchList:[],
            keyword:""
        }
    },
    methods:{
        clearKeyword(){
            this.keyword="";
        },
        selectKeyword(keywordStr){
            this.keyword=keywordStr;
        },
        gosearch(){
          if(this.keyword)
            this.go({path:'/pages/home/searchresult',query:{keyword:this.keyword}})
        }
    },
    async mounted(){
        var rep = await this.$ShoppingAPI.GoodsSearchHistory_GetHot({size:10});
        if(rep.ret==0)
        {
            this.hotList = rep.data;
        }
        
        var rep2 =await this.$ShoppingAPI.GoodsSearchHistory_Get({size:10});
        if(rep2.ret==0)
        {
            this.searchList = rep2.data;
        }
    },
    created(){
        
    }
}
</script>
<style lang="less" scoped>
.search .top {
  width: 10.8rem;
  padding-bottom: 0.14rem;
  padding-top: 0.14rem;
  background-color: #12b7f5;
  overflow: hidden;
  position: fixed;
  top: 0;
}

.search .top .back {
  width: 0.28rem;
  height: 0.5rem;
  margin-left: 0.28rem;
  margin-top: 0.28rem;
  float: left;
}

.search .top .sousuo {
  width: 7.62rem;
  height: 0.97rem;
  margin-left: 0.8rem;
  border: solid 1px #d0f1fd;
  border-radius: 0.5rem;
  overflow: hidden;
  float: left;
  font-size: 0.55rem;
  /*input提示文字颜色*/
}
input::-webkit-input-placeholder {
color:#d0f1fd;
}

.search .top .sousuo .ss {
  width: 0.58rem;
  height: 0.58rem;
  margin-top: 0.21rem;
  margin-left: 0.52rem;
  float: left;
  color: #d0f1fd;
}

.search .top .sousuo ::-webkit-input-placeholder {
  color: #d0f1fd;
}

.search .top .sousuo ::-o--input-placeholder {
  color: #d0f1fd;
}

.search .top .sousuo ::-moz-input-placeholder {
  color: #d0f1fd;
}

.search .top .sousuo ::-ms-input-placeholder {
  color: #d0f1fd;
}

.search .top .sousuo .shuru {
  height: 0.95rem;
  background-color: #12b7f5;
  width: 5rem;
  display: block;
  font-size: 0.46rem;
  color: #d0f1fd;
  white-space: nowrap;
  float: left;
  line-height: 1.05rem;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 0.3rem;
}

.search .top .sousuo .false {
  width: 0.42rem;
  height: 0.42rem;
  margin-top: 0.09rem;
  margin-right: 0.45rem;
  float: right;
  color: #d0f1fd;
  font-size: 0.76rem;
}

.search .top .more {
//   width: 0.6rem;
  height: 0.6rem;
  float: right;
  margin-right: 0.4rem;
  margin-top: 0.22rem;
  font-size: 0.46rem;
  color: #d0f1fd;
}

.search .content {
  overflow: auto;
  top: 1.28rem;
  bottom: 1.2rem;
  position: absolute;
  background-color: #ffffff;
}

.search .content .hot {
  padding: 0.58rem 0.3rem 0.44rem 0.3rem;
}

.search .content .hot .title {
  color: #959595;
  font-size: 0.4rem;
  font-family: 'PingFang-SC-Regular';
}

.search .content .hot ul {
  overflow: hidden;
  list-style-type: none;
}

.search .content .hot ul li {
  float: left;
  padding: 0.26rem 0.38rem 0.26rem 0.38rem;
  background-color: #f0f0f0;
  border-radius: 0.1rem;
  margin-right: 0.34rem;
  margin-top: 0.3rem;
}

.search .content .hot ul li p {
  font-size: 0.4rem;
  color: #222222;
  font-family: 'PingFang-SC-Regular';
  text-align: center;
}

.search .content .history {
  border-top: #f0f0f0 0.01rem solid;
  padding: 0.45rem 0.35rem 0.6rem 0.3rem;
}

.search .content .history .bt {
  color: #959595;
  font-size: 0.4rem;
  font-family: 'PingFang-SC-Regular';
}

.search .content .history ul {
  list-style-type: none;
  overflow: hidden;
}

.search .content .history ul li {
  height: 0.6rem;
  margin-top: 0.75rem;
}

.search .content .history ul li .liulan {
  width: 0.41rem;
  height: 0.41rem;
  float: left;
  margin-top: 0.09rem;
  margin-bottom: 0.09rem;
}

.search .content .history ul li p {
  color: #959595;
  font-size: 0.4rem;
  margin-left: 0.26rem;
  float: left;
}

.search .content .history ul li .err {
  float: right;
  margin-right: 10px;
  font-size: 20px;
  line-height: 20px;
}

.search .content .btn {
  background-color: #ffffff;
  height: 1.2rem;
}

.search .content .btn .clearbtn {
  background-color: #12b7f5;
  border-radius: 0.16rem;
  left: 0.3rem;
  right: 0.3rem;
  position: fixed;
  bottom: 0.21rem;
}

.search .content .btn .clearbtn p {
  font-family: 'MicrosoftYaHei';
  color: #ffffff;
  font-size: 0.48rem;
  text-align: center;
  line-height: 1.2rem;
}
</style>
