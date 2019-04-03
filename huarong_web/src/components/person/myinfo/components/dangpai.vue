<template>
	 <div>
     <subList
       title='党派信息'
       :ref="infoSetCode"
       :infoSetCode="infoSetCode"
       :editabled="true"
       :theaddata='theadData'
       @add="openLvliDialog"
       @delete="deleteList"
       @handle="handleList"></subList>

     <subDialog
       title="党派信息"
       :visible="dialogVisible"
       :formConfig="formConfig"
       :formData="dialogData"
       @close="dialogVisible = false"
       @dateChange="dateChangeInDialog"
       @submit="savePersonInfo"></subDialog>

   </div>
</template>
<script>
	import Qs from 'qs';
	import Cookies from 'js-cookie';
	import { deepCopyObj, deepCopyArry } from '@/assets/js/v-extend.js';
	import { ajaxData, getUpdateParam } from '@/assets/js/ajaxdata.js';
	import yInput from '@/components/public/yinput';
  import subList from './sublist';
  import subDialog from './subdialog';

	export default {
		props: [ ],
		data() {
			return {
        infoSetCode: 'hi_psndoc_partylog', //接口关键字
        dialogVisible: false, //新增编辑弹窗的显示隐藏字段
        dialogData: {}, //弹窗的数据
        postSaveData: {
          "transType": "savePsnInfo",
          "infoSetCode": 'hi_psndoc_partylog'
        }, //新增编辑删除
        initData: {
        }
			}
		},
    computed:{
      theadData(){
        return this.$store.state.Information['dangpaiTheadData']
      },
      formConfig(){
        return this.$store.state.Information['dangpaiFormConfig']
      }
    },
		components: {
			yInput, //表单元素
      subList, //列表信息
      subDialog //弹窗信息
		},
		created() {
		},
		methods: {
      dateChangeInDialog: function( param ){
        if( param[0] == "partyduedate" ){
          var _val = param[1];
          if( _val == '' ){
            this.initData.glbdef4='';
          }else {
            if( this.systime() < this.systimetran ( _val ) ){
            }else{
              var days = this.sysdays( this.systime(),this.systimetran( _val ) );
              var _glbdef4 = (days/365).toFixed(2);
              this.initData.glbdef4 =_glbdef4;
            }
          };
        };
      },
      fnInitData: function(){
        this.initData = {
          "begindate": "",
          "enddate": "",
          "partydate": "",
          "partyname": "",
          "partyunit": "",
          "partypsn": "",
          "partyduedate": "",
          "exreason": "",
          "exsort": "",
          "glbdef4": "",
          "glbdef1": "",
          "glbdef7": "",
          "glbdef8": ""
        };
      },
      openLvliDialog: function( data ){
        var me = this;
        me.fnInitData();
        switch(data[0]) {
          case "add":
            this.postSaveData.status = 2;
            this.dialogData = this.initData;
            break;
          case 'edit':
            var _data = data[2];
            this.postSaveData.status = 1;
            if( data[2].pk_psndoc_sub ){
              this.postSaveData.pk_psndoc_sub = data[2].pk_psndoc_sub;
            }else{
              this.postSaveData.pk_psndoc_sub = data[2].index;
            };
            this.dialogData = me.getEditData( this.initData, _data );
            break;
        };
        this.dialogVisible = true;
      },
      //新增、编辑、删除操作调用保存借口
      savePersonInfo: function( data ){
        var me = this;
        this.postSaveData.jsonStr = encodeURIComponent( JSON.stringify( data ) );

        if( !this.validateForm( data ) ){
          return false;
        };

        this.$http.post(this.$store.state.Interface.hi, Qs.stringify( this.postSaveData ), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=gbk' }
        }).then(function(response) {
          if(response.data.flag == '0' ) {
            me.$refs[me.infoSetCode].loadData();
            me.resetDialog();
          } else {
            me.$message({
              message: response.data.des,
              type: 'error'
            })
          };
        }.bind(this)).catch(function(error1) {
          //me.$message.error('请求数据失败');
        });
      },
      //校验入学日期、毕业日期的有效性
      validateForm: function( data ){
        var _sdate = ( data.partydate ? data.partydate : this.dialogData.partydate );
        var _edate = ( data.partyduedate ? data.partyduedate : this.dialogData.partyduedate );

        if( _sdate && _sdate != "" && _edate && _edate != "" ){
          if( _edate < _sdate ){
            this.$message.error('转正日期不能早于参加日期');
            return false;
          };
        };
        return true;
      },
      //删除操作
      deleteList: function( data ){
        this.postSaveData.status = 3;
        if( data[2].pk_psndoc_sub ){
              this.postSaveData.pk_psndoc_sub = data[2].pk_psndoc_sub;
            }else{
              this.postSaveData.pk_psndoc_sub = data[2].index;
            };
        this.savePersonInfo( data[2] );
      },
      //提交、还原、收回等操作
      handleList: function( data ){
        var me = this;
        var _code = me.infoSetCode;
        this.$http.post(this.$store.state.Interface.hi, Qs.stringify({
          "transType": 'handlePsnInfo',
          "infoSetCode": _code,
          "way": data[0]
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=gbk'
          }
        }).then(function(response) {
          if(response.data.flag == 0) {
            this.$refs[_code].loadData();
          } else {
            this.$message({
              message: response.data.des,
              type: 'error'
            })
          }
        }.bind(this)).catch(function(error1) {
          this.$message.error('请求数据失败');
        }.bind(this));
      },
      //关闭弹窗
      resetDialog: function(){
        this.dialogVisible = false;
      },
      //日期变化之后
      dateChange: function(){

      },
      //被编辑的列表数据
      getEditData: function( sdata, cdata ){
        var _obj = {};
        for(var i in sdata) {
          _obj[i] = (cdata[i] ? cdata[i] : sdata[i]);
        };
        return _obj;
      },
      systime(){
        var date = new Date();
        var year = date.getFullYear();
        var month = (date.getMonth() + 1);
        month = month > 9 ? month : "0" + month;
        var day = date.getDate();
        day = day > 9 ? day : "0" + day;
        var hours = date.getHours();
        hours = hours > 9 ? hours : "0" + hours;
        var minutes = date.getMinutes();
        minutes = minutes > 9 ? minutes : "0" + minutes;
        var seconds = date.getSeconds();
        seconds = seconds > 9 ? seconds : "0" + seconds;
        return year + '-' + month + '-' + day;
      },
      systimetran(date){
        if( date ){
          var date = new Date(date);
          var year = date.getFullYear();
          var month = (date.getMonth() + 1);
          month = month > 9 ? month : "0" + month;
          var day = date.getDate();
          day = day > 9 ? day : "0" + day;
          var hours = date.getHours();
          hours = hours > 9 ? hours : "0" + hours;
          var minutes = date.getMinutes();
          minutes = minutes > 9 ? minutes : "0" + minutes;
          var seconds = date.getSeconds();
          seconds = seconds > 9 ? seconds : "0" + seconds;
          return year + '-' + month + '-' + day;
        }else{
          return ''
        };

      },
      sysdays(sDate1,  sDate2){
        if( sDate1 && sDate2 ){
          var  aDate,  oDate1,  oDate2,  iDays;
          aDate  =  sDate1.split("-");
          oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
          aDate  =  sDate2.split("-");
          oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
          iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24);
          return  iDays;
        }else{
          return ''
        };

      }
		}
	}
</script>
