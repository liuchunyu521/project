<template>
	 <div>
     <subList
       title='职业资格'
       :infoSetCode="infoSetCode"
       :editabled="false"
       :theaddata='theadData'></subList>
   </div>
</template>
<script>
	import Qs from 'qs';
	import Cookies from 'js-cookie';
	import { deepCopyObj, deepCopyArry } from '@/assets/js/v-extend.js';
	import { ajaxData, getUpdateParam } from '@/assets/js/ajaxdata.js';
	import yInput from '@/components/public/yinput';
  import subList from './sublist';

	export default {
		props: [ ],
		data() {
			return {
        infoSetCode: 'hi_psndoc_nationduty'
			}
		},
    computed:{
      theadData(){
        return this.$store.state.Information['zhiyeTheadData']
      }
    },
		components: {
			yInput, //表单元素
      subList //列表信息
		},
		created() {
		},
		methods: {
		}
	}
</script>
