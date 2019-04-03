<template>
    <div>
        <el-row class="headrow">
            <el-col span="4">{{lvname}}序号</el-col>
            <el-col span="16">{{lvname}}名称</el-col>
            <el-col span="4"></el-col>
        </el-row>
        <div class="lvdata">
            <div>
                <el-row v-for="(item, index) in value" class="datarow">
                    <el-col span="4" class="xhcol">{{index + 1}}</el-col>
                    <el-col span="16" class="namecol">
                        <el-input v-model="item.levelname"></el-input>
                    </el-col>
                    <el-col span="4" class="oprcol"><i class="el-icon-delete" @click="delLv(index)"></i></el-col>
                </el-row>
            </div>
        </div>
        <br/>
        <el-button type="text" @click="addLv" style="text-align: left;">新增{{lvname}}</el-button>
    </div>
</template>
<script>
    export default {
        props: ["value", "lvname"],
        data() {
            return {};
        },
        methods: {
            addLv(){
                this.value.push({});
                this.$nextTick(function(){
                    $(".lvdata").each(
                        function(){
                            $(this).scrollTop($(this)[0].scrollHeight);
                        }
                    );
                });

            },
            delLv(index){
                this.value.splice(index, 1);
            },
        }
    };
</script>
<style scoped>
    .headrow {
        color: gray;
        font-weight: normal;
        height: 30px;
    }

    .datarow {
        height: 37px;
    }

    .xhcol {
        text-align: left;
        padding-top: 8px;
        padding-left: 10px;
    }

    .namecol {
        padding: 2px;
    }

    .oprcol {
        text-align: right;
        padding-top: 6px;
    }

    .oprcol i {
        color: #5CB0E6;
        font-size: 23px;
        cursor: pointer;
        border-radius: 4px;
        padding-right: 10px;
    }

    .lvdata{
        width:100%;
        position:relative;
        max-height:250px;
        overflow-y: auto;
    }
</style>
