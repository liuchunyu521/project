/**

liuchym@yonyou.com

**/
<template>
  <a-layout>
    <drawer v-if="isMobile" :openDrawer="collapsed" @change="onDrawerChange">
      <sider-menu :theme="theme" :menuData="menuData" :collapsed="false" :collapsible="false" @menuSelect="onMenuSelect"/>
    </drawer>
    <sider-menu :theme="theme" v-else-if="layout === 'side'" :menuData="menuData" :collapsed="collapsed" :collapsible="true" />
    <drawer :open-drawer="showSetting" placement="right"  @change="onSettingDrawerChange">
      <div class="setting" slot="handler">
        <a-icon :type="showSetting ? 'close' : 'setting'" />
      </div>
      <setting />
    </drawer>
    <a-layout>
      <global-header :menuData="menuData" :collapsed="collapsed" @toggleCollapse="toggleCollapse"/>
      <a-layout-content :style="{minHeight: minHeight, marginTop: '16px',background:'#fff',padding:'16px',paddingTop:'8px'}">
        <slot></slot>
      </a-layout-content>
      <a-layout-footer style="padding: 0px">
        <global-footer :link-list="linkList" :copyright="copyright" />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import GlobalHeader from './GlobalHeader'
import GlobalFooter from './GlobalFooter'
import Drawer from '../components/tool/Drawer'
import SiderMenu from '../components/menu/SiderMenu'
import Setting from '../components/setting/Setting'
import { ajaxData } from '../pages/components/mixins/ajaxdata.js';
const minHeight = window.innerHeight - 64 - 24 - 122

let menuData = []

export default {
  name: 'GlobalLayout',
  components: {Setting, SiderMenu, Drawer, GlobalFooter, GlobalHeader},
  data () {
    return {
      minHeight: minHeight + 'px',
      collapsed: false,
      menuData:menuData,
      showSetting: false
    }
  },
  computed: {
    isMobile () {
      return this.$store.state.setting.isMobile
    },
    theme () {
      return this.$store.state.setting.theme
    },
    layout () {
      return this.$store.state.setting.layout
    },
    linkList () {
      return this.$store.state.setting.footerLinks
    },
    copyright () {
      return this.$store.state.setting.copyright
    }
  },
  methods: {
    toggleCollapse () {
      this.collapsed = !this.collapsed
    },
    onDrawerChange (show) {
      this.collapsed = show
    },
    onMenuSelect () {
      this.toggleCollapse()
    },
    onSettingDrawerChange (val) {
      this.showSetting = val
    },
    transData(a, idStr, pidStr, chindrenStr){  //处理数据
        var r = [], 
          hash = {}, 
          id = idStr, 
          pid = pidStr, 
          children = chindrenStr, 
          i = 0, j = 0, len = a.length;
        for(; i < len; i++){  
            hash[a[i][id]] = a[i];  
        }  
        for(; j < len; j++){  
            var aVal = a[j], hashVP = hash[aVal[pid]];  
            if(hashVP){  
                !hashVP[children] && (hashVP[children] = []);  
                hashVP[children].push(aVal);  
            }else{  
                r.push(aVal);  
            }  
        }  
        return r;  
    },
    getArray(data){//递归处理数据；
    		if(data.length){
    			//主级排序
    			data.sort(function(a, b) {
					    var t1 = a.order*1;
					    var t2 = b.order*1;
					    if (t1 > t2) return 1;
					    else if (t1 < t2) return -1;
					    else return 0;
					});
					//子级的排序
					for (var i in data) {
            if (data[i].children) {
                data[i].children.sort(function(a, b) {
							    var t1 = a.order*1;
							    var t2 = b.order*1;
							    if (t1 > t2) return 1;
							    else if (t1 < t2) return -1;
							    else return 0;
							});
							this.getArray(data[i].children)
            } else {
                break;
            }
        	}
    		}
        
    }
  },
  beforeCreate () {
    menuData = this.$router.options.routes.find((item) => item.path === '/').children
    console.log(menuData)

   /* var array=[];
    // 发送请求获取菜单数据
    var _url='appmodule/api/appfunction?appModule.id=41&fetchProperties=order,id,url,code,name,enabled,parent[id,code,name,url,order,enabled]&size=99999999';
    ajaxData("get",_url,'', (res) => {
        array=res.data;
        //第一步将 parent 等于id 的值；
        for(var i=0;i<array.length;i++){
          array[i].icon='dashboard'//图标可换;
          array[i].path=array[i].url;
          array[i].invisible=array[i].enabled;
          delete array[i].url;
          if(array[i].parent){
            array[i].parent=array[i].parent.id;
          }
        }
        //打印arrayconsole.log(array)
        //第二部 将没有parent 数据提取出来
        var noParent=[]
        for(var j=0;j<array.length;j++){
          if(!array[j].parent){
            noParent.push(array[j])
          }
        }
        //打印	console.log(noParent);
        //不带parent 的新array;console.log(array);
        var jsonData = eval(array);  
        var jsonDataTree = this.transData(jsonData, 'id', 'parent', 'children');  
        this.getArray(jsonDataTree);
        this.menuData=jsonDataTree;//给菜单赋值(安装规定格式)
        console.log(this.menuData) 
    }); */
  }
}
</script>

<style lang="less" scoped>
  .setting{
    background-color: #1890ff;
    color: #fff;
    border-radius: 5px 0 0 5px;
    line-height: 40px;
    font-size: 22px;
    width: 40px;
    height: 40px;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  }
</style>
