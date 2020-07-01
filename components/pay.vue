<template>
  <div >
    <!--遮罩层-->
    <!-- <div class="mask-modal" @click="onClose"></div> -->
    <!--确认付款-->
    <div v-if="showPayStatus===1||showPayStatus===3" class="paywindows">
      <div class="paytile flex-center-between">
        <span @click="forgetPassword">忘记支付密码？</span>
        <text>确认付款</text>
        <img src="http://jrwd.wtvxin.com/upload/images/icons/close.png" class="close" @click="onClose" />
      </div>
      <div class="maskprice">￥{{total}}</div>
      <div class="flex-between maskitem" v-if="orderNumber">
        <div class="fontclolr">订单号</div>
        <div>{{orderNumber}}</div>
      </div>
      <div class="flex-between maskitem" @click="showPayStatus=2">
        <div class="fontclolr">付款方式</div>
        <div>
          <text class="wx">{{payType.name}}</text>
          <img src="http://jrwd.wtvxin.com/upload/images/icons/right.png" class="right" />
        </div>
      </div>
      <div class="paybtn" @click="pay">确认付款</div>
    </div>
    <!--选择付款方式-->
    <div v-if="showPayStatus===2" class="paymask">
      <div class="paytile">
        <img
          src="http://jrwd.wtvxin.com/upload/images/icons/leftarrow.png"
          class="leftarrow leftposi"
          @click="showPayStatus = 1"
        />
        <text>选择支付方式</text>
      </div>
      <div>
        <!-- <radio-group @change="changes"> -->
        <radio-group>
          <block v-for="(item,index) in payTypeList" :key="index">
            <label class="flex-between payitem" @click="changes(item)" v-if="item.status">
              <div class="flex-center">
                <img :src="item.icon" class="payimg" />
                {{item.name}}
              </div>
              <radio name="payType" :checked="payType.id==item.id" value="0" color="#dd196d"/>
            </label>
          </block>
        </radio-group>
      </div>
    </div>
    <!-- 支付密码组件 -->
    <div class="payPasswordComponent flex-content" v-if="showPayStatus===3" @click.self="closePasswordInput">
      
      <div class="box">
        <div class="header">
          请输入支付密码
          <div class="close" @click.stop="closePasswordInput">×</div>
        </div>

        <div class="bodys flex-content" @click="onFocusflag">
          <input
            type="number"
            password
            v-model="password"
            @input="editPaw"
            :focus="focusflag"
            maxlength="6"
          />
          <div class="boxItem flex-content" v-for="i in 6" :key="i">
            <div class="item" v-if="i<password.length+1"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//##  参数：
// total--支付价格（确认与后台支付金额一致)
// orderNumber -- 订单编号
// payMode -- 支付模式[wx--微信,alipay--支付宝,balance--余额,integral--积分]，--默认微信和余额

// ## event: 动作事件
// onClose --关闭弹窗
// success -- 点击支付或者输入支付密码后。
// -------接收：
//            payType---  Number支付类型；0--微信支付.1--余额支付,2--支付宝
//            password--- string支付密码

import wxIcon from '@/static/pay_weixin.png';
import alipayIcon from '@/static/pay_alipay.png';
import balanceIcon from '@/static/pay_yue.png';
import jfIcon from '@/static/pay_jf.png';
import { post } from "@/common/util";
export default {
  props: {
    total: {
      type: [Number,String],
      default: 0
    },
    orderNumber: {
      type: String,
      default: ""
    },
    payMode:{
      type:Array,
      default(){return ['wx','balance']}
    }
  },
  data() {
    return {
      focusflag: true, //支付密码获取焦点
      showPayStatus:1, //支付密码状态 1--支付；2--选择支付方式；3--填写支付密码
      password:'',
      forgetPasswordUrl:'/pages/member/setpwd/setpwd',//忘记密码跳转url
      payType: {},//选择的支付方式
      payTypeList:[
        {
          name:'微信',
          icon:wxIcon,
          id:0,
          code:'wx',
          status:true,
        },
        {
          name:'支付宝',
          icon:alipayIcon,
          id:2,
          code:'alipay',
          status:false,
        },
        {
          name:'余额',
          icon:balanceIcon,
          id:1,
          code:'balance',
          status:true,
        },
        {
          name:'积分',
          icon:jfIcon,
          id:3,
          code:'integral',
          status:false,
        },
      ]
    };
  },
  watch:{
    // payMode:{
    //   handler(){
    //     console.log(this.payTypeList,'mode1')
    //     let arr=[];
    //     this.payMode.map(modeItem=>{
    //       this.payTypeList.map(typeItem=>{
    //         if(modeItem===typeItem.code){
    //           typeItem.status = true;
    //         }else{
    //           typeItem.status = false;
    //         }
    //       })
    //     })
    //     console.log(this.payTypeList,'mode')
    //   },
    //   deep:true
    // }
  },
  mounted(){
        this.showPayStatus = 1;
        let arr =[];
        this.payTypeList.map(typeItem=>{
          this.payMode.map(modeItem=>{
            if(modeItem===typeItem.code){
              typeItem.status = true;
              arr.push(typeItem)
            }
          })
        })
        this.payTypeList = arr;
        this.payType = this.payTypeList[0];
  },
  methods: {
    // 获取焦点
    onFocusflag() {
      this.focusflag = false;
      this.focusflag = true;
    },
    changes(item) {
      this.payType = item;
      this.showPayStatus = 1;
    },
    // 确认付款
    pay() {
      if (this.payType.id==1||this.payType.id==3) {
         // 如果是余额支付弹出输入支付密码框，并获取焦点
        this.showPayStatus=3;
        this.focusflag = true;
      } else {
         // 否则直接完成
         this.success();
      }
    },
    // 关闭支付弹窗
    onClose(){
        console.log('onClose--关闭了弹窗')
        this.$emit("onClose");
    },
    // 完成支付
    success(){
      console.log('password',this.password)
        this.$emit('success',this.payType,this.password);
    },
    // 输入密码
    editPaw(e) {
      if (this.password.length === 6) {
        this.success();
        this.focusflag = false;
        setTimeout(()=>{
            this.password = "";
            this.showPayStatus =1;
        },1000)
      }
    },
    // 关闭密码输入框
    closePasswordInput() {
        this.showPayStatus=1;
    },
   //  设置支付密码跳转页面
    forgetPassword() {
      const that =this;
      uni.showModal({
        title: "设置密码",
        content: "是否跳转设置支付密码页面！",
        confirmColor: "#dd196d",
        success(res) {
          if (res.confirm) {
            uni.navigateTo({ url: that.forgetPasswordUrl });
          } else if (res.cancel) {
          }
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.flex-center-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mask-modal {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  z-index: 100;
  background: rgba(0, 0, 0, 0.4);
}
.paywindows {
//   position: fixed;
//   bottom: 0;
//   left: 0;
//   z-index: 101;
  background: #fff;
//   height: 680upx;
  width: 100%;
  padding-bottom:40upx;
}
.flex-center {
  display: flex;
  align-items: center;
}
.flex-center img {
  margin-right: 20upx;
}
.payPassword {
  text-align: right;
}
.paytile span {
  padding-top: 20upx;
  font-size: 20upx;
  color: #999;
}

.paytile {
  position: relative;
  padding: 30upx;
  border-bottom: 1upx solid #eee;
  text-align: center;
  font-size: 36upx;
  font-weight: bold;
}
.paytile .close {
  width: 28upx;
  height: 28upx;
  margin-left: 102upx;
}
.maskprice {
  font-weight: bold;
  font-size: 68upx;
  text-align: center;
  padding: 30upx 0;
}
.maskitem {
  padding: 30upx 20upx;
  border-bottom: 1upx solid #eee;
}
.fontclolr {
  color: #999;
}
.wx {
  margin-right: 20upx;
}
.leftposi {
  position: absolute;
  top: 50%;
  left: 20upx;
  margin-top: -11upx;
}
.payimg {
  width: 56upx;
  height: 56upx;
}
.payitem {
  padding: 40upx 20upx;
  border-bottom: 1upx solid #ececec;
}
/*立即下单的按钮样式*/
.paybtn {
  width: 660upx;
  height: 90upx;
  margin: 40upx auto 0;
  background: $primary;
  border-radius: 10upx;
  line-height: 90upx;
  font-size: 30upx;
  color: #fff;
  text-align: center;
}
/*右侧箭头*/
.right {
  width: 12upx;
  height: 22upx;
}
/*左侧箭头*/
.leftarrow {
  width: 16upx;
  height: 30upx;
  vertical-align: middle;
}
.plr30 {
  padding-left: 30upx;
  padding-right: 30upx;
}
/* 选择支付方式 */

.paymask {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 101;
  width: 100%;
  box-sizing: border-box;
  /* padding-bottom:60upx; */
  background: #fff;
}
/* ----------------------------支付密码--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

.flex-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
.payPasswordComponent {
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: -350px;
  left: 0;
  z-index: 102;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
.payPasswordComponent input {
  position: absolute;
  opacity:0;
  top: 60upx;
  left: 80upx;
  width:480upx;height:80upx;
}

.payPasswordComponent .box {
  width: 85%;
  background: #fff;
  border-radius: 10upx;
}

.payPasswordComponent .header {
  font-size: 35upx;
  font-weight: 600;
  line-height: 100upx;
  text-align: center;
  position: relative;
  border-bottom: 1upx #e8e8e8 solid;
}
.payPasswordComponent .header .close {
  position: absolute;
  font-weight: 400;
  right: 10upx;
  top: -20upx;
  font-size: 50upx;
  color: #999;
}
.bodys {
  height: 200upx;
  position: relative;
}
.bodys .boxItem {
  width: 80upx;
  height: 80upx;
  border-left: 1upx #c8c8c8 solid;
  border-top: 1upx #999 solid;
  border-bottom: 1upx #999 solid;
}
.bodys .boxItem:first-child {
  border-left: 1upx #999 solid;
}
.bodys .boxItem:last-child {
  border-right: 1upx #999 solid;
}
.bodys .boxItem .item {
  width: 20upx;
  height: 20upx;
  border-radius: 50%;
  background: #000;
}
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

/*复选框清除默认样式*/
.checkbox-cart .wx-checkbox-input {
  width: 40upx;
  height: 40upx;
  border-radius: 50% !important;
}
.checkbox-cart .wx-checkbox-input.wx-checkbox-input-checked {
  background: #3172f5;
  border-radius: 50% !important;
  border: 0 !important;
  width: 45upx;
  height: 45upx;
}
.checkbox-cart .wx-checkbox-input.wx-checkbox-input-checked::before {
  width: 42upx;
  height: 42upx;
  border-radius: 50% !important;
  line-height: 42upx;
  text-align: center;
  font-size: 30upx;
  color: #ffffff;
  background: transparent;
  transform: translate(-50%, -50%) scale(1);
  -webkit-transform: translate(-50%, -50%) scale(1);
}
/*单选按钮清除默认样式*/
radio .wx-radio-input {
  /* 自定义样式.... */
  height: 40upx;
  width: 40upx;
  border-radius: 50%;
  border: 2upx solid #999;
  background: transparent;
}

/* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
radio .wx-radio-input.wx-radio-input-checked {
  border: none;
  background: #3172f5;
}
/* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
radio .wx-radio-input.wx-radio-input-checked::before {
  border-radius: 50%; /* 圆角 */
  width: 45upx; /* 选中后对勾大小，不要超过背景的尺寸 */
  height: 45upx; /* 选中后对勾大小，不要超过背景的尺寸 */
  line-height: 45upx;
  text-align: center;
  font-size: 30upx; /* 对勾大小 30upx */
  color: #fff; /* 对勾颜色 白色 */
  background: #3172f5;
  transform: translate(-50%, -50%) scale(1);
  -webkit-transform: translate(-50%, -50%) scale(1);
}
/*清除input默认样式*/
input[type="text"] {
  outline: none;
  border: 0;
  font-size: 25upx;
}
</style>


