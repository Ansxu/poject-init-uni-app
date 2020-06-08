<template>
	<div class="bgfff">
		<date-price-picker ref="datePicker" @change="changeDatePicker" :option="calendarOption" :goodsDateTime="goodsDateTime"></date-price-picker>
		<div class="dateBox plr30 pb30">
			<h3>入住退房日期</h3>
			<div class="date-time flex-end-between" @click="$refs.datePicker.open()">
				<div class="start">
					<p>入住</p>
					<div class="text">{{calendarOption.currentRangeStartDate}}</div>
				</div>
				<p>- 最少一晚 -</p>
				<div class="end">
					<p>退房</p>
					<div class="text">{{calendarOption.currentRangeEndDate}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import datepricePicker from '@/components/date-price-picker/date-price-picker';
	import { post,navigate,toast,debounce } from '@/utils';
	import { mapState, mapMutations } from "vuex"; //vuex辅助函数
	export default {
		components:{
			datepricePicker
		},
		data() {
			return {
				navigate,
				userId:'',
				token:'',
				Id:0,
				// 地图图标数组
			    markers: [{
			      iconPath: "http://xqk.wtvxin.com/images/wxapp/icons/house.png",
			      latitude: 0,
			      longitude: 0,
				  width:50,
				  height: 50,
				  anchor: {x: .5, y: .5}
			    }],
				// 产品日期对应价格数组
				goodsDateTime: [],
				// 产品评论列表
				commentList :[],
				// 订单评价汇总信息
				OrderCommentInfo: {}
			}
		},
		onLoad(options) {
			console.log("传递过来的参数:",options)
			let Id = options.Id;
			this.Id = options.Id;
			this.userId = uni.getStorageSync('userId');
			this.token = uni.getStorageSync('token');
			this.getDetail()
			this.getGoodsDateTime(Id)
			this.getOrderCommentInfo(Id)
			this.getOrderCommentList()
		},
		computed:{
			// 监听日历的变化
			...mapState(['lng','lat','cityName','cityCode','calendarOption']),
		},
		methods: {
			// 全屏预览图片
			previewImage(index) {
				previewImage(this.details.PicData,index)
			},
			...mapMutations(['update']),
			// 获取产品日期价格
			async getGoodsDateTime (Id){
				let res = await post('Goods/GoodsDateTime', {ProId:Id})
				this.goodsDateTime = res.data;
			},
			async getDetail() {
				let res = await post('Goods/Goodsxq_yd',{
					Id: this.Id,
					UserId:this.userId,
					Token:this.token
					})
				// console.log(`详情返回:`,res)
				// 正则增加富文本的样式
				res.data.BookNote = res.data.BookNote.replace(/<img/g, '<img style="max-width:100%;"');
				res.data.QJDesc = res.data.QJDesc.replace(/<img/g, '<img style="max-width:100%;"');
				res.data.Synopsis = res.data.Synopsis.replace(/<img/g, '<img style="max-width:100%;"');
				res.data.ContentDetail = res.data.ContentDetail.replace(/<img/g, '<img style="max-width:100%;"');
				res.data.DevLogo = res.data.DevLogo.replace(/<img/g, '<img style="max-width:100%;"');
				// console.log("我是精度",parseFloat(res.data.Lng))
				// 经纬度
				// res.data.Lng = parseFloat(res.data.Lng)
				// res.data.Lat = parseFloat(res.data.Lat)
				// 地图标记
				this.markers[0].latitude = res.data.Lat
				this.markers[0].longitude = res.data.Lng
				// 住房价格
				this.details = res.data
			},
			changeSwiper(e){
				this.currentSwiper=e.detail.current;
			},
			// 更改日历
			changeDatePicker(e) {
				// console.log("我是日历出现变更",e)
				let calendarOption = this.calendarOption;
				calendarOption.currentRangeStartDate = e.startDate;
				calendarOption.startDate = e.startDate.substring(e.startDate.indexOf('-')+1);
				calendarOption.currentRangeEndDate = e.endDate;
				calendarOption.endDate = e.endDate.substring(e.endDate.indexOf('-')+1);
				calendarOption.dateNum = e.dateNum;
				this.update({
					calendarOption:calendarOption
				})
			},
			// 立即预订
			submit(){
				if(!this.isSubmit){
					toast('请选择可预订的日期！');
					return;
				}
				navigate('product/confirmOrder/confirmOrder',{id:this.Id})
			}

		}
	}
</script>
<style scoped lang="scss">
@import './style.scss';
</style>