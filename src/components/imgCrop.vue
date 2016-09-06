<template>
    <div class="img-upload">
        <input type="file" accept="image/*" 
               @change="selectImg($event)"
               v-el:up-input 
               class="hide">
        <div v-touch:tap="slotClick()">
            <slot></slot>
        </div>
        <div class="img-preview">
            <img :src="previewSrc" v-show="showImg">
        </div>
        <div class="crop-box" v-show="showCover">
            <div class="cut-box" v-el:cut-box @touchstart="tStart($event)" @touchmove="tMove($event)" @touchend="tEnd($event)">
                <img class="source-img" v-el:simg :style="imgStyle" @load="initImg()">
                <div class="top-outline"></div>
            </div>
            <canvas v-el:cutter class="hide" :width="size" :height="size"></canvas>
            <div class="btn-box">
                <!-- 此处用 @click 因为 v-touch 与页面内touch事件冲突 -->
                <div class="crop-btn" @click="getCrop()">确定</div>
                <div class="crop-btn cancel" @click="cancel()">取消上传</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            size:{
                type:Number,
                default: 300
            }
        },
        data() {
            return {
                showCover: false,
                showImg:false,
                imgStyle:{
                    left: '0px',
                    top: '0px',
                    width: '100%',
                    paddingTop: '80%'
                },
                initPos:{
                    top: 0,
                    left: 0
                },
                initTouchPos:{
                    x:0,
                    y:0
                },
                previewSrc:'',
                showSize:0
            }
        },
        methods: {
            slotClick(){
                return this.$els.upInput.click()
            },
            selectImg(e) {
                var simg = this.$els.simg;
                var file = e.target.files[0];
                var fr = new FileReader();
                fr.readAsDataURL(file);
                fr.onload = () => {
                    simg.src = fr.result;
                    this.previewSrc = fr.result;
                    this.showCover = true
                }
            },

            initImg(){
                var simg = this.$els.simg;
                var nW = simg.naturalWidth;
                var nH = simg.naturalHeight;
                if( nW - nH > 0 ){
                    // 横向长方形
                    var ratio = this.showSize / nH;
                    this.$set('imgStyle.height',this.showSize + 'px');
                    this.$set('imgStyle.width',nW * ratio + 'px');
                    this.$set('imgStyle.top','0px');
                    this.$set('imgStyle.left',(nH - nW) / 2 * ratio + 'px');
                    this.initPos.top = 0;
                    this.initPos.left = (nH - nW) / 2 * ratio;
                }else{
                    // 纵向长方形以及正方形
                    var ratio = this.showSize / nW;
                    this.$set('imgStyle.width', this.showSize + 'px');
                    this.$set('imgStyle.height',nH * ratio + 'px');
                    this.$set('imgStyle.left','0px');
                    this.$set('imgStyle.top',(nW - nH) / 2 * ratio + 'px');
                    this.initPos.left = 0;
                    this.initPos.top = (nW - nH) / 2 * ratio;  
                }
            },
            getCrop(){
                var _vm = this;
                var simg = this.$els.simg;
                var nW = simg.naturalWidth;
                var nH = simg.naturalHeight;
                var oSize = nW > nH ? nH : nW;
                var x = (- parseInt(this.imgStyle.left) / this.size)  * oSize ;
                var y = (- parseInt(this.imgStyle.top) / this.size)  * oSize ;

                var img = new Image();
                var cutter = this.$els.cutter;
                var ctx = cutter.getContext('2d');

                img.src = this.previewSrc;
                ctx.drawImage(img,x,y,oSize,oSize,0,0,this.size,this.size);
                // 预览效果
                this.previewSrc = cutter.toDataURL();
                this.showImg = true
                this.showCover = false
                
                // ajax Upload
                // cutter.toBlob(function(blob){
                //     var fm = new FormData();
                //     fm.append('file',blob);
                //     var api = HOST + '/APIRest/image';
                //     $.ajax({
                //         url:api,
                //         type:'POST',
                //         data:fm,
                //         processData : false,
                //         contentType : false,
                //         success:function(res){
                //             res = JSON.parse(res);
                //             console.log('avatar res',res)
                //             if(res.msg == '上传成功'){
                //                 _vm.$dispatch('avatar-uploaded',res.data.imgurl);
                //                 _vm.showCover = false
                //             }else{
                //                 alert('上传失败,请刷新重试')
                //             }
                //         },
                //         error:function(){
                //             alert('网络不好,请稍后重试')
                //         }
                //     })
                // },"image/jpeg", 0.8);
            },
            cancel(){
                this.showCover = false
            },
            tStart(e){
                e.preventDefault();
                this.initTouchPos ={
                    x:e.touches[0].clientX,
                    y:e.touches[0].clientY
                }
            },
            tMove(e){
                e.preventDefault();
                var simg = this.$els.simg;
                var cW = simg.clientWidth;
                var cH = simg.clientHeight;
                if(cW - cH > 0){
                    var maxOffset = cW - cH;
                    var offsetLeft = e.touches[0].clientX - this.initTouchPos.x;
                    var left = this.initPos.left + offsetLeft;
                    left = left > 0 ? 0 : left;
                    left = left + maxOffset < 0 ? -maxOffset : left;
                    // console.log('left',left,'maxOffset',maxOffset)
                    this.$set('imgStyle.left',left + 'px');
                }else{
                    var maxOffset = cH - cW;
                    var offsetTop = e.touches[0].clientY - this.initTouchPos.y;
                    var top = this.initPos.top + offsetTop;
                    top = top > 0? 0: top;
                    top = top + maxOffset < 0 ? -maxOffset: top;
                    this.$set('imgStyle.top',top + 'px');
                }
            },
            tEnd(e){
                e.preventDefault();
                this.initPos = {
                    top: parseInt(this.imgStyle.top),
                    left: parseInt(this.imgStyle.left)
                }
                this.initTouchPos = {
                    x:0,
                    y:0
                }
            },
        },
        ready(){
            /** 此处 showSize 通过 #app元素获取是因为 
             * cutBox 在 ready() 方法时不能保证 CSS 渲染完成
             **/
            this.showSize = document.getElementsByTagName('body')[0].scrollWidth * 0.8;
            var _vm = this;
            var cutBox = this.$els.cutBox;
            var simg = this.$els.simg;
            _vm.$set('imgStyle.paddingTop','0px');
            _vm.$set('imgStyle.height',this.showSize + 'px');
        }
    }
</script>
<style lang="less">
    @import '../assets/css/normalize.css';
    @maincolor: green;
    .img-upload{
        .hide{
            display: none;
        }
    
    }
    .img-preview{
        text-align: center;
    }
    .img-preview>img{
        max-width: 100%;
    }
    .crop-box {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow: hidden;
        background-color: #fff;
        z-index: 7;

        .cut-box {
            position: absolute;
            top: 4rem;
            left: 0;
            right: 0;
            width: 80%;
            padding-top: 80%;
            margin: auto;
            font-size: 0;
        }
        .top-outline {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 1px solid @maincolor;
            box-shadow: 0 0 0 999px rgba(233,233,233, .6);
        }
        .source-img {
            position: absolute;
            top: 0;
            left: 0;
        }
        .btn-box{
            position: absolute;
            left: 0;right: 0;
            padding: 10%;
            bottom: 0;
            line-height: 2.2rem;
            background-color: rgb(233,233,233);
        }
        .crop-btn {
            background-color: #fff;
            text-align: center;
            transition: all ease 0.3s;
            margin-bottom: 1rem;
            border: 1px solid @maincolor;
            color: @maincolor;
            &:active{
                background-color: @maincolor;
                color: #fff;
            }
            &.cancel{
                background-color: #fff;
                border: 1px solid @maincolor;
            }
            &.cancel:active{
                background-color: @maincolor;
                color: #fff;
            }
        }
    }
</style>