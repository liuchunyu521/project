<template>
	 <div>
     <subList
       title='奖励信息'
       :ref="infoSetCode"
       :infoSetCode="infoSetCode"
       :editabled="true"
       :theaddata='theadData'
       @add="openLvliDialog"
       @delete="deleteList"
       @handle="handleList"></subList>

     <subDialog
       title="奖励信息"
       :visible="dialogVisible"
       :formConfig="formConfig"
       :formData="dialogData"
       @close="dialogVisible = false"
       @dateChange="dateChange"
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
        infoSetCode: 'hi_psndoc_enc', //接口关键字
        dialogVisible: false, //新增编辑弹窗的显示隐藏字段
        dialogData: {}, //弹窗的数据
        postSaveData: {
          "transType": "savePsnInfo",
          "infoSetCode": 'hi_psndoc_enc'
        }, //新增编辑删除
        initData: {

        }
			}
		},
    computed:{
      theadData(){
        return this.$store.state.Information['jiangliTheadData']
      },
      formConfig(){
        return this.$store.state.Information['jiangliFormConfig']
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
      fnInitData: function(){
        this.initData = {
          "encourdate": "",
          "encourtype": "",
          "encourrank": "",
          "encourorg": "",
          "encourmatter": "",
          "encourmeas": ""
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
      }
		}
	}
</script>
