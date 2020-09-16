<template>
	<view>
		<view class="uni-bg-white">
			<view class="proInfo flex pp3" v-if="proType==0">
				<view class="imgbox">
					<image :src="Info.PicImg" mode="aspectFill"></image>
				</view>
				<view class="txtbox flex1">
					<view class="name uni-ellipsis2">
						{{Info.name}}
					</view>
					<view class="price c_theme">
						<text class="fz12">￥</text>{{Info.price}}
					</view>
				</view>
			</view>
			<view class="proInfo1 flex-between pp3" v-if="proType==1">
				<view class="imgbox">
					<image :src="Info.PicImg||'http://m.dance-one.com/static/default_music.png'" mode="aspectFill"></image>
				</view>
				<view class="txtbox flex1 flex-between">
					<view class="name uni-ellipsis flex1">
						{{Info.name}}
					</view>
					<view class="price c_theme flex-column">
						<text>
							<text class="fz12">￥</text>{{Info.price}}
						</text>
					</view>
				</view>
			</view>
			<view class="pay-hd pd15">付款方式</view>
			<view class="pay-bd line-list payMethods__modal">
				<block v-for="(item,index) in payway" :key="index"> 
					<view class="line-item flex-between" @click="tabBtn(item.Id)">
					  <view class="item-l flex-start">
						<image class="iconimg" :src="item.iconimg" mode="widthFix"></image>
						<view class="txt">{{item.name}}
						<text v-if="item.Id==3">({{userinfo.Score}})</text>
						<text v-if="item.Id==4">({{userinfo.Amount}})</text>
						</view>
					  </view>
					  <view class="item-r">
						<view :class="['uni-icon',payType==item.Id?'uni-icon-checkbox-filled':'uni-icon-checkbox']"></view>
					  </view>
					</view>
				</block>
			</view>
		</view>
		<view class="pp3 c_theme fz12">
			普通积分：100积分=1元；返佣积分：1积分=1元
		</view>
		<view style="height: 110upx;"></view>
		<view class="fixedbtn" style="background: #f8f8f8;">
			<view class="btn" @click="surePop">确认支付</view>
		</view>
		<pay v-on:hidePay="hidePay" v-on:getPassword="getPassword" v-if="showPay" :allprice="allprice" :isJifen="payType==3||payType==4"></pay>
	</view>
</template>

<script>
	import { post, get, getUrlParam,isWeixin} from '@/common/util.js';
	import pay from '@/components/payPaw.vue';
	export default {
		components: {
			pay
		},
		data() {
			return {
				userId: "",
				token: "",
				proID:"",//产品id
				proType:0,//0课程，1舞曲
				payType:0, //0微信支付
				showPay:false,//支付密码弹框
				payway:[
				// #ifdef APP-PLUS||H5	
				// {
				// 	Id:1,
				// 	iconimg:'http://m.dance-one.com/static/pay_alipay.png',
				// 	name:"支付宝"
				// },
				// #endif
				{
					Id:0,
					iconimg:'http://m.dance-one.com/static/pay_weixin.png',
					name:"微信"
				},
				{
					Id:2,
					iconimg:'http://m.dance-one.com/static/pay_yue.png',
					name:"余额"
				},
				{
					Id:3,
					iconimg:'http://m.dance-one.com/static/pay_jf2.png',
					name:"普通积分"
				},
				{
					Id:4,
					iconimg:'http://m.dance-one.com/static/pay_jf.png',
					name:"返佣积分"
				}],
				Info:{},
				allprice:"0",
				IsPayWallet:0,
				IsPayScore:0,
				IsPayAmountScore:0,
				userinfo:{},
				WxOpenid:"",
				WxCode:"",
			}
		},
		onLoad(e) {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			// #ifdef H5
			this.WxCode=getUrlParam("code");
			this.WxOpenid = uni.getStorageSync("openId");
			if(this.WxCode){//首次跳转获取code地址都直接调起支付
				let OrderNo=e.OrderNo;
				this.WechatPay(OrderNo)
			}
			// #endif
			// #ifdef APP-PLUS
			this.proType=e.type;
			this.proID=e.id;
			// #endif
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.Info=uni.getStorageSync("buyInfo");
			this.WxOpenid=uni.getStorageSync("openId");
			this.GetCenterInfo();
			// #ifndef APP-PLUS
			this.proType=this.$mp.query.type;
			this.proID=this.$mp.query.id;
			// #endif
			// #ifdef MP-WEIXIN
			this.getcode();
			// #endif
		},
		methods: {
			async GetCenterInfo(){
				let result = await post('User/GetCenterInfo', {
					"UserId": this.userId,
					"Token": this.token
				});
				if(result.code==0){
					this.userinfo=result.data
				}
			},
			tabBtn(index){
				this.payType=index;
				if(this.payType==3){
					this.allprice=JSON.stringify(this.Info.price*10000/100);
				}else{
					this.allprice=JSON.stringify(this.Info.price);
				}
			},
			//接收支付密码
			getPassword(Password){
				this.CourseBuy(Password);
			},
			//关闭支付密码弹窗
			hidePay(e){
				this.showPay=false;
			},
			//课程订单提交（余额积分提交订单并支付）
			async CourseBuy(Password){
				uni.showLoading();
				let url="",param={};
				if(this.proType==0){
					url="Course/CourseBuy";
					param={
						"UserId": this.userId,
						"Token": this.token,
						"OutlineId":this.proID,
						"IsPayWallet":this.IsPayWallet,
						"IsPayScore":this.IsPayScore,
						"IsPayAmountScore":this.IsPayAmountScore,
						"Password":Password
					}
				}else if(this.proType==1){
					url="DanceMusic/DanceMusicBuy";
					param={
						"UserId": this.userId,
						"Token": this.token,
						"MusicId":this.proID,
						"IsPayWallet":this.IsPayWallet,
						"IsPayScore":this.IsPayScore,
						"IsPayAmountScore":this.IsPayAmountScore,
						"Password":Password
					}
				}
				let result = await post(url, param);
				if(result.code==0){
					uni.showToast({
						title: result.msg
					})
					setTimeout(()=>{
						uni.navigateBack();
					},1500)
				}
				else if(result.code==200){
					uni.hideLoading();
					uni.showToast({
						title: result.msg
					})
					setTimeout(function(){
						uni.navigateBack()
					},1500)
				}else if(result.code==3){
					uni.showModal({
						content: "您还没有设置支付密码，去设置？",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url:"/pages/member/setpwd/setpwd"
								})
							} else if (res.cancel) {
							}
						}
					});
				}
			},
			//确认支付
			surePop(){
				if(this.payType==0){//微信
					this.submitOrder()
				}else if(this.payType==1){
					
				}else if(this.payType==2){//余额
					this.showPay=true;
					this.IsPayWallet=1;
					this.IsPayScore=0;
					this.IsPayAmountScore=0;
				}else if(this.payType==3){//积分
				    this.showPay=true;
					this.IsPayScore=1;
					this.IsPayWallet=0;
					this.IsPayAmountScore=0;
				}else if(this.payType==4){//返佣积分
				    this.showPay=true;
					this.IsPayAmountScore=1;
					this.IsPayScore=0;
					this.IsPayWallet=0;
				}
			},
			//微信支付
			async WechatPay(OrderNo){
				uni.showLoading();
				let url="",param={};
				// #ifdef H5
				let NewUrl=this.GetUrlRelativePath() +'/#/pages/pay2/pay2?OrderNo='+OrderNo+'&type='+this.proType+'&id='+this.proID;
				if(isWeixin()){
					var paytype=0
				}else{
					var paytype=3
				}
				// #endif
				if(this.proType==0){//课程
					url="Course/WeiXinCoursePay";
					param={
						"UserId": this.userId,
						"Token": this.token,
						"OrderNo":OrderNo,
						// #ifdef H5
						"NewUrl":NewUrl,//支付后的回调地址
						"WxCode":this.WxCode,
						"WxOpenid":this.WxOpenid,
						"paytype":paytype,
						// #endif
						// #ifdef APP-PLUS
						"paytype":2,
						// #endif
						// #ifdef MP-WEIXIN
						"WxCode": this.WxCode,
						"WxOpenid":this.WxOpenid ,
						"paytype":4
						// #endif
					}
				}else if(this.proType==1){//舞曲
					url="DanceMusic/WechatPayWQ";
					param={
						"UserId": this.userId,
						"Token": this.token,
						"OrderNo":OrderNo,
						// #ifdef H5
						"NewUrl":NewUrl,//支付后的回调地址
						"WxCode":this.WxCode,
						"WxOpenid":this.WxOpenid,
						"paytype":paytype,
						// #endif
						// #ifdef APP-PLUS
						"paytype":2,
						// #endif
						// #ifdef MP-WEIXIN
						"WxCode": this.WxCode,
						"WxOpenid":this.WxOpenid ,
						"paytype":4
						// #endif
					}
				}
				let result = await post(url, param);
				console.log(param)
				// #ifdef H5
				if(isWeixin()){//微信内置H5支付
					if(result.code == 0){console.log(result.data)
						uni.setStorageSync('openId', result.data.openid);
						this.WxOpenid = uni.getStorageSync("openId");
						if(this.WxOpenid!=""&&this.WxOpenid!="undefined"){
							this.WxCode="";//每次获取的code只能使用一次，有openid时用openid调起支付数据
						}
						this.callpay(result.data.JsParam);
					}else if (result.code == 201) { //检测不到openid需要进行微信授权
						window.location.href=result.data;
					}else {
						uni.showToast({
							title: result.msg,
							icon: "none",
							duration: 1500
						});
					}
				}else{//浏览器H5微信支付
					if(result.code == 0){
						window.location.href = result.data.mweb_url;
					}else {
						uni.showToast({
							title: result.msg,
							icon: "none",
							duration: 1500
						});
					}
				}
				// #endif
				// #ifdef APP-PLUS
				if(result.code==0){console.log(result.data)
					// var payData=JSON.parse(result.data.JsParam)
					let _this=this;
					uni.requestPayment({
					  provider:"wxpay",
					  orderInfo:result.data.JsParam,
					  success(res) {
							console.log(res)
							_this.type = "";
							_this.showPay=false;
							setTimeout(()=>{
								uni.navigateBack();
							},1500)
						},
					  fail(err) {console.log(err)
						  uni.showToast({
						  	title:"支付失败",
							icon:"none",
							duration:4000
						  })
					  }
					})
				}else {console.log(result)
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 1500
					});
				}
				// #endif
				// #ifdef MP-WEIXIN
				if(result.code===0){
					let payData=JSON.parse(result.data.JsParam)
					let _this=this;
					uni.requestPayment({
					  timeStamp: payData.timeStamp,
					  nonceStr: payData.nonceStr,
					  package: payData.package,
					  signType: payData.signType,
					  paySign: payData.paySign,
					  success(res) {
							uni.navigateBack()
						},
					  fail(res) {}
					})
				}
				// #endif
			},
			//订单提交
			async submitOrder(){
				uni.showLoading();
				let url="",param={};
				if(this.proType==0){
					url="Course/CourseBuy";
					param={
						"UserId": this.userId,
						"Token": this.token,
						"OutlineId":this.proID,
						"IsPayWallet":0,
						"IsPayScore":0,
						"IsPayAmountScore":0,
					}
				}else if(this.proType==1){
					url="DanceMusic/DanceMusicBuy";
					param={
						"UserId": this.userId,
						"Token": this.token,
						"MusicId":this.proID,
						"IsPayWallet":0,
						"IsPayScore":0,
						"IsPayAmountScore":0,
					}
				}
				let result = await post(url, param);
				if(result.code==0){
					uni.hideLoading();
					if(this.payType==0){//微信
						this.WechatPay(result.data)
					}else if(this.payType==1){
						
					}
				}else{
					uni.hideLoading();
					uni.showToast({
						title: result.msg
					})
				}
			},
			//微信公众号支付
			callpay(param) {
				if(typeof WeixinJSBridge === 'undefined') {
					if(document.addEventListener) {
						document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(), false);
					} else if(document.attachEvent) {
						document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady());
						document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady());
					}
				} else {
					this.onBridgeReady(param);
				}
			},
			onBridgeReady(param){
				var _this=this;
				var parameter = JSON.parse(param);
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', parameter,
					function(res){
					if(res.err_msg == "get_brand_wcpay_request:ok" ){
					// 使用以上方式判断前端返回,微信团队郑重提示：
					//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
						setTimeout(()=>{
							uni.navigateBack();
						},1500)
					}else{
						uni.showToast({
							title: "支付失败",
							icon: "none",
							duration: 1500
						});
					} 
				}); 
			},
			GetUrlRelativePath() {
				var urlStr = '';　　　　
				var url = document.location.toString();　　　　
				var arrUrl = url.split("//");　　　　
				var start = arrUrl[1].split("/");
				urlStr = arrUrl[0] + '//' + start[0];　　　　
				return urlStr;　　
			},
			getcode(){
				let _this=this;
				uni.login({
					success: function(res) {
					  if (res.code) {
						_this.WxCode=res.code;
					  } else {
						console.log('登录失败！' + res.errMsg)
					  }
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.proInfo{
		.imgbox{
			width: 180upx;
			height: 180upx;
		}
		.txtbox{
			justify-content: space-between;
			.price{
				font-size: 32upx;
				margin-top: 20upx;
			}
		}
	}
	.proInfo1{
		.imgbox{
			width: 84upx;
			height: 84upx;
		}
		.txtbox{
			justify-content: space-between;
			.price{
				font-size: 32upx;
				margin-top: 20upx;
				align-items: flex-end;
			}
		}
	}
	.imgbox{
		border-radius: 12upx;
		overflow: hidden;
		margin-right: 20upx;
		image{
			width: 100%;
			height: 100%;
			background-color: #f2f2f2;
		}
	}
	.pay-hd{ font-size: 32upx; font-weight: 600}
</style>
