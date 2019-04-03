// 调用打印预览方法，funcode为功能编码,nodekey为模板标识，queryParams为object对象，使用import引入，mixins混入
export default {
    methods: {
        printPre(funcode,nodekey,queryParams) {
            this.$http({
                url: '/riart/printtemplate/getPreviewURL',
                method: 'post',
                dataType: 'json',
                data: {
                    'funcode': funcode,
                    'nodekey': nodekey,
                    'queryParams': queryParams
                }
            }).then((res) => {
                if (res.data.status == true) {
                    window.open(res.data.data, '_blank');
                } else {
                    this.$message.error(res.data.message);
                }
            }).catch((e) => {
                console.error(e);
                this.$message.error('操作失败');
            });
        }
    }
}