<template>
  <el-dialog
          title="授权使用"
          v-model="powerVisible"
          size="small" id="powerTagDialog">
      <el-tabs   v-model="activeName" class="ifbp-content-tabs">
        <el-tab-pane label="用户权限" name="1">
            <div style="height:400px;overflow:auto">
                <el-tree ref="userRef" node-key="cuserid" :check-strictly="false" :data="userData" show-checkbox :props="userProps" :default-checked-keys="defaultUserCheckKeys"></el-tree>
            </div>
        </el-tab-pane>
        <el-tab-pane label="角色管理" name="2">
            <div style="height:400px;overflow:auto">
                <el-tree ref="roleRef" node-key="pk_role" :check-strictly="false" :data="roleData" show-checkbox :props="roleProps" :default-checked-keys="defaultRoleCheckKeys"></el-tree>
            </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogCancel">取 消</el-button>
            <el-button type="primary" @click="dialogConfirm">确 定</el-button>
            </span>
  </el-dialog>
</template>
<script>

  export default {
    data() {
      return {
          powerVisible:false,
          activeName:"1",
          pk_org:"",
          pk_hi_tag:"",
          userData:[],
          roleData:[],
          defaultUserCheckKeys:[],
          defaultRoleCheckKeys:[],
          directUpd:false,
          userProps:{
            id: 'cuserid',
                pid: 'pk_usergroupforcreate',
            children: 'children',
            label: 'user_name',
        },
          roleProps:{
              id: 'pk_role',
              pid: 'role_group_id',
              children: 'children',
              label: 'role_name',
          },
        scirptLang:'',
        businessLang:'',
        //确定按钮按下后,回传得数据格式
        selectedData: [{id:'',code:'',name:''}],
      };
    },
      computed:{},
    mounted() {
    },

    methods: {
        showDirectDialog(pk_org, pk_hi_tag){
            this.pk_org = pk_org;
            this.pk_hi_tag = pk_hi_tag;
            this.powerVisible = true;
            this.getUsePowerData();
            this.userData =[];
            this.roleData =[];
            this.getData();
            this.directUpd = true;
        },
        showDialog(pk_org, pk_hi_tag, userpks, rolepks){
            this.pk_org = pk_org;
            this.pk_hi_tag = pk_hi_tag;
            this.powerVisible = true;
            this.defaultUserCheckKeys = userpks;
            this.defaultRoleCheckKeys = rolepks;
            this.userData =[];
            this.roleData =[];
            this.getData();
            this.directUpd = false;
        },
        getUsePowerData(){
            var url = "/hrhi/tag/usePowerData";
            this.$http({
                url: url,
                method: "post",
                params:{
                    pk_hi_tag: this.pk_hi_tag,
                },
            })
                .then((res) => {
                    if (res.data.status === true) {
                        this.tagVisible = true;
                        this.defaultUserCheckKeys = res.data.userpks;
                        this.defaultRoleCheckKeys = res.data.rolepks;
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                })
                .catch((e) => {
                    this.$message({
                        message: "查询数据失败！",
                        type: "error"
                    });
                });
        },
        getData(){
          var url = "/hrhi/tag/powerSetData";
            this.$http({
                url: url,
                method: "post",
                params:{pk_org : this.pk_org}
            })
                .then(res => {
                    if (res.data.status === true) {
                        this.userData = res.data.user;
                        this.roleData = res.data.role;
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: "error"
                        });
                    }
                })
                .catch(e => {
                    this.$message({
                        message: "详情获取失败",
                        type: "error"
                    });
                });
        },
        dialogConfirm: function dialogConfirm() {

            let users = this.$refs.userRef.getCheckedKeys(true);
            let roles = this.$refs.roleRef.getCheckedKeys(true);
            let userNodes = this.$refs.userRef.getCheckedNodes(true);
            let roleNodes = this.$refs.roleRef.getCheckedNodes(true);
            let names = "";
            if(userNodes && userNodes.length > 0){
                for(var idx in userNodes){
                    var userName = userNodes[idx].user_name;

                    if(userName.indexOf(" ") > -1){
                        userName = userName.substr(userName.indexOf(" ") + 1);
                    }
                    names += "," + userName;
                }
            }
            if(roleNodes && roleNodes.length > 0){
                for(var idx in roleNodes){
                    names += "," + roleNodes[idx].role_name;
                }
            }
            if(names && names.length > 0){
                names = names.substr(1);
            }else{
                names = "";
            }
            this.$emit('confirm', users, roles, names, this.directUpd);
            this.powerVisible = false;
        },
      realSave() {
        this.$http({
          url: "/hrwa/payitem/detail/getScriptLang",
          method: "post",
          data:{ifromflag : 7, func:this.formData.func,parentitemkey:this.queryParams.itemkey}
        })
          .then(res => {
            if (res.data.status === true) {
//              this.funcOptions = res.data.data;
              this.scirptLang = res.data.data.scirptLang;
              this.businessLang = res.data.data.businessLang;
              this.selectedData[0].id=this.formData.func;
              this.selectedData[0].code=this.scirptLang;
              this.selectedData[0].name=this.businessLang;
              this.$emit('customRefConfirm', this.selectedData);

            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          })
          .catch(e => {
            this.$message({
              message: "详情获取失败",
              type: "error"
            });
          });
      },
      dialogCancel: function dialogCancel() {
            this.powerVisible = false;
        this.$emit('customRefCancel');
      },
    },
    created: function created() {
    }
  };
</script>
<style>
    #powerTagDialog  .el-dialog__body{
        padding: 0 16px!important;
    }
    #powerTagDialog .el-tree {
        border: none !important;
    }
</style>
