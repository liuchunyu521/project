define(['text!./index.html', 'css!./index.css'], function(template) {
  function init(id) {
    new Vue({
      el: '#' + id,
      template: template,
      data: function() {
        return {
          birthdayBoys: [],
          imgPathdata: [],
          num: '',
          dialogVisible: false
        }
      },
      created: function() {},
      mounted: function() {
        var _this = this
        var param = {
          fromSite: 'hrss'
        }
        this.$http({
          params: param,
          url: '/hrhi/psndoc/listBirthdayBoys',
          method: 'post'
        })
          .then(function(res) {
            console.log(res)
            if (res.data.status == true) {
              if (res.data.data) {
                var _DATA = []
                _this.num = res.data.data.birthdayBoys.length
                if (res.data.data.birthdayBoys.length > 3) {
                  _DATA = res.data.data.birthdayBoys.slice(0, 3)
                  _this.birthdayBoys = res.data.data.birthdayBoys.slice(0, 3)
                } else {
                  _DATA = res.data.data.birthdayBoys
                  _this.birthdayBoys = res.data.data.birthdayBoys
                }
                for (var i = 0; i < _DATA.length; i++) {
                  _this.imgPathdata.push({
                    imgPath:
                      '/hrhi/psndoc/getPhotoByPK?pk_psndoc=' +
                      _DATA[i].pk_psndoc
                  })
                }
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
              message: '数据请求失败',
              type: 'error'
            })
          })
      },
      methods: {
        errorLoadImg: function(index) {
          var imgback = document.getElementsByClassName('imgover')[index]
          var imgblock = document.getElementsByClassName('imgSrc')[index]
          var popoverimgSrc = document.getElementsByClassName('popoverimgSrc')[
            index
          ]
          var popoverimgover = document.getElementsByClassName(
            'popoverimgover'
          )[index]
          popoverimgSrc.style.display = 'none'
          imgblock.style.display = 'none'
          popoverimgover.style.backgroundSize = '48px 48px'
          popoverimgover.style.backgroundImage =
            'url(../i_hr/ifbp_hr/widget/homePage/homePage_birthdayBoy/img/peple.png)'
          imgback.style.backgroundSize = '48px 48px'
          imgback.style.backgroundImage =
            'url(../i_hr/ifbp_hr/widget/homePage/homePage_birthdayBoy/img/peple.png)'
        }
      }
    })
  }
  return {
    init: init
  }
})
