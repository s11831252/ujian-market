import Strophe from "./weixin-sdk/libs/strophe";
//import xmldom from "../sdk/libs/xmldom/dom-parser";
// import websdk from "./weixin-sdk/connection";
// import config from "./MPIMConfig";

console.group = console.group || {};
console.groupEnd = console.groupEnd || {};
let config =  mpvue_Mode === 'WX'?require("./MPIMConfig.js").default:require("./WebIMConfig.js").default;
var websdk =  mpvue_Mode === 'WX'? require("./weixin-sdk/connection.js"):require("./web-sdk/websdk3.1.4.js").default;
// console.log(config)
if(!window)  window = {};
let WebIM = window.WebIM = websdk;
window.WebIM.config = config;
//var DOMParser = window.DOMParser = xmldom.DOMParser;
//let document = window.document = new DOMParser().parseFromString("<?xml version='1.0'?>\n", "text/xml");

WebIM.isDebug = function(option){
	if (option) {
		WebIM.config.isDebug = option.isDebug
		openDebug(WebIM.config.isDebug)
	} 

	function openDebug(value){
		function ts(){
			var d = new Date();
			var Hours = d.getHours(); // 获取当前小时数(0-23)
			var Minutes = d.getMinutes(); // 获取当前分钟数(0-59)
			var Seconds = d.getSeconds(); // 获取当前秒数(0-59)
			return (Hours < 10 ? "0" + Hours : Hours) + ":" + (Minutes < 10 ? "0" + Minutes : Minutes) + ":" + (Seconds < 10 ? "0" + Seconds : Seconds) + " ";
		}

		Strophe.Strophe.log = function(level, msg){
			// console.log(ts(), level, msg);
		};

		if (value) {
			Strophe.Strophe.Connection.prototype.rawOutput = function(data){
				try{
					console.group("%csend # " + ts(), "color: blue; font-size: large");
					console.log("%c" + data, "color: blue");
					console.groupEnd();
				}
				catch(e){
					console.log(e);
				}
			};
		}else{
			Strophe.Strophe.Connection.prototype.rawOutput = function(){};
		}
		
	}
}

/**
 * Set autoSignIn as true (autoSignInName and autoSignInPwd are configured below),
 * You can auto signed in each time when you refresh the page in dev model.
 */
WebIM.config.autoSignIn = false;
if(WebIM.config.autoSignIn){
	WebIM.config.autoSignInName = "lwz2";
	WebIM.config.autoSignInPwd = "1";
}


// var stropheConn = new window.Strophe.Connection("ws://im-api.easemob.com/ws/", {
//                 inactivity: 30,
//                 maxRetries: 5,
//                 pollingTime: 4500
//             });
//
// stropheConn.connect(
//   '$t$' + 'YWMtmbQEBKKIEeaGmMtXyg5n1wAAAVlkQvGO2WOJGlMCEJKM4VV9GCMnb_XLCXU',
//   function() {
//     console.log(arguments, 'ggogogo');
//   }, stropheConn.wait, stropheConn.hold);
WebIM.parseEmoji = function(msg){
	if(typeof WebIM.Emoji === "undefined" || typeof WebIM.Emoji.map === "undefined"){
		return msg;
	}
	var emoji = WebIM.Emoji,
		reg = null;
	var msgList = [];
	var objList = [];
	for(var face in emoji.map){
		if(emoji.map.hasOwnProperty(face)){
			while(msg.indexOf(face) > -1){
				msg = msg.replace(face, "^" + emoji.map[face] + "^");
			}
		}
	}
	var ary = msg.split("^");
	var reg = /^[p|e].*g$/;
	for(var i = 0; i < ary.length; i++){
		if(ary[i] != ""){
			msgList.push(ary[i]);
		}
	}
	for(var i = 0; i < msgList.length; i++){
		if(reg.test(msgList[i])){
			var obj = {};
			obj.data = msgList[i];
			obj.type = "emoji";
			objList.push(obj);
		}
		else{
			var obj = {};
			obj.data = msgList[i];
			obj.type = "txt";
			objList.push(obj);
		}
	}
	return objList;
};

WebIM.time = function(){
	var date = new Date();
	var Hours = date.getHours();
	var Minutes = date.getMinutes();
	var Seconds = date.getSeconds();
	var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " "
								+ (Hours < 10 ? "0" + Hours : Hours) + ":" + (Minutes < 10 ? "0" + Minutes : Minutes) + ":" + (Seconds < 10 ? "0" + Seconds : Seconds);
	return time;
};

WebIM.Emoji = {
	path:  mpvue_Mode === 'WX' ?"/static/img/faces/":"./static/img/faces/",
	map: {
		"[):]": "ee_1.png",
		"[:D]": "ee_2.png",
		"[;)]": "ee_3.png",
		"[:-o]": "ee_4.png",
		"[:p]": "ee_5.png",
		"[(H)]": "ee_6.png",
		"[:@]": "ee_7.png",
		"[:s]": "ee_8.png",
		"[:$]": "ee_9.png",
		"[:(]": "ee_10.png",
		"[:'(]": "ee_11.png",
		"[<o)]": "ee_12.png",
		"[(a)]": "ee_13.png",
		"[8o|]": "ee_14.png",
		"[8-|]": "ee_15.png",
		"[+o(]": "ee_16.png",
		"[|-)]": "ee_17.png",
		"[:|]": "ee_18.png",
		"[*-)]": "ee_19.png",
		"[:-#]": "ee_20.png",
		"[^o)]": "ee_21.png",
		"[:-*]": "ee_22.png",
		"[8-)]": "ee_23.png",
		"[del]": "btn_del.png",
		"[(|)]": "ee_24.png",
		"[(u)]": "ee_25.png",
		"[(S)]": "ee_26.png",
		"[(*)]": "ee_27.png",
		"[(#)]": "ee_28.png",
		"[(R)]": "ee_29.png",
		"[({)]": "ee_30.png",
		"[(})]": "ee_31.png",
		"[(k)]": "ee_32.png",
		"[(F)]": "ee_33.png",
		"[(W)]": "ee_34.png",
		"[(D)]": "ee_35.png",
		"[微笑]":"png_u1.png",
		"[撇嘴]":"png_u2.png",
		 "[色]":"png_u3.png",
		"[发呆]":"png_u4.png",
		"[得意]":"png_u5.png",
		"[流泪]":"png_u6.png",
		"[害羞]":"png_u7.png",
		"[闭嘴]":"png_u8.png",
		 "[睡]":"png_u9.png",
		"[大哭]":"png_u10.png",
		"[尴尬]":"png_u11.png",
		"[发怒]":"png_u12.png",
		"[调皮]":"png_u13.png",
		"[呲牙]":"png_u14.png",
		"[惊讶]":"png_u15.png",
		"[难过]":"png_u16.png",
		 "[酷]":"png_u17.png",
		 "[囧]":"png_u18.png",
		"[抓狂]":"png_u19.png",
		 "[吐]":"png_u20.png",
		"[偷笑]":"png_u21.png",
		"[愉快]":"png_u22.png",
		"[白眼]":"png_u23.png",
		"[傲慢]":"png_u24.png",
		"[饥饿]":"png_u25.png",
		 "[困]":"png_u26.png",
		"[惊恐]":"png_u27.png",
		"[流汗]":"png_u28.png",
		"[憨笑]":"png_u29.png",
		"[悠闲]":"png_u30.png",
		"[奋斗]":"png_u31.png",
		"[咒骂]":"png_u32.png",
		"[疑问]":"png_u33.png",
		 "[嘘]":"png_u34.png",
		 "[晕]":"png_u35.png",
		"[抓狂]":"png_u36.png",
		 "[衰]":"png_u37.png",
		"[骷髅]":"png_u38.png",
		"[敲打]":"png_u39.png",
		"[再见]":"png_u40.png",
		"[擦汗]":"png_u41.png",
		"[抠鼻]":"png_u42.png",
		"[鼓掌]":"png_u43.png",
		"[糗大了]":"png_u44.png",
		"[坏笑]":"png_u45.png",
		"[左哼哼]":"png_u46.png",
		"[右哼哼]":"png_u47.png",
		"[哈欠]":"png_u48.png",
		"[鄙视]":"png_u49.png",
		"[委屈]":"png_u50.png",
		"[快哭了]":"png_u51.png",
		"[阴险]":"png_u52.png",
		"[亲亲]":"png_u53.png",
		 "[吓]":"png_u54.png",
		"[可怜]":"png_u55.png",
		"[菜刀]":"png_u56.png",
		"[西瓜]":"png_u57.png",
		"[啤酒]":"png_u58.png",
		"[篮球]":"png_u59.png",
		"[兵乓球]":"png_u60.png",
		"[咖啡]":"png_u61.png",
		 "[饭]":"png_u62.png",
		"[猪头]":"png_u63.png",
		"[玫瑰]":"png_u64.png",
		"[凋谢]":"png_u65.png",
		"[嘴唇]":"png_u66.png",
		"[爱心]":"png_u67.png",
		"[心碎]":"png_u68.png",
		"[蛋糕]":"png_u69.png",
		"[闪电]":"png_u70.png",
		"[炸弹]":"png_u71.png",
		 "[刀]":"png_u72.png",
		"[足球]":"png_u73.png",
		"[瓢虫]":"png_u74.png",
		"[便便]":"png_u75.png",
		"[月亮]":"png_u76.png",
		"[太阳]":"png_u77.png",
		"[礼物]":"png_u78.png",
		"[拥抱]":"png_u79.png",
		 "[强]":"png_u80.png",
		 "[弱]":"png_u81.png",
		"[握手]":"png_u82.png",
		"[胜利]":"png_u83.png",
		"[抱拳]":"png_u84.png",
		"[勾引]":"png_u85.png",
		"[拳头]":"png_u86.png",
		"[差劲]":"png_u87.png",
		"[爱你]":"png_u88.png",
		"[NO]":"png_u89.png",
		"[OK]":"png_u90.png",
		"[嘿哈]":"png_u91.png",
		"[捂脸]":"png_u92.png",
		"[奸笑]":"png_u93.png",
		"[机智]":"png_u94.png",
		"[皱眉]":"png_u95.png",
		 "[耶]":"png_u96.png",
		"[doge]":"png_u97.png",
		"[瞄瞄]":"png_u98.png",
		"[二哈]":"png_u99.png",
		"[撒手]":"png_u100.png",
		"[奥特曼]":"png_u101.png",
	}
};

WebIM.EmojiObj = {
	// 相对 emoji.js 路径

	path: mpvue_Mode === 'WX' ?"/static/img/faces/":"./static/img/faces/",
	map1: {
		"[):]": "ee_1.png",
		"[:D]": "ee_2.png",
		"[;)]": "ee_3.png",
		"[:-o]": "ee_4.png",
		"[:p]": "ee_5.png",
		"[(H)]": "ee_6.png",
		"[:@]": "ee_7.png"
	},
	map2: {
		"[:s]": "ee_8.png",
		"[:$]": "ee_9.png",
		"[:(]": "ee_10.png",
		"[:'(]": "ee_11.png",
		"[<o)]": "ee_12.png",
		"[(a)]": "ee_13.png",
		"[8o|]": "ee_14.png"
	},
	map3: {
		"[8-|]": "ee_15.png",
		"[+o(]": "ee_16.png",
		"[|-)]": "ee_17.png",
		"[:|]": "ee_18.png",
		"[*-)]": "ee_19.png",
		"[:-#]": "ee_20.png",
		"[del]": "del.png"
	},
	map4: {
		"[^o)]": "ee_21.png",
		"[:-*]": "ee_22.png",
		"[8-)]": "ee_23.png",
		"[(|)]": "ee_24.png",
		"[(u)]": "ee_25.png",
		"[(S)]": "ee_26.png",
		"[(*)]": "ee_27.png"
	},
	map5: {
		"[(#)]": "ee_28.png",
		"[(R)]": "ee_29.png",
		"[({)]": "ee_30.png",
		"[(})]": "ee_31.png",
		"[(k)]": "ee_32.png",
		"[(F)]": "ee_33.png",
		"[(W)]": "ee_34.png",
		"[(D)]": "ee_35.png"
	},
	map6: {
		"[del]": "del.png"
	}
};
WebIM.EmojiObj2={
	path: mpvue_Mode === 'WX' ?"/static/img/faces/":"./static/img/faces/",
	group:21,
	map:[
		{
			"[微笑]":"png_u1.png",
			"[撇嘴]":"png_u2.png",
			 "[色]":"png_u3.png",
			"[发呆]":"png_u4.png",
			"[得意]":"png_u5.png",
			"[流泪]":"png_u6.png",
			"[害羞]":"png_u7.png",
			"[闭嘴]":"png_u8.png",
			 "[睡]":"png_u9.png",
			"[大哭]":"png_u10.png",
			"[尴尬]":"png_u11.png",
			"[发怒]":"png_u12.png",
			"[调皮]":"png_u13.png",
			"[呲牙]":"png_u14.png",
			"[惊讶]":"png_u15.png",
			"[难过]":"png_u16.png",
			 "[酷]":"png_u17.png",
			 "[囧]":"png_u18.png",
			"[抓狂]":"png_u19.png",
			 "[吐]":"png_u20.png",
			"[偷笑]":"png_u21.png",
		},
		{
			"[愉快]":"png_u22.png",
			"[白眼]":"png_u23.png",
			"[傲慢]":"png_u24.png",
			"[饥饿]":"png_u25.png",
			 "[困]":"png_u26.png",
			"[惊恐]":"png_u27.png",
			"[流汗]":"png_u28.png",
			"[憨笑]":"png_u29.png",
			"[悠闲]":"png_u30.png",
			"[奋斗]":"png_u31.png",
			"[咒骂]":"png_u32.png",
			"[疑问]":"png_u33.png",
			 "[嘘]":"png_u34.png",
			 "[晕]":"png_u35.png",
			"[抓狂]":"png_u36.png",
			 "[衰]":"png_u37.png",
			"[骷髅]":"png_u38.png",
			"[敲打]":"png_u39.png",
			"[再见]":"png_u40.png",
			"[擦汗]":"png_u41.png",
			"[抠鼻]":"png_u42.png",
		},
		{
			"[鼓掌]":"png_u43.png",
			"[糗大了]":"png_u44.png",
			"[坏笑]":"png_u45.png",
			"[左哼哼]":"png_u46.png",
			"[右哼哼]":"png_u47.png",
			"[哈欠]":"png_u48.png",
			"[鄙视]":"png_u49.png",
			"[委屈]":"png_u50.png",
			"[快哭了]":"png_u51.png",
			"[阴险]":"png_u52.png",
			"[亲亲]":"png_u53.png",
			 "[吓]":"png_u54.png",
			"[可怜]":"png_u55.png",
			"[菜刀]":"png_u56.png",
			"[西瓜]":"png_u57.png",
			"[啤酒]":"png_u58.png",
			"[篮球]":"png_u59.png",
			"[兵乓球]":"png_u60.png",
			"[咖啡]":"png_u61.png",
			 "[饭]":"png_u62.png",
			"[猪头]":"png_u63.png",
		},
		{
			"[玫瑰]":"png_u64.png",
			"[凋谢]":"png_u65.png",
			"[嘴唇]":"png_u66.png",
			"[爱心]":"png_u67.png",
			"[心碎]":"png_u68.png",
			"[蛋糕]":"png_u69.png",
			"[闪电]":"png_u70.png",
			"[炸弹]":"png_u71.png",
			 "[刀]":"png_u72.png",
			"[足球]":"png_u73.png",
			"[瓢虫]":"png_u74.png",
			"[便便]":"png_u75.png",
			"[月亮]":"png_u76.png",
			"[太阳]":"png_u77.png",
			"[礼物]":"png_u78.png",
			"[拥抱]":"png_u79.png",
			 "[强]":"png_u80.png",
			 "[弱]":"png_u81.png",
			"[握手]":"png_u82.png",
			"[胜利]":"png_u83.png",
			"[抱拳]":"png_u84.png",
		},{
			"[勾引]":"png_u85.png",
			"[拳头]":"png_u86.png",
			"[差劲]":"png_u87.png",
			"[爱你]":"png_u88.png",
			"[NO]":"png_u89.png",
			"[OK]":"png_u90.png",
			"[嘿哈]":"png_u91.png",
			"[捂脸]":"png_u92.png",
			"[奸笑]":"png_u93.png",
			"[机智]":"png_u94.png",
			"[皱眉]":"png_u95.png",
			 "[耶]":"png_u96.png",
			"[doge]":"png_u97.png",
			"[瞄瞄]":"png_u98.png",
			"[二哈]":"png_u99.png",
			"[撒手]":"png_u100.png",
			"[奥特曼]":"png_u101.png",
		}
	]
}


// wx.connectSocket({url: WebIM.config.xmppURL, method: "GET"})

WebIM.conn = mpvue_Mode === 'WX'? new WebIM.connection({
	isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
	https: WebIM.config.https,
	url: WebIM.config.xmppURL,
	apiUrl: WebIM.config.apiURL,
	isAutoLogin: true,
	heartBeatWait: WebIM.config.heartBeatWait,
	autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
	autoReconnectInterval: WebIM.config.autoReconnectInterval,
    appKey: WebIM.config.appkey,

}): new websdk.connection({
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    https: WebIM.config.https,
	url: WebIM.config.socketServer,
	apiUrl : WebIM.config.restServer,
    isAutoLogin: true,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    delivery: WebIM.config.delivery,
	useOwnUploadFun: WebIM.config.useOwnUploadFun,
    isDebug: WebIM.config.isDebug,
    isHttpDNS: WebIM.config.isHttpDNS,
    appKey: WebIM.config.appkey,
});

// async response
// WebIM.conn.listen({
//   onOpened: () => dispatch({type: Types.ON_OPEND})
// })

export default WebIM
