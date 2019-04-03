<!--
  作者：yangchd
  时间：2018-07-24
  支持：薪资方案权限——按方案授权——分配给角色
-->
<template>
  <el-dialog title="分配给角色" :visible.sync="dialogVisible" :show-close="false">
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
      powerData: Array,
    },

    data() {
      return {
        // 功能编码
        funcode: 'funcode=60130classpower',
        permissionPrefix: '/hrwa/classpower',
        url: {
          dialog: '/dialog',
          save: '/save',
        },

        dialogRef: 'role_dialog_ref',
        pk_org: '',
        pk_dialog: '',
        classids: [],
        originalValue: [],

        //这个属性类似于映射关系
        dialogNodeKey: 'pk_role',
        defaultProps: {
          id: 'pk_role',
          children: 'children',
          label: 'role_name',
        },
        defaultCheckKeys: [],

        //导出框是否显示
        dialogVisible: false,
      }
    },

    methods: {
      dialogInit: function () {
        let param = {
          type: 2,
          pk_org: this.pk_org,
          pk_dialog: this.pk_dialog,
        };
        this.$http({
          url: this.permissionPrefix + this.url.dialog,
          method: 'post',
          params: param,
        }).then((res) => {
          this.originalValue = res.data.data;
          this.defaultCheckKeys = res.data.default.role;
        }).catch(() => {
          this.$message({message: '查询失败', type: 'error'});
        });
      },
      checkPowerData: function () {
        if (this.powerData && this.powerData.length > 0) {
          this.classids = [];
          for (let i = 0; i < this.powerData.length; i++) {
            if (i + 1 < this.powerData.length && this.powerData[i].pk_org !== this.powerData[i + 1].pk_org) {
              this.$message({message: '批量操作只允许选择同一个组织', type: 'error'});
              return false;
            }
            this.classids.push(this.powerData[i].pk_wa_class);
          }
          this.pk_org = this.powerData[0].pk_org;
          if (this.classids.length > 1) {
            this.pk_dialog = '';
          } else {
            this.pk_dialog = this.powerData[0].pk_wa_class;
          }
        } else {
          this.$message({message: '分配角色必须选择一个薪资方案！', type: 'error'});
          return false;
        }
        return true;
      },
      dialogSave: function () {
        let roleids = this.$refs[this.dialogRef].getCheckedKeys(true);
        let param = {
          type: 1,
          subject_type: '0',
          pk_org: this.pk_org,
        };
          let data = {
              classids: this.classids,
              roleids: roleids,
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
        this.classids = [];
        this.originalValue = [];
        this.defaultCheckKeys = [];
        this.setDialogVisible(false);
      },

      // 设置dialog是否可见
      setDialogVisible: function (val) {
        if (val) {
          this.dialogVisible = val;
          this.$nextTick(function () {
            if (this.checkPowerData()) {
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
