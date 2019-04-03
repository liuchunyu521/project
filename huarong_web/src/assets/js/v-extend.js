
export function deepCopyArry( arr ){ 
	//为了保证原始的listdata数据不被污染，使用拷贝的方式赋值
	return arr.map((e)=>{
        if(typeof e === 'object'){
            return Object.assign({},e)
        }else{
            return e
        }
    });
};

export function deepCopyObj( obj ){   
	var newO = {};
	  if (obj instanceof Array) {
	    newO = [];
	  };
	  for ( var key in obj) {
	    var val = obj[key];
	    if( val instanceof Array ){
	    	newO[key] = val;
	    }else{
	    	newO[key] = typeof val === 'object' ? arguments.callee(val) : val;  
	    }; 
	  };
	  return newO;
};  