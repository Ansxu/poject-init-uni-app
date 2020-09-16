<template>
	<view class="emptybox">
		<view class="iconimg">
			<view class="iconfont icon-wushuju" v-if="mode==='icon'"></view>
			<image class="img" v-if="mode==='img'&&notDataImg" :src="notDataImg" mode="widthFix"></image>
		</view>
		<view class="tips uni-center">{{tipsTitle}}</view>
		<div class="tips-min" v-if="tipsText">{{tipsText}}</div>
	</view>
</template>

<script>
// 列表的无数据组件
	export default {
		name:'no-date',
		props: {
			tipsTitle:{
				type:String,
				default:'暂无数据',
			},
			tipsText:{
				type:String,
				default:'',
			},
			// icon--图标；img--图片
			mode:{
				type:String,
				default:'img'
			}
		},
		data() {
			return {
				notDataImg:'',
			};
		},
		created: function(){
			this.notDataImg= '';
		}
	}
</script>

<style scoped>
.emptybox{
    padding-bottom: 50upx;
    padding-top:100upx;
    margin-top:0 !important;text-align:center;
  }
  .iconimg{
	  display: flex;justify-content: center;align-items: center;
  }
 .iconimg .img{ display: block; width: 400upx; margin: 0 auto 20upx;}
 .iconimg .iconfont{ display: block; font-size: 80upx; color: #999; margin: 0 auto;}
 .emptybox .tips{ color: #666;font-size:32upx;line-height:2;}
 .emptybox .tips-min{ color: #888; font-size:26upx;}
</style>
