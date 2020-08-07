<template>
    <!-- 弹出优惠券 -->
    <!-- <uni-popup type="bottom" ref="couponWin"> -->
        <view class="coupon-modal">
            <view class="title">优惠</view>
            <view class="content">
                <scroll-view scroll-y class="coupon-list">
                    <view class="coupon-item" v-for="(item,index) in list" :key="index">
                        <view class="coupon-left">
                            <view class="coupon-price">
                                <block v-if="1"><text>￥</text><text class="price">456</text></block>
                                <block v-else><text class="price">7.5</text><text>折</text></block>
                                <text class="coupon-name">限时优惠券</text>
                            </view>
                            <view class="coupon-condition">满100元可用</view>
                            <view class="conpon-date">2019-4-5到2020-1-2</view>
                        </view>
                        <view class="coupon-line"></view>
                        <view class="coupon-right">
                            <view class="coupon-get" @click="getCoupon(item)">立即领取</view>
                        </view>
                    </view>
                    
                </scroll-view>
            </view>
            <view class="coupon-confirm" @click="$emit('close')">完成</view>
        </view>
    <!-- </uni-popup> -->
</template>
<script>
//此组件需搭配uni-popup使用,每个后台返回字段不同，就不做统一转换了，直接每个项目的数据字段替换一下
export default {
    props:{
        list:{
            type:Array,
            detail(){return [];}
        },
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