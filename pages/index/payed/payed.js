// pages/index/payed/payed.js
var QRCode = require('qrcode.js')
var qrcode;
var app = getApp();
const W = wx.getSystemInfoSync().windowWidth;
const rate = 750.0 / W;

// 300rpx 在6s上为 150px
const code_w = 300 / rate;

Page({
  data: {
    code_w: code_w,
    user_id: app.globalData.userid
  },
  endtime1: function (time) {
    let formatTime1 = new Date().getTime();
    var time = time.replace(/-/g, '/');
    let formatTime2 = new Date(time).getTime();
    let formatTime3 = new Date(formatTime2 + 300000 - formatTime1);
    var that = this;
    var none = '00:00';
    if (formatTime3 <= 0) {
      return none;
    } else {
      // 分钟位 
      let min = parseInt((formatTime3 % (1000 * 60 * 60)) / (1000 * 60));
      // 秒位 
      let sec = parseInt((formatTime3 % (1000 * 60)) / 1000);
      if (min <= 9) min = '0' + min;
      if (sec <= 9) sec = '0' + sec;
      let time = min + ":" + sec + " ";
      return time
    }
  },
  endtime2: function (time) {
    let formatTime1 = new Date().getTime();
    var time = time.replace(/-/g, '/');
    let formatTime2 = new Date(time).getTime();
    let formatTime3 = new Date(formatTime2 + 900000 - formatTime1);
    var that = this;
    var none = '00:00';
    if (formatTime3 <= 0) {
      return none;
    } else {
      // 分钟位 
      let min = parseInt((formatTime3 % (1000 * 60 * 60)) / (1000 * 60));
      // 秒位 
      let sec = parseInt((formatTime3 % (1000 * 60)) / 1000);
      if (min <= 9) min = '0' + min;
      if (sec <= 9) sec = '0' + sec;
      let time = min + ":" + sec + " ";
      return time
    }
  },
  count_down: function (countDown_time1, countDown_time2) {
    var that = this;
    var time1 = countDown_time1.split(':')
    var time2 = countDown_time2.split(':')
    var mmm1 = parseInt(time1[0])
    var sss1 = parseInt(time1[1])
    var mmm2 = parseInt(time2[0])
    var sss2 = parseInt(time2[1])
    that.setData({
      sss1: (sss1 < 10) ? '0' + sss1 : sss1,
      mmm1: (mmm1 < 10) ? '0' + mmm1 : mmm1,
    })
    that.setData({
      sss2: (sss2 < 10) ? '0' + sss2 : sss2,
      mmm2: (mmm2 < 10) ? '0' + mmm2 : mmm2,
    })


    var Interval = setInterval(function () {
      if (sss1 > 0) {
        sss1--
      } else {
        that.setData({
          sss1: '00',
          mmm1: '00',
          msg4:"您已超时请尽快离开车位"
        })
      }
      if (sss2 > 0) {
        sss2--
      } else {
        that.setData({
          sss2: '00',
          mmm2: '00',
          msg4: "您已超时请尽快离开小区"
        })
        clearInterval(Interval)
      }
      if (sss1 == 0) {
        if (mmm1 > 0) {
          mmm1--
          sss1 = 60;
        }
      }
      if (sss2 == 0) {
        if (mmm2 > 0) {
          mmm2--
          sss2 = 60;
        }
      }

      that.setData({
        sss1: (sss1 < 10) ? '0' + sss1 : sss1,
        mmm1: (mmm1 < 10) ? '0' + mmm1 : mmm1,
      })
      that.setData({
        sss2: (sss2 < 10) ? '0' + sss2 : sss2,
        mmm2: (mmm2 < 10) ? '0' + mmm2 : mmm2,
      })
    }, 1000)
  },
  makeCode: function (orderinfo) {
    qrcode.makeCode(orderinfo);
  },
  onLoad: function (options) {
    var that = this;

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
    wx.request({
      url: 'https://www.51gxcw.cn/user/paid/',
      data:
      {
        userid:app.globalData.userid
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        //"Content-Type": "application/json"
      },
      success: function (res) {
        var time1 = that.endtime1(res.data.endtime);
        var time2 = that.endtime2(res.data.endtime);
        that.count_down(time1, time2)
        that.makeCode(res.data.orderinfo);
        that.setData({
          msg3: res.data.xiaoqu,
        })
      },
      fail: function (res) {
        console.log('submit fail');
      },
    })

  },
})