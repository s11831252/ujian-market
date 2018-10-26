<template>
    <div class="drop">
        <div class="drop-selected" @click="show">
            <span class="drop-label">{{selectItem?selectItem.text:''}}</span>
            <i class="icon">&#xe601;</i>
        </div>
        <ul v-if="showed" class="drop-options">
            <li class="drop-option" v-for="(item,index) in options" :key="index" @click="select(index)">{{item.text}}</li>
        </ul>
    </div>
</template>
<script>
export default {
    props:{
        options:Array,
        onSelected:Function
    },
    data(){
        return {
            selectIndex:0,
            showed:false,
        }
    },
    computed:{
        selectItem(){
            if(this.options&&this.options.length>0)
            {
                this.onSelected(this.options[this.selectIndex]);                

                return this.options[this.selectIndex]
            }
            else
            {
                return this.options[0]
            }
        },
        _options:{
            get(){
                return this.options;
            },
            set(newvalue){

            }
        }
    },
    methods:{
        select(index){
             if(this.selectIndex!=index)
             {
                this.selectIndex=index;
             }
            this.showed=!this.showed;

        },
        show(){
            this.showed=!this.showed;
        }
    },
    mounted(){
        
    }
}
</script>
<style lang="less" scoped>
.drop{
    margin-left:10px;
    display: inline-block;
    position: relative;
    border-radius: 5px;
    border: 1px solid #c1c1c1;
    .drop-selected{
        .drop-label{
        padding: 0px 15px;
        border-right: 1px solid #c1c1c1;
        }
        i{
            padding: 5px 0;
            display: inline-block;
        }
    }
    .drop-options{
        width: 100%;
        position: absolute;    
        background-color: #fff;
        border: 1px solid #c1c1c1;
        border-bottom: none;
        left: -1px;
        .drop-option{
            border-bottom: 1px solid #c1c1c1;
            padding: 5px 0 5px 5px;
        }
    }
}
</style>
