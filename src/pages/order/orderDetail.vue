<template>
  <div class="content" v-if="orderInfo.OrderId" @click="checktanchuceng">
    <!-- 提示框 State=4时可以使用该值判断订单评价情况 0待评价-->
    <div class="marked" v-if="orderInfo.State==4 && orderInfo.Order_CommentState==0 && orderInfo.IsReturnGoods==false">
      <p>(订单已完成，请提出您的宝贵意见~)</p>
    </div>
    <!-- 头部 -->
    <div class="top">
      <div class="long">订单状态：{{ StateName}}</div>
      <div class="tapTitle orderinfo">
        <div class="orderinfo-top" v-for="(item, index) in orderInfo.Order_Goods_items" v-bind:key="index">
          <div class="left">
            <img :src="item.Image_url	">
          </div>
          <div class="right">
            <div class="right-top">{{item.gName}}</div>
            <div class="right-botton">单价：</div>
            <div class="unit_price">¥{{item.Price}}</div>
            <!-- 判断规格是否为空，为空就返回默认，否则返回规格值。 -->
            <div class="specification">/件（规格：{{item.ItemName==null? "默认":item.ItemName}}）</div>
            <div class="quantity">x{{item.Number}}</div>
          </div>
        </div>
        <!-- 订单信息在退款退货页面不显示v-if="(orderInfo.State==2 && orderInfo.IsCancelling==false)|| (orderInfo.State==4&& orderInfo.IsReturnGoods==false )"-->
        <div class="OrderInfo1">
          <div class="OrderInfoltft">
            <ul>
              <li class="orleft">商品金额：</li>
              <li>运费：</li>
              <li>实际支付：</li>
            </ul>
          </div>
          <div class="OrderInforight">
            <ul class="rightfloat">
              <li class="ordecolor">￥{{orderInfo.GoodsAmount}}</li>
              <li>￥{{orderInfo.LogisticsInfo.Amount}}</li>
              <li class="pay">￥{{orderInfo.TotalAmount}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品退货理由 上传凭证-->
    <div class="reimburse" v-if="(orderInfo.State==2 && orderInfo.IsCancelling==true)|| (orderInfo.State==4&& orderInfo.IsReturnGoods==true && orderInfo.Order_CommentState!=1 )">
      <ul>
        <li>订单号：{{orderInfo.OrderNo}}</li>
        <li>申请时间：{{ orderInfo.OrderTime}}</li>
        <li>退款金额：¥{{orderInfo.GoodsAmount}}（仅退货款）</li>
        <li>退款原因：{{orderInfo.ReturnGoodsType==null?"":orderInfo.ReturnGoodsType}}</li>
        <ul>
          <li>上传凭证:</li>
          <li class="proof" v-for="(item, index) in orderInfo.ReturnProcess_Images" v-bind:key="index">
            <img :src="item">
            <!-- <img src="/static/img/reimburse_iocp.png">
            <img src="/static/img/reimburse_iocp.png"> -->
          </li>
        </ul>
      </ul>
    </div>

    <!-- 隐藏信息 补差价页面显示-->
    <div class="conceal" v-if="orderInfo.DifferenceAmount>0">
      <div class="pay-freight">
        <div class="pay-left">补运费差价：</div>
        <div class="pay-right">¥{{DifferenceAmountToFixed}}</div>
      </div>
      <div class="leave">
        <div class="leave-left">商家留言：货物太大，需更换车辆。</div>
      </div>
    </div>

    <!-- 退款处理  进度条状态  -->
    <div class="processing" v-if="orderInfo.IsCancelling">
      <div class="sales_return">退款处理</div>
      <!-- 进度条 -->
      <div class="app">
        <!-- Widthfix 宽度不变，高度自动变化，保持原图宽高比不变 -->
        <img src="/static/img/Progress_Ing1.png" mode="widthFix" v-if="StateName=='退款中'">
        <img src="/static/img/Progress_Ing2.png" mode="widthFix" v-else-if="StateName=='退款处理中'">
        <img src="/static/img/Progress_Ing3.png" mode="widthFix" v-else-if="StateName=='已退款'">
        <div class="ReturnProcess_logs">
          <ul class="salesreturn1" v-if="StateName=='退款中'||StateName=='退款处理中'||StateName=='已退款'">
            <li class>退款中</li>
            <li>{{Cancelling1.CreateTime}}</li>
          </ul>
          <ul class="salesreturn2" v-if="(StateName=='退款处理中'||StateName=='已退款')&&Cancelling2!=null">
            <li>处理中</li>
            <li>{{Cancelling2.CreateTime}}</li>
          </ul>
          <ul class="salesreturn2" v-else-if="(StateName=='退款处理中'||StateName=='已退款')">
            <li>&nbsp;</li>
            <li></li>
          </ul>
          <ul v-if="StateName=='已退款'">
            <li>已退款</li>
            <li>{{Cancelling3.CreateTime}}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 退货处理 进度条状态-->
    <div class="processing" v-if="orderInfo.IsReturnGoods && orderInfo.Order_CommentState!=1">
      <div class="sales_return">退货处理</div>
      <!-- 进度条 -->
      <div class="app">
        <img src="/static/img/Progress_Ing1.png" mode="widthFix" v-if="StateName=='退货中'">
        <img src="/static/img/Progress_Ing2.png" mode="widthFix" v-else-if="StateName=='退货处理中'">
        <img src="/static/img/Progress_Ing3.png" mode="widthFix" v-else-if="StateName=='已退货'">
        <div class="ReturnProcess_logs">
          <ul class="salesreturn1" v-if="StateName=='退货中'||StateName=='退货处理中'||StateName=='已退货'">
            <li class>退货中</li>
            <li>{{IsReturnGoods1.CreateTime}}</li>
          </ul>
          <ul class="salesreturn2" v-if="(StateName=='退货处理中'||StateName=='已退货')&&Cancelling2!=null">
            <li>处理中</li>
            <li>{{IsReturnGoods2.CreateTime}}</li>
          </ul>
          <ul class="salesreturn2" v-else-if="(StateName=='退货处理中'||StateName=='已退货')">
            <li>&nbsp;</li>
            <li></li>
          </ul>
          <ul v-if="StateName=='已退货'">
            <li>已退货</li>
            <li>{{IsReturnGoods3.CreateTime}}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 买家评论 -->
    <div class="Order_Comment" v-if="orderInfo.Order_CommentState==1 ||orderInfo.Order_CommentState==2 ">
      <!-- 1 -->
      <div class="border_top">
        <div class="comments">买家评论</div>
      </div>
      <!-- 2 -->
      <div class="Buyers_information" v-for="(item, index) in getCommentModel.goodsCommentList" v-bind:key="index">
        <div class="user_ID">
          <div class="user_iocn">
            <img :src="item.Portrait ">
          </div>
          <div class="userinfo">
            <div class="useid">{{ item.UserName }}</div>
            <div class="credit">
              <li class="quality">质量:</li>
              <li class="qualitynumber">{{getCommentModel.QualityVal}}</li>
              <li class="speed">速度：</li>
              <li class="speednumber">{{getCommentModel.SpeedVal}}</li>
              <li class="serve">服务：</li>
              <li class="servenumber">{{getCommentModel.ServiceVal}}</li>
            </div>
          </div>
        </div>
        <div class="comment_content">
          <div class="content2">
            <div class="content3">{{ item.Content }}</div>
            <div class="content_time">{{ item.AddTime }}</div>
          </div>
          <div class="evaluate_img">
            <!-- <img src="/static/img/img1.png"> -->
            <img v-for="(item2,inde2) in item.imageInfoList" v-bind:key="inde2" :src="item2.url">
          </div>
        </div>
        <!-- <div class="Business_reply">商家回复：非常感谢您的评价，欢迎下次再来购买。</div> -->
        <div class="Business_reply" v-for="(item2, reply) in item.replyInfoList" v-bind:key="reply">商家回复:{{item2.Content}}</div>
      </div>
    </div>

    <!-- 骑手信息在待发货和待收货-->
    <div class="horseman" v-if="(orderInfo.State==2 && orderInfo.IsCancelling==false) || (orderInfo.State==3)">
      <div class="border">
        <div class="logisticsaddress">骑手信息</div>
      </div>
      <div class="horseman-message" v-if="orderInfo.State==2 && orderInfo.LogisticsInfo.LogisticsState==0">
        <div class="car">
          <div class="car-icon">
            <img src="/static/img/car.png">
          </div>
          <div>（商家正在发布信息，请耐心等待~）</div>
        </div>
        <div class="distribution">等待商家联系物流配送</div>
      </div>
      <div class="horseman-message" v-else-if="orderInfo.State==2 && (orderInfo.LogisticsInfo.LogisticsState==1 || orderInfo.LogisticsInfo.LogisticsState==2 || orderInfo.LogisticsInfo.LogisticsState==3)">
        <div class="car">
          <div class="car-icon">
            <img src="/static/img/car.png">
          </div>
          <div>（师傅正在努力飞奔向您，请耐心等待~）</div>
        </div>
      </div>
      <div class="car-messaage" v-if="orderInfo.Distributions_Info.length>0">
        <div class="car-top">
          <div class="car-left">车牌号：{{ orderInfo.Distributions_Info[0].Car_Number}}</div>
          <div class="car-right">配送师傅：{{ orderInfo.Distributions_Info[0]. UserName}}</div>
        </div>
        <div class="car-buttom">
          <div class="mode">车 型：{{ orderInfo.Distributions_Info[0].DistributionModeText}}</div>
          <div class="tel">联系电话：{{ orderInfo.Distributions_Info[0].Phone}}</div>
        </div>
      </div>
    </div>

    <!-- 物流信息 待付款  待发货 待收货  已完成有 >0-->
    <div class="address" v-if="orderInfo.State>0||orderInfo.IsCancelling||orderInfo.IsReturnGoods">
      <div class="logistics">
        <div class="border">
          <div class="logisticsaddress">物流地址</div>
        </div>
        <div class="Gaininformation">
          <div class="adrrleft">
            <img src="/static/img/address.png">
          </div>
          <div class="shippingaddress">取货地址：</div>
          <div class="shippingaddress2">{{ orderInfo.Contact_Address}}</div>
          <div class="adrrbuttom"></div>
        </div>
      </div>

      <div class="Gaininformation1">
        <!-- 收货人信息 顶部 -->
        <div class="infotop">
          <div class="Consignee-icon">
            <img src="/static/img/man.png">
          </div>
          <div class="recipients">收货人：{{ orderInfo.Contact_Name}}</div>
          <div class="phone-icon">
            <img src="/static/img/phone2.png">
          </div>
          <div class="phone">{{ orderInfo.Contact_Phone}}</div>
        </div>
        <!--地址  中间 -->
        <div class="centre">
          <div class="Delivery-icon">
            <img src="/static/img/site.png">
          </div>
          <div class="deliveryaddress">送货地址：</div>
          <div class="location">{{ orderInfo.LogisticsInfo.Shipper_Address}}</div>
        </div>
        <!-- 距离 底部 运输距离在代付款页面显示 1-->
        <div class="bottom" v-if="orderInfo.State==1">
          <div class="distance">距离{{orderInfo.LogisticsInfo.Distance}}公里</div>
          <div class="cm">共计运费¥{{orderInfo.LogisticsInfo.Amount}}</div>
        </div>
      </div>
    </div>

    <!-- 补差价的收货地址 收货地址页面只有补差价有 ==-1 -->
    <div class="DifferenceAmount" v-if="orderInfo.State==-1">
      <div class="border">
        <div class="logisticsaddress">收货地址</div>
      </div>
      <div class="infotop">
        <div class="Consignee-icon">
          <img src="/static/img/man.png">
        </div>
        <div class="recipients">收货人：{{ orderInfo.Contact_Name}}</div>
        <div class="phone-icon">
          <img src="/static/img/phone2.png">
        </div>
        <div class="phone">tel:{{ orderInfo.Contact_Phone}}</div>
      </div>
      <div class="centre">
        <div class="Delivery-icon">
          <img src="/static/img/site.png">
        </div>
        <div class="deliveryaddress">送货地址：</div>
        <div class="location">{{ orderInfo.LogisticsInfo.Shipper_Address}}</div>
      </div>
    </div>

    <!-- 配送信息  只有代付款页面显示  ==1时候 -->
    <div class="Shippinginformation" v-if="orderInfo.State==1">
      <!-- 车辆信息 -->
      <div class="motorcycletype">
        <div class="border">
          <div class="logisticsaddress">配送车辆</div>
        </div>
        <div class="left">{{orderInfo.LogisticsInfo.DistributionModeText}}：￥33.00/5km</div>
        <div class="right">超里程：￥3.00/km</div>
      </div>
      <!-- 重量 -->
      <div class="aa">
        <div class="kg">
          <div class="weight">
            <div class="weight1">500kg</div>
            <div class="weight2">载重</div>
          </div>
          <div class="length">
            <div class="shuzhi">1.8m x 1.3m x 1.1m</div>
            <div class="ckg">长宽高</div>
          </div>
          <div class="volume">
            <div class="Volumenumerical">2.4㎡</div>
            <div class="bulk">载货体积</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 留言 在代付款页面不显示留言  其他页面都显示 !=1-->
    <div class="leave-world" v-if="orderInfo.State!=1">留言：越快送到越好，急着要！</div>

    <!-- 订单信息 在退货/退款中不显示-->
    <div class="OrderInfo">
      <div class="order" v-if="orderInfo.IsReturnGoods==false || orderInfo.IsCancelling==false">
        <div class="information">订单信息</div>
        <ul class="ordernumber">
          <li>订单号:</li>
          <li>下单时间</li>
        </ul>
        <ul class="ordertime">
          <li>{{ orderInfo.OrderNo}}</li>
          <li>{{ orderInfo.OrderTime}}</li>
        </ul>
      </div>
    </div>

    <!-- 处理记录 退款/退货 -->
    <div class="Create" v-if="orderInfo.IsCancelling || (orderInfo.IsReturnGoods && orderInfo.Order_CommentState<0)">
      <div class="Create1">处理记录</div>
      <div class="CreateTime" v-for="(item, index) in orderInfo.ReturnProcess_logs" v-bind:key="index">
        <!-- 买家申请 1买家 2商家 3平台-->
        <div class="CreateTime1">
          <div class="time1left">{{item.CreateTime}}</div>
          <div class="time1right">{{item.Log_Title}}</div>
        </div>
      </div>
    </div>

    <!-- 底部 按钮-->
    <!-- 待付款页面State=1和补差价页面 DifferenceAmount> 0"-->
    <div class="buttommessage" v-if="orderInfo.DifferenceAmount > 0 || orderInfo.State==1">
      <!-- @click.stop 阻止事件冒泡 -->
      <button class="payment btn" @click.stop="unshow">取消订单</button>
      <button class="cancellationoforder btn" v-on:click="pay">付款</button>
    </div>
    <!-- 取消页面 下面的按钮 -->
    <div v-if="orderInfo.State==0 && orderInfo.DifferenceAmount == 0 && (orderInfo.IsCancelling==false && orderInfo.IsReturnGoods==false)">
      <!-- 重新购买跳转到 店铺详情中 -->
      <button class="cancel_button btn" @click="go({path:'/pages/shop/index',query:{sId:orderInfo.sId}})">重新购买</button>
    </div> 
    <!-- 退款中  待发货页面 State=2 并且IsCancelling=true -->
    <div class="buttommessage" v-if="orderInfo.State==2 && orderInfo.IsCancelling==true">
      <button class="payment btn"  v-if="IsPlatformin">联系客服</button>
      <button class="payment btn" v-on:click="Platform" v-else-if="orderInfo.IsCancelling==true">平台介入</button>
      <button class="cancellationoforder btn"  @click.stop="CancelRequest" >取消申请</button>
    </div>
    <!-- 待发货页面 State=2并且IsCancelling=false -->
    <div class="buttommessage" v-if="orderInfo.State==2 && orderInfo.IsCancelling==false">
      <button class="cancel_button btn" @click="go({path:'/pages/order/orderreturn',query:{OrderId:orderInfo.OrderId,retreat:1}})">申请退款</button>
    </div>
    <!-- 确认收货 v-if="orderInfo.State==3"-->
    <div class="buttommessage" v-if="orderInfo.State==3">
      <button class="cancel_button btn" @click.stop="ensurebtr">确认收货</button>
    </div>

    <!-- 退货中 -->
    <div class="buttommessage" v-if="orderInfo.State==4 && orderInfo.IsReturnGoods4==true">
      <button class="payment btn" @click="Platform"  v-if="orderInfo.IsReturnGoods4==true">平台介入</button>
      <button class="cancellationoforder btn" @click.stop="applyRefund" >取消申请</button>
    </div>
    <!-- 待评价页面 -->
    <div class="buttommessage" v-if="orderInfo.State==4 && orderInfo.Order_CommentState==0 && orderInfo.IsReturnGoods==false">
      <button class="payment btn" @click="go({path:'/pages/order/orderreturn',query:{OrderId:orderInfo.OrderId,retreat:2}})">申请退货</button>
      <button class="cancellationoforder btn" @click="go({path:'/pages/order/write_review',query:{OrderId:orderInfo.OrderId}})">评论</button>
    </div>

    <!-- 弹出框  -->
    <div class="message-box-wrapper" @click="checktanchuceng" v-if="showed">
      <!-- 取消订单弹出框 @click.stop 阻止事件冒泡-->
      <div class="dialog" @click.stop v-if="!Cancel">
        <button class="message-box-cap">请选择取消订单的理由</button>
        <div class="message-box">
          <!-- 头部 -->
          <div class="message-box-content">
            <radio-group class="radio-group" @change="bindchange">
              <!--value取值项，KeywordName显示项 //表单元素radio用radio-group组件进行代替 -->
              <radio :value="item.KeywordId" :checked="item.checked" v-for="(item, index) in Cancelreason " v-bind:key="index">{{item.KeywordName}}</radio>
            </radio-group>
          </div>
          <textarea class="textarea" v-model="Revokecause"></textarea>
          <button class="message-box-ascertain" @click="OrderCancelbtr">确定</button>
        </div>
      </div>
      <!-- 取消成功 -->
      <div class="dialog" v-if="Cancel" @click.stop>
        <div class="OrderCancel-box">
          <div class="OrderCancel-content">
            <img src="/static/img/correct.png">
            <p>取消成功</p>
          </div>
        </div>
      </div>
    </div>

    <div class="message-box-wrapper" @click="checktan" v-if="sign">
      <!-- 确认收货弹窗 -->
      <div class="ReturnGoods" v-if="Over" @click.stop>
        <button class="ReturnGoods-cap">
          您可以选择
          <img src="/static/img/close.png">
        </button>
        <div class="ReturnGoods-box">
          <button class="scan btr" @click="scanOver">扫码签收</button>
          <button class="direct btr" @click="directsign">直接签收</button>
        </div>
      </div>
      <!-- 二维码签收弹框 -->
      <div class="dialog" v-if="scan" @click.stop>
        <div class="OrderCancel-box">
          <div class="QR-content">
            <img src="/static/img/QR.png">
            <p>请骑手扫描二维码确认收货</p>
          </div>
        </div>
      </div>
      <!--  确定收货? -->
      <div class="dialog" v-if="consignee" @click.stop>
        <button class="message-box-cap">
          确认收货?
          <img src="/static/img/close.png">
        </button>
        <div class="scan-box">
          <p>请确认物品完好无损</p>
          <button class="scan-btr" @click="Affirmreceipt">确定</button>
        </div>
      </div>
      <!-- 收货成功 -->
      <div class="dialog" v-if="hint" @click.stop>
        <div class="OrderCancel-box">
          <div class="OrderCancel-content">
            <img src="/static/img/correct.png">
            <p>收货成功</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template> 


<script>
import { mapState } from "vuex"; //暖存
export default {
  data() {
    return {
      Notescontact:true,
      cancellationreason: "",
      Revokecause: "",
      sign: false,
      hint: false,
      consignee: false,
      scan: false,
      Over: true,
      Cancel: false,
      showed: false,
      Cancelreason: [],
      getCommentModel: {
        UserName: ""
      },
      orderInfo: {
        OrderId: "5d8cd0bd-992a-4008-82e2-06755454a0a6",
        OrderNo: "201808291523519697",
        Contact_Phone: "13366985814",
        UserId: "dd796938-ae8c-408b-b692-64ab18744f33",
        State: 0,
        Order_CommentState: 0,
        Contact_Address: "广西壮族自治区南宁市西乡塘区",
        Contact_Name: "小石",
        RevokeRemarks: "hhd",
        TotalAmount: 161.4,
        DifferenceAmount: 0.0,
        PayAmount: 161.4,
        GoodsAmount: 134.0,
        TotalNum: 10,
        CancelType: 3422,
        CancelDisplay: "暂时不需要",
        ReturnGoodsType: null,
        ReturnGoodsTypeDisplay: null,
        OrderTime: "2018-08-29 15:23:51",
        Invoice: false,
        IsReturnGoods: false,
        IsCancelling: true,
        IsDelete: false,
        Image_url:
          "http://192.168.0.119:802/Goods/ShowImg/2018-08-27/201808271719461315NG6.jpg",
        Thumbnail_url:
          "http://192.168.0.119:802/Goods/ShowImg///2018-08-27/201808271719461315NG6.jpg",
        gTitle: "钢材菜刀水泥焊丝服务网工程配送应有尽有快快来试试",
        gUnit: "件",
        gId: "a9dc4d7a-6707-4334-ba7b-bc5633c5b192",
        sId: "ae0f4060-ec28-4cf5-b94d-9e237096498d",
        sName: "这里是越知测试钢材店",
        Remarks: "建信基金",
        PayType: null,
        ThridNumber: null,
        ReturnProcess_logs: [
          {
            Id: 118,
            OrderId: "5d8cd0bd-992a-4008-82e2-06755454a0a6",
            UserId: "dd796938-ae8c-408b-b692-64ab18744f33",
            Log_Title: "买家申请退款",
            Log_Remarks: "",
            Role: 1,
            CreateTime: "2018-08-29 15:25:10",
            Confirm: true
          },
          {
            Id: 119,
            OrderId: "5d8cd0bd-992a-4008-82e2-06755454a0a6",
            UserId: "dd796938-ae8c-408b-b692-64ab18744f33",
            Log_Title: "买家取消申请退款",
            Log_Remarks: "",
            Role: 1,
            CreateTime: "2018-08-29 17:28:56",
            Confirm: true
          },
          {
            Id: 120,
            OrderId: "5d8cd0bd-992a-4008-82e2-06755454a0a6",
            UserId: "dd796938-ae8c-408b-b692-64ab18744f33",
            Log_Title: "买家申请退款",
            Log_Remarks: "",
            Role: 1,
            CreateTime: "2018-08-29 17:29:10",
            Confirm: true
          },
          {
            Id: 143,
            OrderId: "5d8cd0bd-992a-4008-82e2-06755454a0a6",
            UserId: "dd796938-ae8c-408b-b692-64ab18744f33",
            Log_Title: "买家取消申请退款",
            Log_Remarks: "",
            Role: 1,
            CreateTime: "2018-08-31 09:45:58",
            Confirm: true
          },
          {
            Id: 397,
            OrderId: "5d8cd0bd-992a-4008-82e2-06755454a0a6",
            UserId: "7893da8a-883c-4f33-a341-e8dddac905ec",
            Log_Title: "商家不同意退款",
            Log_Remarks: "这个货已近发了",
            Role: 2,
            CreateTime: "2018-09-9 16:57:36",
            Confirm: false
          },
          {
            Id: 374,
            OrderId: "5d8cd0bd-992a-4008-82e2-06755454a0a6",
            UserId: "dd796938-ae8c-408b-b692-64ab18744f33",
            Log_Title: "买家申请退款",
            Log_Remarks: "",
            Role: 1,
            CreateTime: "2018-09-10 16:27:39",
            Confirm: true
          },
          {
            Id: 397,
            OrderId: "5d8cd0bd-992a-4008-82e2-06755454a0a6",
            UserId: "7893da8a-883c-4f33-a341-e8dddac905ec",
            Log_Title: "商家同意退款",
            Log_Remarks: "",
            Role: 2,
            CreateTime: "2018-09-10 16:57:36",
            Confirm: true
          }
        ],
        ReturnProcess_Images: [],
        Order_Goods_items: [
          {
            OrderId: "5d8cd0bd-992a-4008-82e2-06755454a0a6",
            gId: "a9dc4d7a-6707-4334-ba7b-bc5633c5b192",
            sId: "ae0f4060-ec28-4cf5-b94d-9e237096498d",
            gName: "钢材菜刀水泥焊丝服务网工程配送应有尽有快快来试试",
            gTitle: "钢材菜刀水泥焊丝服务网工程配送应有尽有快快来试试",
            gUnit: "件",
            Image_url:
              "http://192.168.0.119:802/Goods/ShowImg/2018-08-27/201808271719461315NG6.jpg",
            ItemId: "d6802376-4dd3-405a-afae-31acca64e59d",
            ItemName: "三把手",
            Price: 19.0,
            Number: 2,
            Stock: 69845,
            Amount: 38.0,
            KeywordId: 3675,
            KeywordPath: ",3666,3675"
          },
          {
            OrderId: "5d8cd0bd-992a-4008-82e2-06755454a0a6",
            gId: "f3150def-3e83-476e-a96c-eed4cde47d25",
            sId: "ae0f4060-ec28-4cf5-b94d-9e237096498d",
            gName: "钢材螺丝铁木头板材焊丝防护手套安全帽安全把手螺丝批",
            gTitle: "记得恒大华府好",
            gUnit: "件",
            Image_url:
              "http://192.168.0.119:802/Goods/ShowImg/2018-08-27/2018082717203531836QO.jpg",
            ItemId: "6b6dd1e3-2f5f-4736-9bc4-ec813f1816e3",
            ItemName: null,
            Price: 12.0,
            Number: 8,
            Stock: 1100,
            Amount: 96.0,
            KeywordId: 3614,
            KeywordPath: ",3570,3614"
          }
        ],
        LogisticsInfo: {
          DistributionModeText: "小型轿车",
          ActualAmount: 27.4,
          OrderId: "5d8cd0bd-992a-4008-82e2-06755454a0a6",
          LogisticsNo: "",
          Contact_Phone: "13366985814",
          Shipper_Phone: "13557595636",
          Shipper_Tel: "0771525624",
          UserId: "7893da8a-883c-4f33-a341-e8dddac905ec",
          Shipper_Address: "广西壮族自治区南宁市西乡塘区相思湖西路",
          Contact_Address: "广西壮族自治区南宁市西乡塘区",
          Contact_Name: "小石",
          Shipper_Name: "这里是越知测试钢材店",
          Remarks: "",
          LogisticsMode: 1,
          DistributionModeId: 1,
          LogisticsState: -1,
          Distance: 6000.0,
          Duration: 377.0,
          Amount: 27.4,
          ServiceAmount: 5.48,
          DistributionAmount: 21.92,
          Contact_Latitude: 22.849499,
          Contact_Longitude: 108.221214,
          Shipper_Latitude: 22.850658,
          Shipper_Longitude: 108.246649,
          CreateTime: "2018-08-29 15:23:51"
        },
        Distributions_Info: [],
        OrderCouponList: []
      },
      StateNames: ["订单取消", "待付款", "待发货", "已发货", "已完成"],
      ReturnProcess: ["退货中", "处理中", "已退货"]
    };
  },
  computed: {
    ...mapState({
      //当前登录用户
      UserInfo: state => state.User.UserInfo
    }),

    // 根据ReturnProcess_logs数组里面是否有Role=3的项来判断是否有平台介入
    IsPlatformin:function(){
       for (const item of this.orderInfo.ReturnProcess_logs) {
        if (item.Role == 3) {
          return true;
        }
      }
       return false;
     },

    // 补运费差价：显示两位小数点
    DifferenceAmountToFixed: function() {
      // `this` 指向 vm 实例
      if (!this.orderInfo.DifferenceAmount) return "0";
      var _temp = this.orderInfo.DifferenceAmount.toFixed(2);
      return _temp;
    },
    // 实际支付保留两位小数点
    payment: function() {
      if (!this.orderInfo.PayAmount) return "0";
      var _temp1 = this.orderInfo.PayAmount.toFixed(2);
      return _temp1;
    },
    // 运费保留两位小数点
    freight: function() {
      if (!this.orderInfo.LogisticsInfo) return "0";
      var _temp3 = this.orderInfo.LogisticsInfo.Amount.toFixed(2);
      return _temp3;
    },
    Cancelling1() {
      for (const item of this.orderInfo.ReturnProcess_logs) {
        if (item.Role == 1) {
          return item;
        }
      }
    },
    Cancelling2() {
      for (const item of this.orderInfo.ReturnProcess_logs) {
        //if(item.Role==2&&!item.Confirm) 同意思
        if (item.Role == 2 && item.Confirm == false) {
          return item;
        }
      }
    },
    Cancelling3() {
      for (const item of this.orderInfo.ReturnProcess_logs) {
        if (item.Role == 2 && item.Confirm) {
          return item;
        }
      }
    },
    IsReturnGoods1() {
      for (const item of this.orderInfo.ReturnProcess_logs) {
        if (item.Role == 1) {
          return item;
        }
      }
    },
    IsReturnGoods2() {
      for (const item of this.orderInfo.ReturnProcess_logs) {
        //if(item.Role==2&&!item.Confirm) 同意思
        if (item.Role == 2 && item.Confirm == false) {
          return item;
        }
      }
    },
    IsReturnGoods3() {
      for (const item of this.orderInfo.ReturnProcess_logs) {
        if (item.Role == 2 && item.Confirm) {
          return item;
        }
      }
    },
    //待补差价/退款退货页面显示
    StateName: function() {
      //待补差价,大于0表示有余款需要用户支付
      if (this.orderInfo.DifferenceAmount > 0) {
        return "补运费差价";
      }
      //退款中 退款只能在待发货中
      else if (
        this.orderInfo.State == 2 &&
        this.orderInfo.IsCancelling == true
      ) {
        //循环数组判断数组里面的Role=?2 =2返回退款处理中 否则返回退款处理中
        for (const item of this.orderInfo.ReturnProcess_logs) {
          if (item.Role == 2) {
            return "退款处理中";
          }
        }
        return "退款中";
      }
      //已退款
      else if (
        this.orderInfo.State == 0 &&
        this.orderInfo.IsCancelling == true
      ) {
        return "已退款";
      }

      //退货中  当订单已完成后刻申请退货 state=4
      else if (
        this.orderInfo.State == 4 &&
        this.orderInfo.IsReturnGoods == true &&
        this.orderInfo.Order_CommentState == 0
      ) {
        for (const item of this.orderInfo.ReturnProcess_logs) {
          if (item.Role == 2) {
            return "退货处理中";
          }
        }
        return "退货中";
      }
      //已退货
      else if (
        this.orderInfo.State == 0 &&
        this.orderInfo.IsReturnGoods == true
      ) {
        return "已退货";
      }

      //待评价 State=4并且Order_CommentState=0
      else if (
        this.orderInfo.State == 4 &&
        this.orderInfo.Order_CommentState == 0 &&
        this.orderInfo.IsReturnGoods==false
      ) {
        return "待评价";
      }

      //已评价 State=4并且Order_CommentState=1
      else if (
        this.orderInfo.State == 4 &&
        this.orderInfo.Order_CommentState == 1
      ) {
        return "已评价";
      }
      return this.StateNames[this.orderInfo.State];
    },

    // 判断处理进度
    ReturnProcess: function() {
      if (ReturnProcess == 1) {
        return "退货中";
      }
    }
  },

  components: {},

  methods: {
    //弹窗信息  取消按钮
    cancellation: function() {
      var that = this;
      wx.showModal({
        title: "取消提示",
        content: "是否取消这个订单?",
        cancelText: "再想想",
        confirmText: "确认取消",
        cancelColor: "#FF0000",
        success(res) {
          if (res.confirm) {
            that.orderInfo.State = 0;
            console.log("用户点击确定");
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },

    //支付按钮  弹窗信息
    pay: function() {
      var that = this;
      wx.showModal({
        title: "支付提示",
        content: "是否支付这个订单?",
        cancelText: "再想想",
        confirmText: "确认支付",
        cancelColor: "#FF0000",
        success(res) {
          if (res.confirm) {
            that.orderInfo.State = 2;
            console.log("用户点击确定");
          } else if (res.cancel) {
            this.orderInfo.State = 1;
            console.log("用户点击取消");
          }
        }
      });
    },
   
    //确认收货
    receipt: function() {
      var that = this;
      wx.showModal({
        title: "收货提示",
        content: "是否已收货?",
        cancelText: "还没",
        confirmText: "对呀",
        cancelColor: "#FF0000",
        success(res) {
          if (res.confirm) {
            that.orderInfo.State = 4;
            console.log("已确认收货");
          } else if (res.cancel) {
            console.log("没确认收货");
          }
        }
      });
    },
    say: function(message) {
      alert(message);
    },
    checktanchuceng() {
      if ((this.showed = true)) {
        this.showed = false;
        this.Cancel = false;
      }
    },

    checktan() {
      if ((this.sign = true)) {
        this.sign = false;
        this.consignee = false;
        this.sign = false;
        this.scan = false;
        this.Over = true;
        this.hint = false;
      }
    },
    // 取消订单
    unshow() {
      this.showed = !this.showed;
    },

    // 扫码签收
    scanOver() {
      this.scan = true;
      this.Over = false;
    },
    //直接签收
    directsign() {
      this.consignee = true;
      this.Over = false;
    },
    //确定收货按钮
    ensurebtr() {
      this.sign = true;
    },

    //订单取消表单
    async OrderCancelbtr() {
      var rep = await this.$ShoppingAPI.Order_Cancel({
        OrderId: this.orderInfo.OrderId, //提交订单的ID
        RevokeRemarks: this.Revokecause, //提交申请的内容
        //	申请取消原因,0其他原因
        CancelType: this.cancellationreason
      });
      console.log(rep);
      if (rep.ret == 0) {
        this.Cancel = true;
      }
    },

    //确认收货
    async Affirmreceipt() {
      var rep = await this.$ShoppingAPI.Order_OrderOver({
        OrderId: this.orderInfo.OrderId
      });
      console.log(rep);
      if (rep.ret == 0) {
        this.hint = true;
        this.consignee = false;
      // 页面跳转  跳转去确认收货页面
        this.replace({
        path: "/pages/order/confirm_receipt",
        query: { OrderId: this.orderInfo.OrderId },
        reLaunch: true
       })
         
      }
    },
    
    //买家退货中 取消申请
    async CancelRequest(){
      var rep=await this.$ShoppingAPI.Order_ApplyCancel({
         OrderId:this.orderInfo.OrderId,
         CancelType:0,
         IsCancelling:false
      });
      if(rep.ret==0){
        this.orderInfo.IsCancelling=false;
      }
    },
    //以已签收订单  取消申请
    async applyRefund(){
      var rep=await this.$ShoppingAPI.Order_ApplyRefund({
         OrderId:this.orderInfo.OrderId,
         ReturnGoodsType:0,
         IsReturnGoods:false
      });
      if(rep.ret==0){
        this.orderInfo.IsReturnGoods=false;
      }
    },
    //取消申请  点击平台介入插入一条记录，插进记录后文字变为联系客服
    async Platform(){
       var myDate = new Date();//获取系统当前时间
       var year=myDate.getFullYear(); //获取完整的年份(4位,1970-????)
       var Month=myDate.getMonth()+1;//获取当前月份(0-11,0代表1月)
       var day=myDate.getDate(); //获取当前日(1-31)
       var hour=myDate.getHours();//获取当前小时数(0-23)
       var minute=myDate.getMinutes();//获取当前分钟数(0-59)
       var second=myDate.getSeconds();//获取当前秒数(0-59)
       var currenttime =year+"-"+Month+"-"+day+" "+hour+":"+minute+":"+second;
       var rep=await this.$ShoppingAPI.Order_ApplyPlatform({
          OrderId:this.orderInfo.OrderId,
      })
      console.log(rep)
       if(rep.ret==0){
        //往一个数组里面插入一个对象 用push  //用push在数组后面插入元素
        console.log("进来了")
        this.orderInfo.ReturnProcess_logs.push({
          Id: 1,
          OrderId: "dade587b-eb85-4954-8219-2c5e7246e285",
          UserId: "50b55f26-963d-4ed7-9bc4-11038bd491f1",
          Log_Title: "平台已介入处理",
          Log_Remarks: "sample string 5",
          Role: 3,
          CreateTime: currenttime,
          Confirm: true
        
        });
         console.log("已经插入数据")
       }
    },

    // //删除评论
    // async Deletecomment(){
    //   var rep=await this.$ShoppingAPI.OrderComment_GetListdelete({
    //     OrderId: this.orderInfo.OrderId  
    //   });
    //   if(rep.ret==0){
        
    //   }
    // },
    //bindchange事件，每次勾选时，只能使一个选项呈现为选中状态，同时会将相应的值存在detail里。
    bindchange(e) {
      console.log("radio发生change事件，携带value的值", e.target.value);
      this.cancellationreason = e.target.value;
    }
  },
   async onShow(){
  //打印外面传进来的参数
    // console.log(this.$route.query);
    //把vue this 指向that，方便在其他回调函数里面使用this
    var that = this;
    //访问服务端，请求api获取传进来的OrderId的订单信息
    var res = await this.$ShoppingAPI.Order_Get({
      OrderId: this.$route.query.OrderId //从外面传进来的订单ID
    });
    //res.ret==0表示服务端请求成功
    if (res.ret == 0) {
      // console.log(res.data[0]);
      //将返回的data数组第一项（因为接口返回的是数组）赋值给 this.orderInfo
      this.orderInfo = res.data[0];
    }

    //访问服务端，请求api获取传进来的数据 rep返回后台传回来行业市场店铺分类的数据
    var rep = await this.$UJAPI.GetKeyword({
      TypeId: 19
    });
    // console.log(rep);
    if (rep.ret == 0) {
      this.Cancelreason = rep.data; //把后台返回来的数据赋值给数组Cancelreason
    }

    //获取订单评论
    var rec = await this.$ShoppingAPI.OrderComment_GetList({
      OrderId: this.$route.query.OrderId, //从外面传进来的订单ID
      // sId:this.orderInfo.sId,
      userId:this.UserInfo.UserId//获取当前用户id  一开始就有
    });
    if (rec.ret == 0) {
      this.getCommentModel = rec.data;
      // console.log(this.getCommentModel);
    }
  },
  //异步
  async mounted() {
  },
  created() {
    // console.log(this.orderInfo.Contact_Name);
  }
};
</script>





<style scoped>
.content {
  padding-top: 0.2rem;
  background-color: #ecf0f1;
}
/* 先定位 才能设置四个值得属性 居中定位 取消订单弹出框 */
.message-box-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.message-box-wrapper::after {
  content: "";
  display: inline-block;
  height: 100%;
  width: 0;
  vertical-align: middle; /*让行级元素垂直居中*/
}
.dialog {
  margin-top: 1.33rem;
}
.message-box {
  display: inline-block;
  vertical-align: middle;
  /* position: relative; */
  width: 7.21rem;
  background: #ffffff;
  margin-left: 1.8rem;
}

.message-box-content {
  padding: 10px 20px;
  color: #12b7f5;
}
.message-box-content .radio-group radio {
  margin-left: 0.59rem;
  display: block;
  padding-bottom: 0.48rem;
  color: #5c5c5c;
  font-family: MicrosoftYaHei;
  font-size: 0.41rem;
}

/* 文本框 */
.textarea {
  width: 5.6rem;
  height: 1.54rem;
  border: solid 0.03rem #e4e5e5;
  font-size: 0.4rem;
  margin-left: 0.8rem;
}
.message-box-ascertain {
  width: 5.6rem;
  background-color: #12b7f5;
  color: #ffffff;
  border-radius: 0.16rem;
  margin-top: 0.6rem;
  margin-bottom: 0.54rem;
}
.message-box-cap {
  width: 7.74rem;
  height: 1.14rem;
  text-align: center;
  color: #ffffff;
  background-color: #12b7f5;
}
/* end取消订单弹出框 */
/* 取消订单 */
.OrderCancel-box {
  display: inline-block;
  position: relative;
  width: 7.21rem;
  height: 7.25rem;
  background: #ffffff;
  text-align: center;
  margin-left: 1.78rem;
}

.OrderCancel-content {
  padding: 10px 20px;
  color: #12b7f5;
  font-size: 0.72rem;
}
.OrderCancel-content img {
  padding-top: 1.23rem;
  width: 3.37rem;
  height: 3.38rem;
  padding-bottom: 0.61rem;
}
/* 二维码签收弹窗 */
.QR-content {
  padding: 10px 20px;
  color: #5c5c5c;
  font-size: 0.46rem;
}
.QR-content img {
  padding-top: 0.7rem;
  width: 5.05rem;
  height: 5.05rem;
  padding-bottom: 0.37rem;
}
/* 确认收货弹窗  */
.message-box-cap img {
  width: 0.68rem;
  height: 0.68rem;
  float: right;
  padding-top: 0.19rem;
}
.ReturnGoods {
  margin-top: 1.81rem;
  text-align: center;
}
.ReturnGoods-cap {
  width: 7.72rem;
  height: 1.14rem;
  color: #ffffff;
  background-color: #12b7f5;
}
.ReturnGoods-cap img {
  width: 0.68rem;
  height: 0.68rem;
  float: right;
  padding-top: 0.19rem;
}

.ReturnGoods-box {
  display: inline-block;
  width: 7.2rem;
  height: 2.73rem;
  background: #ffffff;
}
.btr {
  width: 2.38rem;
  height: 0.86rem;
  margin-top: 0.78rem;
  border-radius: 0.16rem;
  line-height: 0.7rem;
  font-size: 0.4rem;
  border: solid 0.01rem #dddbdb;
}
.scan {
  background-color: #12b7f5;
  float: left;
  margin-left: 0.6rem;
  color: #ffffff;
}
.direct {
  color: #595959;
}
/* 确定收货？ */
.scan-box {
  display: inline-block;
  width: 7.2rem;
  height: 3.33rem;
  background: #ffffff;
  margin-left: 1.82rem;
  text-align: center;
}
.scan-box p {
  font-size: 0.46rem;
  color: #5c5c5c;
  padding-top: 0.68rem;
}
.scan-btr {
  width: 3.01rem;
  height: 0.86rem;
  line-height: 0.7rem;
  background-color: #12b7f5;
  font-size: 0.4rem;
  border-radius: 0.16rem;
  color: #ffffff;
  margin-top: 0.83rem;
}
/* 待评论页面的提示语 */
.marked {
  text-align: center;
  color: #12b7f5;
  font-size: 0.4rem;
  height: 1rem;
  background-color: rgba(18, 183, 245, 0.06);
  line-height: 0.8rem;
}
/* 订单信息 */
.content .top {
  background-color: #ffffff;
  /* margin-bottom: 0.21rem; */
}
.content .top .long {
  color: #ff5252;
  padding-left: 0.2rem;
  font-size: 0.36rem;
  border-bottom: solid #ecf0f1;
}
.orderinfo {
  margin-left: 0.21rem;
  margin-right: 0.21rem;
  margin-top: 0.21rem;
}
.orderinfo .orderinfo-top {
  float: left;
  border-bottom: solid #ecf0f1;
}
.orderinfo .orderinfo-top .left {
  float: left;
  margin-right: 0.35rem;
}
.orderinfo .orderinfo-top .left img {
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 0.1rem;
}
.orderinfo .orderinfo-top .right {
  float: left;
  width: 7.42rem;
  overflow: hidden;
}
.orderinfo .orderinfo-top .right .right-botton {
  float: left;
  padding-top: 0.42rem;
  color: #5c5c5c;
  font-size: 0.36rem;
}
.orderinfo .orderinfo-top .right .unit_price {
  float: left;
  color: #ff5252;
  padding-top: 0.42rem;
  font-size: 0.36rem;
}
.orderinfo .orderinfo-top .right .specification {
  float: left;
  color: #5c5c5c;
  padding-top: 0.42rem;
  font-size: 0.36rem;
}

.right-top {
  color: #021218;
  font-size: 0.4rem;
}

.orderinfo .orderinfo-top .right .quantity {
  padding-left: 7rem;
  color: #5c5c5c;
  padding-top: 0.42rem;
  font-size: 0.36rem;
}
.OrderInfo1 {
  padding-bottom: 0.3rem;
  padding-top: 0.3rem;
}
.OrderInfo1 .OrderInfoltft {
  float: left;
  color: #5c5c5c;
  font-size: 0.36rem;
  padding-top: 0.2rem;
}
.OrderInforight {
  margin-top: 0.3rem;
}
.OrderInfo1 .OrderInforight .rightfloat .ordecolor {
  margin-top: 1.7rem;
}
.OrderInforight .rightfloat {
  padding-left: 8.7rem;
  padding-top: 0.4rem;
  color: #5c5c5c;
  font-size: 0.36rem;
}
.OrderInfo1 .OrderInforight .rightfloat .pay {
  color: #ff5252;
  font-size: 0.36rem;
}

/* 隐藏部分 */
.conceal {
  font-size: 0.36rem;
  background-color: rgba(18, 183, 245, 0.06);
  /* display: none;  */
  color: #5c5c5c;
  padding-left: 0.3rem;
  padding-top: 0.3rem;
}
.pay-left {
  float: left;
  padding-right: 7rem;
}
.leave-left {
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
}
.pay-right {
  color: #ff5252;
}
/***********************************/

/* 退货处理  退货中的状态*/
.processing {
  background-color: #ffffff;
  margin-top: 0.21rem;
  height: 3.76rem;
}
.processing .sales_return {
  font-size: 0.36rem;
  padding-top: 0.27rem;
  width: 10.26rem;
  color: #5c5c5c;
  padding-bottom: 0.23rem;
  border-bottom: solid #ecf0f1;
  margin-left: 0.31rem;
}
.processing .app {
  background-color: #f4f4f4;
  height: 2.15rem;
  margin-bottom: 0.42rem;
  margin-top: 0.42rem;
}
.processing .app img {
  width: 8.81rem;
  /* height: 0.2rem; */
  padding-left: 1.2rem;
}
.processing .ReturnProcess_logs {
  color: #5c5c5c;
  font-size: 0.32rem;
  padding-top: 0.4rem;
  text-align: center;
  /* display: flex;
  justify-content:center; */
}
.processing .ReturnProcess_logs ul {
  /* flex:auto; */
  float: left;
  width: 33%;
}

/* 买家评论 */
.Order_Comment {
  background-color: #ffffff;
  margin-top: 0.3rem;
}
.border_top {
  border-bottom: 0.04rem solid #12b7f5;
  margin-left: 0.2rem;
  padding-top: 0.21rem;
  padding-bottom: 0.32rem;
  width: 10rem;
  font-size: 0.38rem;
  color: #636363;
}
.comments {
  padding-left: 0.3rem;
  padding-bottom: 0.23rem;
  border-left: 0.1rem solid #12b7f5;
  border-radius: 0.1rem;
  overflow: hidden;
}
.Buyers_information {
  padding-left: 0.31rem;
}
.user_ID {
  padding-top: 0.32rem;
  border-bottom: solid #d6d6d6 0.02rem;
  width: 10rem;
}
.user_ID .user_iocn img {
  width: 1.05rem;
  height: 0.96rem;
  float: left;
}
.user_ID .userinfo {
  margin-bottom: 0.62rem;
}
.user_ID .useid {
  font-size: 0.38rem;
  color: #191919;
  padding-left: 0.36rem;
  float: left;
}

.user_ID .quality {
  font-size: 0.3rem;
  color: #666666;
  float: left;
  padding-left: 1.25rem;
}
.user_ID .qualitynumber {
  color: #ff8533;
  font-size: 0.3rem;
  float: left;
}

.user_ID .speed {
  font-size: 0.3rem;
  color: #666666;
  overflow: hidden;
  padding-left: 0.5rem;
  float: left;
}
.user_ID .speednumber {
  color: #63c230;
  font-size: 0.3rem;
  float: left;
}

.user_ID .serve {
  font-size: 0.3rem;
  color: #666666;
  float: left;
  padding-left: 0.5rem;
}
.user_ID .servenumber {
  font-size: 0.3rem;
  color: #f96268;
}

.comment_content {
  padding-top: 0.41rem;
}
.comment_content .content2 {
  font-size: 0.36rem;
  width: 10.19rem;
  padding-bottom: 0.26rem;
}
.comment_content .content3 {
  color: #191919;
  /* float: left; */
}
.comment_content .content_time {
  /* float: right; */
  color: #9d9d9d;
}
.comment_content .evaluate_img img {
  width: 1.97rem;
  height: 1.81rem;
  margin-right: 0.2rem;
  overflow: hidden;
  padding-bottom: 0.4rem;
}

.Business_reply {
  color: #f57c2a;
  font-size: 0.32rem;
  padding-bottom: 0.41rem;
}

/* 骑手信息 */
.horseman {
  background-color: #ffffff;
  margin-top: 0.3rem;
}
.car {
  font-size: 0.36rem;
  margin-top: 0.32rem;
  color: #12b7f5;
  padding-bottom: 0.32rem;
}
.car-icon {
  float: left;
  overflow: hidden;
  margin-left: 1.77rem;
}
.car-icon img {
  width: 0.39rem;
  height: 0.35rem;
}
.car-messaage {
  font-size: 0.36rem;
  color: #5c5c5c;
  margin-top: 0.32rem;
  padding-bottom: 0.32rem;
}
.car-top .car-left {
  float: left;
  margin-left: 0.31rem;
  padding-right: 3rem;
}
.car-buttom {
  margin-top: 0.35rem;
}
.mode {
  float: left;
  margin-left: 0.31rem;
  margin-right: 3.4rem;
}
.distribution {
  color: #a2a2a2;
  font-size: 0.4rem;
  margin-left: 3.1rem;
  margin-top: 0.24rem;
  padding-bottom: 0.9rem;
  /* display: none; */
}

/* ********************************** */
/* 物流信息 */
.address {
  background-color: #ffffff;
  margin-top: 0.3rem;
  padding-bottom: 0.1rem;
}
.logistics {
  border-bottom: solid #ecf0f1;
}
.border {
  border-bottom: 0.04rem solid #12b7f5;
  margin-left: 0.2rem;
  padding-top: 0.01rem;
  padding-bottom: 0.2rem;
  width: 10rem;
}
.logisticsaddress {
  padding-left: 0.3rem;
  padding-top: 0.3rem;
  padding-bottom: 0.23rem;
  border-left: 0.1rem solid #12b7f5;
  color: #5c5c5c;
  font-size: 0.38rem;
  margin-top: 0.2rem;
  border-radius: 0.1rem;
}
.Gaininformation {
  /* height: 3rem; */
  padding-top: 0.44rem;
  overflow: hidden;
  clear: both;
}
.Gaininformation .adrrleft {
  float: left;
  margin-left: 0.29rem;
}
.Gaininformation .adrrleft img {
  height: 0.6rem;
  width: 0.6rem;
}
.Gaininformation .shippingaddress {
  margin-left: 0.22rem;
  color: #5c5c5c;
  float: left;
  padding-bottom: 0.41rem;
  font-size: 0.36rem;
}
.Gaininformation .shippingaddress2 {
  margin-left: 0.22rem;
  color: #5c5c5c;
  padding-bottom: 0.41rem;
  max-width: 6rem;
  float: left;
  font-size: 0.36rem;
}
.recipients {
  color: #5c5c5c;
  float: left;
  padding-top: 0.44rem;
  padding-left: 0.2rem;
  font-size: 0.36rem;
}
.infotop {
  overflow: hidden;
}
.infotop .Consignee-icon {
  float: left;
  margin-left: 0.3rem;
  margin-top: 0.4rem;
}
.infotop .Consignee-icon img {
  height: 0.6rem;
  width: 0.5rem;
}
.infotop .phone-icon {
  float: left;
  margin-top: 0.44rem;
  margin-left: 0.46rem;
  overflow: hidden;
}
.infotop .phone-icon img {
  height: 0.6rem;
  width: 0.4rem;
  padding-left: 2rem;
}
.infotop .phone {
  color: #5c5c5c;
  float: left;
  padding-left: 0.2rem;
  padding-top: 0.44rem;
  font-size: 0.36rem;
}
.centre {
  padding-bottom: 0.5rem;
  color: #5c5c5c;
  padding-top: 0.44rem;
  overflow: hidden;
  /* border-bottom: solid #ecf0f1; */
}
.centre .Delivery-icon {
  height: 0.6rem;
  width: 0.6rem;
  float: left;
  margin-left: 0.3rem;
}
.centre .Delivery-icon img {
  height: 0.6rem;
  width: 0.6rem;
}
.centre .deliveryaddress {
  padding-left: 0.2rem;
  float: left;
  font-size: 0.36rem;
}
.centre .location {
  max-width: 6.5rem;
  float: left;
  font-size: 0.36rem;
}
.buttom {
  width: 10rem;
  padding-top: 0.7rem;
}
.distance {
  padding-top: 0.4rem;
  float: left;
  color: #a2a2a2;
  padding-left: 0.29rem;
  font-size: 0.36rem;
}
.cm {
  padding-left: 8rem;
  padding-top: 0.4rem;
  color: #a2a2a2;
  font-size: 0.36rem;
}

/* 补差价的收货地址 */
.DifferenceAmount {
  background-color: #ffffff;
  margin-top: 0.3rem;
  padding-bottom: 0.5rem;
}

/* ********************************** */
/* 配送信息 */
.Shippinginformation {
  background-color: #ffffff;
  margin-top: 0.3rem;
  overflow: hidden;
  clear: both;
  padding-bottom: 0.41rem;
}

.motorcycletype .left {
  float: left;
  color: #9b9b9b;
  padding-left: 0.3rem;
  font-size: 0.36rem;
  padding-top: 0.34rem;
}
.motorcycletype .right {
  float: right;
  padding-right: 0.41rem;
  color: #9b9b9b;
  font-size: 0.36rem;
  padding-top: 0.34rem;
}
.aa {
  margin-bottom: 0.5rem;
}
.kg {
  float: left;
  overflow: hidden;
  padding-top: 0.4rem;
}
.kg .weight {
  padding-left: 1rem;
  float: left;
  overflow: hidden;
}
.kg .weight .weight1 {
  float: left;
  color: #5c5c5c;
  font-size: 0.42rem;
}
.kg .weight .weight2 {
  text-align: center;
  color: #9b9b9b;
  font-size: 0.36rem;
}
.length {
  float: left;
  overflow: hidden;
  border-left: solid #616161 0.02rem;
  border-right: solid #616161 0.02rem;
  margin-left: 1rem;
}
.length .shuzhi {
  color: #5c5c5c;
  font-size: 0.42rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.length .ckg {
  text-align: center;
  color: #9b9b9b;
  font-size: 0.36rem;
}
.volume {
  overflow: hidden;
  float: left;
  padding-left: 0.81rem;
}
.volume .bulk {
  color: #9b9b9b;
  font-size: 0.36rem;
}
.volume .Volumenumerical {
  color: #5c5c5c;
  padding-left: 0.25rem;
  font-size: 0.42rem;
}

/* 订单信息 */
.OrderInfo {
  background-color: #ffffff;
  height: 2.47rem;
  margin-bottom: 0.2rem;
  /* padding-bottom: 0.21rem; */
  margin-top: 0.21rem;
  font-size: 0.36rem;
}
.order {
  width: 10.24rem;
  margin-left: 0.31rem;
}
.information {
  color: #5c5c5c;
  padding-top: 0.2rem;
  border-bottom: solid #ecf0f1 0.02rem;
  padding-bottom: 0.31rem;
}
.ordernumber {
  margin-top: 0.2rem;
  color: #a2a2a2;
  float: left;
}
.ordertime {
  margin-top: 0.2rem;
  color: #a2a2a2;
  float: right;
  text-align: right;
}

/* 处理记录  退货状态*/
.Create {
  background-color: #ffffff;
  padding-left: 0.31rem;
  margin-bottom: 0.32rem;
  margin-top: 0.21rem;
}
.Create .Create1 {
  font-size: 0.36rem;
  color: #5c5c5c;
  padding-top: 0.27rem;
  margin-bottom: 0.32rem;
}
.Create .CreateTime .CreateTime1 {
  padding-bottom: 0.32rem;
}
.Create .CreateTime .time1left {
  color: #a2a2a2;
  font-size: 0.28rem;
  float: left;
  padding-right: 0.74rem;
}
.Create .CreateTime .time1right {
  color: #5c5c5c;
  font-size: 0.32rem;
}

/* 留言 */
.leave-world {
  background-color: #ffffff;
  font-size: 0.36rem;
  padding-left: 0.31rem;
  color: #5c5c5c;
  padding-top: 0.41rem;
  /* margin-top: 0.22rem; */
  padding-bottom: 0.46rem;
}

.btn {
  color: #12b7f5;
  width: 2.18rem;
  height: 0.78rem;
  line-height: 0.78rem;
  text-align: center;
  font-size: 0.36rem;
  border: solid 0.01rem #12b7f5;
  border-radius: 0.16rem;
  display: inline-block;
  margin-right: 0.42rem;
}

/* 待付款页面和补差价页面 按钮 */
.buttommessage {
  background-color: #ffffff;
  font-size: 0.36rem;
  padding-top: 0.32rem;
  height: 1rem;
}
.buttommessage .payment {
  float: right;
  color: #5c5c5c;
}
.buttommessage .cancellationoforder {
  float: right;
  border: solid 0.01rem #dddbdb;
}

/* 页面的按钮 */
.cancel_button {
  float: right;
  background-color: #ffffff;
  color: #5c5c5c;
}

/* 商品退货理由 */
.reimburse {
  font-size: 0.36rem;
  line-height: 0.54rem;
  padding-left: 0.3rem;
  color: #a2a2a2;
  background-color: #ffffff;
}
.reimburse .proof {
  padding-left: 1.28rem;
}
.reimburse img {
  width: 1.33rem;
  height: 1.34rem;
  padding-left: 0.29rem;
}

</style>
<style>
page {
  background-color: #ecf0f1;
}
</style>
