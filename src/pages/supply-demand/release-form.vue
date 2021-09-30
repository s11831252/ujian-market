<!--
 * @Author: SuChonghua
 * @Date: 2021-09-27 10:04:33
 * @LastEditTime: 2021-09-30 18:46:17
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\release-form.vue
-->
<template>
  <div class="root">
    <div class="group">
      <input v-model="title" placeholder="输入标题" />
      <span class="length">10</span>
    </div>
    <div class="group">
      <div>
        <div class="tip">
          <p><i class="icon">&#xe6b3;</i>详细描述您所供应的产品</p>
          <p class="txt">· 供应产品的类型</p>
          <p>· 供应产品的外观、尺寸、型号等</p>
          <p>· 预算、到货时间、运输方式、区域限定等</p>
        </div>
        <textarea class="content" placeholder="请在此填写详细介绍资料"></textarea>
        <div class="imgList">
          <div class="item" v-for="(item, index) in imageList" :key="index">
            <img :src="item.extContent" />
          </div>
          <div class="item add">
            <img src="../../../static/img/Images.png" />
          </div>
        </div>
      </div>
    </div>
    <div class="group">
      <i class="icon">&#xe66f;</i>
      <span class="label">公司</span>
      <input v-model="title" />
      <i class="icon go">&#xe601;</i>
    </div>
    <div class="group">
      <i class="icon">&#xe66f;</i>
      <span class="label">地址</span>
      <input v-model="title" />
      <i class="icon go">&#xe601;</i>
    </div>
    <div class="group">
      <i class="icon">&#xe66f;</i>
      <span class="label">姓名</span>
      <input v-model="title" />
      <i class="icon go">&#xe601;</i>
    </div>
    <div class="group">
      <i class="icon">&#xe66f;</i>
      <span class="label">联系方式</span>
      <input v-model="title" />
      <i class="icon go">&#xe601;</i>
    </div>
    <div class="group">
      <div class="public">
        <span><i class="icon">&#xe633;</i>公开信息</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      supplyModel: {
        info: {
          listId: 1,
          title: "",
          sendUserId: "",
          bindId: "",
          content: "",
          listType: 0,
          status: 0,
          isTop: 0,
          cityCode: 0,
          showDays: 0,
          gps_lng: 0,
          gps_lat: 0,
          sendTime: "",
          reflushTime: "",
          showTime: "",
        },
        ext: [
          {
            extId: 1,
            extTitle: "图片1",
            extContent: "/static/img/homeshare.jpg",
            extOrder: 0,
            extType: 1,
            extPublic: true,
            listId: 1,
          },
          {
            extId: 2,
            extTitle: "图片2",
            extContent: "/static/img/homeshare.jpg",
            extOrder: 0,
            extType: 1,
            extPublic: true,
            listId: 1,
          },
        ],
      },
    };
  },
  computed: {
    imageList() {
      if (!this.supplyModel.ext || this.supplyModel.ext.length == 0) return [];

      return this.supplyModel.ext.filter((item) => {
        return (item.extType = 1);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.root {
  padding: 0 0.49rem;
  .group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0;
    border-bottom: 0.02rem solid #ebebeb;
    color: #333333;
    input {
      font-size: 0.48rem;
    }
    ::-webkit-input-placeholder {
      /* Edge */
      color: #a6a6a6;
    }

    :-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #a6a6a6;
    }

    ::placeholder {
      color: #a6a6a6;
    }
    .length {
      font-size: 0.32rem;
      color: #a6a6a6;
    }
    .tip {
      color: #8590a4;
      p {
        font-size: 0.4rem;
        display: flex;
        align-items: center;
        line-height: 0.81rem;
        i {
          margin-right: 0.2rem;
        }
      }
      p.txt {
        font-size: 0.36rem;
      }
    }
    .content {
      height: 4.56rem;
      font-size: 0.43rem;
    }
    .imgList {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .item {
        margin-left: 0.23rem;
        img {
          width: 2.94rem;
          height: 2.93rem;
          border-radius: 0.2rem;
        }
      }
    }
    &.icon {
      color: #fff;
      background-color: #bfbfbf;
      border-radius: 50%;
      width: 0.5rem;
      height: 0.5rem;
      line-height: 0.5rem;
      font-size: 0.3rem;
      text-align: center;
    }
    &.icon.go {
      background-color: transparent;
      color: #e6e6e6;
      font-size: 0.7rem;
      font-weight: 800;
    }
    .public {
      font-size: 0.35rem;
      color: #0c64ea;
      display: flex;
      justify-content: flex-end;
      width: 100%;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f4f5f9;
	    border-radius: 0.32rem;
        text-align: center;
        width: 2.4rem;
        height: 0.64rem;
        .icon {
          width: 0.32rem;
          height: 0.32rem;
          border-radius: 0.05rem;
          background-color: #0c64ea;
          color: #fff;
          text-align: center;
          line-height: 0.32rem;
          font-size: 0.3rem;
          margin-right: 0.1rem;
        }
      }

    }
  }
}
</style>