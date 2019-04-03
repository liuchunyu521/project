<!--
  作者：yangchd
  时间：2018-05-15
  支持：员工-基本信息-头像部分
  修改：2018-11-27将头像部分变成公共组件，并添加标签
-->
<template>
  <div class="psndoc-main-avatar clearfix">
    <!--显示部分-->
    <div class="psndoc-main-avatar-left">
      <el-upload v-if="templateEdit"
                 class="avatar-uploader"
                 accept="image/*"
                 action=""
                 :show-file-list="false"
                 :before-upload="beforeAvatarUpload">
        <img v-if="imgUrlNew" :src="imgUrlNew" alt="" @error="errorLoadImg" style="width: 134px;height: 188px;">
      </el-upload>
      <img v-if="!templateEdit" :src="imgUrl" alt="" @error="errorLoadImg" style="width: 134px;height: 188px;"/>
    </div>
    <div class="psndoc-main-avatar-right" v-if="pk_psndoc">
      <div class="psndoc-main-avatar-info">
        <div v-if="psndocName" class="psndoc-main-avatar-name" v-text="psndocName"></div>
        <div v-if="psndocName&&isPrincipal" class="psndoc-main-avatar-img ifbp-icon-organization"
             @click="psndocAvatarOrgClick()"></div>
      </div>
      <div style="clear:both"></div>
      <div v-if="psnclName" class="psndoc-main-avatar-psncl" v-text="psnclName"></div>
      <div v-if="orgDeptPsncl" class="psndoc-main-avatar-other" v-text="orgDeptPsncl"></div>
      <!--<div v-if="deptName" class="psndoc-main-avatar-other" v-text="deptName"></div>-->
      <!--<div v-if="orgName" class="psndoc-main-avatar-other" v-text="orgName"></div>-->
      <tag-dis :pk_psndoc="pk_psndoc" :pk_org="pk_org" :mode="mode"></tag-dis>
    </div>
  </div>
</template>

<script>

  import defaultAvatar from '../../assets/images/hrhi/avatar/default_avatar.png';
  import defaultAvatarMin from '../../assets/images/hrhi/avatar/default_avatar_min.png';
  import tagDis from './psn-tag-dis.vue';

  export default {
    components:{
      tagDis,
    },
    props: {
      mode: {
        type: Number,
        default: function () {
          return 1;
        },
      },
      templateEdit: {
        type: Boolean,
        default: function () {
          return false;
        },
      },
      psndocData: Object,
      funcode: {
        type: String,
        required: true
      },
      requestPrefix: {
        type: String,
        required: true
      },
    },

    computed: {
      pk_psndoc: function() {
        return this.psndocData.psndoc.pk_psndoc;
      },
      psndocName: function () {
        return this.psndocData.psndoc.name;
      },
      isPrincipal:function(){
        return this.psndocData.psndoc.isPrincipal;
      },
      eduName: function () {
        return this.psndocData.psndoc.edu ? this.psndocData.psndoc.beanMap['edu_ref'][this.psndocData.psndoc.edu].name : '';
      },
      //人员类别
      psnclName: function () {
        return this.psndocData.psnjob
            ? this.psndocData.psnjob[this.psndocData.psnjob.length - 1]
                .beanMap['pk_psncl_ref'][this.psndocData.psnjob[this.psndocData.psnjob.length - 1].pk_psncl].name : '';
      },
      //部门名称
      deptName: function () {
        return this.psndocData.psnjob
            ? this.psndocData.psnjob[this.psndocData.psnjob.length - 1]
                .beanMap['pk_dept_ref'][this.psndocData.psnjob[this.psndocData.psnjob.length - 1].pk_dept].name : '';
      },
      //组织名称
      orgName: function () {
        return this.psndocData.psnjob
            ? this.psndocData.psnjob[this.psndocData.psnjob.length - 1]
                .beanMap['pk_org_ref'][this.psndocData.psnjob[this.psndocData.psnjob.length - 1].pk_org].name : '';
      },
      orgDeptPsncl:function () {
        let org = this.orgName?this.orgName+" | ":'';
        let dept = this.deptName?this.deptName+" | ":'';
        let edu = this.eduName?this.eduName+" | ":'';
        let all = org + dept + edu;
        if(all.endsWith('| ')){
          all = all.substring(0,all.length - 2);
        }
        return all;
      },
      //组织
      pk_org: function () {
        return this.psndocData.psnjob
            ? this.psndocData.psnjob[this.psndocData.psnjob.length - 1].pk_org : '';
      }
    },
    watch: {
      pk_psndoc(newValue, oldValue) {
        if (this.pk_psndoc) {
          this.imgUrl = this.getDefaultPhotoUrl();
          this.imgUrlNew = this.getDefaultPhotoUrl();
        }
      },
      templateEdit: {
        handler(newValue, oldValue) {
          //每当编辑状态改变时，进行图片的重置
          if (!newValue) {
            this.imgUrl = this.getDefaultPhotoUrl();
            this.imgUrlNew = this.getDefaultPhotoUrl();
          }
        },
        deep: true
      }
    },

    data() {
      return {
        // 联查地址
        joinUrl : this.$route.path,
        imgUrl: '',
        imgUrlNew: '',
      };
    },

    methods: {
      // 获取默认显示路径
      getDefaultPhotoUrl:function () {
        //新增时间戳，防止缓存
        return '/hrhi/psndoc/getPhotoByPK?pk_psndoc=' + this.pk_psndoc + '&time=' + (new Date()).getTime();
      },

      // 点击组织机构小图标事件
      psndocAvatarOrgClick(){
        let query = {
          pk_psndoc:this.pk_psndoc,
        };
        let path = '';
        if(this.joinUrl.indexOf("register") > 0){
          path = "/hrhi/register?" + this.funcode;
        }else if(this.joinUrl.indexOf("employee") > 0){
          path = "/hrhi/employee?" + this.funcode;
        }else if(this.joinUrl.indexOf("psninfo") > 0){
          path = "/hrhi/psninfo?" + this.funcode;
        }else{
          path = "/hrhi/psndoc?funcode=60070psninfo";
        }
        this.$router.push({path: path, query: query});
      },

      // 当图片加载失败以后触发
      errorLoadImg: function (e) {
        e.srcElement.src = defaultAvatar;
      },

      // 选择图片后的处理方法
      beforeAvatarUpload(file) {
        // 看支持不支持FileReader
        if (!file || !URL.createObjectURL) {
          this.$message({message: "您当前的浏览器不支持图片的上传！", type: "error"});
          return;
        }
        // 图片预览
        this.imgUrlNew = URL.createObjectURL(file);
        // 图片流获取
        let reader = new FileReader();
        reader.readAsDataURL(file);
        let avatarThis = this;
        reader.onload = function (evt) {
          avatarThis.dataChange(evt.target.result);
        };
        //返回false不继续上传
        return false;
      },
      
      // 图片变化
      dataChange: function (val) {
        let data = JSON.parse(JSON.stringify(this.psndocData.psndoc));
        data.photo = val;
        this.$emit('dataChange', data)
      },

      // 初始化数据
      resetTemplateData: function () {
        this.imgUrlNew = this.getDefaultPhotoUrl();
      },
    }
  };
</script>

<style scoped>

  /*清空浮动*/
  .clearfix:after {
    content: "";
    display: block;
    clear: both;
  }

  .psndoc-main-avatar {
    padding-left: 160px;
    padding-top: 32px;
    padding-bottom: 6px;
  }

  .psndoc-main-avatar-left {
    width: 134px;
    height: 188px;
    float: left;
    margin-right: 32px;
  }

  .psndoc-main-avatar-right {
    width: calc(100% - 166px);
    float: left;
  }

  .psndoc-main-avatar-info {
    margin-top: 16px;
  }


  .psndoc-main-avatar-name {
    font-size: 32px;
    color: #2D2D2D;
    line-height: 32px;
    float: left;
  }
  .psndoc-main-avatar-img {
    font-size: 32px;
    line-height: 32px;
    color: #FFA337;
    cursor: pointer;
    float: left;
    margin-left: 16px;
  }


  .psndoc-main-avatar-psncl {
    color: #FFFFFF;
    background: #42BBA7;
    border-radius: 4px;
    height: 28px;
    display: inline-block;
    text-align: center;
    line-height: 28px;
    /*由固定长度改成左右间距*/
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 14px;
    margin-bottom: 18px;
  }
  .psndoc-main-avatar-other {
    font-size: 16px;
    color: #6B6B6B;
    letter-spacing: 0;
    line-height: 16px;
    margin-bottom: 8px;
  }

  input[type=file] {
    display: none;
  }

  .avatar-uploader {
    width: 134px;
    height: 188px;
    background: #f5f5fa;
    text-align: center;
    border: 0;
  }

  .avatar-uploader .el-upload {
    width: 134px;
    height: 188px;
    border: 0;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 134px;
    height: 188px;
    line-height: 188px;
    text-align: center;
  }

</style>
