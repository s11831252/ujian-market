<template>
  <div>
    <div class="wai">
      <div class="top">欢迎您光临本店，请问有什么能帮助您？</div>
      <!-- 用户对话框 -->
      <div class="yonghu">
        <p class="time">下午03:07</p>
        <div class="dialog_box">
          <p class="username">用户名称</p>
          <span class="read">已读</span>
          请传参传参错错错错错错错错错错错错错错错错错错错错错错错错错错错
          <img
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1570536053455&di=e7deaf157fc09c2547ac84bfadd77de5&imgtype=0&src=http%3A%2F%2Fp2.so.qhimgs1.com%2Ft015b444b7249801792.jpg"
            alt
          />
        </div>
      </div>
      <!-- 管理员对话框 -->
      <div class="Administrator">
        <div class="dialog_boxNr">
          <p class="timeNr">下午03:07</p>
          <p class="usernameNr">管理员名称</p>
          <span class="readNr">已读</span>
          南宁
          <img
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1570536053455&di=e7deaf157fc09c2547ac84bfadd77de5&imgtype=0&src=http%3A%2F%2Fp2.so.qhimgs1.com%2Ft015b444b7249801792.jpg"
            alt
          />
        </div>
      </div>

      
      
    </div>
    <!-- 输入框 -->
    <div class="input">
      <!-- 引用图标，需要引用其样式 -->
      <div class="icon">&#xe664;</div>
      <textarea maxlength="1000" auto-focus="’true’" placeholder="输入新消息"></textarea>
      <div class="icon">&#xe652;</div>
      <div class="icon">&#xe726;</div>
    </div>
  </div>
</template>
<style scoped>
.top {
  width: 6.38rem;
  height: 0.68rem;
  background-color: #c9c9c9;
  border-radius: 0.1rem;
  font-size: 0.34rem;
  color: #ffffff;
  text-align: center;
  line-height: 0.68rem;
  margin-top: 0.49rem;
  margin-left: 2.21rem;
}
.yonghu {
  margin: 0.4rem auto;
  float: right;
  word-break:break-all;
}
.time {
  font-size: 0.3rem;
  color: #5c5c5c;
  /* 让内容强制不换行 */
  white-space: nowrap;
  margin-left: 0.1rem;
  margin-bottom: 0.47rem;
}
.username {
  font-size: 0.3rem;
  color: #5c5c5c;
  /* 让内容强制不换行 */
  white-space: nowrap;
  position: absolute;
  right: 0.15rem;
  top: -0.4rem;
}
.read {
  font-size: 0.3rem;
  color: #a2a2a2;
  position: absolute;
  left: -0.74rem;
  top: 50%;
}
.dialog_box {
  max-width: 6.5rem;
  /* css3属性，fit-content既是让宽度随内容大小变化 */
  width: fit-content;
  font-size: 0.4rem;
  color: #5c5c5c;
  background-color: #d2e0e1;
  border-radius: 0.1rem;
  padding: 0.5rem;
  position: relative;
  margin-right: 1.5rem;
}
/* 右侧小三角形 */
.dialog_box:after {
  border: 0.1rem solid transparent;
  border-left: 0.25rem solid #d2e0e1;
  position: absolute;
  content: "";
  top: 50%;
  margin-top: -0.2rem;
  left: 100%;
}
.yonghu img {
  width: 1.08rem;
  height: 1.09rem;
  border-radius: 50%;
  background-color: #5c5c5c;
  position: absolute;
  right: -1.4rem;
  top: 0.2rem;
}
.Administrator {
  width: 100%;
  margin: 0.8rem auto 0rem;
  float: left;
  word-break:break-all;
}
/* 让最后一个元素距离输入框有一个距离 */
.yonghu:last-child {
  margin-bottom: 2rem !important;
}
.Administrator:last-child {
  margin-bottom: 2rem !important;
}

.timeNr {
  font-size: 0.3rem;
  color: #5c5c5c;
  /* 让内容强制不换行 */
  white-space: nowrap;
  position: absolute;
  right: 0.2rem;
  top: -0.8rem;
}
.usernameNr {
  font-size: 0.3rem;
  color: #5c5c5c;
  /* 让内容强制不换行 */
  white-space: nowrap;
  position: absolute;
  left: 0.15rem;
  top: -0.4rem;
}
.readNr {
  font-size: 0.3rem;
  color: #a2a2a2;
  position: absolute;
  right: -0.74rem;
  top: 40%;
}
.dialog_boxNr {
  max-width: 6.5rem;
  /* css3属性，fit-content既是让宽度随内容大小变化 */
  width: fit-content;
  font-size: 0.4rem;
  color: #5c5c5c;
  background-color: #fdfdfd;
  border-radius: 0.1rem;
  padding: 0.35rem;
  position: relative;
  margin-left: 1.5rem;
}
/* 左侧小三角形 */
.dialog_boxNr:after {
  border: 0.1rem solid transparent;
  border-right: 0.25rem solid #fdfdfd;
  position: absolute;
  content: "";
  top: 50%;
  margin-top: -0.2rem;
  right: 100%;
}
.Administrator img {
  width: 1.08rem;
  height: 1.09rem;
  border-radius: 50%;
  background-color: #5c5c5c;
  position: absolute;
  left: -1.4rem;
  top: 0.2rem;
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