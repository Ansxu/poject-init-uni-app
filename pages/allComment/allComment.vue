<template>
	<view>
		<view class="navigation">
			<!-- tab切换 -->
			<view class="change-type p30 flex-center">
				<view v-for="(item,index) in typeList" :key='index' class="type-item" :class="[currentType === index ? 'active' : '']"
				 @click="changeType(index)">
					{{ item }} ({{ (info.length&&info[index])||0}})
				</view>
			</view>
			<!-- 用户评论 -->
			<comment-item  v-for="(item,index) in list" :key="index" :item="item"></comment-item>
			
			<uni-load-more v-if="list.length&&list.length>4" :loadingType="loadingType"></uni-load-more>
			<noData v-if="!list.length"></noData>
		</view>
	</view>
</template>

<script>
	import {
		post,get,
		navigate,
		navigateBack,
		toast,editTime
	} from '@/utils';
	export default {
		data() {
			return {
				navigateBack,
				navigate,
				typeList: [
					'全部',
					'有图',
					// '最新',
					'好评'
				],
				currentType: 0,
				list: [],
				info:[],
				Id:'',
				Type:0,
				page:1,
				pageSize:10,
			loadingType:0,//上拉的状态：0-loading前；1-loading中；2-没有更多了
				score:1,
				iconUrl:''
			};
		},
		onLoad(options){
			this.Type = options.Type*1||0;
			this.Id = options.Id*1||0;
			this.getList();
			this.getInfo();
		},
		methods: {
			async getList(){
			this.loadingType=1;
				 let params ={
				 }
				 let p = this.judgeUrl(params)
				 console.log(p)
				 const res = await get(p.url,p.params);
				 if(res.code)return;
				 const data = res.data;
				if(data.length<this.pageSize){
					this.loadingType = 2;
				}else{
					this.loadingType = 0;
				}
				 if(this.page==1){
					 this.list = [];
				 }
				 let arr=[];
				 data.map(item=>{
					 arr.push({
						 avatar:item.memberAvatar,
						 name:item.memberName,
						 addTime:editTime(item.addTime),
						 images:item.images,
						 contentText:item.contentText,
						 star:item.star,
						 userId:item.memberId
					 })
				 })
				 console.log(arr)
				 this.list.push(...arr)
			},
			judgeUrl(params){
				let url='';
				let infoUrl='';
				switch(this.Type*1){
					case 0:
						url='Sojourn/GetEvaluateList';
						infoUrl = 'Sojourn/GetEvaluateStatisticInfo';
						params={
						 'p.pageIndex':this.page,
						 'p.pageSize':this.pageSize,
						 'p.type':this.currentType,
						 'p.proId' : this.Id,
						 }
						break;
					case 1:
						url="Travel/GetEvaluateList";
						infoUrl = 'Travel/GetEvaluateStatisticInfo';
						params={
						 'p.pageIndex':this.page,
						 'p.pageSize':this.pageSize,
						 'p.type':this.currentType,
						 'p.proId' : this.Id,
						 }
						break;
					case 2:
						url="Evaluate/GetEvaluateList";
						infoUrl = 'Evaluate/GetEvaluateStatistics';
						params={
						 'parameter.pageIndex':this.page,
						 'parameter.pageSize':this.pageSize,
						 'parameter.type':this.currentType,
						 'parameter.proId' : this.Id,
						 }
						break;
				}
				return {url,infoUrl,params}
			},
			async getInfo(){
				const p  = this.judgeUrl({})
				const res = await get(p.infoUrl,{
					productId:this.Id,
					proId:this.Id
				})
				if(res.code) return;
				if(this.Type==2){
					const data = res.data;
					this.info.push(data.allCount)
					this.info.push(data.havePicCount)
					this.info.push(data.goodCount)
				}else{
					this.info = res.data;
				}
				
			},
			changeType(index) {
				// this.score++
				this.currentType = index;
				this.page=1;
				this.getList();
			}
		},
		onReachBottom() { //上拉加载
			if (this.loadingType === 2)return;
			this.page+=1;
			this.getList();
		},
	}
</script>


<style lang="scss" scoped>
	@import './style';
</style>
score-box-right
