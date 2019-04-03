<!--
  作者：yangchd
  时间：2018-05-17
  支持：员工自助——任职记录—带切换模式
-->
<template>
  <div style="margin-top: 16px;">
    <!--上部页签-->
    <ul class="experiencetabs clearfix">
      <el-row :gutter="5">
        <el-col :style="styleObject" v-for="(tab,index) in tableListData" :key="index">
          <li class="experiencelist" @click="tabsSwitch(tab,index)">
            <a href="javascript:" class="experiencetab-link" v-bind:class="{active:tab.isSelected}"></a>
            <span class="experiencecircle"></span><span class="experienceortial"></span>
            <div class="experiencetime">{{tab.beginDateFormat}} - {{tab.endDateFormat}}</div>
          </li>
        </el-col>
      </el-row>
    </ul>
    <!--点击页签以后，显示的内容-->
    <div class="experiencecards">
      <div class="experiencetab-card">
        <ifbp-template :ref="templateRef"
                       :tplId="templateId"
                       :tplData="templateData"
                       :editable="templateEdit"
                       :form-show-message="templateEdit"
                       show-type="form"
                       :tplResetFun="tableFormResetFun"
                       :methods="psnjobExtraMethods">
        </ifbp-template>
        <ifbp-form-button-area v-if="templateEdit">
          <el-button type="primary" @click="registerConfirm">保存</el-button>
          <el-button type="default" @click="registerCancel">取消</el-button>
        </ifbp-form-button-area>
      </div>
    </div>

  </div>
</template>

<script>
  import {formatDate} from "../../../../../common/js/formatDate";
	export default {
		props: {
			templateEdit: {
				type: Boolean,
				default: function() {
					return false;
				},
			},
			psndocData: {},
      funcode: {
        type: String,
        required: true
      },
      requestPrefix: {
        type: String,
        required: true
      },
		},

		data() {
			return {
				infoSetCode: 'hi_psnjob',
				// UI模板传入参数
				templateRef: 'ref_psnjob_c',
				templateId: 'myInfo_psnjob',
				templateData: {
					rules: {},
					deptRefParams: {
						pk_org: '',
					},
					postRefParams: {
						pk_org: '',
						pk_dept: '',
					},
				},
				tablePk: 'pk_psnjob',
				templateUrl: {
					list_url: '/listInfos',
				},
				tableFormResetFun: function($node) {
					//将在岗设置成只有最新一条记录可以编辑
					$node.find("[v-model='hi_psnjob.poststat']").parent()
						.html('<el-checkbox _id="hi_psnjob.poststat" :editable="editable" ' +
							'v-model="hi_psnjob.poststat" :disabled="!hi_psnjob.lastflag"></el-checkbox>');

					// 组织的触发事件
					$node.find("[v-model='hi_psnjob.pk_org']").attr("v-on:trigger", "orgTrigger");
					// 部门的触发事件
					$node.find("[v-model='hi_psnjob.pk_dept']").attr("v-on:trigger", "deptTrigger");

					return $node[0].outerHTML;

				},

				psnjobExtraMethods: {
					// 组织变化的触发事件
					orgTrigger: function() {
						let data = this['hi_psnjob'];
						let pk_org = data.pk_org;

						this.deptRefParams.pk_org = pk_org;
						this.postRefParams.pk_org = pk_org;
					},

					deptTrigger: function() {
						let data = this['hi_psnjob'];
						let pk_dept = data.pk_dept;

						this.postRefParams.pk_dept = pk_dept;
					},

				},

				//页签数据
				tableListData: [],
				//页签当前选择
				tableListIsSelected: 0,
			};
		},
    computed:{
      styleObject:function () {
        return {
          width: 100 / this.tableListData.length + "%",
        };
      }
    },
		// 初始化加载
		mounted() {
			this.requestTableData();
		},

		methods: {
			// 初始化加载数据
			requestTableData() {
				let infoSetCodes = [];
				infoSetCodes.push(this.infoSetCode);
				let data = {
					infoSetCodes: infoSetCodes.join(","),
				};
				this.$http({
					url: this.requestPrefix + this.templateUrl.list_url,
					method: 'post',
					params: data,
				}).then((res) => {
					if(res.data.status === true) {
						this.$nextTick(() => {
							let resData = res.data[this.infoSetCode];
							this.tableListData = resData['uivo'];
							//初始化默认选择
							let len = this.tableListData.length;
							// 由于自助无法排序，这里对任职记录按时间进行排序
              if(this.tableListData && this.tableListData.length > 1){
                for(let i=0;i<this.tableListData.length;i++){
                  for(let j=i+1;j<this.tableListData.length;j++){
                    if(this.tableListData[i].begindate > this.tableListData[j].begindate){
                      let iData = this.tableListData[i];
                      this.tableListData.splice(i,1,this.tableListData[j]);
                      this.tableListData.splice(j,1,iData);
                    }
                  }
                }
              }

							for(let i = 0; i < len; i++) {
								this.tableListData[i].isSelected = false;
							}
							this.tableListIsSelected = len - 1;
							this.tableListData[this.tableListIsSelected].isSelected = true;
							let selectedData = this.tableListData[this.tableListIsSelected];
							this.setTemplateListData(this.tableListData);
							this.$refs[this.templateRef].setFormData(JSON.parse(JSON.stringify(selectedData)));

							this.templateData.deptRefParams.pk_org = selectedData.pk_org;
							this.templateData.postRefParams.pk_org = selectedData.pk_org;
							this.templateData.postRefParams.pk_dept = selectedData.pk_dept;

						});
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				}).catch(() => {
					this.$message({
						message: '查询失败',
						type: 'error'
					});
				});
			},

			// 页签切换方法
			tabsSwitch: function(tab, index) {
				// 当删除了最后一个时，会溢出，所以这里加上校验
				if(this.tableListData.length >= this.tableListIsSelected + 1) {
					// 注意：vue绑定截取set和get方法，数组不支持，所有手动进行一次set，让页面和数据同步
					this.tableListData[this.tableListIsSelected].isSelected = false;
					this.$set(this.tableListData, this.tableListIsSelected, this.tableListData[this.tableListIsSelected]);
				}
				this.tableListIsSelected = index;
				this.$refs[this.templateRef].setFormData(JSON.parse(JSON.stringify(this.tableListData[this.tableListIsSelected])));

				this.tableListData[this.tableListIsSelected].isSelected = true;
        this.$set(this.tableListData, this.tableListIsSelected, this.tableListData[this.tableListIsSelected]);
			},

			// 提供当前页的所有数据
			getTemplateListData: function() {
				return this.tableListData;
			},

			// 查询或保存以后设置数据
			setTemplateListData: function(data) {
				// 在这里对日期进行格式化
				if(data) {
					for(let i = 0; i < data.length; i++) {
						data[i].beginDateFormat = formatDate(data[i].begindate, 'yyyy-MM-dd');
						data[i].endDateFormat = formatDate(data[i].enddate, 'yyyy-MM-dd');
					}
				}
				this.$emit('dataChange', JSON.parse(JSON.stringify(data)));
			},

		}
	};
</script>

<style scoped>
  .experiencetabs{
    padding-left: 0 !important;
  }
  .experiencetabs .el-row>div{
    overflow:visible !important;
  }
	.experiencetabs li {
		float: left;
		margin-right: 8px;
		list-style: none;
		position: relative;
		width: 100%;
	}
	
	.experiencetabs .experiencetab-link {
		display: block;
		width: 100%;
		height: 144px;
		text-align: center;
		line-height: 49px;
		background-color: #fff;
		color: #fff;
		text-decoration: none;
	}
	
	.experiencetabs .experiencetab-link.active {
		height: 144px;
		background: #C4DDFF;
		opacity: 0.3;
		transition: .3s;
	}
	
	.experiencetabs .experiencecircle {
		position: absolute;
		top: 60px;
		left: -10px;
		width: 10px;
		height: 10px;
		border: 5px solid #5CB0E6;
		border-radius: 10px;
	}
	
	.experiencetabs .experienceortial {
		position: absolute;
		top: 69px;
		left: 10px;
		width: calc(100% - 10px);
		border-bottom: 4px solid #5CB0E6;
	}
	
	.experiencecards {
		/*float: left;*/
	}
	
	.experiencecards .experiencetab-card {
		/*display: none;*/
	}
	
	.experiencetime {
		overflow: hidden;
		height: 32px;
		line-height: 32px;
		background: #C4DDFF;
		text-align: center;
		cursor: pointer;
	}
	
	.clearfix:after {
		content: "";
		display: block;
		height: 0;
		clear: both;
	}
	
	.clearfix {
		zoom: 1;
	}
</style>