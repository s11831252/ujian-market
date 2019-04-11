<template>
  <div class="index">
    <div class="content">
      <div class="fill">
        <div class="fillDemo">
          <div class="fill_title">店主姓名:</div>
          <p class="fill_name">程方益</p>
        </div>
        <div class="fillDemo">
          <div class="fill_title">店铺名称:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <input class="fill_input" type="text">
              <p class="fill_fuhao">※</p>
            </div>
            <p class="fill_hint">注：最多10个字</p>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">店铺LOGO:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <img class="fill_addimg" src="img/addImg.png" alt>
              <p class="fill_fuhao">※</p>
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">手机号码:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <input class="fill_input" type="text">
              <p class="fill_fuhao">※</p>
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">固定电话:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <input class="fill_input" type="text">
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">店铺地址:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <div class="selectDiv">
                <select>
                  <option value="1">广西壮族自治区</option>
                  <option value="1">广东</option>
                </select>
                <div class="sjxDiv">
                  <img class="sjx" src="img/next_bottom.png" alt>
                </div>
              </div>
              <div class="selectDiv">
                <select>
                  <option value="1">南宁</option>
                  <option value="1">玉林</option>
                </select>
                <div class="sjxDiv">
                  <img class="sjx" src="img/next_bottom.png" alt>
                </div>
              </div>
              <div class="fillBtn">点击设置</div>
              <input class="fill_input2" type="text">
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">店铺类型:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <div class="selectDiv2">
                <select>
                  <option value="1">选择类型</option>
                  <option value="2">选择类型</option>
                </select>
                <div class="sjxDiv">
                  <img class="sjx" src="img/next_bottom.png" alt>
                </div>
              </div>
              <p class="fill_fuhao">※</p>
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">主营商品:</div>
          <div class="fill_boxDiv">
            <div class="fill_box">
              <div class="selectDiv2">
                <select>
                  <option value="1">主营商品</option>
                  <option value="2">机械设备</option>
                  <option value="2">劳保安防...</option>
                  <option value="2">几点设备</option>
                  <option value="2">电工电气</option>
                  <option value="2">机械设备</option>
                  <option value="2">机械设备</option>
                </select>
                <div class="sjxDiv">
                  <img class="sjx" src="img/next_bottom.png" alt>
                </div>
              </div>
              <div class="selectDiv2">
                <select>
                  <option value="1">主营商品</option>
                  <option value="2">机械设备</option>
                  <option value="2">劳保安防...</option>
                  <option value="2">几点设备</option>
                  <option value="2">电工电气</option>
                  <option value="2">机械设备</option>
                  <option value="2">机械设备</option>
                </select>
                <div class="sjxDiv">
                  <img class="sjx" src="img/next_bottom.png" alt>
                </div>
              </div>
              <p class="fill_fuhao">※</p>
            </div>
          </div>
        </div>
        <div class="fillDemo">
          <div class="fill_title">店铺介绍:</div>
          <div class="fill_editDiv">
            <div class="fill_edit" contenteditable="true"></div>
            <div class="fill_edit_hint">0/200</div>
          </div>
        </div>
      </div>
      <div class="nextBtn">下一步</div>
    </div>
    <div class="tc_agree2">输入店铺介绍在200字内</div>
  </div>
</template>
<script>
export default {};
</script>
<style>
</style>
