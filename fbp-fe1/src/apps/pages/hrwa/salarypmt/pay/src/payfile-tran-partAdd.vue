<!--
	作者：offline
	时间：2018-10-15
	描述：异动-兼职开始
-->
<template>
    <div>
        <!--  :pk-temp="newAddPsnTempId"-->
      <ifbp-template ref="ref_alter_partin"
                     tpl-id="alternewpart"

                     :tpl-data="newAddPsnData"
                     :table-show-menu="false"
                      >
      </ifbp-template>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalElements">
      </el-pagination>
      <el-checkbox v-model="checkedall" @change="checkchange" style="margin-top: 16px;margin-left: 14px;">全部全选</el-checkbox>
    </div>
</template>
<script>


  export default {
    props :['pk_org','pk_wa_class','cyear','cperiod','beginDate','endDate'],
    data() {

      return {

        newAddPsnTempId: "0001AA1000000000ONPW",
        newAddPsnData: {
        },
        currentPage:1,
        pageSize :1,
        totalElements:0,
        checkedall:false,
      };
    },
	watch: {
	  'beginDate': function(val,oldval) {
	     // your code
	     this.request()
	  },
	  'endDate': function(val,oldval) {
	     // your code
	     this.request()
	  }
	},
    methods: {
		checkchange(){
        		if(this.checkedall==true){
        			this.$refs.ref_alter_partin.getTableComp().selectAllRow();
        			this.$emit('setIsAllPageSelect', true);

        		}else if(this.checkedall==false){
        			this.$refs.ref_alter_partin.getTableComp().unSelectAllRow();
        			this.$emit('setIsAllPageSelect', false);

        		}
        		
        	},
	 getTransType(){
	  	return "TRN_PART_ADD";
	  },
    setCheckedallValue(v){
	  	this.checkedall = v;
        this.$emit('setIsAllPageSelect', v);
	 },
	 initPromise(request) {
            Promise.all([request]).then(() => {
                if(this.checkedall==true){
					this.$refs.ref_alter_partin.getTableComp().selectAllRow()
	    		}else if(this.checkedall==false){
	    			this.$refs.ref_alter_partin.getTableComp().unSelectAllRow()
	    		}
            });
        },
      // 请求数据
      request(n, s) {


        if(!this.beginDate || !this.endDate){
          return ;
        }
        var pn = 1;
        var ps =10 ;

        if(n){
          pn = n;
        }
        if(s){
          ps = s;
        }
        var url =
          "/hrwa/salarymgt/payData/psnController/queryAlterPsn";

        this.$http({
          url: url,
          method: "post",
          data :{
            pk_org:this.pk_org,
            trnType:"TRN_PART_ADD",
            begindate : this.beginDate,
            enddate : this.endDate,
            pk_wa_class : this.pk_wa_class,
            cyear : this.cyear,
            cperiod : this.cperiod,
            pn : pn,
            ps : ps
          }
        })
          .then(res => {
            if (res.data.status === true) {
              var originalValue = res.data.data.content;

              this.currentPage = res.data.data.number;
              this.pageSize = res.data.data.size;
              this.totalElements = res.data.data.totalElements;
              this.$emit("setTabLabel","兼职开始("+this.totalElements+")");
              this.$emit("actionDisable",this.totalElements==0);
              this.initPromise(this.$refs.ref_alter_partin.setData(
                "hi_psnjob_t",
                JSON.parse(JSON.stringify(originalValue))
              ))
              
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
              this.$emit("setTabLabel","兼职开始(0)");
            }
          })
          .catch(e => {
            console.error(e);
            this.$message({
              message: "人员获取失败",
              type: "error"
            });
            this.$emit("setTabLabel","兼职开始(0)");
          });
      },
      // 跳转到添加地点页面
      operationButtonClick() {
        var tableSelections = this.$refs.ref_alter_partin.comp.$refs.ref_alter_partin.getSelection();
        var addDatas = [];
        if (tableSelections && tableSelections.length > 0) {
          for (var i = 0; i < tableSelections.length; i++) {
            var row = tableSelections[i];
            addDatas.push(row);
          }
        }
          this.addDatas = addDatas;
            return this.getSelectedData();
      },
      getSelectedData(){
        return this.addDatas;
      },
      // 翻页标签改变每页显示数据
      handleSizeChange(val) {
        this.request(1, val);
      },

      // 翻页标签改变当前页
      handleCurrentPageChange(val) {
        this.request(val, this.pageSize);
      }
    }
  };
</script>
<style>

</style>
