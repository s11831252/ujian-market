// let WebIM = require("../../utils/WebIM")["default"];
// let msgType = require("msgtype");
import WebIM from "@/utils/hx/WebIM";
import msgType from "./msgtype";

// module.exports =
export default function(sendableMsg, type, myName){
	var time = WebIM.time();
	var renderableMsg = {
		info: {
			from: sendableMsg.body.from,
			to: sendableMsg.body.to
		},
		username: sendableMsg.body.from == myName ? sendableMsg.body.to : sendableMsg.body.from,
		yourname: sendableMsg.body.from,
		msg: {
			type: type,
			data: getMsgData(sendableMsg, type),
			ext: sendableMsg.body.ext,
			sending:sendableMsg.body.sending
		},
		style: sendableMsg.body.from == myName ? "self" : "",
		time: time,
		id:sendableMsg.id,
		mid: sendableMsg.type + sendableMsg.id,
		chatType: sendableMsg.body.chatType,
		ext: sendableMsg.body.ext
	};
	if(type == msgType.IMAGE){
		renderableMsg.msg.size = {
			width: sendableMsg.body.body.size.width,
			height: sendableMsg.body.body.size.height,
		};
	}else if (type == msgType.AUDIO) {
		renderableMsg.msg.length = sendableMsg.body.length;

	}else if (type == msgType.FILE){
		renderableMsg.msg.data = [{data: "[当前不支持此格式消息展示]", type: "txt"}];
		renderableMsg.msg.type = 'txt';
	}
	return renderableMsg;

	function getMsgData(sendableMsg, type){
		if(type == msgType.TEXT){
			return WebIM.parseEmoji(sendableMsg.value.replace(/\n/mg, ""));
		}
		else if(type == msgType.EMOJI){
			return sendableMsg.value;
		}
		else if(type == msgType.IMAGE || type == msgType.VIDEO || type == msgType.AUDIO){
			return sendableMsg.body.body.url;
		} else if (type == msgType.FILE) {
			return sendableMsg.body.body.msg
		}
		else if(type==msgType.LOCATION)
		{
			return {
				lat: sendableMsg.body.lat,
				lng: sendableMsg.body.lng,
				addr:sendableMsg.body.addr
			};

		}
		return "";
	}
};
