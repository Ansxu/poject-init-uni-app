<template>
	<view class="content">
		<view class="regLoginBox">
			<view class="logo">
				<view class="img">
					<image src="/static/logo.png" mode="widthFix"></image>
					<view class="Title">聚乐旅居</view>
				</view>
			</view>
			<view class="from pd10">
				<view class="from-line">
					<view class="iconfont icon-shouji"></view>
					<input type="text" class="ipt" value="" v-model="tel" placeholder="请输入手机号码" />
				</view>
				<view class="from-line">
					<view class="iconfont icon-securityCode-b"></view>
					<input type="text" class="ipt" value="" v-model="code" placeholder="请输入验证码" />
					<view class="getcode" :class="{'disabled':count!=0}" @click="getCode">{{codeMsg}}</view>
				</view>
				<view class="from-line" v-if="this.type!=1">
					<view class="iconfont icon-mima"></view>
					<input type="password" class="ipt" value="" v-model="pwd" :placeholder="`请输入${type==2?'新':''}密码`" />
				</view>
				<view class="from-line" v-if="this.type!=1">
					<view class="iconfont icon-mima"></view>
					<input type="password" class="ipt" value="" v-model="pwd2" placeholder="请再次输入密码" />
				</view>
				<!-- <view class="from-line">
					<view class="iconfont icon-mima"></view>
					<input type="text" class="ipt" v-model="inviteCode" placeholder="好友邀请码(选填)" />
					<text class="inviteTips">好友邀请码</text>
				</view> -->
				<view class="from-txt flex-center">
					<view  @click="shiftAgree" class="flex-center">
						<view class="iconfont " :class="isAgree?'icon-radio-ok':'icon-radio'" style="margin-right: 8upx;"></view>
						<text>我已阅读并同意</text>
					</view>
					<navigator url="/pages/login/agreement" class="inline-block" style="color:#3fb1ea;">《用户协议》</navigator>
				</view>
				<view class="ftbtn" style="padding:40upx 0 20upx 0;">
					<button type="primary" class="btn" @click="btnSubmit">{{type==1?'确认绑定':type==2?'找回密码':'确认注册'}}</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		host,
		post,
		get,
		verifyPhone,redirect,navigateBack
	} from '@/utils';
	export default {
		onLoad(e) {
			// if(e.inviteCode){
			// 	this.inviteCode=e.inviteCode;
			// 	uni.setStorageSync('inviteCode',e.inviteCode)
			// }
			// if(uni.getStorageSync('inviteCode')){
			// 	this.inviteCode=uni.getStorageSync('inviteCode')
			// }
			this.type = e.type*1||0;//1小程序绑定手机号,2-找回密码
			uni.setNavigationBarTitle({title:e.type==1?'绑定微信':e.type==2?'找回密码':'注册'})
			
			// 邀请码
			if(uni.getStorageSync('inviteCode') !='undefined'){
			  this.inviteCode = uni.getStorageSync('inviteCode')
			}
			// console.log(this.inviteCode,"type999999999999")
		},
		onShow() {
		},
		data() {
			return {
				tel: "",
				pwd: "",
				pwd2: "",
				code: "",
				inviteCode: "", //邀请码
				timer: null,
				codeMsg: "获取验证码",
				count: 0,
				TIME_COUNT: 60,
				has_click: false,
				isAgree:true,
				type:0,//1小程序绑定手机号,2-找回密码
			};
		},
		methods: {
			getCode() {
				if (verifyPhone(this.tel)) {
					if (!this.has_click) {
						this.sendCode();
					}
				}
			},
			shiftAgree(){
				this.isAgree = !this.isAgree;
			},
			regResetPwdValOther() {
				if (this.code == "") {
					uni.showToast({
						title: "验证码不能为空!",
						icon: "none",
						duration: 2000
					});
					return false;
				}
				if(this.type != 1){
					if (this.pwd == "") {
						uni.showToast({
							title: "密码不能为空!",
							icon: "none",
							duration: 2000
						});
						return false;
					}
					if (this.pwd.length < 6) {
						uni.showToast({
							title: "密码长度不能小于6个字符!",
							icon: "none",
							duration: 2000
						});
						return false;
					}
					if (this.pwd != this.pwd2) {
						uni.showToast({
							title: "两次输入密码不同!",
							icon: "none",
							duration: 2000
						});
						return false;
					}
				}
				if (!this.isAgree) {
					uni.showToast({
						title: "请勾选同意用户协议!",
						icon: "none",
						duration: 2000
					});
					return false;
				}
				return true;
			},
			// 类型: 0.用户注册, 1.用户登录, 2.找回密码, 3.绑定手机, 4.订单通知, 5.商户注册, 6.手机号验证, 
			// 7.手机号修改, 8.找回支付密码, 9.绑定手机号, 10.微信绑定手机号, 
			// 11.绑定银行卡, 12.商户登陆, 13.商户修改申请信息, 14.小程序绑定手机号, 15.消息通知, 16.绑定关系链
			async sendCode() {
				if(this.count!==0)return;
				let objUrl = ''
				// let method = ''
				if(this.type == 1){
					objUrl = 'SMS/Send'
					// method = 'get'
				}else{
					objUrl = 'SMS/Send'
					// method='POST'
				}
				console.log(this.type,"类型")
				get(objUrl,{
					mobile:this.tel,
					type:this.type==1?14:this.type==2?2:0
				}).then(res=>{
					console.log(res)
					uni.showToast({
						title: "发送成功，请注意查收!",
						icon: "none",
						duration: 2000
					});
					this.count=59;
					this.timer = setInterval(() => {
						if (this.count > 0 && this.count <= this.TIME_COUNT) {
							this.count--;
							this.codeMsg = this.count + "s后重新获取";
						} else {
							clearInterval(this.timer);
							this.has_click = false;
							this.timer = null;
							this.codeMsg = "获取验证码";
						}
					}, 1000);
				})
			},
			async wxBand(){
				let result = await post("SmallRoutine/Bind", {
					"Mobile": this.tel,
					"unionid":uni.getStorageSync("unionid"),
					"OpenId": uni.getStorageSync("openId"),
					"VCode": this.code,
					"Password": this.pwd,
					"InviteCode": this.inviteCode
				});
				if (result.code === 0) {
					let _this = this;
					uni.showToast({
						title: result.msg,
						duration: 2000,
						success: function() {
							setTimeout(function() {
								uni.redirectTo({
									url: "/pages/login/login"
								})
							}, 2000);
						}
					});
				}
			},
			async phoneNumberRegister() {
				let result = await post("App/Register", {
					"Mobile": this.tel,
					"Password": this.pwd,
					"VerifyCode": this.code,
					"InviteCode": this.inviteCode
				});
				if (result.code)return;
				let _this = this;
				uni.showToast({
					title: "注册成功，请使用注册手机号登陆!",
					icon: "none",
					duration: 2000,
					success: function() {
						setTimeout(function() {
							// redirect('login/login',{isResgister:1})
							navigateBack();
						}, 2000);
					}
				});
			},
			// 忘记密码
			async forget(){
				let result = await post("App/ForgetPassword", {
					"Mobile": this.tel,
					"Password": this.pwd,
					"Vcode": this.code
				});
				if (result.code)return;
				let _this = this;
				uni.showToast({
					title: "更换成功!",
					icon: "none",
					duration: 2000,
					success: function() {
						setTimeout(function() {
							// redirect('login/login',{isResgister:1})
							navigateBack();
						}, 2000);
					}
				});
			},
			btnSubmit(){
				if(verifyPhone(this.tel) && this.regResetPwdValOther()){
					if(this.type == 1){
						this.wxBand()
					}else if(this.type==2){
						this.forget();
					}else{
						this.phoneNumberRegister();
					}
					
				}
			}
		},
	}
</script>

<style scoped lang="scss">
	@import '../login.scss';
	.content{
		  background:#fff;
		  /* #ifdef H5 */
		  height: calc(100vh - 44px);
		  /* #endif */
		  /* #ifndef H5 */
		  height: 100vh;
		  /* #endif */
		  position: relative;
		  box-sizing: border-box;
	}
	.regLoginBox{
		 /* background: rgba(0,0,0,0.5); */
		  width: 90%;
		  position: absolute;
		  top: 50%;
		  left: 5%;
		  transform: translateY(-50%);
		  border-radius: 20rpx;
		  box-sizing: border-box;
	}
	.from-line{
		  background: #fff;
		  border-radius: 40rpx;
	}
	.from .from-txt {
	    font-size: 14px;
	    /* color: #fff; */
	}
	.inviteTips{ position: absolute; right: 30upx; top: 0; color: #bbb; line-height: 80upx;text-decoration: underline;}
	.icon-radio-ok{
		color:$primary;
	}
	.disabled{
		background:#999!important;
	}
</style>
