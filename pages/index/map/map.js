// pages/index/map/map.js
var app = getApp()
Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},//
    parkname: [],
    parkprice: [],
    parkremain: [],
    longitude: "",
    latitude: "",
    propertyid:"",
    markers: [],
    marker_latitude: "",
    marker_longitude: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    if (options.latitude) {
      console.log(options.latitude)
      this.setData({
        latitude: options.latitude,
        longitude: options.longitude
      })
    } 
    this.mapCtx = wx.createMapContext('map');
    wx.request({
      url: 'https://www.kozartlvis.com/competition/user/search/', //接口地址
      header: {
        //'content-type': 'application/x-www-form-urlencoded' //默认值
      },
      data: {
        latitude: this.data.latitude,
        longitude: this.data.longitude
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        // success
        if (res.data) {
          that.setData({
            markers: res.data,
          })
          console.log(that.data)
        } else {
          wx.showToast({
            title: '服务器开了小差，刷新一下',
            icon: 'warning',
            duration: 3000
          })
        }
      },
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  btnbook(e) {
    if (app.globalData.userid == null) {
      wx.navigateTo({
        url: '../myaccount/zhuce/zhuce',
      })
    } else {
    wx.navigateTo({
      url: '../book/book?parkname='+this.data.parkname+'&propertyid='+this.data.propertyid,
    })
    }
  },
  btnnavigate: function (e) {
    var that = this;
    wx.openLocation({//​调用外部地图导航。
      latitude: this.data.marker_latitude,//marker纬度
      longitude: this.data.marker_longitude,//marker经度
      name: this.data.parkname,
      address: this.data.parkname
    })
  },
  markertap(e) {
    var that = this;
    that.setData({
      hideModal: false
    })
    console.log(this.data.markers)
    // app.globalData.markerid=e.markerId;
    wx.request({
      url: 'https://www.kozartlvis.com/competition/user/markerinfo/', //接口地址
      header: {
        'content-type': 'application/json' //默认值
      },
      data: { id: e.markerId },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log(res)
        // success
        if (res.data) {
          that.setData({
            parkname: res.data.parkname,
            parkprice: res.data.parkprice,
            parkremain: res.data.parkremain,
            propertyid: e.markerId,
            marker_latitude: res.data.latitude,
            marker_longitude: res.data.longitude
          })
          console.log(that.data)
        } else {
          wx.showToast({
            title: '服务器开了小差，刷新一下',
            icon: 'waring',
            duration: 3000
          })
        }
      },
    })
    var animation = wx.createAnimation({
      duration: 0,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn();//调用显示动画
    }, 200)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 0,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 100)//先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  getLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
      }
    });
    this.moveToLocation();
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