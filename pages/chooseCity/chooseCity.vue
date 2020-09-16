<template>
	<view>
		<view class="content">
			<view class="input-box flex-center">
				<i class="iconfont icon-search"></i>
				<ans-input class="keyword" placeholder="搜索城市" @input="search" @close="search('')" ></ans-input>
			</view>
			<view class="herebox">
				<text class="tit">当前城市:</text><text class="here active" >{{cityName}}</text>
				<text class="here" v-if="cityName!=='全国'" @click="choosecity('全国')">全国</text>
			</view>
			<scroll-view scroll-y class="scr0llbox" :scroll-into-view="toitem" scroll-with-animation=true :style="{'height':height+'px'}">
				<view v-if="list.length" class="city"  v-for="(item1,index1) in list" :key="index1" 
					@click="choosecity(item1.name)">{{item1.name}}
				</view>
				<view v-if="!list.length">
					<view class="item" v-for="(item,key,index) in citylist" :key="index">
						<view class="citytitle" :id="'key'+key">{{key}}</view>
						<view class="citybox">
							<view :class="['city',cityName==item1.name ? 'active' : '']" v-for="(item1,index1) in item" :key="index1" @click="choosecity(item1.name)">{{item1.name}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="zimubox">
			<view class="zimuname" v-for="(item,key,index) in citylist" :key="index" @click="chooseZM(key)">
				{{key}}
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	import {MP} from '@/common/map.js';//h5百度定位
	// #endif

	import {post,get} from '@/utils';
	import cityData from '@/common/cityname.js';
	export default {
		data() {
			return {
				citylist:[],
				list:[],//搜索的列表
				// citylist:cityData,
				height:"",
				toitem:'',
				cityName:"",
				here:"定位中",//当前城市
				// #ifdef APP-PLUS
				//检测是否授权
				isIos: true,
				items: ['iOS', 'Android'],
				current: 0,
				// #endif
				
			}
		},
		onLoad() {
			this.cityName = uni.getStorageSync('cityName');
			this.getData();
			
			let res = uni.getSystemInfoSync()
			this.height = res.windowHeight-uni.upx2px(120);
			// var _this=this
			// // #ifdef MP-WEIXIN
			// this.hasgps()
			// // #endif
			// // #ifdef APP-PLUS||MP-WEIXIN
			// uni.getLocation({
			//     type: 'wgs84',
			// 	geocode: true,
			//     success: function (res) {
			// 		// #ifdef APP-PLUS
			// 		var cityname=res.address.city.replace(/市/,'')
			// 		_this.here=cityname
			// 		// #endif
			// 		// #ifdef MP-WEIXIN
			// 		_this.wxGetCity(res.longitude,res.latitude)
			// 		// #endif
			//         // console.log(res);
			//     },
			// 	fail:function(){
			// 		_this.here="定位失败"
			// 		// #ifdef APP-PLUS
			// 		uni.showModal({
			// 		    content: '定位失败，请在设置中打开聚居旅客的位置权限',
			// 			showCancel: false,
			// 		    success: function (res) {
			// 		        if (res.confirm) {
			// 		            console.log('用户点击确定');
			// 		        }
			// 		    }
			// 		});
			// 		// #endif
			// 	}
			// });
			// // #endif
			// //百度定位
			// // #ifdef H5
			// this.H5getcity()
			// // #endif
		},
		onShow() {
			// #ifdef MP-WEIXIN
			var _this=this
			uni.getLocation({
			    type: 'wgs84',
				geocode: true,
			    success: function (res) {
					console.log(res,'定位')
					// #ifdef APP-PLUS
					var cityname=res.address.city.replace(/市/,'')
					_this.here=cityname
					// #endif
					// #ifdef MP-WEIXIN
					_this.wxGetCity(res.longitude,res.latitude)
					// #endif
			        // console.log(res);
			    },
				fail:function(){
					_this.here="定位失败"
					// #ifdef APP-PLUS
					uni.showModal({
					    content: '定位失败，请在设置中打开聚居旅客的位置权限',
						showCancel: false,
					    success: function (res) {
					        if (res.confirm) {
					            console.log('用户点击确定');
					        }
					    }
					});
					// #endif
				}
			});
			// #endif
		},
		methods: {
			getData(){
				get('Help/GetCityList').then(res=>{
					this.citylist = res.data;
					console.log(this.citylist,'list')
				})
			},
			search(e){
				let list =[];
				if(e){
					Object.keys(this.citylist).map(key=>{
						this.citylist[key].map(item=>{
							if(item.name.indexOf(e)!==-1){
								list.push(item)
							}
						})
					})
				}
				this.list = list;
			},
			H5getcity(){
				// var _this=this
				// MP(1).then(BMap => {
				// 	let myCity = new BMap.LocalCity()
				// 	myCity.get(function (res) {
				// 		var cityname=res.name.replace(/市/,'')
				// 		_this.here=cityname;console.log(res,"$$$$$$$")
				// 	})
				// })
			},
			//小程序解析经纬度获取城市
			// #ifdef MP-WEIXIN
			wxGetCity(lon,lat){
				var _this=this
				wx.request({
					url:'https://api.map.baidu.com/reverse_geocoding/v3/?ak=3wwDKCk09o6hU0PK1605QUXOCBqGVHGx&location=' + lat + ',' + lon + '&output=json&coordtype=wgs84ll',
					data: {},
					header: {
						'content-type': 'application/json' // 默认值
					},
					success (res) {
					    console.log(res)
						var cityname=res.data.result.addressComponent.city.replace(/市/,'')
						_this.here=cityname
					}
				})
			},
			hasgps(){
				uni.getSetting({
				  success: (res) => {
					if (!res.authSetting['scope.userLocation'])
					  wx.showModal({
						content: '检测到您没打开聚居旅客的定位权限，是否去设置打开？',
						confirmText: "确认",
						cancelText: "取消",
						success: function (res) {
						  console.log(res);
						  //点击“确认”时打开设置页面
						  if (res.confirm) {
							console.log('用户点击确认')
							wx.openSetting({
							  success: (res) => { }
							})
						  } else {
							console.log('用户点击取消')
						  }
						}
					  });
				  }
				})
			},
			// #endif
			chooseZM(zm){
				this.toitem='key'+zm;
			},
			choosecity(name){
				this.cityName=name;
				uni.setStorageSync('cityName',name)
				uni.showToast({
				  title: '已定位到该城市',
				  success(){
					setTimeout(res=>{
						uni.navigateBack({})
					},1500)
				  }
				})
			},
			choosecity2(name){
				if(name=="定位中"){
					uni.showToast({
					  title: '城市定位中，请稍候再试！',
					  icon:"none"
					})
					return
				}
				if(name=="定位失败"){
					uni.showToast({
					  title: '定位失败，请在设置中打开聚居旅客的位置权限',
					  icon:"none"
					})
					return
				}
				this.cityName=name;
				uni.setStorageSync('cityName',name)
				uni.showToast({
				  title: '已定位到该城市',
				  success(){
					setTimeout(res=>{
						uni.navigateBack({})
					},1500)
				  }
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: #fff;
	}
	.input-box{
		background:#f2f2f2;
		border-radius:40upx;
		line-height:80upx;
		height:80upx;
		width:95%;
		margin:0 auto;
		padding:0 20upx;
		.keyword{
			padding-left:7upx; 
		}
	}
	.scr0llbox{
		width: 100%;
	}
.content{
	box-sizing: border-box;
	width: 100%;
	// padding: 20upx 0;
}
.citytitle{
	background:#f2f2f2;
	padding: 10upx 30upx;
	font-size:32upx;
}
.citybox{
	// display: flex;
	// flex-wrap: wrap;
}
.city{
	padding: 20upx 30upx;
	border-bottom:1upx solid #f2f2f2;
	// width: 180upx;
	// margin: 20upx 0;
	// margin-right: 46upx;
	// background: #eee;
	// text-align: center;
	// border-radius: 4upx;
	// display: flex;
	// align-items: center;
	// justify-content: center;
	// flex-flow:wrap row;
}
.zimubox{
	width: 80upx;
	position: fixed;
	right: 0;
	top: 58%;
	transform: translateY(-50%);
}
.zimuname{
	margin:10upx 20upx;
	width: 40upx;
	line-height: 40upx;
	text-align: center;
	background: #ddd;
	border-radius: 50%;
	font-size: 22upx;
}
.here{
	margin-right: 46upx;
	text-align: center;
	padding: 20upx;
	border-radius: 4upx;
	background: #eee;
	&.ac{
		background: $primary;
		color: #fff;
	}
}
.herebox{
	display: flex;
	align-items: center;
	height: 100upx;
	padding:0 30upx;
	margin-bottom:20upx;
}
.tit{
	color: #000000;
	font-size: 32upx;
	margin-right:20upx;
}
.active{
	background: $primary;
	color: #fff;
}
</style>
