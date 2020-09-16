<template>
	<view>
		<view class="head-box bg-blue p80 white text-center">
			<view class="no-pay">
				待付款金额
			</view>
			<view class="price flex-center-center">
				<view class="unit">
					¥
				</view>
				<view class="pay-price">
					{{Money}}
				</view>
			</view>
		</view>
		<view class="choose-box p30">
			<view class="title blod mt30">
				选择支付方式
			</view>
			<view class="choose-type">
				<radio-group class="" @change="radioChange">
						<label class="flex-between-center mt60" v-for="(item,index) in payType" :key='index'>
							<view class="left flex-center-center">
								<image :src="item.imgUrl" mode="aspectFit"></image>
								<view class="">
									{{ item.value }}
								</view>
							</view>
							<view class="right">
								<radio color='#0AC7DA' :value="item.value" :checked="item.value === payment" />
							</view>
						</label>
				</radio-group>
			</view>
		</view>
		<view @click="Submit" class="now-pay white flex-center-center blod bg-blue">
			立即支付
		</view>
		<uni-popup ref="paypaw">
			<payPaw @success="getPassword" @close="pawClose" :allprice="Money" :focus="focus"></payPaw>
		</uni-popup>
	</view>
</template>

<script>
	import payPaw from '@/components/payPaw.vue';
	import { post,navigate,redirect,navigateBack,toast} from '@/utils';
	export default {
		data() {
			return {
				navigateBack,
				navigate,
				userId:'',
				token:'',
				Type:0,//0-旅居，1-旅游,2-商城/限时抢购/购物车，3，拼团，4-充值余额，5积分兑换，6积分充值，7聚乐豆充值
				Money: '', //付款金额
				focus:false,//对焦密码输入框
				rechargeNum:0,//充值的数量
				OrderNo:'',//订单号
				payment:'微信',//选择的付款方式
				payType: [
					{
						value: '微信',
						imgUrl: '/static/subject/order/wechat.png'
					},
					{
						value: '支付宝',
						imgUrl: '/static/subject/order/zhifubao.png'
					},
					// {
					// 	value: '银联',
					// 	imgUrl: '/static/subject/order/yinlian.png'
					// },
					{
						value: '余额',
						imgUrl: '/static/subject/order/yue.png'
					},
					{
						value: '聚乐豆',
						imgUrl: '/static/subject/order/jindou.png'
					},
					// {
					// 	value: '找人代付',
					// 	imgUrl: '/static/subject/order/daifu.png'
					// }
				],
			};
		},
		components:{payPaw},
		onLoad(e) {
			this.OrderNo = e.OrderNo||''
			this.Money = e.Price ||0;
			this.rechargeNum = e.rechargeNum*1||0;
			this.Type = e.Type*1;//0-旅居，1-旅游,2-商城/限时抢购/购物车，3，拼团，4-充值余额，5积分兑换，6积分充值，7聚乐豆充值
			this.init();
		},
		onShow(){
			this.userId = uni.getStorageSync('userId'),
			this.token = uni.getStorageSync('token');
			uni.getProvider({
				service:'payment',
				success(r){
					console.log(r,'可用支付类型')
				}
			})
		},
		methods: {
			init(){
					// 余额充值只允许使用微信和支付宝
				if(this.Type==4||this.Type==7){
					this.setPayMode(['微信','支付宝'])
				}else if(this.Type==6){
					this.setPayMode(['微信','支付宝','余额'])
				}
				// 支付宝只能在app端支付
				// #ifndef APP-PLUS
				this.payType.map((item,index)=>{
					if(item.value=='支付宝'){
						this.payType.splice(index,1)
					}
				})
				// #endif
			},
			// 设置支付方式
			setPayMode(mode=[]){
				let arr =[];
				this.payType.map(item=>{
					mode.map(Modeitem=>{
						if(item.value==Modeitem){
							arr.push(item)
						}
					})
				})
				this.payType = arr
			},
			// 选择支付方式
			radioChange: function(evt) {
				this.payment = evt.detail.value;
			},
			// 立即支付
			async Submit(){
				console.log(this.payment,'支付方式')
				if(this.payment == '余额'){
					this.$refs.paypaw.open();
					this.focus = true;
				}else
				if(this.payment=='支付宝'){
					let url ='';
					let params={
						UserId:this.userId,
						Token:this.token,
						OrderId:this.OrderNo
					}
					switch(this.Type*1){
						case 0:
							url = 'Sojourn/AliAppPay';
							break;
						case 1:
							url = "Travel/AliAppPay";
							break;
						case 2:
							url = 'Pay/AliAppPay';
							params.OrderIds=this.OrderNo;
							break;
						case 3:
							url = 'GroupBuy/AliAppPay';
							break;
						case 4:
							url = 'Recharge/RechargeWalletByAliPay';
							params.Money=this.Money;
							break;
						case 5:
							url = 'Integral/AliAppPay';
							break;
						case 6:
							url = 'Recharge/RechargeScoreByAliPay';
							params.Number = this.rechargeNum;
							break;
						case 7:
							url = 'Recharge/RechargeJuleCoinByAliPay';
							params.Number = this.rechargeNum;
							break;
					}
					post(url,params).then(res=>{
						console.log(res,'调起支付宝')
						let that=this;
						uni.requestPayment({
						  provider:"alipay",
						  orderInfo:res.data,
						  success(res) {
							  console.log(res,'支付成功')
							that.payAccomplish(1,res)
						  },
						  fail(err) {
							  console.log(err,'支付失败')
							that.payAccomplish(0,res)
						  }
						})
					})
				}else
				if(this.payment == '微信'){
					let {url,params} = this.wxPayParams()
					console.log(url,params,'调起微信参数')
					const res = await post(url,params)
					console.log(res,'调起微信回调')
					let that=this;
					// #ifdef MP
					const payData = JSON.parse(res.data);
					uni.requestPayment({
						timeStamp: payData.timeStamp,
						nonceStr: payData.nonceStr,
						package: payData.package,
						signType: payData.signType,
						paySign: payData.paySign,
						success(res) {
						    console.log(res,'支付成功')
							that.payAccomplish(1,res)
						},
						fail(err) {
						    console.log(err,'支付失败')
							that.payAccomplish(0,res)
						}
					})
					// #endif
					// #ifdef APP-PLUS
					uni.requestPayment({
					  provider:"wxpay",
					  orderInfo:res.data,
					  success(res) {
						  console.log(res,'支付成功')
						that.payAccomplish(1,res)
					  },
					  fail(err) {
						  console.log(err,'支付失败')
						that.payAccomplish(0,res)
					  },
					  complete(e){
						  console.log(e,'支付')
					  }
					})
					// #endif
					// #ifdef H5
					if(this.isWeixin()){//微信内置H5支付
						if(res.code == 0){console.log(res.data)
							uni.setStorageSync('openId', res.data.openid);
							this.WxOpenid = uni.getStorageSync("openId");
							if(this.WxOpenid!=""&&this.WxOpenid!="undefined"){
								this.WxCode="";//每次获取的code只能使用一次，有openid时用openid调起支付数据
							}
							if(typeof WeixinJSBridge === 'undefined') {
								if(document.addEventListener) {
									document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(), false);
								} else if(document.attachEvent) {
									document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady());
									document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady());
								}
							} else {
								this.onBridgeReady(res.data);
							}
						}else if (res.code == 201) { //检测不到openid需要进行微信授权
							window.location.href=res.data;
						}else {
							uni.showToast({
								title: res.msg,
								icon: "none",
								duration: 1500
							});
						}
					}else{//浏览器H5微信支付
						if(res.code == 0){
							window.location.href = res.data.mweb_url;
						}else {
							uni.showToast({
								title: res.msg,
								icon: "none",
								duration: 1500
							});
						}
					}
					// #endif
					
				}else
				if(this.payment == '聚乐豆'){
					this.$refs.paypaw.open();
					this.focus = true;
				}
			},
			// 判断浏览器环境true:微信内置
			isWeixin() {
				var ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i)=="micromessenger") {
					return true;
				} else {
					return false;
				}
			}, 
			// 微信支付,参数判断
			wxPayParams(){
				let url ='';
				let params={
					UserId:this.userId,
					Token:this.token,
					OrderId:this.OrderNo
				}
				// #ifdef APP-PLUS
				switch(this.Type*1){
					case 0:
						url = 'Sojourn/WxAppPay';
						break;
					case 1:
						url = "Travel/WxAppPay";
						break;
					case 2:
						url = 'Pay/WxAppPay';
						params.OrderIds=this.OrderNo;
						break;
					case 3:
						url = 'GroupBuy/WxAppPay';
						break;
					case 4:
						url = 'Recharge/RechargeWalletByAliPay';
						params.Money=this.Money;
						break;
					case 5:
						url = 'Integral/WxAppPay';
						break;
					case 6:
						url = 'Recharge/RechargeScoreByAliPay';
						params.Number = this.rechargeNum;
						break;
					case 7:
						url = 'Recharge/RechargeJuleCoinByAliPay';
						params.Number = this.rechargeNum;
						break;
				}
				// #endif 
				// #ifdef MP
				switch(this.Type*1){
					case 0:
						url = 'Sojourn/WxSMPay';
						break;
					case 1:
						url = "Travel/WxSMPay";
						break;
					case 2:
						url = 'Pay/WxSMPay';
						params.OrderIds=this.OrderNo;
						break;
					case 3:
						url = 'GroupBuy/WxSMPay';
						break;
					case 4:
						url = 'Recharge/RechargeWalletByAliPay';
						params.Money=this.Money;
						break;
					case 5:
						url = 'Integral/WxSMPay';
						break;
					case 6:
						url = 'Recharge/RechargeScoreByAliPay';
						params.Number = this.rechargeNum;
						break;
					case 7:
						url = 'Recharge/RechargeJuleCoinByAliPay';
						params.Number = this.rechargeNum;
						break;
				}
				// #endif
				// #ifdef H5
				switch(this.Type*1){
					case 0:
						url = 'Sojourn/WxH5Pay';
						break;
					case 1:
						url = "Travel/WxH5Pay";
						break;
					case 2:
						url = 'Pay/WxH5Pay';
						params.OrderIds=this.OrderNo;
						break;
					case 3:
						url = 'GroupBuy/WxH5Pay';
						break;
					case 4:
						url = 'Recharge/RechargeWalletByAliPay';
						params.Money=this.Money;
						break;
					case 5:
						url = 'Integral/WxH5Pay';
						break;
					case 6:
						url = 'Recharge/RechargeScoreByAliPay';
						params.Number = this.rechargeNum;
						break;
					case 7:
						url = 'Recharge/RechargeJuleCoinByAliPay';
						params.Number = this.rechargeNum;
						break;
				}
				// #endif
				return {url,params}
			},
			// 关闭支付密码
			pawClose(){
				this.$refs.paypaw.close();
				this.focus = false;
			},
			//接收支付密码
			getPassword(Password) {
				this.focus = false;
				this.getConfirmPaymentByBalance(Password);
			},
			// 余额支付
			async getConfirmPaymentByBalance(Password){	
				let url='';
				let julebiUrl='';
				let params = {
					UserId:this.userId,
					Token:this.token,
					OrderId:this.OrderNo,		//支付的订单号
					SecondPassWord:Password//支付密码
				}
				switch(this.Type*1){
					case 0:
						url="Sojourn/PayByWallet";
						julebiUrl="Sojourn/JuleCoinPay";
						break;
					case 1:
						url = 'Travel/PayByWallet';
						julebiUrl="Travel/JuleCoinPay";
						break;
					case 2:
						url = 'Pay/WalletPay';
						julebiUrl="Pay/JuleCoinPay";
						params.OrderIds=this.OrderNo;
						break;
					case 3:
						url = 'GroupBuy/PayByWallet';
						julebiUrl="GroupBuy/JuleCoinPay";
						params.OrderIds=this.OrderNo;
						break;
					case 5:
						url="Integral/PayByWallet"
						julebiUrl="Integral/JuleCoinPay";
						break;
					case 6:
						url="Recharge/RechargeScoreByWallet"
						params.Number=this.rechargeNum;
						break;
				}
				if(this.payment == '聚乐豆'){
					url = julebiUrl;
				}
				let res = await post(url,params)
				if(res.code != 0) return
				this.payAccomplish(1,res)
			},
			// 支付完成
			payAccomplish(status=0,res){
				// uni.showToast({
				// 	title: res.msg,
				// 	icon: status?'success':'none',
				// 	duration: 1500,
				// });
				// setTimeout(()=> {
					redirect('pay/payStatus/payStatus',{money:this.Money,status:status,type:this.Type,OrderNo:res.data})
				// }, 1500);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.p30 {
		padding: 0 30upx;
	}
	.pt30 {
		padding-top: 30upx;
	}
	.mt30 {
		margin-top: 30upx;
	}
	.mt60 {
		margin-top: 60upx;
	}
	// .mt20 {
	// 	margin-top: 20upx;
	// }
	.p80 {
		padding: 80upx 0upx;
	}
	.white {
		color: white;
	}
	.flex-between-center {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.flex-center-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.flex-center {
		display: flex;
		justify-content: center;
	}
	.bg-blue {
		background-color: #0AC7DA;
	}
	.blod {
		font-weight: bold;
	}
	.text-center {
		text-align: center;
	}
	.no-pay {
		font-size: 30upx;
	}
	.price {
		height: 70upx;
		margin-top: 20upx;
		.unit {
			height: 30upx;
			font-size: 30upx;
			align-self: flex-end;
			margin-bottom: 10upx;
		}
		.pay-price {
			font-size: 70upx;
			line-height: 1;
		}
	}
	
	.choose-box {
		.title {
			font-size: 35upx;
		}
		.left {
			image {
				width: 50upx;
				height: 50upx;
				margin-right: 20upx;
			}
		}
		&:after {
			display: block;
			width: 100%;
			height: 320upx;
			// background-color: red;
			content: '';
		}
	}
	
	.now-pay {
		font-size: 30upx;
		width: 690upx;
		height: 99upx;
		border-radius: 10upx;
		// margin: 160upx 30upx 30upx;
		position: fixed;
		left: 30upx;
		bottom: 30upx;
	}
</style>
