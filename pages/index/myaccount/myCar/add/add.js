      // pages/myCar/add/add.js
const app = getApp()
const userid = app.globalData.userid;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    licencePlate: "行驶证号",
    userid:userid,
    // 键盘
    provinceArr: ["粤", "京", "津", "渝", "沪", "冀", "晋", "辽", "吉", "黑", "苏", "浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "琼", "川", "贵", "云", "陕", "甘", "青", "蒙", "桂", "宁", "新", "藏", "使", "领", "警", "学", "港", "澳"],
    strArr: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Q", "W", "E", "R", "T", "Y", "U", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"],
    hiddenPro: true, // 省份键盘
    hiddenStr: true, // 数字字母键盘
    carDrivingLicenseId: '单击此输入车牌号'

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  proTap(e) { //点击省份
    let province = e.currentTarget.dataset.province;
    let carDrivingLicenseId = this.data.carDrivingLicenseId;
    this.setData({
      carDrivingLicenseId: carDrivingLicenseId + province,
      hiddenPro: true,
      hiddenStr: false
    })
  },
  strTap(e) { //点击字母数字
    let province = e.currentTarget.dataset.str;
    let carDrivingLicenseId = this.data.carDrivingLicenseId;
    if (carDrivingLicenseId.length > 7) return; // 车牌长度最多为8个（新能源车牌8个）
    carDrivingLicenseId += province;
    this.setData({
      carDrivingLicenseId: carDrivingLicenseId
    })
  },
  backSpace() { //退格
    let carDrivingLicenseId = this.data.carDrivingLicenseId;
    var arr = carDrivingLicenseId.split('');
    arr.splice(-1, 1)
    console.log(arr)
    var str = arr.join('')
    if (str == '') {
      this.setData({
        hiddenPro: false,
        hiddenStr: true
      })
    }
    this.setData({
      carDrivingLicenseId: str
    })
  },
  backKeyboard() { //返回省份键盘
    this.setData({
      hiddenPro: false,
      hiddenStr: true
    })
  },
  keyboard_display() {
    this.setData({
      carDrivingLicenseId: '',
      hiddenPro: false,
    })
  },

  keyboard_conceal() {
    this.setData({
      hiddenStr: true,
      hiddenPro: true,
    })

  },


  // 点击添加后触发的事件
  add: function(e, res) {
    var that = this;
    console.log(e)
    let carDrivingLicenseId = this.data.carDrivingLicenseId;
    wx.request({
      url: 'https://www.kozartlvis.com/competition/user/addcar/',
      method: "POST",

      header: {
        "content-type": "application/x-www-form-urlencoded"
      },

      data: {
        licencePlate: carDrivingLicenseId,
        carDrivingLicenseId: e.detail.value.licencePlate,
        defaultCar: e.detail.value.defaultCar,
        userId:app.globalData.userid,
      },


      success: function(e, res) {
        if (e.statusCode == 200) {
          console.log(res)
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })
          console.log(e)
          wx.redirectTo({
            url: '../myCar'
          })
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'success',
            duration: 2000
          })
        }


      }
    })
  },

})