<template>
    <div class="index">
        <!--<div>
            {{vuser|json}}
        </div>
        <div>
            <input type="text" v-model="user.name">
            <input type="text" v-model="user.said">
        </div>
        <button v-touch:tap="updateUser()">保存</button>-->
        <img-crop><div class="upload-btn">上传图片</div></img-crop>
    </div>
</template>
<script>
import ImgCrop from '../components/imgCrop.vue'
import { setUser } from '../vuex/actions.js'
    export default{
        components:{
            ImgCrop
        },
        data(){
            return {
                user:{
                    name:'小黑',
                    said:'hoho'
                }
            }
        },
        vuex:{
            getters:{
                vuser: ({ user }) => user
            },
            actions:{
                setUser
            }
        },
        methods:{
            updateUser(){
                this.setUser(this.user)
            }
        }
    }
</script>
<style lang="less">
.upload-btn{
    width: 80%;
    margin: 2rem auto;
    border: 1px solid green;
    background-color: #fff;
    color: green;
    line-height: 2rem;
    text-align: center;
}
</style>