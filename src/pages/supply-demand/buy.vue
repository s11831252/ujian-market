<!--
 * @Author: SuChonghua
 * @Date: 2021-10-13 10:28:51
 * @LastEditTime: 2021-10-15 16:00:07
 * @LastEditors: SuChonghua
 * @Description: 
 * @FilePath: \ujian-market\src\pages\supply-demand\buy.vue
-->
<template>
    <div class="root">
        <div class="top"><i class="icon">&#xe651;</i><span>当前剩余个人发布点 35 </span><span> 企业发布点 40</span></div>
        <div class="tab-select">
            <div class="item action">企业发布点</div>
            <div class="item">个人发布点</div>
        </div>
        <img class="fenjie" src="../../../static/img/fenjie.png">
        <div class="grade-list">
            <div class="item" :class="{action:GradePrice==300}" @click="selectGrade(300)">
                <div class="price"><i>￥</i><span>300</span></div>
                <div class="tip">4点企业发布点</div>
            </div>
            <div class="item" :class="{action:GradePrice==600}" @click="selectGrade(600)">
                <div class="price"><i>￥</i><span>600</span></div>
                <div class="tip">10点企业发布点</div>
            </div>
            <div class="item" :class="{action:GradePrice==1200}" @click="selectGrade(1200)">
                <div class="price"><i>￥</i><span>1200</span></div>
                <div class="tip">20点企业发布点</div>
            </div>
            <div class="item" :class="{action:GradePrice==2800}" @click="selectGrade(2800)">
                <div class="price"><i>￥</i><span>2800</span></div>
                <div class="tip">50点企业发布点</div>
            </div>
        </div>
        <div class="getcode" @click="go({path:'/pages/supply-demand/discount-code'})"><span>获取推荐码</span><i class="icon">&#xe638;</i></div>
        <div class="break"></div>
        <div class="pay-list">
            <div class="item action">
                <i class="icon left">&#xe66b;</i>
                <span>U建钱包支付</span>
                <small>（钱包余额¥3412）</small>
                <i class="icon right">&#xe633;</i>
            </div>
        </div>
        <div class="break"></div>
        
        <div class="bottom">
            <div class="total">
                <p class="price">
                    <span class="txt">总计：</span>
                    <span class="val"><small>￥</small><span>2800</span></span>
                </p>
                <p class="tip">购买50点企业发布点</p>
            </div>
            <div class="detai">
                <span>明细</span>
                <i class="icon">&#xe712;</i>
            </div>
            <button>确认支付</button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            GradePrice:0
        }
    },
    methods:{
        selectGrade(price){
            this.GradePrice=price;
        },
    }
}
</script>
<style lang="scss" scoped>
.root{
    .top{
        margin-top: 0.74rem;
        margin-bottom: 0.8rem;
        display: flex;
        align-items: center;
        color: #333333;
        font-size: 0.4rem;
        i{
            margin-left: 0.58rem;
            margin-right: 0.13rem;
        }
        span{
            margin-right: 0.28rem;
        }
    }
    .tab-select{
        display: flex;
        align-items: center;
        justify-content:space-around;
        margin-bottom: 0.58rem;
        .item{
            width: 4.64rem;
            height: 1.6rem;
            line-height: 1.6rem;
            text-align: center;
            border-radius: 0.3rem;
	        border: solid 0.03rem #dbdad8;
        }
        .item.action{
            background-image: linear-gradient(-25deg, 
                #fff9ef 0%, 
                #fff9f4 100%);
            border-radius: 0.3rem;
            border: solid 0.03rem #cb9952;
        }
    }
    .fenjie{
        height: 0.48rem;
        width: 100%;
    }
    .grade-list{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap:wrap;
        margin-top: 0.8rem;
        margin-bottom: 0.39rem;
        .item{
            width: 4.22rem;
            height: 2.51rem;
            display: flex;
            align-items: center;
            align-content:center;
            flex-wrap:wrap;
            justify-content: center;
            margin-left: 0.41rem;
            margin-bottom: 0.38rem;
            background-color: #ffffff;
            border-radius: 0.3rem;
            border: solid 0.03rem #dbdad8;
            &:nth-of-type(2n+1){
                margin-left: 0;
            }
            .price{
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                i{
                    font-size: 0.42rem;
                }
                span{
                    font-size: 0.9rem;
                }
            }
            .tip{
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666666;
                font-size: 0.32rem;
            }
        }
        .item.action{
            width: 4.16rem;
            height: 2.45rem;
            background-color: #fff9ef;
            border-color: rgba(197, 131, 45, 0.2);
            border-width: 0.06rem;
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
    .getcode{
        font-size: 0.4rem;
        color: #666666;
        margin: 0 1rem 0.48rem 0rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        i{
            margin-left: 0.18rem;
            font-size: 0.3rem;
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
        .detai{
            display: flex;
            align-items: center;
            width: 1.64rem;
            font-size: 0.42rem;
            color: #bf822f;
            padding-bottom: 0.3rem;
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
}
</style>