<template>
	<view>
		<view v-if="option.isModal" @touchmove.stop.prevent="catchtouchmove" :class="{ move: isShow }" @click="close" class="select_date_bg"></view>
		<view class="select_date" :class="{ move: isShow && option.isModal, init: !option.isModal }">
			<view v-if="option.isModal" class="head">
				<text>选择日期</text>
				<text @click="close">X</text>
			</view>
			<view class="week">
				<view :class="{ weekend: index == 0 || index == 6 }" v-for="(item, index) in weekData" :key="index">{{ item }}</view>
			</view>
			<scroll-view scroll-y class="main" :class="{ init: !option.isModal ,show_submit:option.isShowSubmit}">
				<view class="list" v-for="(item, index) in totalDate" :key="index">
					<view class="title">{{ titleDateFormat(item.info[0].date) }}</view>
					<view class="date">
						<view
							@click="clickDay(index, y)"
							:class="{
								range_space: x.isRangeStyle,
								choosed: (x.isChoosed || x.isRangeStart || x.isRangeEnd)  && !x.isSpace,
								disabled: x.isDisadled,
								weekend: x.isWeekend && !x.isDisadled
							}"
							v-for="(x, y) in item.info"
							:key="y"
						>
							<view v-if="!x.isDayOne && !x.isDayTwo && !x.isDayThree">{{ x.day }}</view>
							<view v-if="x.isDayOne">今天</view>
							<view v-if="x.isDayTwo">明天</view>
							<view v-if="x.isDayThree">后天</view>
							<view v-if="x.isChoosed && !x.isSpace">选择</view>
							<view class="price" v-if="x.Price">￥{{x.Price}}</view>
							<view v-if="x.currentRangeStartDate && !x.isSpace">入住</view>
							<view v-if="x.currentRangeEndDate">离店</view>
							<view v-if="x.currentRangeEndDate" class="num">共{{ currentDateNum }}晚</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view v-if="(option.isModal || option.isShowSubmit) && isShow" @click="clickSubmit" class="footer"><view :class="{ disabled: isDisabledBtn }" hover-class="hover">确定</view></view>
		</view>
	</view>
</template>

<script>
export default {
	props: ['option','goodsDateTime'], //配置参数
	data() {
		return {
			weekData: ['日', '一', '二', '三', '四', '五', '六'],
			totalDate: [],
			chooseOneDate: '', //单选模式当前点击的日期
			currentRangeStartDate: '', //区域选择模式当前点击的开始日期
			currentRangeEndDate: '', //区域选择模式当前点击的结束日期
			outIndex: 0, //当前点击外索引
			innerIndex: 0, //当前点击内索引
			isShow: false
		};
	},
	activated(){
		console.log('更新了组件激活了')
	},
	mounted() {
		console.log('加载了组件')
		if(!this.option.isModal){
			setTimeout(()=>{
				this.open();
			},0)
		}
	},
	watch: {
		isShow(n) {
			if (n) {
				this.dateFirstInit();
				if(!this.totalDate.length){
					console.log('获取到了数据')
					this.totalDateInit();
				}
			}
		}
	},
	computed: {
		currentDateNum() {
			//当前起始日期与结束日期之间的天数
			return this.dateSpace(this.currentRangeStartDate, this.currentRangeEndDate);
		},
		isDisabledBtn() {
			if (this.option.isRange) {
				return !(this.currentRangeStartDate && this.currentRangeEndDate);
			} else {
				return !this.chooseOneDate;
			}
		}
	},
	methods: {
		catchtouchmove() {
			return;
		},
		titleDateFormat(date) {
			//2019年9月格式化
			const _arr = date.split('-');
			return `${_arr[0]}年${_arr[1] - 0}月`;
		},
		getNextMonth(AddDayCount = 6, date = new Date()) {
			//获取x个月后的日期
			if (typeof date !== 'object') {
				date = date.replace(/-/g, '/');
			}
			let dd = new Date(date);
			dd.setMonth(dd.getMonth() + AddDayCount);
			let y = dd.getFullYear();
			let m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1;
			let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
			return y + '-' + m + '-' + d;
		},
		getNextDate(day = 1, date = new Date()) {
			var dd = new Date(date);
			dd.setDate(dd.getDate() + day);
			var y = dd.getFullYear();
			var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1;
			var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
			return y + '-' + m + '-' + d;
		},
		noModalSubmit() {
			if (!this.option.isModal && !this.option.isShowSubmit) {
				setTimeout(()=>{
					this.clickSubmit();
				},500)
			}
		},
		clickSubmit() {
			if (!this.isDisabledBtn) {
				//点击确定逻辑
				if (!this.option.isRange) {
					//单选
					this.$emit('change', {
						currentDate: this.chooseOneDate
					});
				} else {
					// 区域选择
					this.$emit('change', {
						startDate: this.currentRangeStartDate,
						endDate: this.currentRangeEndDate,
						dateNum: this.currentDateNum
					});
				}
				this.close();
			}
		},
		dateFirstInit() {
			//首次数据初始化
			if (!this.option.isRange) {
				//单选
				this.chooseOneDate = this.option.chooseOneDate ? this.option.chooseOneDate : this.getNextDate(0);
				this.oneChooseFirstInit();
			} else {
				//区间选择
				this.currentRangeStartDate = this.option.currentRangeStartDate ? this.option.currentRangeStartDate : this.getNextDate(0);
				this.currentRangeEndDate = this.option.currentRangeEndDate ? this.option.currentRangeEndDate : this.getNextDate(1);
				this.rangeChooseFirstInit();
				this.spaceStyleRander();
			}
		},
		oneChooseFirstInit() {
			//首次引用单选初始化
			this.clearOneChoose();
			this.totalDate.forEach(x => {
				x.info.forEach(a => {
					if (a.date == this.chooseOneDate) {
						a.isChoosed = true;
					}
				});
			});
		},
		rangeChooseFirstInit() {
			//首次引用复选初始化
			this.clearRangeChoose();
			this.totalDate.forEach(x => {
				x.info.forEach(a => {
					if (a.date == this.currentRangeStartDate) {
						a.currentRangeStartDate = a.date;
						a.isRangeStart = true;
					}
					if (a.date == this.currentRangeEndDate) {
						a.currentRangeEndDate = a.date;
						a.isRangeEnd = true;
					}
				});
			});
		},

		close() {
			this.isShow = false;
		},
		open() {
			this.isShow = true;
		},
		clickDay(outIndex, innerIndex) {
			this.outIndex = outIndex;
			this.innerIndex = innerIndex;
			if (this.option.isRange) {
				console.log()
				this.chooseRangeInit();
			} else {
				this.chooseOneInit();
			}
		},
		chooseRangeInit() {
			//区域选择点击逻辑
			const _item = this.totalDate[this.outIndex].info[this.innerIndex];
			if (!_item.isDisadled && !_item.isSpace) {
				if (!this.currentRangeStartDate && !this.currentRangeEndDate) {
					//选择清空状态
					_item.currentRangeStartDate = _item.date;
					_item.currentRangeEndDate = '';
					_item.isRangeStart = true;
					this.currentRangeStartDate = _item.currentRangeStartDate;
					this.currentRangeEndDate = '';
					return;
				}
				if (this.currentRangeStartDate && this.currentRangeEndDate) {
					//选择中-第一次点击
					this.clearRangeChoose();
					_item.currentRangeStartDate = _item.date;
					_item.currentRangeEndDate = '';
					_item.isRangeStart = true;
					this.currentRangeStartDate = _item.currentRangeStartDate;
					this.currentRangeEndDate = '';
					this.spaceStyleRander();
					return;
				}
				if (this.currentRangeStartDate && !this.currentRangeEndDate) {
					//选择好了--第二次点击
					if (new Date(_item.date) > new Date(this.currentRangeStartDate)) {
						this.checkOut();
						return;
					} else {
						// 离店比入住小
						this.clearRangeChoose();
						_item.currentRangeStartDate = _item.date;
						_item.currentRangeEndDate = '';
						_item.isRangeStart = true;
						this.currentRangeStartDate = _item.currentRangeStartDate;
						this.currentRangeEndDate = '';
						return;
					}
				}
			}else{
				this.checkOut();
			}
		},
		// 离店点击
		checkOut(){
			// *****日历价格加入逻辑
			// console.log('入住日期：',this.currentRangeStartDate)
			// console.log('离店日期：',_item)
			const _item = this.totalDate[this.outIndex].info[this.innerIndex];
			const goodsDateTime = this.goodsDateTime;
			let toastText = '';
			let goodDay=0;//计算选择的天数
			goodsDateTime.map(item=>{
				if(new Date(item.DayTime)>=new Date(this.currentRangeStartDate)&&
					new Date(item.DayTime)<new Date(_item.date)
				){
					// console.log(item,'选中的日历范围')
					goodDay+=1;
					if(!item.Stock){
						toastText = item.DayTime+'为不可选日期！';
					}
				}
			})
			// 计算相差天数
			let time_diff = new Date(_item.date).getTime() - new Date(this.currentRangeStartDate).getTime();
			let day = Math.floor(time_diff / (24 * 3600 * 1000));
			console.log(day,'相差天数');
			// 判断选择的天数，是否存在日历价格里
			if(day!==goodDay)return;
			if(toastText){
				uni.showToast({
					title:toastText,
					icon:'none',
					duration:3000
				})
				// 取消初始日期选择
				this.clearRangeChoose();
				// _item.currentRangeStartDate = _item.date;
				_item.currentRangeEndDate = '';
				// _item.isRangeStart = true;
				this.currentRangeStartDate = '';
				this.currentRangeEndDate = '';
				return;
			}

			// ******日历价格加入逻辑end
			// 正常选择范围
			_item.currentRangeEndDate = _item.date;
			_item.isRangeEnd = true;
			this.currentRangeEndDate = _item.currentRangeEndDate;
			this.spaceStyleRander();
			this.noModalSubmit();
		},
		spaceStyleRander() {
			//区间样式渲染
			this.totalDate.forEach(x => {
				x.info.forEach(a => {
					if (!a.isSpace && new Date(a.date) > new Date(this.currentRangeStartDate) && new Date(a.date) < new Date(this.currentRangeEndDate)) {
						a.isRangeStyle = true;
					} else {
						a.isRangeStyle = false;
					}
				});
			});
		},
		chooseOneInit() {
			//单选点击逻辑
			const _item = this.totalDate[this.outIndex].info[this.innerIndex];
			if (!_item.isDisadled && !_item.isSpace) {
				this.clearOneChoose();
				this.chooseOneDate = _item.date;
				_item.isChoosed = true;
				this.noModalSubmit();
			}
		},
		clearRangeChoose() {
			//清楚区间选择状态
			this.totalDate.forEach(x => {
				x.info.forEach(a => {
					a.currentRangeStartDate = '';
					a.currentRangeEndDate = '';
					a.isRangeStart = false;
					a.isRangeEnd = false;
					a.isRangeStyle = false;
				});
			});
		},
		clearOneChoose() {
			//清楚单选选择状态
			this.totalDate.forEach(x => {
				x.info.forEach(a => {
					if (a.isChoosed) {
						a.isChoosed = false;
					}
					a.currentRangeStartDate = '';
					a.currentRangeEndDate = '';
				});
			});
		},
		getMaxDate(date) {
			//获取某一月份的最大日期数，参数传递类似2019-12-15，返回31
			let _arr = date.split('-');
			return new Date(_arr[0], _arr[1], 0).getDate();
		},
		getMonthBetween(date1, date2) {
			var _date1 = date1.split('-');
			_date1 = parseInt(_date1[0]) * 12 + parseInt(_date1[1]);
			var _date2 = date2.split('-');
			_date2 = parseInt(_date2[0]) * 12 + parseInt(_date2[1]);
			return Math.abs(_date1 - _date2) + 1;
		},
		weekInit(date) {
			//根据日期获得星期几
			var dateArray = date.split('-');
			var date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
			var week = '0123456'.charAt(date.getDay());
			return week;
		},
		totalDateInit() {
			let _dateArr = [];
			let _initStartDate = this.option.initStartDate ? this.option.initStartDate : this.getNextDate(0);
			let _initEndDate = this.option.initEndDate ? this.option.initEndDate : this.getNextMonth(4);
			const _dateNum = this.getMonthBetween(_initStartDate, _initEndDate);
			const _arrStart = _initStartDate.split('-');
			const _arrEnd = _initEndDate.split('-');
			let _year = _arrStart[0] - 0;
			let _month = _arrStart[1] - 0;
			let _day = _arrStart[2] - 0;
			let _dayEnd = _arrEnd[2] - 0;
			this.totalDate = [];
			this.totalDate[0] = {};
			this.totalDate[0]['info'] = [];
			let _objMonth = '';
			_dateArr[0] = `${_year}-${_month < 10 ? '0' + _month : _month}-${_day < 10 ? '0' + _day : _day}`;
			let _num = 0;
			let _objYear = _year;
			for (var i = 1; i < _dateNum; i++) {
				let _obj = {};
				let _objDay = _day;
				if (i == _dateNum - 1) {
					_objDay = _dayEnd;
				}
				if (_month < 12 && i < _dateNum) {
					_month++;
					_objMonth = _month;
					_dateArr.push(`${_objYear}-${_objMonth < 10 ? '0' + _objMonth : _objMonth}-${_objDay < 10 ? '0' + _objDay : _objDay}`);
				} else if (_month == 12 && i < _dateNum) {
					_month = 1;
					_objYear++;
					_dateArr.push(`${_objYear}-01-${_objDay < 10 ? '0' + _objDay : _objDay}`);
				}
				_obj['info'] = [];
				this.totalDate.push(_obj);
			}
			this.totalDate.forEach((x, y) => {
				const _arr = _dateArr[y].split('-');
				const _endDate = _arr[2] - 0;
				let _totalDate = this.getMaxDate(_dateArr[y]) - 0;
				for (var i = 1; i <= _totalDate; i++) {
					let _currentDate = `${_dateArr[y].split('-')[0]}-${_dateArr[y].split('-')[1]}-${i < 10 ? '0' + i : i}`;
					let _obj = {
						date: _currentDate,
						day: i,
						isDisadled: true,
						isChoosed: false,
						isRangeStart: false,
						isRangeEnd: false,
						currentRangeStartDate: '',
						currentRangeEndDate: '',
						isRangeStyle: false,
						Stock:0,//库存
						Price:0,//价格
						status:false,//可选状态
					};
					// 处理今天明天后天
					if (this.getNextDate(0) == _obj.date) {
						_obj.isDayOne = true;
					} else if (this.getNextDate(1) == _obj.date) {
						_obj.isDayTwo = true;
					}
					if (this.getNextDate(2) == _obj.date) {
						_obj.isDayThree = true;
					}

					// 处理周末加亮
					if (this.weekInit(_currentDate) == 0 || this.weekInit(_currentDate) == 6) {
						_obj.isWeekend = true;
					}
					// *********日历价格加入逻辑
					this.goodsDateTime.map(good=>{
						if(good.DayTime===_obj.date){
							_obj.Price = good.Price;
							_obj.Stock = good.Stock;
							if(good.Stock){
								_obj.isDisadled = false;
							}
						}
					})
					// *******日历价格加入逻辑end
					if (this.totalDate.length <= 1) {
						if (y == 0 && (i < _day || i > _dayEnd)) {
							_obj.isDisadled = true;
						}
					} else {
						if ((y == 0 && i < _day) || (y == this.totalDate.length - 1 && i > _dayEnd)) {
							_obj.isDisadled = true;
						}
					}
					x['info'].push(_obj);
				}
				// 处理星期
				let weekDate = `${_dateArr[y].split('-')[0]}-${_dateArr[y].split('-')[1]}-01`;
				for (var i = 0; i < this.weekInit(weekDate); i++) {
					x['info'].unshift({ date: '', date: _dateArr[y], isSpace: true });
				}
			});
		},
		dateSpace(sDate1, sDate2) {
			//sDate1和sDate2是2006-12-18格式 得出量日期之间的天数
			var dateSpan, tempDate, iDays;
			sDate1 = Date.parse(sDate1);
			sDate2 = Date.parse(sDate2);
			dateSpan = sDate2 - sDate1;
			dateSpan = Math.abs(dateSpan);
			iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
			return iDays;
		}
	}
};
</script>

<style lang="scss" scoped>
.select_date_bg {
	position: fixed;
	top: -10vh;
	left: 0;
	width: 100%;
	height: 10vh;
	background-color: rgba(0, 0, 0, 0.2);
	z-index: 1000;
	transition: all 0.2s;
	&.move {
		top: 0vh;
	}
}
.select_date {
	width: 100%;
	height: 90vh;
	position: fixed;
	top: 100%;
	left: 0;
	background-color: #fff;
	z-index: 10001;
	transition: all 0.2s;
	&.move {
		top: 10vh;
	}
	&.init {
		top: 0;
		height: 100vh;
	}
	> .footer {
		height: 100rpx;
		width: 90%;
		margin: 0 auto;
		background-color: #fff;
		overflow: hidden;
		> view {
			background-color: $primary;
			color: #fff;
			font-size: 26rpx;
			height: 70rpx;
			line-height: 70rpx;
			margin-top: 15rpx;
			text-align: center;
			&.hover {
				background-color: $primary-hover;
			}
			&.disabled {
				background-color: #ccc;
			}
		}
	}

	> .head {
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		position: relative;
		> text {
			&:nth-child(1) {
			}
			&:nth-child(2) {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 20rpx;
				color: $primary;
			}
		}
	}

	> .main {
		height: calc(90vh - 240rpx);
		&.init {
			height: calc(100vh - 80rpx);
		}
		&.show_submit{
			height: calc(100vh - 180rpx);
		}
		.list {
			> .date {
				padding: 0 25rpx;
				display: flex;
				flex-wrap: wrap;
				> view {
					width: 100rpx;
					height: 100rpx;
					text-align: center;
					padding: 10rpx 0;
					position: relative;
					> view {
						&:nth-child(1) {
							font-size: 30rpx;
							color: #333;
							height: 60rpx;
							line-height: 60rpx;
						}
					}
					&.disabled {
						background-color: #eee;
						> view {
							color: #999;
						}
					}
					&.weekend {
						> view {
							color: $primary;
						}
					}
					&.choosed {
						background-color: $primary;
						border-radius: 10rpx;
						> view {
							color: #fff;
							font-size: 22rpx;
							height: 30rpx;
							line-height: 30rpx;
							&.num {
								position: absolute;
								width: 80rpx;
								text-align: center;
								top: -50rpx;
								left: 10rpx;
								background-color: rgba(0, 0, 0, 0.5);
								color: #fff;
							}
						}
					}
					&.range_space {
						background: rgba($primary, 0.2);
						> view {
							color: #333;
						}
						.price{
							color:$primary;
						}
					}
				}
			}
			> .title {
				font-size: 30rpx;
				color: #000;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	> .week {
		height: 80rpx;
		padding: 0 25rpx;
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #ccc;
		> view {
			width: 100rpx;
			text-align: center;
			font-size: 30rpx;
			color: #333;
			&.weekend {
				color: $primary;
			}
		}
	}
}
.price{
	color:$primary;
	font-size:20upx;
	height:25upx;line-height:25upx;
}
</style>
