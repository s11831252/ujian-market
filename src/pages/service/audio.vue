<template>
  <div class="wifi-symbol">
    <div class="wifi-circle first"></div>
    <div class="wifi-circle second"></div>
    <div class="wifi-circle third"></div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
        .wifi-symbol {
            width: 0.8rem;
            height: 0.8rem;
            box-sizing: border-box;
            overflow: hidden;
            transform: rotate(135deg);
            /* border: 0.01rem solid; */
            position: relative;
        }
        .wifi-circle {
            border: 0.02rem solid #000;
            border-radius: 50%;
            position: absolute;
        }

        .first {
            width: 0.2rem;
            height: 0.2rem;
            /* background: #999999; */
            top: -18%;
            left: -18%;
        }

        .second {
            width: 0.4rem;
            height: 0.4rem;
            top: -28%;
            left: -28%;
            animation: fadeInOut 1s infinite 0.2s;
        }
        .third {
            width: 0.6rem;
            height: 0.6rem;
            top: -38%;
            left: -38%;
            animation: fadeInOut 1s infinite 0.4s;
        }

        @keyframes fadeInOut {
            0% {
                opacity: 0; /*初始状态 透明度为0*/
            }
            100% {
                opacity: 1; /*结尾状态 透明度为1*/
            }
        }

        @keyframes fadeInOut {
            0% {
                opacity: 0; /*初始状态 透明度为0*/
            }
            100% {
                opacity: 1; /*结尾状态 透明度为1*/
            }
        }
</style>