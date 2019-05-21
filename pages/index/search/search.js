// pages/index/search/search.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'JKDBZ-OZYKK-B22JH-ACDLW-AGXE5-4RB4K' // 必填
});
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inpuVal: "",//input框内值
    listarr: [],//创建数组
    SearchText: '取消',//按钮变动值
    keydown_number: 0,//检测input框内是否有内容
    input_value: "",//value值
    hostarr: [],//热门搜索接收请求存储数组  
    name_focus: true,//获取焦点
    show: false,
    latitude: "",
    longitude: "",
    address: "",
    hidesug: false
  },
  backfill: function (e) {
    var id = e.currentTarget.id;
    for (var i = 0; i < this.data.suggestion.length; i++) {
      if (i == id) {
        this.setData({
          input_value: this.data.suggestion[i].title,
          address: this.data.suggestion[i].addr,
          latitude: this.data.suggestion[i].latitude,
          longitude: this.data.suggestion[i].longitude
        });
        console.log(this.data.latitude, this.data.longitude)
        // wx.navigateTo({
        //   url: '../map/map?latitude=' + this.data.latitude + '&longitude=' + this.data.longitude,
        // })
        this.search()
      }
    }
  },
  //取值input判断输入框内容修改按钮
  inputvalue: function (e) {
    this.setData({
      inputVal: e.detail.value,
      show: false,
      hidesug: false
    })
    var _this = this;
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function (res) {//搜索成功后的回调
        console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
    if (e.detail.cursor != 0) {
      this.setData({
        SearchText: "搜索",
        keydown_number: 1,
        show: true
      })
    } else {
      this.setData({
        SearchText: "取消",
        keydown_number: 0
      })
    }
  },
  //搜索方法
  search: function () {
    this.setData({
      show: true,
      hidesug: true
    })
    if (this.data.keydown_number == 1) {
      let This = this;
      //把获取的input值插入数组里面
      let arr = this.data.listarr;
      console.log(this.data.inputVal)
      console.log(this.data.input_value)
      //判断取值是手动输入还是点击赋值
      if (this.data.input_value == "") {
        // console.log('进来第er个')
        // 判断数组中是否已存在
        let arrnum = arr.indexOf(this.data.inputVal);
        console.log(arr.indexOf(this.data.inputVal));
        if (arrnum != -1) {
          // 删除已存在后重新插入至数组
          arr.splice(arrnum, 1)
          arr.unshift(this.data.inputVal);

        } else {
          arr.unshift(this.data.inputVal);
        }

      } else {
        console.log('进来第一个')
        let arr_num = arr.indexOf(this.data.input_value);
        console.log(arr.indexOf(this.data.input_value));
        if (arr_num != -1) {
          arr.splice(arr_num, 1)
          arr.unshift(this.data.input_value);
        } else {
          arr.unshift(this.data.input_value);
        }

      }
      console.log(arr)

      //存储搜索记录
      wx.setStorage({
        key: "list_arr",
        data: arr
      })


      //取出搜索记录
      wx.getStorage({
        key: 'list_arr',
        success: function (res) {
          This.setData({
            listarr: res.data
          })
        }
      })
      this.setData({
        input_value: '',
      })
    } else {
      console.log("取消")
    }
    wx.navigateTo({
      url: '../map/map?latitude=' + this.data.latitude + '&longitude=' + this.data.longitude,
    })
  },
  //清除搜索记录
  delete_list: function () {
    //清除当前数据
    this.setData({
      listarr: []
    });
    //清除缓存数据
    wx.removeStorage({
      key: 'list_arr'
    })
  },
  //点击赋值到input框
  this_value: function (e) {
    this.setData({
      name_focus: true,
      show: true,
      hidesug: true
    })
    let value = e.currentTarget.dataset.text;
    this.setData({
      input_value: value,
      SearchText: "搜索",
      keydown_number: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let This = this;
    //设置当前页标题
    wx.setNavigationBarTitle({
      title: '搜索'
    });
    //读取缓存历史搜索记录
    wx.getStorage({
      key: 'list_arr',
      success: function (res) {
        This.setData({
          listarr: res.data
        })
      }
    })
  },
})