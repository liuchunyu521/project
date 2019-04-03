<!--
  作者：liuchym	
  时间：2019-01-10
  支持：花名册权限——按照用户-分配给花名册
-->
<template>
  <el-dialog title="分配花名册" :visible.sync="dialogVisible" :show-close="false">
    <div id="role_dialog_tree">
      <el-tree :ref="dialogRef"
               :data="originalValue"
               :node-key="dialogNodeKey"
               show-checkbox :check-strictly="false"
               :default-checked-keys="defaultCheckKeys"
               :props="defaultProps">
      </el-tree>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogCancel">取 消</el-button>
      <el-button type="primary" @click="dialogSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      repdefData: Array,
      pk_org:String
    },

    data() {
      return {
        // 功能编码
        funcode: 'funcode=60070repdef',
        permissionPrefix: '/hrhi/repdef',
        url: {
          dialog: '/listDialogData',
          save: '/saveRptAuth',
        },

        dialogRef: 'class_dialog_ref',
        pk_dialog: '',
        userids: [],
        originalValue: [],

        //这个属性类似于映射关系
				dialogNodeKey: 'value',
        defaultProps: {
          id: 'value',
          children: 'children',
          label: 'label',
        },
        defaultCheckKeys: [],

        //导出框是否显示
        dialogVisible: false,
      }
    },
    methods: {
      dialogInit: function () {
        let param = {
          type: 1,
          authType:1,
          pk_org: this.pk_org,
          pk_obj: this.pk_dialog,
        };
        this.$http({
          url: this.permissionPrefix + this.url.dialog,
          method: 'post',
          params: param,
        }).then((res) => {
          this.originalValue = res.data.data.uivos;
          this.defaultCheckKeys = res.data.data.auth;
        }).catch(() => {
          this.$message({message: '查询失败', type: 'error'});
        });
      },
      checkrepdefData: function () {
        if (this.repdefData && this.repdefData.length > 0) {
          this.userids = [];
          for (let i = 0; i < this.repdefData.length; i++) {
            if (i + 1 < this.repdefData.length && this.repdefData[i].pk_org !== this.repdefData[i + 1].pk_org) {
              this.$message({message: '批量操作只允许选择同一个组织的数据', type: 'error'});
              return false;
            }
            this.userids.push(this.repdefData[i].cuserid);
          }
          if (this.userids.length > 1) {
            this.pk_dialog = '';
          } else {
            this.pk_dialog = this.repdefData[0].cuserid;
          }
        } else {
          this.$message({message: '请先选择角色或方案！', type: 'error'});
          return false;
        }
        return true;
      },
      dialogSave: function () {
        let repdefids = this.$refs[this.dialogRef].getCheckedKeys(true);
        let param = {
          type: 1,
          authType:1,
          pk_org: this.pk_org,
        };
        let data = {
            cuserids: this.userids,
            pk_rpt_defs: repdefids,
        };
        this.$http({
          url: this.permissionPrefix + this.url.save,
          method: 'post',
          params: param,
            data:data,
        }).then((res) => {
          if (res.data.status === true) {
            this.$message({message: res.data.msg, type: 'success'});
            this.dialogCancel();
          } else {
            this.$message({message: res.data.msg, type: 'error'});
          }
        }).catch(() => {
          this.$message({message: '查询失败', type: 'error'});
        });
      },

      dialogCancel: function () {
        this.userids = [];
        this.originalValue = [];
        this.defaultCheckKeys = [];
        this.setDialogVisible(false);
      },

      // 设置dialog是否可见
      setDialogVisible: function (val) {
        if (val) {
          this.dialogVisible = val;
          this.$nextTick(function () {
            if (this.checkrepdefData()) {
              this.dialogInit();
            } else {
              this.dialogVisible = false;
            }
          });
        } else {
          this.dialogVisible = val;
        }
      },
    }
  }
</script>

<style>
  #role_dialog_tree {
    height: 400px;
  }
  #role_dialog_tree .el-tree {
    border: none !important;
  }
</style>
