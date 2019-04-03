define(['text!./index.html', 'css!./index.css'], function(template) {
  function init(id) {
    new Vue({
      el: '#' + id,
      template: template,
      data: function() {
        return {
          animate: false,
          newEmps: [],
          imgPathdata: [],
          timeOut: '',
          content: '<span>我</span>'
        }
      },
      created: function() {},
      mounted: function() {
        var _this = this
        this.$http({
          url: '/hrhi/psndoc/listNewEmps',
          method: 'post'
        })
          .then(function(res) {
            if (res.data.status == true) {
              if (res.data.data && res.data.data.newEmps) {
                var _DATA = []
                _DATA = res.data.data.newEmps
                _this.newEmps = res.data.data.newEmps
                for (var i = 0; i < _DATA.length; i++) {
                  _this.imgPathdata.push({
                    imgPath:
                      '/hrhi/psndoc/getPhotoByPK?pk_psndoc=' +
                      _DATA[i].pk_psndoc
                  })
                }
                _this.timeOut = setInterval(_this.scroll, 2000)
              }
            } else {
              _this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
          .catch(function(res) {
            _this.$message({
              message: res,
              type: 'error'
            })
          })
      },
      methods: {
        errorLoadImg: function(index) {
          var _this = this
          _this.imgPathdata[index].imgPath =
            '../i_hr/ifbp_hr/widget/homePage/homePage_newpeople/img/peple.png'
        },
        scroll: function() {
          var _this = this
          _this.animate = true // 因为在消息向left滚动的时候需要添加css3过渡动画，所以这里需要设置true
          setTimeout(function() {
            //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
            _this.newEmps.push(_this.newEmps[0]) // 将数组的第一个元素添加到数组的
            _this.imgPathdata.push(_this.imgPathdata[0]) // 将数组的第一个元素添加到数组的
            _this.imgPathdata.shift() //删除数组的第一个元素
            _this.newEmps.shift() //删除数组的第一个元素
            _this.animate = false // margin-top 为0 的时候取消过渡动画，实现无缝滚动
          }, 1000)
        },
        stoptimeinterval: function() {
          //停止滚动
          var _this = this
          clearInterval(_this.timeOut)
        },
        begintimeinterval: function() {
          //开启滚动
          var _this = this
          _this.timeOut = setInterval(_this.scroll, 2000)
        }
      }
    })
  }
  return {
    init: init
  }
})
