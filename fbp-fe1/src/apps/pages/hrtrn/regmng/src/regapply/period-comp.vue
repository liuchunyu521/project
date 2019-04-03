<template>
    <div>
        <div class="periodstr">
            <div class="fl">{{getDateStr(begindate)}}</div>
            <div class="fr">{{getDateStr(enddate)}}</div>
        </div>
        <div class="progress-outer">
            <div class="progress-inner" :style="{width:passWidth+'%',background:passBackground}"></div>
        </div>
    </div>
</template>
<script>

    export default {
        props: ["begindate", "enddate"],
        name: 'hrPeriod',
        data() {
            var vm = this;
            return {};
        },
        watch: {},
        computed: {
            passWidth: function () {
                if (!this.enddate) {
                    return 5
                }
                var now = new Date();
                var days = now.getTime() - (new Date(this.begindate)).getTime();
                var days = parseInt(days / (1000 * 60 * 60 * 24));
                if (days <= 0) {
                    return 0;
                }
                var period = (new Date(this.enddate)).getTime() - (new Date(this.begindate)).getTime();
                var period = parseInt(period / (1000 * 60 * 60 * 24));
                var rtn = (days / period) * 100;
                return rtn > 100 ? 100 : rtn;
            },
            passBackground: function () {
                if (this.passWidth < 35) {
                    return "#5AC8FA";
                } else if (this.passWidth < 70) {
                    return "#FFCC00";
                }
                return "#FF3B30";
            }
        },
        mounted() {
        },

        methods: {
            getDateStr(date){
                if (!date)return "";
                date = new Date(date);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                month = month < 10 ? "0" + month : month;
                day = day < 10 ? "0" + day : day;
                return year + "/" + month + "/" + day;
            }
        }
    };
</script>
<style scoped>
    .periodstr {
        font-size: 14px;
        color: #2D2D2D;
        line-height: 14px;
        height: 14px;
        width: 100%;
        margin-bottom: 6px;
    }

    .progress-outer {
        height: 12px;
        background: #F2F2F2;
    }

    .progress-inner {
        height: 100%;
    }
</style>
