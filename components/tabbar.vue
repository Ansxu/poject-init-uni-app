<template>
	<div>
		<cover-view class="TabBar tabBarAuto flex-center-between">
			<cover-view class="tab flex-column-center-center" v-for="(item,index) in list" :key="index" @click="navigatorTo(item.pagePath)">
				<!-- 普通navbar -->
				<cover-image class="plain" v-if="index !== 2" :src="current === index ? item.selectedIconPath : item.iconPath"></cover-image>
				<!-- 展示中间项 -->
				<cover-image class="special" v-else src="/static/tabbar/f.png"></cover-image>
				<cover-view :class="['text',{'active':current === index}]">{{item.text}}</cover-view>
			</cover-view>
		</cover-view>
		<cover-view class="centerIcon tabBarAuto">
			<cover-image class="centerIcon-img" src="/static/tabbar/f.png" @click="navigatorTo('/pages/tabBar/xingkong/xingkong')"></cover-image>
		</cover-view>
	</div>
</template>

<script>
	export default {
		props: {
			//激活的tabbar，默认第一个页面tabbar激活
			current: {
				type: Number,
				default: 0 
			}
		},
		data() {
			return {
				list: [{
						"pagePath": "/pages/tabBar/index/index",
						"iconPath": "/static/tabbar/ft1.png",
						"selectedIconPath": "/static/tabbar/ft1_in.png",
						"text": "首页"
					},
					{
						"pagePath": "/pages/tabBar/starLang/starLang",
						"iconPath": "/static/tabbar/ft2.png",
						"selectedIconPath": "/static/tabbar/ft2_in.png",
						"text": "星语"
					},
					{
						"pagePath": "/pages/tabBar/xingkong/xingkong",
						"iconPath": "/static/tabbar/f.png",
						"selectedIconPath": "/static/tabbar/f.png",
						"text": "星控"
					},
					{
						"pagePath": "/pages/tabBar/order/order",
						"iconPath": "/static/tabbar/ft3.png",
						"selectedIconPath": "/static/tabbar/ft3_in.png",
						"text": "订单"
					},
					{
						"pagePath": "/pages/tabBar/my/my",
						"iconPath": "/static/tabbar/ft4.png",
						"selectedIconPath": "/static/tabbar/ft4_in.png",
						"text": "我的"
					},
				]
			}
        },
		methods: {
			navigatorTo(params) {
				uni.switchTab({
					url: params,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	//底部安全距离
	.tabBarAuto{
		padding-bottom: 0;  
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom);
	}
	.TabBar {
		position: fixed;
		bottom: 0;
		left: 0;
		height: 100upx;
		width: 750upx;
		background-color: #fff;//white
		z-index: 999;
	}
	.tab {
		width: 150upx;
		height: 100upx;
		text-align: center;
		position: relative;
		.plain{
			margin-top:8upx;
			width: 48upx;
			height: 48upx;
		}
		.special {
			width: 80upx;
			height: 80upx;
		}
		.text {
			text-align: center;
			line-height:1.7;
			font-size: 24upx;
			color: #8a8a8a;
			&.active {
				color: #5cc69a;
			}
		}
		&:nth-child(3) {
			margin-top: -25upx;
			height:120upx;
		}
	}
	/* tabbar */
	.centerIcon {
		position: fixed;
		width: 100%;
		height: 123upx;
		bottom: 0;
		left:0;
		display:flex;
		align-items:flex-start;
		justify-content:center;
		z-index:998;
	}
	.centerIcon-img {
		width: 80upx;
		height: 80upx;
	}
</style>
