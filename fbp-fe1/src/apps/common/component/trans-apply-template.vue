<!--
  作者：yangchd
  时间：2018-08-30
  支持：员工管理——下部调配项目
-->
<template>
  <el-form :ref="transApplyFormRef"
           id="trans-apply-form-id" :class="type=='detail'?'trans-max-width':''" :label-width="type=='detail'?'150px':'120px'"
           :rules="rules" :model="stapply">
    <!--上方标题-->
    <el-form-item label="" v-if="type=='detail'">
      <el-col :span="11">
        <span class="info-left">调配前信息</span>
      </el-col>
      <el-col class="line" :span="2" style="text-align: center;">
        &nbsp;
      </el-col>
      <el-col :span="11">
        <span class="info-right">调配后信息</span>
      </el-col>
    </el-form-item>

    <el-form-item :label="item.itemname" :prop="item.newitemkey" :required="item.ismustnotnull" v-for="(item,index) in itemTemplate" :key="index">
      <el-col :span="11">
        <el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply[item.olditemkey]" :field="item.olditemkey"
                :template-value="stapply" v-if="item.fldtype == 5" :ref-code="item.refcode"></el-ref>
        <el-checkbox max="1" :editable="isEdit" :disabled="true" v-model="stapply[item.olditemkey]" v-if="item.fldtype == 4"></el-checkbox>
        <el-date-picker type="date" max="10" :editable="isEdit" :disabled="true" v-model="stapply[item.olditemkey]" :valuetoms="true" v-if="isDataType(item.fldtype)"></el-date-picker>
        <el-input :editable="isEdit" :disabled="true" v-model="stapply[item.olditemkey]"  v-if="isTextType(item.fldtype)"></el-input>
      </el-col>
      <el-col class="line" :span="2" style="text-align: center;">
        <i class="ifbp-icon-right icon-right"></i>
      </el-col>
      <el-col :span="11">
        <el-ref max="20" :editable="isEdit" @change="validateChildItem" v-model="stapply[item.newitemkey]"
                :field="item.newitemkey" :template-value="stapply" :query-params="getQueryParams(item.itemkey)"
                :ref-code="item.refcode" :not-leaf-selectable="!item.ref_leaf_flag" :isMutiSelect="item.itemkey=='multijob'" @trigger="refTrigger" v-if="item.fldtype == 5"></el-ref>
        <el-checkbox max="1" :editable="isEdit" @change="validateChildItem"
                     v-model="stapply[item.newitemkey]" v-if="item.fldtype == 4"></el-checkbox>
        <el-date-picker type="date" max="10" :editable="isEdit" @change="validateChildItem" v-model="stapply[item.newitemkey]" :valuetoms="true" v-if="isDataType(item.fldtype)"></el-date-picker>
        <el-input :editable="isEdit" @change="validateChildItem" v-model="stapply[item.newitemkey]"  v-if="isTextType(item.fldtype)"></el-input>
      </el-col>
    </el-form-item>


    <!--
      时间：2018-11-15
      支持：调配项目进行动态化，这是以前的旧的逻辑，先不要删除，万一有bug可以进行对比
    -->
    <!--<el-form-item label="人员信息组织" prop="pk_hi_org" :required="itemset.pk_hi_orgmust"-->
                  <!--v-show="itemset.pk_hi_orgshow">-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply.pk_old_hi_org"-->
                <!--field="pk_old_hi_org" :template-value="stapply"-->
                <!--pk="f3fed5ea-72f2-4a0a-ad43-d30b1c22c86c"></el-ref>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" @change="validateChildItem" v-model="stapply.pk_hi_org" field="pk_hi_org"-->
                <!--:template-value="stapply" pk="f3fed5ea-72f2-4a0a-ad43-d30b1c22c86c"></el-ref>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="组织" prop="newpk_org" :required="itemset.newpk_orgmust" v-show="itemset.newpk_orgshow">-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply.oldpk_org"-->
                <!--field="oldpk_org" :template-value="stapply" pk="a0ec952c-e4e5-416a-b3e0-d402725f76be"-->
                <!--ref-code="adminOrgPowerRef"></el-ref>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-ref v-if="stapply_mode!='3'" @change="validateChildItem" max="20" :editable="isEdit" v-model="stapply.newpk_org" field="newpk_org"-->
                <!--:template-value="stapply" pk="a0ec952c-e4e5-416a-b3e0-d402725f76be"-->
                <!--ref-code="adminOrgRef" :not-leaf-selectable="true" v-on:trigger="orgTrigger"></el-ref>-->
        <!--<el-ref v-if="stapply_mode=='3'" @change="validateChildItem" max="20" :editable="isEdit" v-model="stapply.newpk_org" field="newpk_org"-->
                <!--:template-value="stapply" pk="a0ec952c-e4e5-416a-b3e0-d402725f76be"-->
                <!--ref-code="adminOrgPowerRef" :not-leaf-selectable="true" v-on:trigger="orgTrigger"></el-ref>-->
      <!--</el-col>-->

    <!--</el-form-item>-->
    <!--<el-form-item label="部门" prop="newpk_dept" :required="itemset.newpk_deptmust" v-show="itemset.newpk_deptshow">-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply.oldpk_dept" field="oldpk_dept"-->
                <!--:template-value="stapply" pk="58115861-ce2b-44e8-b881-80119db7bf84" ref-code="hrwebdeptref"></el-ref>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-ref v-if="stapply_mode!='3'" @change="validateChildItem" max="20" :editable="isEdit" v-model="stapply.newpk_dept" field="newpk_dept"-->
                <!--:template-value="stapply" pk="58115861-ce2b-44e8-b881-80119db7bf84" :not-leaf-selectable="true"-->
                <!--ref-code="hrauthlessdeptref" :query-params="deptRefParams" v-on:trigger="deptTrigger"></el-ref>-->
        <!--<el-ref v-if="stapply_mode=='3'" @change="validateChildItem" max="20" :editable="isEdit" v-model="stapply.newpk_dept" field="newpk_dept"-->
                <!--:template-value="stapply" pk="58115861-ce2b-44e8-b881-80119db7bf84" :not-leaf-selectable="true"-->
                <!--ref-code="hrwebdeptref" :query-params="deptRefParams" v-on:trigger="deptTrigger"></el-ref>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="岗位" prop="newpk_post" :required="itemset.newpk_postmust"-->
                  <!--v-show="itemset.newpk_postshow">-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply.oldpk_post" field="oldpk_post"-->
                <!--:template-value="stapply" pk="039385a6-3e60-489c-b257-f48a1b7ab046" ref-code="postRef"></el-ref>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" @change="validateChildItem" v-model="stapply.newpk_post" field="newpk_post"-->
                <!--:template-value="stapply" pk="039385a6-3e60-489c-b257-f48a1b7ab046" ref-code="postRef"-->
                <!--:query-params="postRefParams" :not-leaf-selectable="true" v-on:trigger="postTrigger"></el-ref>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="新岗位序列" prop="newpk_postseries" :required="itemset.newpk_postseriesmust"-->
                  <!--v-show="itemset.newpk_postseriesshow">-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply.oldpk_postseries"-->
                <!--field="oldpk_postseries" :template-value="stapply" pk="d0a3192d-1493-4022-a400-2a202e9a6636"-->
                <!--ref-code="postSeriesRef"></el-ref>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" @change="validateChildItem" v-model="stapply.newpk_postseries" field="newpk_postseries"-->
                <!--:template-value="stapply" pk="d0a3192d-1493-4022-a400-2a202e9a6636"-->
                <!--ref-code="postSeriesRef"></el-ref>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="职务" prop="newpk_job" :required="itemset.newpk_jobmust" v-show="itemset.newpk_jobshow">-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply.oldpk_job" field="oldpk_job"-->
                <!--:template-value="stapply" pk="f1edcbce-a808-4dec-9a7f-41d448d8bb44" ref-code="jobRef"></el-ref>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" @change="validateChildItem" v-model="stapply.newpk_job" field="newpk_job"-->
                <!--:template-value="stapply" pk="f1edcbce-a808-4dec-9a7f-41d448d8bb44"-->
                <!--ref-code="jobRef" :not-leaf-selectable="true" v-on:trigger="jobTrigger"></el-ref>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="职级" prop="newpk_jobgrade" :required="itemset.newpk_jobgrademust"-->
                  <!--v-show="itemset.newpk_jobgradeshow">-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply.oldpk_jobgrade"-->
                <!--field="oldpk_jobgrade" :template-value="stapply" pk="19d7419a-1f6d-4596-9b1c-cafee2fc0930"-->
                <!--ref-code="joblevelRef"></el-ref>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" @change="validateChildItem" v-model="stapply.newpk_jobgrade" field="newpk_jobgrade"-->
                <!--:template-value="stapply" pk="19d7419a-1f6d-4596-9b1c-cafee2fc0930"-->
                <!--ref-code="joblevelRef" :query-params="postRefParams" v-on:trigger="jobGradeTrigger"></el-ref>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="职等" prop="newpk_jobrank" :required="itemset.newpk_jobrankmust"-->
                  <!--v-show="itemset.newpk_jobrankshow">-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply.oldpk_jobrank"-->
                <!--field="oldpk_jobrank" :template-value="stapply" pk="718c6a17-38c5-47f0-b285-8fb0d1ff74fa"-->
                <!--ref-code="jobRankRef" ></el-ref>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" @change="validateChildItem" v-model="stapply.newpk_jobrank" field="newpk_jobrank"-->
                <!--:template-value="stapply" pk="718c6a17-38c5-47f0-b285-8fb0d1ff74fa"-->
                <!--ref-code="jobRankRef" :query-params="postRefParams"></el-ref>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="人员类别" prop="newpk_psncl" :required="itemset.newpk_psnclmust"-->
                  <!--v-show="itemset.newpk_psnclshow">-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply.oldpk_psncl" field="oldpk_psncl"-->
                <!--:template-value="stapply" pk="400f55be-f4cc-4b38-b1e2-aabdc75e2aad"-->
                <!--ref-code="psnclref"></el-ref>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" @change="validateChildItem" v-model="stapply.newpk_psncl" field="newpk_psncl"-->
                <!--:template-value="stapply" pk="400f55be-f4cc-4b38-b1e2-aabdc75e2aad"-->
                <!--ref-code="psnclref"></el-ref>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="免职方式" prop="newdeposemode" :required="itemset.newdeposemodemust"-->
                  <!--v-show="itemset.newdeposemodeshow">-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply.olddeposemode"-->
                <!--field="olddeposemode" :template-value="stapply" pk="1001Z71000000000GPD4"-->
                <!--ref-code="HRHI004_0xx"></el-ref>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" @change="validateChildItem" v-model="stapply.newdeposemode" field="newdeposemode"-->
                <!--:template-value="stapply" pk="1001Z71000000000GPD4" ref-code="HRHI004_0xx"></el-ref>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="任职方式" prop="newjobmode" :required="itemset.newjobmodemust"-->
                  <!--v-show="itemset.newjobmodeshow">-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply.oldjobmode" field="oldjobmode"-->
                <!--:template-value="stapply" pk="1001Z71000000000GPD3" ref-code="HRHI003_0xx"></el-ref>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" @change="validateChildItem" v-model="stapply.newjobmode" field="newjobmode"-->
                <!--:template-value="stapply" pk="1001Z71000000000GPD3" ref-code="HRHI003_0xx"></el-ref>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="备注" prop="newmemo" :required="itemset.newmemomust" v-show="itemset.newmemoshow">-->
      <!--<el-col :span="11">-->
        <!--<el-textarea rows="2" max="1024" :editable="isEdit" :disabled="true"-->
                     <!--v-model="stapply.oldmemo"></el-textarea>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-textarea rows="2" max="1024" :editable="isEdit" v-model="stapply.newmemo"></el-textarea>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="职业" prop="newoccupation" :required="itemset.newoccupationmust"-->
                  <!--v-show="itemset.newoccupationshow">-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply.oldoccupation"-->
                <!--field="oldoccupation" :template-value="stapply" pk="1001Z71000000000S19E"-->
                <!--ref-code="HR016_0xx"></el-ref>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" @change="validateChildItem" v-model="stapply.newoccupation" field="newoccupation"-->
                <!--:template-value="stapply" pk="1001Z71000000000S19E" ref-code="HR016_0xx"></el-ref>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="任职类型" prop="newpk_job_type" :required="itemset.newpk_job_typemust"-->
                  <!--v-show="itemset.newpk_job_typeshow">-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply.oldpk_job_type"-->
                <!--field="oldpk_job_type" :template-value="stapply" pk="1001Z71000000000FLQ9"-->
                <!--ref-code="HRHI012_0xx"></el-ref>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" @change="validateChildItem" v-model="stapply.newpk_job_type" field="newpk_job_type"-->
                <!--:template-value="stapply" pk="1001Z71000000000FLQ9" ref-code="HRHI012_0xx"></el-ref>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="是否在岗" prop="newpoststat" :required="itemset.newpoststatmust"-->
                  <!--v-show="itemset.newpoststatshow">-->
      <!--<el-col :span="11">-->
        <!--<el-checkbox max="1" :editable="isEdit" :disabled="true" v-model="stapply.oldpoststat"></el-checkbox>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-checkbox max="1" :editable="isEdit" v-model="stapply.newpoststat"></el-checkbox>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="职务类别" prop="newseries" :required="itemset.newseriesmust"-->
                  <!--v-show="itemset.newseriesshow">-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply.oldseries" field="oldseries"-->
                <!--:template-value="stapply" pk="d09bb4f0-2df0-48cb-a14b-5c82483717d0" ref-code="jobTypeRef"></el-ref>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" @change="validateChildItem" v-model="stapply.newseries" field="newseries"-->
                <!--:template-value="stapply" pk="d09bb4f0-2df0-48cb-a14b-5c82483717d0" ref-code="jobTypeRef"></el-ref>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="工种" prop="newworktype" :required="itemset.newworktypemust" v-show="itemset.newworktypeshow">-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply.oldworktype" field="oldworktype"-->
                <!--:template-value="stapply" pk="1009ZZ100000000030SP" ref-code="defdoc"></el-ref>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" @change="validateChildItem" v-model="stapply.newworktype" field="newworktype"-->
                <!--:template-value="stapply" pk="1009ZZ100000000030SP" ref-code="defdoc"></el-ref>-->
      <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="合同管理组织" prop="pk_hrcm_org" :required="itemset.pk_hrcm_orgmust"-->
                  <!--v-show="itemset.pk_hrcm_orgshow">-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" :disabled="true" v-model="stapply.pk_old_hrcm_org"-->
                <!--field="pk_old_hrcm_org" :template-value="stapply"-->
                <!--pk="f3fed5ea-72f2-4a0a-ad43-d30b1c22c86c"></el-ref>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2" style="text-align: center;">-->
        <!--<i class="ifbp-icon-right icon-right"></i>-->
      <!--</el-col>-->
      <!--<el-col :span="11">-->
        <!--<el-ref max="20" :editable="isEdit" @change="validateChildItem" v-model="stapply.pk_hrcm_org" field="pk_hrcm_org"-->
                <!--:template-value="stapply" pk="f3fed5ea-72f2-4a0a-ad43-d30b1c22c86c"></el-ref>-->
      <!--</el-col>-->
    <!--</el-form-item>-->

    <el-form-item label="附件" v-if="type=='dialog' && stapply.pk_hi_stapply">
      <ifbp-upload busi-code="transapply"
                   force-type="normal"
                   file-class="new"
                   :is-show-title="false"
                   :pk-busi="stapply.pk_hi_stapply"></ifbp-upload>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    props: {
      rules: {
        type: Object,
        required: true,
      },
      stapply: {
        type: Object,
        required: true,
      },
      itemTemplate: {
        type: Array,
        required: true,
      },
      isEdit: {
        type: Boolean,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      stapply_mode: {
        type: [String,Number],
      },
    },
    computed: {
      deptRefParams: function () {
        return {
          pk_org: this.stapply.newpk_org
        };
      },
      postRefParams: function () {
        return {
          pk_org: this.stapply.newpk_org,
          pk_dept: this.stapply.newpk_dept,
          pk_post: this.stapply.newpk_job ? "" : this.stapply.newpk_post,
          pk_job: this.stapply.newpk_job,
          pk_joblevel: this.stapply.newpk_jobgrade
        };
      }
    },
    data() {
      return {
        transApplyFormRef: 'transApplyFormRef',
      }
    },
    methods: {
      //返回参照的查询参数
      getQueryParams(itemkey){
        if(itemkey==='pk_dept'){
          return this.deptRefParams;
        }else if(itemkey==='pk_post' || itemkey==='pk_jobgrade' || itemkey==='pk_jobrank'){
          return this.postRefParams;
        }
        return {};
      },
      refTrigger(type, event){
        if(event.key==="newpk_org"){
          this.orgTrigger(type, event);
        }else if(event.key==="newpk_dept"){
          this.deptTrigger(type, event);
        }else if(event.key==="newpk_post"){
          this.postTrigger(type, event);
        }else if(event.key==="newpk_job"){
          this.jobTrigger(type, event);
        }else if(event.key==="newpk_jobgrade"){
          this.jobGradeTrigger(type, event);
        }
      },
      isDataType(fldtype){
        return fldtype === 3 || fldtype === 20 || fldtype === 101 || fldtype === 102;
      },
      isTextType(fldtype){
        return fldtype === 0 || fldtype === 1 || fldtype === 2 || fldtype === 14 || fldtype === 16 || fldtype === 18;
      },

      getFormComp: function () {
        return this.$refs[this.transApplyFormRef];
      },
      // 组织变化的触发事件
      orgTrigger: function () {
        // 选择组织后，清空部门、岗位、职务、职级、职等
        this.stapply.newpk_dept = "";
        this.stapply.newpk_post = "";
        this.stapply.newpk_job = "";
        this.stapply.newpk_jobgrade = "";
        this.stapply.newpk_jobrank = "";
      },
      deptTrigger: function () {
        // 选择部门后，清空岗位、职务、职级、职等
        this.stapply.newpk_post = "";
        this.stapply.newpk_job = "";
        this.stapply.newpk_jobgrade = "";
        this.stapply.newpk_jobrank = "";
      },
      // 岗位变化
      postTrigger: function () {
        // 选择岗位后，清空职务、职级、职等
        this.stapply.newpk_job = "";
        this.stapply.newpk_jobgrade = "";
        this.stapply.newpk_jobrank = "";

        // 触发岗位联动
        this.setDefaultDataByPost(this.stapply.newpk_post);
      },
      jobTrigger: function () {
        let pk_post = this.stapply.newpk_post;
        let pk_job = this.stapply.newpk_job;
        // 选择职务后，清空职级、职等
        this.stapply.newpk_jobgrade = "";
        this.stapply.newpk_jobrank = "";
        if (pk_job) {
          this.setDefaultDataByJob(pk_job);
        } else {
          this.setDefaultDataByPost(pk_post);
        }
      },
      jobGradeTrigger: function () {
        // 选择职级后，清空职等重新选择
        this.stapply.newpk_jobrank = "";
      },
      setDefaultDataByPost: function (pk_post) {
        if (pk_post) {
          this.$http({
            url: "/hrjf/postJoin/findPostInfo/" + pk_post,
            method: "get"
          }).then(res => {
            if (res.data.status === true) {
              let defaultData = res.data.data[0];
              if (!this.stapply.beanMap) {
                this.stapply.beanMap = defaultData.beanMap;
              }
              if (defaultData.pk_job) {
                this.stapply.newpk_job = defaultData.pk_job;
                this.stapply.beanMap.newpk_job_ref = defaultData.beanMap.pk_job_ref;

                // 当岗位和职务同时存在的时候，职务优先
                this.setDefaultDataByJob(defaultData.pk_job);
              } else {
                if (defaultData.pk_joblevel) {
                  this.stapply.newpk_jobgrade = defaultData.pk_joblevel;
                  this.stapply.beanMap.newpk_jobgrade_ref = defaultData.beanMap.pk_joblevel_ref;
                }
                if (defaultData.defaultrank) {
                  this.stapply.newpk_jobrank = defaultData.defaultrank;
                  this.stapply.beanMap.newpk_jobrank_ref = defaultData.beanMap.defaultrank_ref;
                }
              }
            } else {
              this.$message({message: res.data.msg, type: "error"});
            }
          }).catch(() => {
            this.$message({message: "查询岗位信息失败！", type: "error"});
          });
        }
      },

      // 根据职务获取变量
      setDefaultDataByJob: function (pk_job) {
        if (pk_job) {
          this.$http({
            url: "/hrjf/jobJoin/findJobLevelRank/" + pk_job,
            method: "get"
          }).then(res => {
            if (res.data.status === true) {
              let defaultData = res.data.data;
              if (!this.stapply.beanMap) {
                this.stapply.beanMap = defaultData.beanMap;
              }
              if (defaultData.pk_joblevel) {
                this.stapply.newpk_jobgrade = defaultData.pk_joblevel;
                this.stapply.beanMap.newpk_jobgrade_ref = defaultData.beanMap.pk_joblevel_ref;
              }
              if (defaultData.defaultrank) {
                this.stapply.newpk_jobrank = defaultData.defaultrank;
                this.stapply.beanMap.newpk_jobrank_ref = defaultData.beanMap.defaultrank_ref;
              }
            } else {
              this.$message({message: res.data.msg, type: "error"});
            }
          }).catch(() => {
            this.$message({message: "查询职务信息失败！", type: "error"});
          });
        }
      },

      validateChildItem(){
        this.$refs[this.transApplyFormRef].validate(valid2 => {
        });
      },
    }
  }
</script>

<style>
  .info-left, .info-right {
    font-size: 16px;
    color: #5CB0E6;
    letter-spacing: 0;
    text-align: right;
    line-height: 16px;

  }

  #trans-apply-form-id {
    /*max-width: 900px;*/
  }
  .trans-max-width{
    max-width: 900px;
  }

  #trans-apply-form-id .icon-right {
    color: #5CB0E6;
    line-height: 32px;
  }

  #trans-apply-form-id .line {
    text-align: center;
    height:32px;
  }

  #trans-apply-form-id .el-form-item__cover,
  #trans-apply-form-id .el-form-item__error {
    width: 45.83333%; left: 54.16666%;
  }

</style>