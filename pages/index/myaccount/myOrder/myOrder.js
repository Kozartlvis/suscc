// pages/myorder/index.js
const app = getApp()
const userid = app.globalData.userid;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    total: [],
    userid:userid,
    array: [
      '近一周的订单',
      '近一个月的订单',
      '近一年的订单',
      '全部订单'
    ],
    objectArray: [{
      id: 0,
      name: '近一周的订单'
    },
    {
      id: 1,
      name: '近一个月的订单'
    },
    {
      id: 2,
      name: '近一年的订单'
    },
    {
      id: 3,
      name: '全部订单'
    }
    ],
    index: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    var that = this;
    wx.request({
      url: 'https://www.51gxcw.cn/user/orderlist/',
      method: "GET",

      header: {
        "content-type": 'application/json'
      },

      data: {
        userid:app.globalData.userid,
      },

      success: function (e, res) {
        console.log(e)
        console.log(res)
        that.setData({
          total: e.data
        })
      }


    })
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

  bindPickerChange(event) {
    console.log('bindPickerChange发生了选择事件，携带数据为：', event.detail.value)
  }




})