// pages/index/first/first.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['已预订', '已占用', '已支付'],
    currentTab: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    imgUrls: [],
    page: 1,
    scrollTop: 0,
    array: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    };
    // if (options.latitude) {
    //   console.log(options.latitude)
    //   this.setData({
    //     latitude: options.latitude,
    //     longitude: options.longitude
    //   })
    // }
    wx.request({
      url: 'https://www.51gxcw.cn/user/page/',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        page: that.data.page
      },
      success(res) {
        that.setData({
          // imgUrls:res.data.img,
          array: res.data.array
        })
      }
    })
  },
  // 导航切换监听
  navbarTap: function(e) {
    console.debug(e);
    var that = this;
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    var currentTab = e.currentTarget.dataset.idx
    if (currentTab == 0) {
      console.log(app.globalData.userid)
      console.log(app.globalData.openid)
      if (app.globalData.userid == null) {
        wx.navigateTo({
          url: '../myaccount/zhuce/zhuce',
        })
      } else {
        wx.request({
          url: 'https://www.51gxcw.cn/user/ordered/',
          method: "GET",
          header: {
            "content-type": "application/json"
          },
          data: {
            userid: app.globalData.userid,
          },
          success(res) {
            if (res.data.orderstatus == 1) {
              wx.navigateTo({
                url: '../ordered/ordered'
              })
            } else {
              wx.showToast({
                title: '没有已预定车位',
                icon: 'none',
                duration: 3000
              })
            }
          }
        })
      }
    }
    if (currentTab == 1) {
      if (app.globalData.userid == null) {
        wx.navigateTo({
          url: '../myaccount/zhuce/zhuce',
        })
      } else {
      wx.request({
        url: 'https://www.51gxcw.cn/user/used/',
        method: "GET",
        header: {
          "content-type": "application/json"
        },
        data:{
          userid: app.globalData.userid
        },
        success(res) {
          if (res.data.orderstatus == 3) {
            console.log(res.data.ordernumber)
            wx.navigateTo({
              url: '../used/used?ordernumber=' + res.data.ordernumber + '&xiaoqu=' + res.data.xiaoqu + '&starttime=' + res.data.starttime + '&codeinfo=' + res.data.codeinfo
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
      }
    }
    if (currentTab == 2) {
      if (app.globalData.userid == null) {
        wx.navigateTo({
          url: '../myaccount/zhuce/zhuce',
        })
      } else {
      wx.request({
        url: 'https://www.51gxcw.cn/user/paid/',
        method: "GET",
        header: {
          "content-type": "application/json"
        },
        data:{
          userid: app.globalData.userid
        },
        success(res) {
          if (res.data.orderstatus == 4) {
            wx.navigateTo({
              url: '../payed/payed'
            })
          }
          else {
            wx.showToast({
              title: '没有已支付订单',
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
    }
  },

  bindSearchTap(e) {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  swipertap: function(e) {
    var id = e.currentTarget.dataset.id; //获取swiper组件的data-id值
    this.setData({
      latitude: this.data.array[id - 1].latitude,
      longitude: this.data.array[id - 1].longitude
    })
    wx.navigateTo({
      url: '../map/map?latitude=' + this.data.latitude + '&longitude=' + this.data.longitude,
    })
  },
  //页面顶部刷新
  upper: function(e) {
    wx.showNavigationBarLoading();
    this.onLoad();
    wx.hideNavigationBarLoading();
  },
  //底部加载
  lower: function(e) {
    var that = this
    // wx.showLoading({
    //   title: '加载中',
    // })

    wx.request({
      url: 'https://www.51gxcw.cn/user/page/',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        page: that.data.page
      },
      success(res) {
        that.setData({
          // imgUrls:res.data.img,
          array: res.data.array
        })
      }
    })
  },
  bindAvatorTap: function(e) {
    wx.navigateTo({
      url: '../myaccount/myaccount',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    // 显示加载图标
    // wx.showLoading({
    //   title: '加载中',
    // })

    // 隐藏加载框
    // wx.hideLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})