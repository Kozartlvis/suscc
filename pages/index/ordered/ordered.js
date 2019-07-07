// pages/index/ordered/ordered.js
var app = getApp();
var util = require('../../../utils/util.js');
var QRCode = require('../../../utils/weapp-qrcode.js')
var qrcode;
const W = wx.getSystemInfoSync().windowWidth;
const rate = 750.0 / W;

// 300rpx 在6s上为 150px
const code_w = 300 / rate;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookedlatitude: "",
    bookedlongitude: "",
    hidetime: false,
    hide: true,
    code_w: code_w,
    flag: true,
    btn_dis: false,
    user_id:app.globalData.userid
  },
  naviagtor: function (e) {
    var that = this;
    wx.openLocation({//​调用外部地图导航。
      latitude: Number(this.data.bookedlatitude),//marker纬度
      longitude: Number(this.data.bookedlongitude),//marker经度
      name: this.data.parkname,
    })
  },
  // 倒计时
  count_down: function (hhh, mmm, sss) {
    var that = this;
    this.setData({
      sss: (sss < 10) ? '0' + sss : sss,
      mmm: (mmm < 10) ? '0' + mmm : mmm,
      hhh: (hhh < 10) ? '0' + hhh : hhh
    })
    var Interval = setInterval(function () {
      if (sss > 0) {
        sss--
      } else {
        console.log('时间到')
        that.setData({
          hide: false,
          hidetime: true
        })
        clearInterval(Interval)
      }
      if (sss == 0) {
        if (mmm > 0) {
          mmm--
          sss = 59;
        }
        if (mmm == 0 && hhh > 0) {
          hhh--
          sss = 59;
          mmm = 59;
        }
      }
      that.setData({
        sss: (sss < 10) ? '0' + sss : sss,
        mmm: (mmm < 10) ? '0' + mmm : mmm,
        hhh: (hhh < 10) ? '0' + hhh : hhh
      })
    }, 1000)
  },
  startcharging: function () {
    var that = this
    console.log(this.data.orderid)
    wx.request({
      url: 'https://www.kozartlvis.com/competition/user/startorder/',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        status: "1",
        ordernumber: this.data.orderid
      },
      success(res) {
        if (res.data.rec == 1) {
          that.setData({
            btn_dis: true
          })
          wx.showToast({
            title: '已开始计费',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '服务器出错',
          icon: 'warning',
          duration: 2000
        })
      },
    })
  },
  save: function () {
    console.log('save')
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          qrcode.exportImage(function (path) {
            wx.saveImageToPhotosAlbum({
              filePath: path,
            })
          })
        }
      }
    })
  },
  hideQR: function () {
    this.setData({ flag: true })
  },

  indoor:function(){
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
          console.log(res.data.ordernumber)
          wx.redirectTo({
            url: '../used/used',
          })
        }
        else {
          wx.showToast({
            title: '没有已占用车位',
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
      
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // var time = util.formattime(new Date());
    qrcode = new QRCode('canvas', {
      // usingIn: this,
      // text: "https://github.com/tomfriwel/weapp-qrcode",
      // image: '/images/bg.jpg',
      width: code_w,
      height: code_w,
      colorDark: "#1CA4FC",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });
    wx.request({
      url: 'https://www.kozartlvis.com/competition/user/orderedinfo/',
      method: "GET",
      header: {
        "content-type": "application/json"
      },
      data: {
        userid: app.globalData.userid
      },
      success(res) {
        if (res.data) {
          console.log(res)
          that.setData({
            bookedlatitude: res.data.latitude,
            bookedlongitude: res.data.longitude,
            bookedtime: res.data.time,
            parkname: res.data.parkname,
            orderid: res.data.orderid
          })
          var bookedtime = String(that.data.bookedtime)
          var bookedtime = bookedtime.replace(/-/g, '/');
          var endTime = new Date(bookedtime);
          
          var t=new Date(endTime.getTime() + 1000 * 15 * 60-new Date())
          var counttime = util.formattime(t);
          console.log(counttime)
          var booked = counttime.split(':')
          console.log(booked)
          var hhh = 0
          var mmm = parseInt(booked[1])
          var sss = parseInt(booked[2])
          console.log(hhh, mmm, sss)
          if ( mmm >= 0 && mmm<=15) {
            that.count_down(hhh, mmm, sss)
          }
          else {
            that.setData({
              hide: false,
              hidetime: true
            })
          }
        }
        else {
          wx.showToast({
            title: '服务器开了小差，刷新一下',
            icon: 'waring',
            duration: 3000
          })
        }
      }
    })
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

  }
})