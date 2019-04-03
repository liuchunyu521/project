<template>
	<div>   
		<employeePage v-show="judgeyg"></employeePage>
	</div>
</template>

<script> 	
import employeePage from './employeepage';
import Cookies from 'js-cookie';
export default{ 
	data(){
		return {
			judgeyg:true,
			judgeld:false 
		}
	},
	components: {
		employeePage
	},
   created() {
// 		var userid=Cookies.get('usermsg');
// 		//判断是领导还是员工还是经理。。。。。。
//   	if(userid){
//   		this.judgeyg=true;
//   	}	
   }
}
</script>
 