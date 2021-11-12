<!--
 * @Author: SuChonghua
 * @Date: 2021-11-10 18:05:10
 * @LastEditTime: 2021-11-12 18:27:09
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\post.vue
-->
<template>
    <div class="root">
        <div class="info"></div>
        <div></div>
        <div class="bottom">
            <div class="total">
                <p class="price">
                    <span class="txt">总计：</span>
                    <span class="val"><small>￥</small><span>2800</span></span>
                </p>
                <p class="tip">购买50点企业发布点</p>
            </div>
            <div class="detail" :class="{ open: openDetail }" @click="openDetail=true">
                <span>明细</span>
                <i class="icon">&#xe712;</i>
            </div>
            <button @click="go({path:'/pages/supply-demand/pay-ok'})">确认支付</button>
        </div>
        <div class="detail-box" :class="{ open: openDetail }">
            <div class="mask" ></div>
            <div class="wrapper" @click="openDetail = false">
                <div class="wrapper_body" @click.stop>
                    <div class="box-top"><span>支付明细</span><i class="icon" @click="openDetail = false">&#xe613;</i></div>
                    <div class="box-bottom">
                        <div class="title">套餐明细</div>
                        <div class="detail-info">
                            <span class="name">50点企业发布点</span>
                            <span class="price"><small>￥2800</small>￥0.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.root{
    .break{
        width: 100%;
        height: 0.19rem;
        background-color: #eff3f6;
    }
    .bottom{
        display: flex;
        border-top: 0.03rem solid #f4f4f4;;
        align-items: center;
        position:fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        .total{
            flex-grow:1;
            margin-left: 0.38rem;
            .price{
                display: flex;
                align-items: center;
                .txt{
                    font-size: 0.52rem;
                    color: #222222;
                }
                .val{
                    color: #bf822f;
                    display: flex;
                    align-items: center;
                    small{
                        font-size: 0.4rem;
                    }
                    span{
                        font-weight: bold;
                        font-size: 0.8rem;
                        line-height: 0.25rem;
                    }
                }
            }
            .tip{
                font-size: 0.28rem;
                color: #989898;
            }
        }
        .detail{
            display: flex;
            align-items: center;
            width: 1.64rem;
            font-size: 0.42rem;
            color: #bf822f;
            padding-bottom: 0.3rem;
            i{
                transition: transform 300ms ease-out;
                transform:rotate(0deg);
            }
        }
        .detail.open{
           i.icon{
               transform:rotate(180deg);
           }  
        }
        button{
            width: 3.67rem;
            height: 1.56rem;
            line-height: 1.56rem;
            text-align: center;
            background-image: linear-gradient(-38deg, 
		#353535 0%, 
		#4e4e4e 100%);
            font-size: 0.54rem;
            color: #ecc187;
        }
    }
  .detail-box{
    .mask {
      position: fixed;
      z-index: 10;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: none;
      opacity: 0;
      transform: scale3d(1, 1, 0);
      transition: all 0.3s ease-in;
    }
    .wrapper {
      position: fixed;
      z-index: 10;
      top:0;
      right: 0;
      bottom: 0;
      left: 0;
      text-align: center;
      font-size: 0;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      align-items: flex-end;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      transform: translateY(100%);
      visibility: hidden;
      opacity: 0;
      transition: opacity 700ms ease-out, transform 300ms ease-out, visibility 700ms ease-out;
      .wrapper_body {
        width: 100%;
        background-color: #fff;
        .box-top{
            font-size: 0.48rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding:0.48rem;
            border-bottom:0.02rem solid #dbdad8
        }
        .box-bottom{
            font-size: 0.48rem;
            padding:0.48rem;
            padding-bottom: 1.6rem;
            .title{
                text-align: left;
                font-size: 0.48rem;
                font-weight: 500;
                margin-bottom: 0.4rem;
            }
            .detail-info{
                display: flex;
                align-items: center;
                justify-content: space-between;
                .name{
                    font-size: 0.4rem;
                }
                .price{
                    font-size: 0.38rem;
                    color: #999;
                    display: flex;
                    align-items: center;
                    small{
                        color: #dbdad8;
                        font-size: 0.35rem;
                        text-decoration: line-through
                    }
                }

            }
        }
      }
    }
  }
  .detail-box.open {
    .mask {
      display: block;
      opacity: 1;
      transform: scale3d(1, 1, 1);
    }
    .wrapper {
      transform: none;
      visibility: visible;
      opacity: 1;
    }
  }
}
</style>