<template>
    <!-- 弹出优惠券 -->
    <!-- <uni-popup type="bottom" ref="couponWin"> -->
        <view class="coupon-modal" :style="{'padding-bottom':safeDistance+'rpx'}">
            <view class="title">优惠</view>
            <view class="content">
                <scroll-view scroll-y class="coupon-list">
                    <view class="coupon-item" v-for="(item,index) in list" :key="index">
                        <view class="coupon-left">
                            <view class="coupon-price">
                                <block v-if="item.discountType==1"><text>￥</text><text class="price">{{item.denomination}}</text></block>
                                <block v-else><text class="price">{{item.denomination}}</text><text>折</text></block>
                                <text class="coupon-name">{{item.name}}</text>
                            </view>
                            <view class="coupon-condition">{{item.meetConditions}}</view>
                            <view class="conpon-date">{{item.startTime}}到{{item.endTime}}</view>
                        </view>
                        <view class="coupon-line"></view>
                        <view class="coupon-right">
                            <view class="coupon-get" v-if="item.isReceive">{{isGetTitle}}</view>
                            <view class="coupon-get" v-else @click="$emit('get-coupon',item)">{{getTitle}}</view>
                        </view>
                    </view>
                    
                </scroll-view>
            </view>
            <view class="coupon-confirm" @click="$emit('confirm')">完成</view>
        </view>
    <!-- </uni-popup> -->
</template>
<script>
// 领取优惠券
//此组件需搭配uni-popup使用,
// 考虑的可能多个接口返回优惠券列表,统一以下字段
// 参数
// 优惠券列表
// list:[{
// 	denomination:Number,//优惠券金额，如果是折扣优惠券显示折扣
// 	discountType:Number,//优惠券类型，1-立减券，2-折扣券
// 	name:String,//名称
// 	conditions:String,//满足多少可用，
// 	startTime:String,//开始时间
// 	endTime:String,//结束时间
// 	isReceive:Number||Boolean,//是否已领取
// }],
// getTitle:String;--领取优惠券文字
// isGetTitle:String;--已领取优惠券文字
// 事件
// get-coupon--领取优惠券,参数-item
// confirm--点击完成
export default {
    props:{
        list:{
            type:Array,
            default:()=>{return [];}
		},
		getTitle:{
			type:String,
			default: '立即领取'
		},
		isGetTitle:{
			type:String,
			default: '已领取'
		},
		// 底部安全距离
		safeDistance:{
			type:[String,Number],
			default: 20
		}
    },
    data(){
        return{

        }
    }
}
</script>
<style lang="scss" scoped>
    /* 弹出优惠券 */
	.coupon-modal{
		background: #fff; 
		border-radius: 15px 15px 0 0; 
		padding-bottom: 100upx;
		.title {
			line-height: 3;
			font-size: 30upx;
			text-align:center;
			font-weight:bold;
			// padding-top:10upx;
		}
		.coupon-list{
			height:600upx;
			box-sizing:border-box;
			padding:0 20upx;
			.coupon-item{
				border-radius:12upx;
				background:	#FF2751;
				color:#fff;
				width:100%;
				height:184upx;
				margin-bottom:20upx;
				display:flex;
				align-items:center;
				.coupon-left{
					width:75%;
					padding:20upx;
					.coupon-price{
						font-size:30upx;
						height:70upx;
						.price{
							font-size:50upx;
							font-weight:bold;
						}
						.coupon-name{
							margin-left:10upx;
						}
					}
					// 条件
					.coupon-condition{
						font-size:25upx;
						line-height:1.5;
					}
					.conpon-date{
						font-size:24upx;
						line-height:1.5;
					}
				}
				.coupon-right{
					width:25%;
					.coupon-get{
						text-align:center;
						line-height:184upx;
						width:100%;
					}
				}
				.coupon-line{
					position:relative;
					width:1upx;
					height:184upx;
					border-right: 3upx dotted #FFf;
					&::before{
						content:'';
						position: absolute;
						left: -10upx;
						top:-10upx;
						width: 20upx;
						height: 20upx;
						background: #fff;
						border-radius: 50%;
					}
					&::after{
						content:'';
						position: absolute;
						left:-10upx;
						bottom: -10upx;
						width: 20upx;
						height: 20upx;
						background: #fff;
						border-radius: 50%;
					}
				}
			}
		}
		.coupon-confirm{
			height: 88upx;
			line-height: 88upx;
			background: #FF3333;
			font-size: 32upx;
			color: #fff;
			text-align:center;
			border-radius: 40upx;
			margin:20upx;
			}
		
	}
	
</style>