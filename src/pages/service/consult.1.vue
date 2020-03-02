<template>
    <div class="wai">
      <div class="top">欢迎您光临本店，请问有什么能帮助您？</div>
      <chatItem  v-for="(item,index) in ChatHistory" :key="index" :chatdata="item" ></chatItem>
      <!-- 输入框 -->
      <div class="input">
        <!-- 引用图标，需要引用其样式 -->
        <div class="icon">&#xe664;</div>
        <textarea maxlength="1000" auto-focus="’true’" v-model="msg" placeholder="输入新消息"></textarea>
        <div class="icon">&#xe652;</div>
        <div class="icon" @click="WebSocketSendMsg">&#xe726;</div>
      </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
import WebSocketUtil  from '@/utils/socket.js'
import utils from '@/utils/index.js'
import chatItem from '@/pages/service/chat-item'

export default {
    data(){
        return {
            msg:"",
            sId:null,
            webSocket:null,
            ChatHistory:[]
        }
    },
    components:{
      chatItem
    },
    computed:{
        ...mapState({
            Ticket: state => state.User.SingleTicket,
            UserInfo:state => state.User.UserInfo
        }),
    },
    methods:{
        //发送WebSocket消息
         WebSocketSendMsg() {

            //消息内容
            var msgData = {
                to: this.sId,
                msg:this.msg
            }
            //消息类型
            var msg = {
                data:msgData,
                action:1,//聊天
            }
            var msgStr =  JSON.stringify(msg);

            //调用WebSocket发送消息
            this.webSocket.send(msgStr);
        },
        //建立WebSocket连接成功
        WebSokectOnOpen(args1,args2) {
            console.log("WebSocketCreate Success!");

            //消息内容
            var msgData = {
                to: this.sId,
                start:this.ChatHistory.length
            };

            //消息类型
            var msg = {
                data:msgData,
                action:2,//聊天历史记录
            }
             ;
            var msgStr =  JSON.stringify(msg);

            //调用WebSocket发送消息
            this.webSocket.send(msgStr);
        },
 
        //监听服务端发送的消息
         WebSocketOnMessage(event,resultdata) {
           console.log(event,resultdata);
            if(resultdata.ret==0)
            {
              if(resultdata.action==1)
              {
                this.msg="";
                let _data = this.ChatHistory;
                _data.push(resultdata.data)
                utils.setItem(this.sId,JSON.stringify(_data));
                
              }else  if(resultdata.action==2)
              {
                let _data = this.ChatHistory;
                resultdata.data.forEach(item => {
                  _data.push(item);
                });
                utils.setItem(this.sId,JSON.stringify(_data));
              }
            }
        },
        //监听到WebSocket链接断开
        WebSocketOnClose(args1,args2) {
            console.log('和服务器断开连接');
        }
    },
    mounted(){
        if (this.sId || (this.$route.query && this.$route.query.sId.length > 0)) 
        {
          this.sId = this.sId || this.$route.query.sId;
          let _val = utils.getItem(this.sId);
          if(_val)
          {
            let _data = JSON.parse(_val);
            this.ChatHistory  = _data;
          }
        }
        this.webSocket = new WebSocketUtil(this.Ticket,this.WebSokectOnOpen,this.WebSocketOnMessage,this.WebSocketOnClose);
    }
}
</script>

<style scoped>
.wai{
  background-color: #ecf0f1;
    height: 100%;
    padding-top: 0.49rem;
}
.top {
  width: 6.38rem;
  height: 0.68rem;
  background-color: #c9c9c9;
  border-radius: 0.1rem;
  font-size: 0.34rem;
  color: #ffffff;
  text-align: center;
  line-height: 0.68rem;
  /* margin-top: 0.49rem; */
  margin-left: 2.21rem;
}

.input {
  width: 100%;
  border-top: 0.02rem solid #898989;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.2rem;
  background-color: #fdfdfd;
  opacity: 1;
  position: fixed;
  bottom: 0rem;
  z-index: 99;
}
.input textarea {
  padding: 0.1rem;
  height: fit-content;
  min-height: 1rem;
  max-height: 2rem;
  width: 8rem;
  font-size: 0.4rem;
  /* 允许长单词换行到下一行 */
  word-wrap: break-word;
  word-break: break-all;
  overflow-y: visible;
  border-radius: 0.15rem;
  border: 0.02rem solid #898989;
  margin-right: 0.2rem;
  background-color: #ffffff;
}
.icon {
  font-size: 0.7rem;
  margin-right: 0.2rem;
}
</style>
