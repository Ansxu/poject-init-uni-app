<template>
		<view class="">
        <view class="common-dialog pay-dialog">
            <view class="dialog-title">请输入支付密码</view>
			<view class="pay-money" v-if="isJifen">{{allprice}}<text class="fz12">积分</text></view>
            <view class="pay-money" v-else>￥{{allprice}}</view>
            <view class="pay-password">
				<input type="number" maxlength="6" class="real-ipt" v-model="Password" :focus="focus">
                <view class="surface-ipts">
                    <view class="surface-ipt">
                        <input type="password" disabled=true v-model="PasswordArr[0]">
                        <input type="password" disabled=true v-model="PasswordArr[1]">
                        <input type="password" disabled=true v-model="PasswordArr[2]">
                        <input type="password" disabled=true v-model="PasswordArr[3]">
                        <input type="password" disabled=true v-model="PasswordArr[4]">
                        <input type="password" disabled=true v-model="PasswordArr[5]">
                    </view>
                </view>
            </view>
           <!-- <view class="btns">
                <button class="cancel-btn" @click="hide">取消</button>
                <button class="confirm-btn" @click="paybtn">付款</button>
            </view> -->
        </view>
    </view>
</template>

<script>
	export default {
		props:{
			allprice:{
				type: String,
				default: "0.00"
			},
			isJifen:{
				type:Boolean,
				default:false
			},
			focus:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				Password:"",//密码
				PasswordArr:[],//密码数组
			};
		},
		watch: {
			Password(newVal) {
				this.PasswordArr=newVal.split("");
				if(this.Password.length==6){
					this.$emit('success',this.Password);
					setTimeout(()=>{
						this.hide();
					},500)
				}
			}
		},
		mounted(){
		},
		methods:{
			hide(){
				this.$emit('close');//关闭弹窗
				this.Password='';
				this.PasswordArr=[];
			},
			paybtn(){
				if(this.PasswordArr.length===6){
					this.$emit('success',this.Password);
				}else{
					uni.showToast({
						title: "请输入支付密码！",
						icon: "none",
						duration: 1500
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.common-dialog{
    width: 680upx;
    text-align: center;
    background: #ffffff;
    border-radius: 12upx;
    border: 1px solid #f2f2f2;
	padding-bottom:60upx;
	margin-bottom:60%;
}
.dialog-title{
    height: 120upx;
    line-height: 120upx;
    color: #333333;
    font-size: 40upx;
    border-bottom: 1px solid #f2f2f2;
}
.pay-money{
    color: #333333;
    font-size: 50upx;
    margin: 40upx 0;
    font-weight: bold;
}
.pay-password{
    width: 600upx;
    height: 102upx;
    border: 1upx solid #999999;
	border-right: none;
    margin: 0 auto;
    position: relative;
}

.pay-password .real-ipt{
    position: absolute;
    top: 0;
    right: 0;
    width: 150%;
    height: 100upx;
    opacity: 0;
    z-index: 3;
	background-color: rgba(0,0,0,0);
	box-sizing: border-box;
	font-size: 1upx;
	color: transparent;
	text-align: left;
}
.pay-password /deep/ .real-ipt input{ color: transparent;}
.pay-password .surface-ipts{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100upx;
    z-index: 1;
	opacity: 1;
    overflow: hidden;
}
.pay-password .surface-ipts .surface-ipt{
    height: 100upx;
    line-height: 100upx;
    display: flex;
    justify-content: space-between;
}
.pay-password .surface-ipts .surface-ipt input{
    width: 100upx;
    height: 100upx;
    line-height: 100upx;
    border: 0;
    border-right: 1upx solid #999999;
    color: #333333;
    font-size: 80upx;
    text-align: center;
    padding: 0;
	min-height:1;
}
/* #ifdef MP-WEIXIN */
.pay-password .surface-ipts .surface-ipt input{
    width: 100upx;
    height: 100upx;
    line-height: 100upx;
    border: 0;
    border-right: 1upx solid #999999;
    color: #333333;
    font-size: 40upx;
    text-align: center;
    padding: 0;
}
/* #endif */
.btns{
	margin-top: 60upx;
	margin-bottom: 80upx;
  display: flex;
	justify-content: space-around;
	align-items: center;
}
.cancel-btn{
    width: 240upx;
    height: 100upx;
    line-height: 100upx;
    color: $primary;
    font-size: 40upx;
    /* border: #2AA8E1 1upx solid; */
		border: #fff;
}
.confirm-btn{
    width: 240upx;
    height: 100upx;
    line-height: 100upx;
    background-size: 100%;
    color: #ffffff;
    font-size: 40upx;
		background-color: $primary;
}
</style>
