// pages/index/used/used.js
var app = getApp();
var QRCode = require('qrcode.js')
// var util = require('../../../utils/util.js');
// var QRCode = require('../../../utils/weapp-qrcode.js')
var qrcode;
const W = wx.getSystemInfoSync().windowWidth;
const rate = 750.0 / W;

// 300rpx 在6s上为 150px
const code_w = 300 / rate;
//const code_w = 150;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    code_w: code_w,
    ordernumber: '',
    success: '1',
    user_id: app.globalData.userid
  },
  makeCode: function (orderinfo) {
    qrcode.makeCode(orderinfo);
  },
  starttime: function (time) {
    let formatTime1 = new Date().getTime();

    var time = time.replace(/-/g, '/');
    console.log(time)
    let formatTime2 = new Date(time).getTime();

    
    let formatTimeS = new Date(formatTime1 - formatTime2);

    var that = this;
    var none = '00:00:00:00';
    if (formatTimeS <= 0) {
      this.setData({
        time: none
      })
    } else {
      // 天
      let day = parseInt(formatTimeS / (1000 * 60 * 60 * 24));
      // 小时位 
      let hr = parseInt((formatTimeS % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      // 分钟位 
      let min = parseInt((formatTimeS % (1000 * 60 * 60)) / (1000 * 60));
      // 秒位 
      let sec = parseInt((formatTimeS % (1000 * 60)) / 1000);
      if (hr <= 9) hr = '0' + hr;
      if (min <= 9) min = '0' + min;
      if (sec <= 9) sec = '0' + sec;
      let time = day + ":" + hr + ":" + min + ":" + sec + " ";

      return time;
    }
  },
  count_down: function (totaltime) {
    var that = this;
    var time2 = totaltime.split(':')
    var ddd2 = parseInt(time2[0])
    var hhh2 = parseInt(time2[1])
    var mmm2 = parseInt(time2[2])
    var sss2 = parseInt(time2[3])
    that.setData({
      ddd2: ddd2,
      sss2: (sss2 < 10) ? '0' + sss2 : sss2,
      mmm2: (mmm2 < 10) ? '0' + mmm2 : mmm2,
      hhh2: (hhh2 < 10) ? '0' + hhh2 : hhh2
    })

    var Interval = setInterval(function () {
      if (sss2 < 60) {
        sss2++
      }
      if (sss2 == 60) {
        if (mmm2 < 60) {
          mmm2++
          sss2 = 0;
        }
        if (mmm2 == 60) {
          hhh2++
          sss2 = 0;
          mmm2 = 0;
        }
        if (hhh2 == 23 && mmm2 == 60) {
          ddd2++
          hhh2 = 0;
          mmm2 = 0;
          sss2 = 0;
        }
      }
      that.setData({
        ddd2: ddd2,
        sss2: (sss2 < 10) ? '0' + sss2 : sss2,
        mmm2: (mmm2 < 10) ? '0' + mmm2 : mmm2,
        hhh2: (hhh2 < 10) ? '0' + hhh2 : hhh2
      })
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://www.kozartlvis.com/competition/user/used/',
      method: "GET",
      header: {
        "content-type": "application/json"
      },
      data: {
        userid: app.globalData.userid
      },
      success(res) {
        if (res.data.orderstatus == 3) {
          var totaltime = that.starttime(res.data.starttime);
          that.count_down(totaltime)
          that.makeCode(res.data.codeinfo);
          that.setData({
            msg1: res.data.xiaoqu,
            ordernumber: res.data.ordernumber,
          })
        }
      }
    })
    qrcode = new QRCode('canvas', {
      usingIn: this,
      text: "",
      image: '',
      width: code_w,
      height: code_w,
      colorDark: "#1CA4FC",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  hideQR: function () {
    this.setData({ flag: true })
  },

  renting: function () {
    console.log(this.data.ordernumber)
    wx.request({
      url: 'https://www.kozartlvis.com/competition/user/returnpark/',
      data:
      {
        ordernumber: this.data.ordernumber,
        success: this.data.success,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.data.flag == 1) {
          wx.showToast({
            title: '归还车位成功',
            icon: 'success',
            duration: 3000
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../payed/payed'
            })
          }, 1000)
         
        } else {
          wx.showToast({
            title: '归还车位失败',
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '归还车位失败',
          icon: 'none',
          duration: 3000
        })
      },
    });
    wx.navigateTo({
      url: '../used/used?ordernumber=' + res.data.ordernumber + '&xiaoqu=' + res.data.xiaoqu + '&starttime=' + res.data.starttime + '&codeinfo=' + res.data.codeinfo
    })
  },
})