// pages/userinfo/index.js
let app = getApp
const db = wx.cloud.database()
let username = ''
let tel = ''
let addr = ''
const { $Message } = require('../../dist/base/index');
Page({
  data: {
    id: '',
    openid: '',
    username: '',
    tel: '',
    addr: '',
    usertype: '',
    //用户个人信息
    userInfo: {
      avatarUrl: "", //用户头像
      nickName: "", //用户昵称
      city: ""
    },
  },
  handleSuccess () {
    $Message({
        content: '刷新成功',
        type: 'success'
    });
  },
  //查询用户信息
  getUser() {
    var that = this;
    db.collection('users').where({
        _openid: this.data.openid
      })
      .get({
        success: function (res) {
          that.setData({
            id: res.data[0]._id,
            username: res.data[0].username,
            tel: res.data[0].tel,
            addr: res.data[0].addr,
            usertype: res.data[0].usertype
          })
        },
        fail: function (res) {
          console.log("查询失败")
        }
      })
  },
  //获取修改值
  upname(event) {
    username = event.detail.value
  },
  uptel(event) {
    tel = event.detail.value
  },
  upaddr(event) {
    addr = event.detail.value
  },
  //修改用户信息
  updateInfo() {
    db.collection('users').doc(this.data.id).update({
      data: {
        username: username,
        tel: tel,
        addr: addr
      },
      success(res){
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail(res) {
        console.log("修改失败！")
      }
    })
  },
  //获取openid
  getopenid() {
    var that = this;
    wx.cloud.callFunction({
      name: "getopenid",
      success(res) {
        that.setData({
          openid: res.result.openid
        })
        that.getUser()
      },
      fail(res) {
        console.log("获取失败！", res)
      }
    })
  },
  getUserInfo() {
    wx.getUserInfo({
      success: function (res) {
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        var addr = 'userInfo.city';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
          [addr]: res.userInfo.city,
        })
      }
    })
  },
  onLoad: function (options) {
    this.getopenid();
    this.getUserInfo();
    wx.stopPullDownRefresh()
  },
  onPullDownRefresh(){
    var that=this
    this.onLoad()
    setTimeout(function () {
      //要延时执行的代码     
      that.handleSuccess()
    }, 1000)
  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad()
  }
})