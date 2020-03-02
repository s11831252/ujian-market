
/**
 *
 *
 * @class WebSocket封装类
 */
class WebSocketUtil{
    /**
     *创建一个WebSocket实例,用于通讯
     * @param {*} token u建token
     * @param {*} onopen socket连接成功回调
     * @param {*} onmessage socket接收消息回调
     * @param {*} onclose socket关闭回调
     * @memberof WebSocketUtil
     */
    constructor(token,onopen,onmessage,onclose) { 
        this.token=token;
        this.onopen = onopen;
        this.onmessage = onmessage;
        this.onclose = onclose;
        let webSocket = new WebSocket(`ws://127.0.0.1:8181/?token=${this.token}`);
        webSocket.onopen = this.onopen;
        webSocket.onmessage = event =>{ 
          var dataObj = JSON.parse(event.data);
          this.onmessage(event,dataObj); 
        };
        webSocket.onclose = this.onclose;

        return webSocket;
    }
}

module.exports= WebSocketUtil;
