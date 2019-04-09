/**
  Author:liuchym@yonyou.com
  desc:"往来单位账户新增"
**/
<template>
  <div>
    <a-modal
      title="往来单位账户"
      :visible="visible"
      @ok="handleOk"
      width="800px"
      okText="保存"
      cancelText="取消"
       @cancel="handleCancel"
    >
      <a-form
        :form="form"
        @submit="handleSubmit"
      >
        <a-row>

          <a-col :span="12">
            <a-form-item
              label="开户行名"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                v-decorator="[
                  'bankNodeName',
                  {rules: [{ required: false, message: '' }]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="银行账号"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                v-decorator="[
                  'bankNodeName',
                  {rules: [{ required: true, message: '请输入银行账号' }]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
              <a-form-item
                label="往来单位"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-select
                  v-decorator="[
                    'orgType',
                    {rules: [{ required: false,message: '请输入往来单位'}],
                    initialValue: ''
                    }
                  ]"
                >
                  <a-select-option value="china">
                    China
                  </a-select-option>
                  <a-select-option value="usa">
                    U.S.A
                  </a-select-option>
                </a-select>
              </a-form-item>
          </a-col>
          <a-col :span="12">
              <a-form-item
                label="单位类型"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-select
                  v-decorator="[
                    'bankName',
                    {rules: [{ required: false }],
                    initialValue: ''
                    }
                  ]"
                >
                  <a-select-option value="china">
                    China
                  </a-select-option>
                  <a-select-option value="usa">
                    U.S.A
                  </a-select-option>
                </a-select>
              </a-form-item>
          </a-col>
          <a-col :span="12">
              <a-form-item
                label="账户类型"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-select
                  v-decorator="[
                    'bankName',
                    {rules: [{ required: false }],
                    initialValue: ''
                    }
                  ]"
                >
                  <a-select-option value="china">
                    China
                  </a-select-option>
                  <a-select-option value="usa">
                    U.S.A
                  </a-select-option>
                </a-select>
              </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="基金险种"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                v-decorator="[
                  'bankNodeName',
                  {rules: [{ required: true, message: '请输入基金险种' }]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
              <a-form-item
                label="开户银行"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-select
                  v-decorator="[
                    'bankName',
                    {rules: [{ required: false }],
                    initialValue: ''
                    }
                  ]"
                >
                  <a-select-option value="china">
                    China
                  </a-select-option>
                  <a-select-option value="usa">
                    U.S.A
                  </a-select-option>
                </a-select>
              </a-form-item>
          </a-col>
           <a-col :span="12">
              <a-form-item
                label="网点"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-select
                  v-decorator="[
                    'bankName',
                    {rules: [{ required: true, message: '请输入网点'  }],
                    initialValue: ''
                    }
                  ]"
                >
                  <a-select-option value="china">
                    China
                  </a-select-option>
                  <a-select-option value="usa">
                    U.S.A
                  </a-select-option>
                </a-select>
              </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="人行联行号"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                disabled
                v-decorator="[
                  'bankNodeName',
                  {rules: [{ required: true, message: '请输入人行联行号' }]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
              <a-form-item
                label="是否使用"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-select
                  v-decorator="[
                    'bankName',
                    {rules: [{ required: false }],
                    initialValue: ''
                    }
                  ]"
                >
                  <a-select-option value="1">
                    是
                  </a-select-option>
                  <a-select-option value="0">
                    否
                  </a-select-option>
                </a-select>
              </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="省份"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                disabled
                v-decorator="[
                  'bankNodeName',
                  {rules: [{ required: false, message: '' }]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="城市"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            >
              <a-input
                disabled
                v-decorator="[
                  'bankNodeName',
                  {rules: [{ required: false, message: '' }]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="备注"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 12 }"
            > 
              <a-textarea placeholder="" :autosize="{ minRows: 2, maxRows: 6 }" 
                v-decorator="[
                  'bankNodeName',
                  {rules: [{ required: false, message: '' }]}
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>

export default {
  name: 'comegoCompanyMgtadd',
  components: {
    
  },
  props:['dialogvisible','dialogData'],
  data() {
    return {
      visible: this.dialogvisible,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
    }
  },
  created(){
    console.log(this.dialogData)
  },
  methods: {
    handleCancel(e) {
      this.$emit('onesc')
      this.visible = false;
    },
   
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      // console.log(this.$refs.singleTable.setCurrentRow(row));
      this.handleSubmit(e)
    },
    handleSubmit (e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
    
  }
}
</script>

<style lang="less" >

.ant-row .ant-form-item {
  margin-bottom: 0px;
}
</style>
