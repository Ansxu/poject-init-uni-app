<template>
	<view>
		<view class="head-box bg-blue">
			<!-- <view class="leftArrow">
				<image src="/static/subject/zuojiantou.png" mode="aspectFill"></image>
			</view> -->
			<view class="pay-content white">
				<view class="success flex-center-center pt30">
					<i class="iconfont icon-chahao" v-if="!status"></i>
					<i class="iconfont icon-radio-ok" v-else></i>
					<view class="success-text blod">{{status?'支付成功':'支付失败'}}</view>
				</view>
				<view class="price bold flex-center mt30">
					<view class="unit">¥</view>
					<view class="pay-price">{{money}}</view>
				</view>
				<view class="button-box flex-center mt30 p65">
					<view @click="switchTab('tabBar/index/index')" class="backIndex button-item flex-center-center">返回首页</view>
					<view @click="goDetail" class="checkOrder button-item flex-center-center"
					v-if="Type!==4&&Type!==6&&Type!==7"
					>查看订单</view>
				</view>
			</view>
		</view>
		<!-- 为你推荐 -->
		<view class="recommend-box flex-center-center">
			<view class="recommend flex-center-center">
				<image src="/static/subject/left.png" mode="aspectFill"></image>
				<view class="recommend-text blod">为你推荐</view>
				<image src="/static/subject/right.png" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 列表 -->
		<div class="list">
			<lvyouCard  v-for="(item,index) in list" :key='index' 
			:item="item" :isTag="true" @onClick="goProDetail(item)"></lvyouCard>
		</div>
		<noData v-if="!list.length"></noData>
		<uni-load-more :loadingType="loadingType" v-else />
	</view>
</template>

<script>
import lvjuCard from '@/components/lvjuCard/lvjuCard.vue';
import lvyouCard from '@/components/lvyouCard/lvyouCard.vue';

import { post, navigate, navigateBack, toast, redirect,switchTab } from '@/utils';
export default {
	components: {
		lvjuCard,
		lvyouCard
	},
	data() {
		return {
			navigate,
			switchTab,
			userId:'',
			token:'',
			money:0,
			OrderNo:'',
			status: 0,//0-失败,1-成功
			Type:0,//0-旅居，1-旅游,2-商城/限时抢购/购物车，3，拼团，4-充值余额，5积分兑换，6积分充值，7聚乐豆充值
			page:1,
			pageSize:5,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			list:[],
		}
	},
	onLoad(option) {
		this.status = option.status*1;
		this.money = option.money || 0;
		this.Type = option.type*1;
		this.OrderNo = option.OrderNo;
		this.userId = uni.getStorageSync("userId");
		this.token = uni.getStorageSync("token");
		this.getList();
	},
	methods: {
		goDetail(){
			let url = '';
			let type = this.Type;
			console.log(this.Type)
			if(type==0||type==1||type==2||type==3){
				url="mycenter/order/orderdetails"
			}else if(type==5){
				url="buttonType/jifenshangcheng/duihuanjilu/orderdetails"
			}
			let orderArr = this.OrderNo&&this.OrderNo.split(',')
			if(orderArr.length>1){
				url = 'mycenter/order/order';
			}
			redirect(url,{
				order:type,
				type,
				orderId:this.OrderNo
			})
		},
		goProDetail(item){
			let url='';
			// type:0-旅游;1-旅居
			if(item.type){
				url = 'buttonType/lvju/detail/detail';
			}else{
				url = 'buttonType/kuailelvyou/detail/detail';
			}
			redirect(url,{id:item.id})
		},
		async getList(){
			const res = await post('Condensation/SearchProduct',{
				 "UserId": this.userId,
				  "Token": this.token,
				  "PageIndex": this.page,
				  "PageSize": this.pageSize,
				  "SortByPrice": 0,//按照价格排序0: 无 1: 升序 2: 降序 ,
				  "SortBySalesVolume": 0,//按照销量排序0: 无 1: 升序 2: 降序 ,
				  "Keywrod": ''
			})
			if(res.code)return;
			const data = res.data;
			if (this.page === 1) {
				this.list = [];
			}
			if (data.length < 10) {
				this.loadingType = 2;
			} else {
				this.loadingType = 0;
			}
			this.list.push(...data);
		},
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.loadingType != 2) {
			this.page+=1;
			this.getList();
		}
	}
};
</script>

<style lang="scss" scoped>
@import './style';
.iconfont{
	font-size:50upx;
	color:#fff;
	margin:0 20upx;
}
</style>
