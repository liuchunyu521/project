/**
  Author:liuchym@yonyou.com
  desc:"调剂金方案配置"
**/
<template>
  
  <div class="adjustGOldconfig">
      <!-- 按钮区域 -->
      <div style="height:30px">
          <div style="float:left;font-size:16px">
              调剂金方案
          </div>
          <div style="float:right">
              <a-button type="primary" @click="onAdd()">新增</a-button>
          </div>
      </div>
        <!-- 内容区域 -->
      <div style=" margin: 20px;">
        <a-row :gutter="16">
            <a-col :span="8" :key="index" v-for="(item,index) in dataSource">
                <div class="wrap" @click="makebill(item)">
                    <div class="title" :style="{'background':item.state ==0 ? '#ddd':'#B0C4DE'}">
                        <a-row>
                            <a-col :span="7">
                                <div class="xuhao" :style="{'background':item.state ==0 ? '#ddd':'#B0C4DE'}">
                                    {{index+1}}
                                </div>
                            </a-col>
                            <a-col :span="17">
                                <div style="margin-top:20px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="item.planName">{{item.planName}}</div>
                                <div style="margin-top:10px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="item.description">{{item.description}}</div>
                                <div style="margin-top:10px">更新时间：{{item.lastModifiedDate | date}}</div>
                            </a-col>
                        </a-row>
                    </div>
                    <div class="footer">
                        <div style="float:right">
                            <span class="rg">
                                
                                <span @click.stop="onState(item)" v-if='item.state==0'><a href="javascript:;">启用</a></span>
                                <span  @click.stop="onState(item)" v-else><a-icon type="stop" /><a href="javascript:;">禁用</a></span>
                            </span>
                            <span class="rg">
                                <a-icon type="setting" />
                                <span @click.stop="onSet(item)"><a href="javascript:;">设置</a></span>
                            </span>
                            <span class="rg">
                                <a-popconfirm title="确定删除吗？删除后记得菜单也要删除掉" okText="是" cancelText="否" @confirm="confirm(item)">
                                    <a-icon type="delete" />
                                    <span ><a href="javascript:;">删除</a></span>
                                </a-popconfirm>
                                
                            </span>

                        </div>
                        
                        
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
    <!-- 分页区域 -->
    <template>
        <div v-if="isFlag==true" style="text-align:center">
            <a-pagination  @change="onChange" :current="current"  :total="total" />
        </div>
    </template>
  </div>
</template>

<script>
import filter from '../../components/mixins/filters.js'

import deleteEmptyProperty from '../../components/mixins/json.js';
import { ajaxData } from '../../components/mixins/ajaxdata.js';

export default {
  name: 'adjustGoldconfigMgt',
  components: {},
  mixins:[filter,deleteEmptyProperty],
  data () {
    return {
        current: 1,//当前显示第几页
        pageSize:12,
        total:0,
        dataSource:[],
        isFlag:false
    }
  },
  computed: {
    service_sms () {
      return this.$store.state.setting.service_sms
    }
  },
  watch:{
    pageSize(val) {
      this.pageSize=val
      this.request(this.current-1,this.pageSize)
    },
    current(val) {
      this.current=val;
      this.request(this.current-1,this.pageSize)
    }
  },
  created(){
    //   方案列表
    this.request(this.current-1,this.pageSize)
  },
  methods: {
    request(p,s){
        var params= {
            page:p,
            size:s,
            businessType:"TJJ"
          }
        var _url=this.service_sms+'/api/plan?fetchProperties=id,planName,description,state,lastModifiedVersion,lastModifiedDate,adjustFundPlanItems[*,dockingSys[*],dockingInterface[*],interfaceField[*]]&state<2&sort=createDate,desc';
        ajaxData("get",_url,params, (res) => {
            console.log(res);
            if(res.data.length==0){
                this.$message.success("暂无数据,请新增数据")
                this.isFlag=false;
            }else {
                this.dataSource=res.data;
                this.isFlag=true;
                var T=res.headers['x-page-totalelements']
                this.total=Number(T)-2;
            }
            
        });
    },
    makebill(res){
        // this.$router.push({//你需要接受路由的参数再跳转
        //     path: "/adjustGoldMgt/adjustMakeDetails",
        //      query: { id: res.id }
        // });
    },
    onAdd(){
        //新增
        this.$router.push({//你需要接受路由的参数再跳转
            path: "/projectconfigMgt/adjustGoldconfigDetails"
        });
    },
    onChange(current) {
        this.current = current
    },
    onState(item){//启用,禁用事件
        console.log(item)
        var state=item.state==0 ? 1 : 0;
         var params= {
            id:item.id,
            lastModifiedVersion:item.lastModifiedVersion,
            state:state
          }
      var _url=this.service_sms+'/api/plan';
      ajaxData("post",_url,params, (res) => {
        // 从新获取列表
        console.log(res)
        this.current=1;
        this.pageSize=12;
        this.request(this.current-1,this.pageSize)
      });
    },
    onSet(item){//设置
        // this.$message.success("待开发中。。。请期待")
        // return;
        console.log(item)
        this.$router.push({//你需要接受路由的参数再跳转
            path: "/projectconfigMgt/adjustGoldconfigDetails",
            query: { id: item.id }
        });
    },
    confirm(item){
        this.onDelet(item);
    },
    onDelet(item){
        //删除操作
        console.log(item)
        
      var params= {}
      var _url=this.service_sms+'/api/plan/delete/'+item.id;
      ajaxData("get",_url,params, (res) => {
        // 从新获取列表
        console.log(res)
        if(res.data.code==0){
            this.$message.success('删除成功');
            this.current=1;
            this.pageSize=12;
            this.request(this.current-1,this.pageSize)
        }else {
            this.$message.error(res.data.msg);
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
 .adjustGOldconfig {
     color: #000;
     .wrap {
         border: 1px solid #ddd;
         border-radius: 4px;
         margin-bottom: 16px;
         .title {
             height: 120px;
         }
         .footer {
             height: 40px;
             border-top: 1px solid #ddd;
             padding-top:8px; 
             padding-right: 8px;
         }
         .xuhao {
             border: 1px solid #fff;
             border-radius: 100%;
             text-align: center;
             width: 50px;
             line-height: 60px;
             height: 60px;
             margin: 16px 0 0 16px;
         }
         .rg {
             margin-right: 8px;
             cursor: pointer;
         }
     }
 }
</style>
