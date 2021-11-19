<!--
 * @Author: SuChonghua
 * @Date: 2021-11-10 18:05:10
 * @LastEditTime: 2021-11-16 18:09:55
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\post.vue
-->
<template>
    <div class="root">
        <div class="main">
            <div class="img-box">
                <img class="img" src="../../../static/img/homeshare.jpg">
                <span class="lab supply">供应</span>
            </div>
            <div class="info">
                <div class="title">
                    <small>项目</small>
                    <span>大量供应各种钢材用品</span>
                </div>
                <div class="content">大量出售钢筋，便宜而且实惠，便宜...</div>
                <div class="position"><i class="icon">&#xe65e;</i>南宁西乡塘</div>
            </div>
        </div>
        <div class="tip">
            <p>发布费用为 <span>5元</span>或<span>1个企业发布点</span>，信息展示时间为<span>7天</span></p>
        </div>
        <div class="break"></div>
        <div class="pay-list">
            <div class="item action">
                <i class="icon left">&#xe66b;</i>
                <span>U建钱包支付</span>
                <small>（钱包余额 ¥3412）</small>
                <i class="icon right">&#xe633;</i>
            </div>
            <div class="item">
                <i class="icon left">&#xe66b;</i>
                <span>发布点支付</span>
                <small>（企业发布点40）</small>
                <i class="icon right">&#xe633;</i>
            </div>
        </div>
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
<script>
export default {
    data(){
        return{
            openDetail:false,
        }
    }
}
</script>
<style lang="scss" scoped>
.root{
    .main{
        display: flex;
        justify-items: center;
        align-items: center;
        margin:0.55rem 0.37rem 0 0.37rem;
        padding-bottom: 0.7rem;
        border-bottom: 0.03rem solid #e4e4e4;
        .img-box{
            position: relative;
            margin-right: 0.42rem;
            img{
                width: 2.08rem;
                height: 2.08rem;
            }
            .lab{
                position: absolute;
                right:-0.1rem;
                top: -0.1rem;
                border-radius: 0.1rem;
                color: #fff;
                font-size: 0.3rem;
                width: 0.82rem;
                height: 0.48rem;
                line-height: 0.48rem;
                text-align: center;
            }
            .lab.supply{
                background-color:#0166ff;
            }
            .lab.demand{
                background-color:#37cba7;
            }
        }
        .info{
            flex-grow:1;
            width: 7.39rem;
            .title{
                color: #333333;
                font-size: 0.44rem;
                display: flex;
                justify-items: center;
                align-items: center;
                margin-bottom: 0.31rem;
            }
            .content{
                font-size: 0.42rem;
                color: #1a1a1a;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
                margin-bottom: 0.39rem;
            }
            .position{
                display: flex;
                justify-items: center;
                align-items: center;
                font-size: 0.4rem;
                color: #888888;
                .icon{
                    margin-right: 0.13rem;
                    color: #08bb91;
                }
            }
        }
    }
    &>.tip{
        text-align: center;
        width: 100%;
        margin: 0.62rem 0 0.76rem 0;
        font-size: 0.35rem;
        color: #8c8c8c;
        span{
            color: #666666;
        }
    }
    .break{
        width: 100%;
        height: 0.19rem;
        background-color: #eff3f6;
    }
    .pay-list{
        .item{
            display: flex;
            align-items: center;
            margin: 0.65rem 0;
            i.left{
                width: 0.69rem;
                height: 0.69rem;
                line-height: 0.69rem;
                margin-left: 0.48rem;
                margin-right: 0.4rem;
                font-size: 0.69rem;
                background-color:#3b88f2;
                color: #fff;
                border-radius: 0.08rem;
            }
            i.right{
                background-image: #fff;
                color: #fff;
                border-radius: 50%;
                width: 0.61rem;
                height: 0.61rem;
                line-height: 0.61rem;
                text-align: center;
            }
            span{
                font-size: 0.42rem;
                color: #000000;
            }
            small{
                width: 50%;
                font-size: 0.35rem;
                color: #666666;
            }

        }
        .item.action{
            i.right{
                background-image: linear-gradient(174deg, 
                #f5cb95 0%, 
                #cb9952 100%);
            }
        }
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