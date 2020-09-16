<template>
    <!-- 弹出优惠券 -->
	<view class="couponbox pop" style="z-index: 10000;">
		<view class="title">
			选择优惠券
			<view class="close" @click="$emit('close')">+</view>
		</view>
		<scroll-view scroll-y style="width: 100%;height: 560upx;">
			<view class="coupon">
				<view class="couponitem flex-center-between" @click="onSelect({id:0})">
					<view class="couponname">不使用</view>
					<view style="margin: 0;" :class="['iconfont radios',useCouponId<1?'icon-radio-ok':'icon-radio']"></view>
				</view>
				<view class="couponitem flex-center-between" v-for="(item,index) in list" :key="index" @click="onSelect(item)">
					<view class="couponname">
						满{{item.meetConditions}}
						<block v-if="item.discountType==1">
							减{{item.denomination}}
						</block>
						<block v-else>
							打{{item.denomination}}折
						</block>
					</view>
					<view style="margin: 0;" :class="['iconfont radios',useCouponId==item.id?'icon-radio-ok':'icon-radio']"></view>
				</view>
			</view>
		</scroll-view>
		<view class="btn-max" @click="confirCoupon">完成</view>
	</view>
</template>
<script>
// 使用优惠券
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
// confirm--点击完成
export default {
    props:{
        list:{
            type:Array,
            default:()=>{return [];}
		},
		useCouponId:{
            type:[Number,String],
            default:0
		}
    },
	watch:{
	},
    data(){
        return{
        }
    },
	methods:{
		onSelect(item){
			this.$emit('selectCoupon',item)
		},
		confirCoupon(){
			this.$emit('success')
		}
	}
}
</script>
<style lang="scss" scoped>
 .pop{
     border-radius: 6px 6px 0 0;
 	background-color: #fff;
 	width: 100%;
     .title{
         text-align:center;
     }
     .centent{
         padding:0 20upx; 
     }
     .btn-max{
         border-radius:0;
         font-size:30upx;
         line-height:88upx;
     }
 }
 .couponbox{
     .couponitem{
         width: 100%;
         height: 120upx;
         border-bottom: 1upx #ECECEC solid;
         padding:0 20upx;
     }
     .couponname{
         font-size: 30upx;
     }
 }
</style>