<!--
 * @Author: your name
 * @Date: 2021-02-04 10:52:56
 * @LastEditors: your name
 * @LastEditTime: 2021-02-04 11:03:53
 * @Description: file content
-->
<template>
    <web-view :src="webviewUrl"></web-view>
</template>
<script>
export default {
    data(){
        return {
            webviewUrl:""
        }
    },
    mounted(){
        console.log(this.$route.query)
        if(this.$route.query.webviewUrl)
            this.webviewUrl = decodeURIComponent(this.$route.query.webviewUrl)
    }
}
</script>
