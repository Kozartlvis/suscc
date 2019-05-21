// pages/myCar/index.js
const app = getApp()
const userid = app.globalData.userid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: [],
    userid:userid,
    conceal: true,
    conceal2: false,
  },
  goaddcar: function(){
    wx.redirectTo({
      url: '../myCar/add/add',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://www.51gxcw.cn/user/mycar/',
      method: "GET",
      header: {
        "content-type": 'application/json'
      },
      data: {
        userid: app.globalData.userid
      },
      success: function (e, res) {
        console.log(e)
        that.setData({
          total: e.data
        })
        console.log(that.data.total)
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
  onShareAppMessage: function () { },


  // 删除车辆
  delete: function (e) {
    console.log(e);
    var Index = e.currentTarget.dataset.idx;
    var caridentification = e.currentTarget.dataset.val
    this.data.total.splice(Index, 1);
    this.setData({
      total: this.data.total
    });

    wx.request({
      url: 'https://www.51gxcw.cn/user/delcar/',
      method: "POST",

      header: {
        "content-type": "application/x-www-form-urlencoded"
      },

      data: {
        caridentification
      },

      success: function (e, res) {
        if (e.statusCode == 200) {
          console.log(res)
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })

        }

      }
    })

  },

  default: function (e) {
    console.log(e);
    var that=this;
    var Index = e.currentTarget.dataset.idx;
    var caridentification = e.currentTarget.dataset.val


    wx.request({
      url: 'https://www.51gxcw.cn/user/defaultcar/',
      method: "POST",

      header: {
        "content-type": "application/x-www-form-urlencoded"
      },

      data: {
        caridentification,
        userId:app.globalData.userid
      },

      success: function (e, res) {
        if (e.statusCode == 200) {
          console.log(res)
          wx.showToast({
            title: '设置默认成功',
            icon: 'success',
            duration: 2000
          })

        }

      }
    })

  },


  // 对车辆的增删改查
  manage: function () {
    this.setData({
      conceal: false,
      conceal2: true,
    });

  },


  manage2: function () {
    this.setData({
      conceal: true,
      conceal2: false,
    })
  }

})