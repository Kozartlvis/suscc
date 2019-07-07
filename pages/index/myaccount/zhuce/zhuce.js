//var app = require('../../resource/js/util.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid: app.globalData.openid,
    phone: '', //手机号
    code: '', //验证码
    iscode: "", //用于回收状态码
    codename: '获取验证码'
  },


  //获取input输入框的值
  getPhoneValue: function (e, res) {
    var that = this;
    console.log(e);
    this.setData({
      phone: e.detail.value
    })
  },
  getCodeValue: function (e) {
    var that = this;
    this.setData({
      code: e.detail.value
    })
  },
  getCode: function () {
    var a = this.data.phone;
    var that = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }


  },




  //获取验证码
  getVerificationCode(e) {
    var num = 61;
    this.getCode();
    var that = this
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      console.log("手机号" + this.data.phone)
      wx.request({
        url: 'https://www.kozartlvis.com/competition/user/sms_deliver/',
        method: "GET",

        header: {
          "content-type": 'application/json'
        },

        data: {
          phone: this.data.phone,
          posttype: 1
        },

        success: function (e, res) {
          if (e.statusCode == 200) {
            console.log(res)
            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 2000
            })
            console.log(e)
          } else {
            wx.showToast({
              title: '发送失败',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
      // 超时处理函数
      var timer = setInterval(function () {
        num--;
        if (num <= 0) {
          clearInterval(timer);
          that.setData({
            codename: '重新发送',
            disabled: false
          })

        } else {
          that.setData({
            codename: num + "s"
          })
        }
      }, 1000)
    }
  },



  //提交表单信息
  submit: function () {
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    var that = this;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      console.log(this.data.phone);
      console.log(this.data.code);
      wx.request({
        url: 'https://www.kozartlvis.com/competition/user/code1/',
        method: "GET",

        header: {
          "content-type": 'application/json'
        },
        data: {
          phone: this.data.phone,
          code: this.data.code,
          openid: app.globalData.openid
        },
        success(e) {
          console.log(e);
          that.setData({
            iscode: e.data
          })
          console.log(that.data.iscode)
          if (that.data.iscode != "000000" &&
            that.data.iscode != "000001" &&
            that.data.iscode != "000002") {
            wx.showToast({
              title: "注册成功",
              icon: 'success',
              duration: 1000
            })
            app.globalData.userid = that.data.iscode;
            console.log(app.globalData.userid);
            wx.redirectTo({
              url: '../../first/first',
            })
          } else {
            wx.showToast({
              title: "失败 错误码：" + that.data.iscode,
              icon: 'none',
              duration: 1000
            })

          }
        }
      })


    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.openid)
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