 import {toast,requestHideLoading} from '@/utils';
 import QQMapWX from "@/utils/qqmap-wx-jssdk"; //腾讯地图，reverseGeocoder逆地址转码
 let qqmapsdk = new QQMapWX({
     key: "LJTBZ-A5SWU-ZDGVJ-2OV5E-SOKAJ-HIBQI" // 必填
 });
 // 判断是否获取定位
 export function hasPosition() {
     return new Promise((resolve, reject) => {
         uni.getSetting({
             success: res => {
                 // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
                 // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
                 // res.authSetting['scope.userLocation'] == true    表示 地理位置授权

                 //未授权
                 if (
                     res.authSetting["scope.userLocation"] != undefined &&
                     res.authSetting["scope.userLocation"] != true
                 ) {
                     toast('获取定位未授权')
                     reject('未授权');
                 } else if (res.authSetting["scope.userLocation"] == undefined) {
                     //用户首次进入页面,调用wx.getLocation的API
                     getMyPosition().then(res=>{
                        resolve(res);
                     });
                 } else {
                     //调用wx.getLocation的API
                     getMyPosition().then(res=>{
                        resolve(res);
                     });
                 }
             }
         });

     })
 }
 // 重新获取定位授权--废弃
 export function initPosition() {
     return new Promise((resolve,reject)=>{
        uni.openSetting({
            success: function (res) {
                if (res.authSetting["scope.userLocation"] == true) {
                    //再次授权，调用wx.getLocation的API
                    getMyPosition().then(res=>{
                    resolve(res);
                    });
                } else {
                    toast('授权失败')
                    reject();
                }
            },
            fail(err) {
                reject();
            }
        });
    })
 }
 // 获取定位
 export function getMyPosition() {
     return new Promise((resolved, rejected) => {
         wx.getLocation({
             type: "gcj02",
             success: data => {
                 let lat = data.latitude;
                 let lng = data.longitude;
                 // 根据坐标获取城市信息
                 getCityinfo(lat, lng).then((res) => {
                     res = Object.assign(res, {
                         lat,
                         lng
                     })
                     resolved(res);
                 });
             },
             fail(err) {
                 toast("获取定位失败！请重新尝试");
                 rejected();
             }
         });
     });
 }
 //根据经纬度获取城市名称nowPlace 反地理转码
 export function getCityinfo(lat, lng) {
     return new Promise((resolved, rejected) => {
         qqmapsdk.reverseGeocoder({
             location: {
                 latitude: lat,
                 longitude: lng
             },
             success(res) {
                 // console.log(res,'qqmap')
                 // const _res = res.result;
                 // that.cityName = _res.address_component.city;
                 // that.update({
                 //   cityName: _res.address_component.city,
                 //   nowPlace:
                 //     _res.formatted_addresses.recommend + " - " + _res.address
                 // });
                 resolved(res.result);
             },
             fail: function (err) {
                 toast("获取定位失败！请重新尝试");
                 rejected(err);
             }
         });
     });
 }
export function getCityCode(cityName){
    return requestHideLoading('Area/GetCityCode',{Name:cityName},'post');
}