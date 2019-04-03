define(['text!./index.html', 'css!./index.css'], function(template) {
  function init(id) {
    new Vue({
      el: '#' + id,
      template: template,
      data: function() {
        return {
          newEmps: [],
          imgPathdata: [],
          num: '',
          styleObject: {
            height: '50px',
            margin: '0px 0px 0px 0px'
          }
        }
      },
      created: function() {},
      mounted: function() {
        var _this = this
        var param = {
          fromSite: 'hrss'
        }
        //				get->params  post->data
        this.$http({
          params: param,
          url: '/hrhi/psndoc/listNewEmps',
          method: 'post'
        })
          .then(function(res) {
            console.log(res)
            if (res.data.status == true) {
              if (res.data.data && res.data.data.newEmps) {
                var _DATA = []
                _this.num = res.data.data.newEmps.length
                if (res.data.data.newEmps.length > 3) {
                  _DATA = res.data.data.newEmps.slice(0, 3)
                  _this.newEmps = res.data.data.newEmps.slice(0, 3)
                } else {
                  _DATA = res.data.data.newEmps
                  _this.newEmps = res.data.data.newEmps
                }
                for (var i = 0; i < _DATA.length; i++) {
                  _this.imgPathdata.push({
                    imgPath:
                      '/hrhi/psndoc/getPhotoByPK?pk_psndoc=' +
                      _DATA[i].pk_psndoc
                  })
                }
              } else {
                //还需要改进
                //							_this.$message({
                //								message: res.data.msg,
                //								type: 'error'
                //							});
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
          var imgback1 = document.getElementsByClassName('imgover1')[index]
          var imgblock1 = document.getElementsByClassName('imgSrc1')[index]
          var popoverimgSrc1 = document.getElementsByClassName(
            'popoverimgSrc1'
          )[index]
          var popoverimgover1 = document.getElementsByClassName(
            'popoverimgover1'
          )[index]
          popoverimgSrc1.style.display = 'none'
          imgblock1.style.display = 'none'
          popoverimgover1.style.backgroundSize = '48px 48px'
          popoverimgover1.style.backgroundImage =
            'url(../i_hr/ifbp_hr/widget/homePage/homePage_newEmp/img/peple.png)'
          imgback1.style.backgroundSize = '48px 48px'
          imgback1.style.backgroundImage =
            'url(../i_hr/ifbp_hr/widget/homePage/homePage_newEmp/img/peple.png)'
        }
      }
    })
  }
  return {
    init: init
  }
})
