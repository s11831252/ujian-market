//  let Disp = require("../../utils/hx/Dispatcher");
//  let disp = require("../../utils/hx/broadcast");
import Disp from "../../utils/hx/Dispatcher";
import disp from "../../utils/hx/broadcast";
import msgPackager from "./msgpackager";
import msgType from "./msgtype";
import utils from '../../utils/index'
let msgStorage = new Disp();
msgStorage.saveReceiveMsg = function(receiveMsg, type){
	let sendableMsg;
	let myName = utils.getItem("myUsername");
	if(receiveMsg.from==myName)
	{
	  return;
	}
	if(type == msgType.IMAGE){
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			body: {
				id: receiveMsg.id,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: receiveMsg.type,
				ext: receiveMsg.ext,
				chatType: receiveMsg.type,
				toJid: "",
				body: {
					type: type,
					url: receiveMsg.url,
					filename: receiveMsg.filename,
					filetype: receiveMsg.filetype,
					size: {
						width: receiveMsg.width,
						height: receiveMsg.height
					},
				},
			},
		};
	}
	else if(type == msgType.TEXT || type == msgType.EMOJI){
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			body: {
				id: receiveMsg.id,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: receiveMsg.type,
				ext: receiveMsg.ext,
				chatType: receiveMsg.type,
				toJid: "",
				body: {
					type: type,
					msg: receiveMsg.data,
				},
			},
			value: receiveMsg.data
		};
	}
	else if (type == msgType.FILE) {
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			body: {
				id: receiveMsg.id,
				length: receiveMsg.file_length,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: receiveMsg.type,
				ext: receiveMsg.ext,
				chatType: receiveMsg.type,
				toJid: "",
				body: {
					type: type,
					url: receiveMsg.url,
					filename: receiveMsg.filename,
					msg: "当前不支持此格式消息展示",
				},
			},
			value: receiveMsg.data
		};
	}
	else if(type == msgType.AUDIO||type ==msgType.VIDEO){
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			accessToken: receiveMsg.token || receiveMsg.accessToken,
			body: {
				id: receiveMsg.id,
				length: receiveMsg.length,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: receiveMsg.type,
				ext: receiveMsg.ext,
				chatType: type,
				toJid: "",
				body: {
					type: type,
					url: receiveMsg.url,
					filename: receiveMsg.filename,
					filetype: receiveMsg.filetype,
					from: receiveMsg.from,
					to: receiveMsg.to
				},
			},
		};
	}else if(type == msgType.LOCATION){
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			body: {
				id: receiveMsg.id,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: receiveMsg.type,
				ext: receiveMsg.ext,
				chatType: receiveMsg.type,
				toJid: "",
				body: {
					type: type,
					lat: receiveMsg.lat,
					lng: receiveMsg.lng,
					addr:receiveMsg.addr,
				},
			},
		};
	}
	else{
		return;
	}
	this.saveMsg(sendableMsg, type, receiveMsg);
};
msgStorage.saveMsg = function(sendableMsg, type, receiveMsg){
	//console.log('sendableMsgsendableMsg', sendableMsg)
	let me = this;
	let myName = utils.getItem("myUsername");
	let sessionKey;
	// 仅用作群聊、聊天室接收消息，发消息没有 receiveMsg
	if(receiveMsg && (receiveMsg.type == "groupchat"|| receiveMsg.type == "chatroom")){
		sessionKey = receiveMsg.to + myName;
	}
	// 群聊发 & 单发 & 单收
	else{
		sessionKey = sendableMsg.body.from == myName
			? sendableMsg.body.to + myName
			: sendableMsg.body.from + myName;
	}
	let curChatMsg = utils.getItem(sessionKey) || [];
	let renderableMsg = msgPackager(sendableMsg, type, myName);
	if(type == msgType.AUDIO) {
		renderableMsg.msg.length = sendableMsg.body.length;
		renderableMsg.msg.token = sendableMsg.accessToken;
	}
	curChatMsg.push(renderableMsg);
	//console.log('renderableMsgrenderableMsg', renderableMsg)
	// if(type == msgType.AUDIO){
	// 	renderableMsg.msg.token = sendableMsg.accessToken;
		//如果是音频则请求服务器转码
		// wx.downloadFile({
		// 	url: sendableMsg.body.body.url,
		// 	header: {
		// 		"X-Requested-With": "XMLHttpRequest",
		// 		Accept: "audio/mp3",
		// 		Authorization: "Bearer " + sendableMsg.accessToken
		// 	},
		// 	success(res){
		// 		// wx.playVoice({
		// 		// 	filePath: res.tempFilePath
		// 		// });
		// 		renderableMsg.msg.url = res.tempFilePath;
				
		// 		save();
		// 	},
		// 	fail(e){
		// 		console.log("downloadFile failed", e);
		// 	}
		// });
	// }
	// else{
	// 	save();
	// }

	save();
	function save(){
		if(!sendableMsg.body.roomType)
			utils.setItem(sessionKey,curChatMsg)
		if (type == msgType.AUDIO || type == msgType.VIDEO) {
			disp.fire('em.chat.audio.fileLoaded');
		}
		me.fire("newChatMsg", renderableMsg, type, curChatMsg, sessionKey,receiveMsg);
	}
};

module.exports = msgStorage;
