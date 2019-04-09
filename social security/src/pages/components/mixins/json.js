export default {//json 去空字段
    methods:{
        deleteEmptyProperty(object){
            var _this=this;
            for (var i in object) {
                var value = object[i];
                
                if (typeof value === 'object') {
                    if (Array.isArray(value)) {
                        if (value.length == 0) {
                        delete object[i];
                        continue;
                        }
                    }
                    _this.deleteEmptyProperty(value);
                    if (_this.isEmpty(value)) {
                    delete object[i];
                    }
                } else {
                    if (value === '' || value === null || value === undefined) {
                        delete object[i];
                        } else {
                            // console.log('check ', i, value);
                        }
                }
            }

            return object
        },
        isEmpty(object) {
            for (var name in object) {
                return false;
            }
            return true;
        }
    }
};
