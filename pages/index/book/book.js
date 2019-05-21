// pages/index/book/book.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDisabled: false,
    ordernumber: '',
    propertyid:"",
    user_id: app.globalData.userid,
    defaultcar : '',
  },
  iflot: function (lastparking) {
    var that = this;
    if (lastparking > 5) {
      that.setData({
        msg2: '充足',
      })
    }
    else {
      that.setData({
        msg2: '紧张',
      })
    }
  },
  book: function () {
    var that = this;
    wx.request({
      url: 'https://www.51gxcw.cn/user/order_normal/',
      data:
      {
        propertyid : that.data.propertyid,
        userid:app.globalData.userid,
        
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.flag == 1) {
          wx.showToast({
            title: '预定成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            isDisabled: false,
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '../first/first',
            })},1000)
            
        }
        else if (res.data.flag == 2){
          wx.showToast({
            title: '预定失败',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            msg3:"请在个人信息页面设置您的默认车辆"
          })
        }else
        {
          wx.showToast({
            title: '预定失败',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            isDisabled: true
          })
        }
      },
      fail: function (res) {
        console.log('submit fail');
      },
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      propertyid: options.propertyid
    })
    wx.request({
      url: 'https://www.51gxcw.cn/user/book_normal/',
      data:
      {
        propertyid: that.data.propertyid
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        that.setData({
          msg1: options.parkname,
        })
        that.iflot(res.data.lastparking)
      },
      fail: function (res) {
        console.log('submit fail');
      },
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