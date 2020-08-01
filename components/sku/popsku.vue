<template>
  <div class="mengban">
        <!-- content -->
        <div class="main" id="main">
            <div @click="hidePopup" class="close">+</div>
            <div class="top-box">
                <div class="proinfo">
                    <div class="img-box">
                        <img :src="selectSku.img||proInfo.img" alt="">
                    </div>
                    <div class="right">
                        <div>
                            <!-- <p class="tit">{{proInfo.name}}</p> -->
                            <span><span class="fuhao">￥</span>{{selectSku.price||proInfo.price}}</span>
                            <p class="font_four">库存：{{selectSku.num||proInfo.stock}}</p>
                            <p v-if="skuAll.length">{{selectSku.text?'已选：':'请选择商品规格'}}{{selectSku.text}}</p>
                                <!-- :SpecInfo.PunitPrice -->
                        </div>
                    </div>
                </div>
                <!-- <div class="guige" v-for="(item, index) in specList" :key="index">
                    <p>{{index}}</p>
                    <div class="flex-wrap">
                        <span :class="{'active':ite.name==SpecValue[index]}" @click="cliTag(index,ite.name)" class="ali-c jus-c" v-for="(ite, ind) in item" :key="ind">{{ite.name}}</span>
                    </div>
                </div> -->
                <!-- <div class="sku" v-for="(sku,skuIndex) in sku" :key="skuIndex">
                  <div class="spcestitle">{{sku}}</div>
                  <div class="specs">
                    <div
                      class="spec"
                      :class="{'specactive':item.selectStatus}"
                      :style="item.status?'color:#999;':''"
                      v-for="(item,index) in sku"
                      :key="index"
                      @click="clickSelectSku(skuIndex,index,item)"
                    >
                      <text>{{item.val}}{{item.selectStatus}}</text>
                    </div>
                  </div>
                </div> -->
                
                <div class="sku" v-for="(skus,val) in thisSku" :key="val">
                  <div class="spcestitle">{{val}}</div>
                  <div class="specs">
                    <div
                      class="spec"
                      :class="{'specactive':item.selectStatus}"
                      :style="item.status?'color:#999;':''"
                      v-for="(item,index) in skus"
                      :key="index"
                      @click="onSelectSku(val,index)"
                    >
                      <text>{{item.val}}</text>
                    </div>
                  </div>
                </div>

                <div class="buyNum">
                    <span>购买数量</span>
                    <div class="numBox">
                        <span @click="suan(1)" class="last">-</span>
                        <input type="number" v-model="goodsNum" disabled>
                        <span @click="suan(2)" class="add">+</span>
                    </div>
                </div>
            </div>
            <div class="footerBtn">
              <!-- <p v-if="isLimint==1&&starTimetype==0" class="flex1 jus-c ali-c">即将开始 敬请期待</p>
              <p v-else-if="isLimint==1&&starTimetype==2" class="flex1 jus-c ali-c btn_ccc">秒杀已结束</p> -->
              <!-- <block v-else> -->
              <div class="btnBox">
                <block v-if="submitBtnType">
                  <p class="btn_red" @click="success(submitBtnType)">确认</p>
                </block>
                <block v-else>
                  <p class="addcard" @click="success('addCar')">加入购物车</p>
                  <p class="nowbuy btn_red" @click="success('buy')">立即购买</p>
                </block>
              </div>
            </div>
        </div>
      
  </div>
</template>
<script>
// 获取的sku格式：渲染的数据格式
//   {
//     尺寸:[{
//       selectStatus:false, //选中状态
//       status:true,  //可选状态
//       val:"S"
//     }],
//     颜色:[{
//       selectStatus:false,
//       status:true,
//       val:"白色"
//     }],
//   }
// 获取的skuAll格式：全部sku列表 数组
// [
//   {
//     img:"", //sku图片
//     num:10,  //sku数量
//     price:1, //sku价格
//     text:"白色_S_T恤", //sku组合，下划线分隔
//     value:{    //sku的key和值
//       尺寸:"S",
//       款式:"T恤",
//       颜色:"白色"
//     }
//   },
//   {
//     img:"", //sku图片
//     num:10,  //sku数量
//     price:1, //sku价格
//     text:"白色_S_T恤", //sku组合，下划线分隔
//     value:{    //sku的key和值
//       尺寸:"M",
//       款式:"T恤",
//       颜色:"白色"
//     }
//   },
// ]
export default {
  props: {
    sku: {
      type: Object,
      dafault() {
        return [];
      }
    },
    skuAll: {
      type: Array,
      default() {
        return [];
      }
    },
    proInfo:{
      type:Object,
      default(){
        return {
          img:'',//默认产品图片
          maxbuy:0,//最大购买量
          minbuy:1, //最小购买量
          stock:0,
          price:0,
          name:'',
        };
      }
    },
    // 提交按钮的类型，点击后返回该类型字符串（主要区分确定按钮的功能）；默认展示--立即购买+加入购物车
    // addCar加入购物车  buy立即购买
    submitBtnType:{
      type:[String,Number],
      default:''
    }
  },
  watch:{
    sku:{
      handler(e){
        // 赋值为组件内data声明变量，兼容小程序组件
        console.log('小程序改变',this.proInfo);
        this.thisSku = JSON.parse(JSON.stringify(this.sku));
        this.isUseSku();
        this.init();
        this.setSelectSkuItem();
      },
      deep:true
    },
  },
  data() {
    return {
      showPop:true,
      selectSku: {
        //选中的sku组合
        value: {},
        img: "",
        num: 0,
        price: "",
        text: "", //sku组合用下划线分隔_
        buyNum:1
      },
      datas:{},
      // restock:0,//库存
      goodsNum:1,
      thisSku:{},
      hasSku:true,//是否需要选择sku
    };
  },
  // mounted小程序--只会执行一遍，h5--每次打开都会执行
  mounted() {
    console.log(123)

    // 赋值为组件内data声明变量，兼容小程序组件
    this.thisSku = JSON.parse(JSON.stringify(this.sku));
    this.isUseSku();
    this.init();
  },
  methods: {
    init(){
      this.goodsNum = this.proInfo.minbuy||1;
      this.selectSku.buyNum = this.proInfo.minbuy||1;
    },
    //type =   addCar加入购物车  buy立即购买
    success(type){
      if(this.skuAll.length&&this.hasSku){ 
        uni.showToast({
          title:"请选择商品规格",
          icon:'none'
        })
        return
      };
      this.$emit('success',type,this.selectSku)
    },

    // 确定
    confirmBtn(){
      this.$emit('confirm',this.submitBtnType)
    },
    // 隐藏sku
    hidePopup(){
      this.$emit('close')
    },
    // 选择sku
    onSelectSku(val, index) {
      // 判断是否为不可选状态
      if (this.thisSku[val][index].status) {
        return false;
      }
      // 更改选择sku的状态
      this.thisSku[val].map((oeb, i) => {
        this.$set(this.thisSku[val][i], "selectStatus", false);
      });
      let sku = JSON.parse(JSON.stringify(this.thisSku[val]));
      sku[index].selectStatus = true;
      this.$set(this.thisSku, val, sku);

      this.selectSku.value[val] = this.thisSku[val][index].val;
      // return false;
      // 是否选择完sku属性
      this.checkedSku();
      this.isUseSku();
    },
    // 全部选择完sku属性执行
    checkedSku() {
      //首先，选择后的属性肯定是不会重复的，只会特换选择的sku。
      //再判断选择后的数量是否等于数据返回的属性数量。
      // 只有相等的情况再执行判断，遍历数组，存在相等属性的话+1.
      // 如果相等的数量等于返回数据的属性数量，那就是唯一的sku了

      // 选择sku的数量
      let selectSkuNum = 0;
      Object.keys(this.selectSku.value).map(() => {
        selectSkuNum += 1;
      });
      // 判断sku选择的数量是否全部选择
      let skuAttrNum = 0;
      Object.keys(this.thisSku).map(() => {
        skuAttrNum += 1;
      });
      // 全部选择完sku属性
      if (skuAttrNum === selectSkuNum) {
        this.hasSku = false;
        this.skuAll.map(skuAllItem => {
          // 遍历全部数组的对象，如果存在相同的属性则数量+1
          let skuAllNum = 0;
          Object.keys(skuAllItem.value).map(skuAllItemValue => {
            Object.keys(this.selectSku.value).map(selectItem => {
              if (
                skuAllItemValue === selectItem &&
                skuAllItem.value[selectItem] ===
                  this.selectSku.value[selectItem]
              ) {
                skuAllNum += 1;
              }
            });
          });
          // 判断全部属性相等的数量是否等于sku全部属性的数量
          if (skuAttrNum === skuAllNum) {
            console.log(skuAllItem, "选择的sku");
            const value = this.selectSku.value;
            this.selectSku = {
              num: skuAllItem.num,
              price: skuAllItem.price,
              img: skuAllItem.img,
              text: skuAllItem.text,
              value,
              buyNum:this.goodsNum
            };
            this.proInfo.stock = skuAllItem.num;
            this.goodsNum=this.proInfo.minbuy||1;
            this.$emit("getSkuData", skuAllItem);//更新了sku
          }
        });
      }else{
        this.hasSku = true;
      }
    },
    // 判断可使用的sku
    isUseSku() {
      // 创建一个对象,用于进行添加值判断
      Object.keys(this.thisSku).map(skuItem => {
        // 遍历渲染的sku值，只有跟选中的key值不相同的情况。再把值添加到obj
        let obj = JSON.parse(JSON.stringify(this.selectSku.value));
        this.thisSku[skuItem].map((skuItemValue, skuItemIndex) => {
          // 选择sku的数量 
          let selectSkuNum = 0;
          Object.keys(this.selectSku.value).map(() => {
            selectSkuNum += 1;
          });
          // 判断sku选择的数量是否全部选择
          let skuAttrNum = 0;
          Object.keys(this.thisSku).map(() => {
            skuAttrNum += 1;
          });
          if (selectSkuNum === skuAttrNum) {
            obj[skuItem] = skuItemValue.val;
            const status = this.isUseSku2(obj);
            this.thisSku[skuItem][skuItemIndex].status = status;
          } else if (!this.selectSku.value[skuItem]) {
            obj[skuItem] = skuItemValue.val;
            const status = this.isUseSku2(obj);
            this.thisSku[skuItem][skuItemIndex].status = status;
          }
        });
      });
    },
    // 拿到组合的数据来判断是否有库存
    // 没有选择全部sku的话，拿选中的key和值+遍历的每一个没选中的进行判断，
    // 判断是否有库存

    // 全部选中sku的话，则每个组合都进行判断，是否有库存

    // 每次执行isUseSku2传过来的obj应该只有一个渲染数据this.sku的遍历
    isUseSku2(obj) {
      // true为不可选，false--可选状态
      let status = true;
      // console.log(obj, "obj");
      let objNum = 0;
      Object.keys(obj).map(() => {
        objNum += 1;
      });
      // 渲染全部sku，判断跟boj的值相同剩余可选的sku属性库存
      this.skuAll.map(skuAllItem => {
        let sameNum = 0;
        Object.keys(skuAllItem.value).map(skuAllValueItem => {
          Object.keys(obj).map(bojItem => {
            if (
              skuAllValueItem === bojItem &&
              skuAllItem.value[bojItem] === obj[bojItem]
            ) {
              sameNum += 1;
            }
          });
        });
        // 相等的情况下,判断库存是否大于0，
        // 大于0：状态为可选，跳出
        // 没有一个大于0：则没有库存，状态为禁用
        if (objNum === sameNum) {
          if (skuAllItem.num * 1 > 0) {
            status = false;
            return false;
          }
        }
      });
      return status;
    },
    // 更改数量
		suan(tip) {
      const minbuy = this.proInfo.minbuy;
      const maxbuy = this.proInfo.maxbuy;
      const stock = this.proInfo.stock;
			if (tip == 1) {
				if (this.goodsNum > 1) {
					if (this.goodsNum > minbuy) {
						this.goodsNum--;
					} else {
						this.goodsNum = minbuy;
						uni.showToast({
							title: minbuy + '件起购',
							icon: 'none',
							duration: 1500
						});
            return;
					}
				}
			} else if (tip == 2) {
				if (maxbuy == 0) {
					if (this.goodsNum >= stock) {
						this.goodsNum = stock;
						uni.showToast({
							title: '库存不足！',
							icon: 'none',
							duration: 1500
            });
            return;
					} else {
						this.goodsNum++;
					}
				} else {
					if (stock > this.goodsNum) {
						if (this.goodsNum < maxbuy) {
							this.goodsNum++;
						} else {
							this.goodsNum = maxbuy;
							uni.showToast({
								title: '限购' + maxbuy + '件',
								icon: 'none',
								duration: 1500
							});
              return;
						}
					} else {
						this.goodsNum = stock;
						uni.showToast({
							title: '库存不足！',
							icon: 'none',
							duration: 1500
            });
            return;
					}
				}
      }
      this.selectSku.buyNum = this.goodsNum;
      this.$emit('setBuyNum',this.goodsNum)
    },
    // 设置已选择的sku
    setSelectSkuItem(){
        Object.keys(this.thisSku).map(skuItem=>{
          
        })
    }
		
  }
};
</script>
<style scoped lang="scss">
.mengban{
    .main{
        width: 100vw;
        background-color: #fff;
        border-radius: 20rpx 20rpx 0 0;
        .close{
          font-size: 55rpx;
          transform: rotate(45deg);
          width: 30rpx;
          height: 30rpx;
          position: absolute;
          top: 0;
          right: 10upx;
          line-height:1;
        }
        .top-box{
            padding: 0 30rpx 130rpx;
            .proinfo{
                border-bottom: 1rpx solid #ededed;
                padding-bottom:20upx;
                display:flex;
                align-items:flex-end;
                justify-content:space-between;
                .img-box{
                    width: 200rpx;
                    height: 200rpx;
                    border-radius: 10rpx;
                    border:1rpx solid #ededed;
                    margin-top:-70upx;
                    background-color: #fff;
                    overflow:hidden;
                  img{
                      width: 100%;
                      height: 100%;
                  }
                }
                .right{
                    width: 475rpx;
                    div{
                        width: 450rpx;
                        .tit{
                            font-size: 28rpx;
                            line-height:2;
                            color: #333;
                        }
                        span{
                            color: #f0370b;
                            font-size: 36rpx;
                            font-weight:bold;
                            .fuhao{
                                font-size: 22rpx;
                                font-weight:100;
                            }
                        }
                        .font_four{
                          font-size:24upx;
                          color:#999;
                        }
                    }
                }
            }
            .buyNum{
                height: 100rpx;
                font-size: 28rpx;
                color: #999;
                display:flex;
                align-items:center;
                justify-content:space-between;
                .numBox{
                    width: 200rpx;
                    display:flex;
                    align-items:center;
                    span{
                        font-size: 50rpx;
                        color: #333
                    }
                    .last{
                      padding-right:30upx;
                    }
                    .add{
                      padding-left:30upx;
                    }
                    input{
                      width: 80rpx;
                        height: 44rpx;
                        background-color: #eeeeee;
                        border-radius: 8rpx; 
                        text-align: center;
                        position: relative;
                        top: 5rpx
                    }
                }
            }
        }
        .footerBtn{
            position: absolute;
            bottom: 0;
            left:0;
            width: 100%;
            height: 118rpx;
            color: #fff;
            font-size: 28rpx;
            padding:20upx;
            .btnBox{
                border-radius:40upx;
                overflow:hidden;
                width:100%;
                display:flex;
                align-items:center;
            }
            p{
                background-color: #fda33a;
                width:100%;
                line-height: 80rpx;
                text-align:center;
            }
            p.btn_red{
                background-color: #ff6f00;
            }
            p.btn_ccc{ background-color: #ccc}
        }
    }
}
.spcestitle {
  padding: 20rpx 0;
}
.specs {
  flex-wrap: wrap;
  display: flex;
  align-items: center;
}
.specs div {
  font-size: 24rpx;
  margin-top: 20rpx;
  padding: 0rpx 25rpx;
  line-height:2;
  background: #f3f3f3;
}
.spec {
  border: 1rpx solid #fff;
  border-radius: 10rpx;
  background: #fff7f4;
  margin-right: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.specactive {
  border: 1rpx solid #ff6325;
  color:#ff6325;
  border-radius: 10rpx;
  background: #fcf9f7!important;
}
</style>

