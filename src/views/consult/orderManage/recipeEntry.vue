<template>
  <div id="recipeEntry">
    <el-row>
      <div class="btn-group-head" v-if="!lock">
        <el-button size="small" type="success" plain class="el-icon-success" @click="handelHeaderOperat('singleAgain')"
                   v-if="recipeDetail.status > 96"> 再来一单
        </el-button>
        <!--用户已确认-->
        <el-button size="small" type="success" plain class="el-icon-success" @click="handelHeaderOperat('sendMSG')"
                   v-if="recipeDetail.status === 15 || recipeDetail.status === 10"> 进入短信发送
        </el-button>
        <el-button size="small" type="success" plain class="el-icon-success" @click="handelHeaderOperat('orderSave')"
                   v-if="recipeDetail.status >= 5 && recipeDetail.status <= 6"> 修改
        </el-button>
        <el-button size="small" type="success" plain class="el-icon-success" @click="handelHeaderOperat('orderDone')"
                   v-if="recipeDetail.status >= 5 && recipeDetail.status <= 6"> 确认
        </el-button>
        <el-button size="small" type="success" plain class="el-icon-check" @click="handelHeaderOperat('save')"
                   v-if="recipeDetail.status === 0"> 录入临时保存
        </el-button>
        <el-button size="small" type="primary" plain class="el-icon-remove" @click="handelHeaderOperat('removelock')"
                   v-if="recipeDetail.status >= 5 && recipeDetail.status <= 6||recipeDetail.status === 0">移除锁定
        </el-button>
        <el-button size="small" type="warning" plain class="el-icon-delete" @click="handelHeaderOperat('giveup')"
                   v-if="recipeDetail.status >= 5 && recipeDetail.status <= 6||recipeDetail.status === 0"> 放弃
        </el-button>
        <!--录入-->
        <el-button size="small" type="success" plain class="el-icon-success" @click="handelHeaderOperat('done')"
                   v-if="recipeDetail.status === 0"> 完成
        </el-button>
      </div>
    </el-row>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="处方信息" name="recipeMsg">
        <el-form ref="recipeDetail" :rules="rules" :model="recipeDetail" label-width="90px" size="small">
          <el-row type="flex" justify="space-between" class="baseINFO" style="font-size: 12px">
            <el-col :span="3">
              <span>订单号: {{recipeDetail.orderid}}</span>
            </el-col>
            <el-col :span="6" style="text-align: right"><span
              v-if="ordersource">{{ordersource}}:</span>{{recipeDetail.realname}}<span
              v-if="recipeDetail.mobile">({{recipeDetail.mobile}})</span></el-col>
          </el-row>
          <!--1.患者信息-->
          <div class="table">
            <div class="title">患者信息</div>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="病人姓名" prop="username">
                  <el-input v-model="recipeDetail.username"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="年龄" prop="age">
                  <el-input v-model="recipeDetail.age"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="width: 280px">
                <el-form-item label="">
                  <el-radio-group v-model="recipeDetail.gender" size="medium">
                    <el-radio :label='1'>男</el-radio>
                    <el-radio :label='0'>女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="width: 265px">
                <el-form-item label="">
                  <el-radio-group v-model="recipeDetail.ispregnant"
                                  :disabled="recipeDetail.gender === 1||recipeDetail.status >= 15">
                    <el-radio :label="1">孕妇</el-radio>
                    <el-radio :label="0">非孕妇</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="手机" prop="tel">
                  <el-input v-model="recipeDetail.tel"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="身份证" prop="id_number">
                  <el-input v-model="recipeDetail.id_number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="width: 280px">
                <el-form-item label="">
                  <el-radio-group v-model="recipeDetail.issuffering" :disabled="recipeDetail.status >= 15"
                                  v-show="recipeDetail.prescrtype === 0">
                    <el-radio :label="1">煎煮</el-radio>
                    <el-radio :label="0">非煎煮</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="width: 265px">
                <el-form-item label="">
                  <el-radio-group v-model="recipeDetail.iswithin" :disabled="recipeDetail.status >= 15">
                    <el-radio :label="1">外用</el-radio>
                    <el-radio :label="0">非外用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--2.收货信息-->
          <div class="table">
            <div class="title">收货信息</div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="收货人" prop="consignee">
                  <el-input v-model="recipeDetail.consignee"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="收货电话" prop="contel">
                  <el-input v-model="recipeDetail.contel"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="送货时间">
                  <el-date-picker
                    v-model="recipeDetail.sendgoodstime"
                    align="right"
                    type="date"
                    value-format="yyyy-MM-dd">
                    :picker-options="pickerOptions1">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="*送货地址" prop="areaAddress">
                  <!--送货地址省市区-->
                  <el-cascader :style="{width:'400px'}"
                               :options="proviceList"
                               v-model="areaAddress"
                               @active-item-change="handleItemChange"
                               @change="handleItemLastChange"
                  ></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="地址-详情" prop="addrstr">
                  <el-col :span="8">
                    <el-input v-model="recipeDetail.addrstr"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="发票抬头">
                  <el-input v-model="recipeDetail.invoicetitle"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--3.医生信息-->
          <div class="table">
            <div class="title">医生信息</div>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="医生" prop="realname">
                  <el-input v-model="recipeDetail.realname" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="医院">
                  <el-input v-model="recipeDetail.referhosname" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="电话">
                  <el-input v-model="recipeDetail.mobile" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input v-model="recipeDetail.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="主诉及辩证">
                  <el-input  :row="2" v-model="recipeDetail.diagnosis"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="诊断">
                  <el-input  :row="2" v-model="recipeDetail.zhenduan"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" v-if="!isEdit">
              <el-col :span="24">
                <el-form-item label="用药指导" prop="medicationinstruction">
                  <el-input v-model="recipeDetail.medicationinstruction"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" v-if="!isEdit">
              <el-col :span="24">
                <el-form-item label="医嘱">
                  <el-input v-model="recipeDetail.doctoradvice"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" v-if="!isEdit">
              <el-col :span="24">
                <el-form-item label="病例说明">
                  <el-input v-model="recipeDetail.medicalrecords"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--4.药房导航-->
          <div class="btn-group" v-show="pageType ==='entry'">
            <el-button size="small" class="el-icon-plus" @click="tapTable(0)">添加中药处方</el-button>
            <el-button size="small" class="el-icon-plus" @click="tapTable(2)">添加膏方</el-button>
            <el-button size="small" class="el-icon-plus" @click="tapTable(1)">添加西药处方</el-button>
            <el-button size="small" class="el-icon-plus" @click="tapTable(3)">添加丸剂处方</el-button>
            <el-button size="small" class="el-icon-plus" @click="tapTable(6)">添加中成药</el-button>
          </div>
          <div class="doseNow" v-if="pageType !== 'entry'">
            当前剂量:{{recipeDetail.totalDose}}g
          </div>
          <div class="table-tab-box">
            <!--1.中药处方表单-->
            <el-row class="recipeContainer" id="CNMedicine" v-show="recipeDetail.prescrtype === 0">
              <!--1.1剂量模拟-->
              <el-row :gutter="20" type="flex" justify="end" v-if="isEdit">
                <el-col :span="3" style="width: 135px">
                  <el-button @click="caculateTotalPrice('show')" type="">
                    药价计算
                  </el-button>
                </el-col>
              </el-row>
              <!--1.2煎服方法-->
              <el-row>
                <el-col :span="8">
                  <el-form-item label="煎服方法">
                    <el-radio-group v-model="recipeDetail.sufferingtype" size="medium"
                                    :disabled="recipeDetail.status >= 15"
                    >
                      <el-radio :label=0>一剂两包</el-radio>
                      <el-radio :label=1>一剂三包</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="table">
                <div class="tableHeader title">
                  <el-row>
                    <span class="title-name">中药清单</span>
                  </el-row>
                  <el-row type="flex" justify="space-between" class='dose'>
                    <el-col :span="8">
                      <el-form-item label="剂数:" label-width="50px">
                        <el-input-number size="mini" controls-position="right"
                                         v-model="recipeDetail.amount"
                                         @change="recipeDetail.status >0?caculateTotalPrice():' '"
                                         :min="1" :max="1000"
                                         :disabled="recipeDetail.status >= 15"
                                         label="描述文字"></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" style="width: 88px" v-if="this.pageType === 'entry'">
                      <el-button class="button el-icon-plus" size="small" @click="addDrug(0)">添加药材</el-button>
                    </el-col>
                  </el-row>
                </div>
                <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%"
                         :columns="pageType !== 'entry'?coloumsDetail : columnsChinieseMedicine"
                         :cell-edit-done="cellEditDone"
                         :table-data="docprescriptiondetails" row-hover-color="#eee"
                         row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
              </el-row>
            </el-row>
            <!--2.膏方表单-->
            <el-row class="recipeContainer" id="plaster" v-show="recipeDetail.prescrtype === 2">
              <!--2.1剂量模拟- -->
              <el-row :gutter="20" type="flex" justify="end" v-if="pageType === 'entry'">
                <el-col :span="3" style="width: 135px">
                  <el-button @click="caculateTotalPrice('show')" type="">
                    药价计算
                  </el-button>
                </el-col>
              </el-row>
              <!--2.2添加辅料-->
              <el-row>
                <el-col :span="2" v-if="pageType === 'entry'">
                  <el-button size="small" class="el-icon-plus" @click="addOther('')">添加輔料</el-button>
                </el-col>
                <el-col :span="2" v-if="!isEdit">
                  辅料:
                </el-col>
                <el-col :span="22">
                  <div style="line-height: 32px;height: 32px">{{otherStr}}</div>
                </el-col>
              </el-row>
              <!--2.3装盛方式-->
              <el-row style="margin-top: 15px" v-if="pageType === 'entry'">
                <el-col :span="6">
                  <el-form-item label="装盛方式:">
                    <el-button @click="handleWithin('袋装')" size="mini">袋装</el-button>
                    <el-button @click="handleWithin('瓶装')" size="mini">瓶装</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="table">
                <div class="tableHeader title">
                  <span class="title-name">膏方清单</span>
                  <el-row type="flex" justify="space-between" class='dose'>
                    <el-col :span="8">
                      <el-form-item label="剂数:" label-width="50px">
                        <el-input-number size="mini" controls-position="right"
                                         @change="handleAgentNumChange" :min="1" :max="1000" label="描述文字"
                                         :disabled="recipeDetail.status >= 15"
                                         v-model="recipeDetail.amount"></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" style="width: 88px" v-if="pageType === 'entry'">
                      <el-button class="button el-icon-plus" size="small" @click="addDrug(0)">添加药材</el-button>
                    </el-col>
                  </el-row>
                </div>
                <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%"
                         :columns="pageType !== 'entry'?coloumsDetail : columnsPlaster"
                         :cell-edit-done="cellEditDone"
                         :table-data="docprescriptiondetails" row-hover-color="#eee"
                         row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
              </div>
            </el-row>
            <!--2.2 固定膏方表单-->
            <el-row class="recipeContainer" id="plaster" v-show="recipeDetail.prescrtype === 5">
              <!--2.1剂量模拟- -->
              <el-row :gutter="20" type="flex" justify="end" v-if="pageType === 'entry'">
                <el-col :span="3" style="width: 135px">
                  <el-button @click="caculateTotalPrice('show')" type="">npm
                    药价计算
                  </el-button>
                </el-col>
              </el-row>
              <!--2.2添加辅料-->
              <el-row>
                <el-col :span="2" v-if="pageType === 'entry'">
                  <el-button size="small" class="el-icon-plus" @click="addOther('')">添加輔料</el-button>
                </el-col>
                <el-col :span="2" v-if="!isEdit">
                  辅料:
                </el-col>
                <el-col :span="22">
                  <div style="line-height: 32px;height: 32px">{{otherStr}}</div>
                </el-col>
              </el-row>
              <!--2.3装盛方式-->
              <el-row style="margin-top: 15px" v-if="pageType === 'entry'">
                <el-col :span="6">
                  <el-form-item label="装盛方式:">
                    <el-button @click="handleWithin('袋装')" size="mini">袋装</el-button>
                    <el-button @click="handleWithin('瓶装')" size="mini">瓶装</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="table">
                <div class="tableHeader title">
                  <span class="title-name">膏方清单</span>
                  <el-row type="flex" justify="space-between" class='dose'>
                    <el-col :span="8">
                      <el-form-item label="剂数:" label-width="50px">
                        <el-input-number size="mini" controls-position="right"
                                         @change="handleAgentNumChange" :min="1" :max="1000" label="描述文字"
                                         :disabled="recipeDetail.status >= 15"
                                         v-model="recipeDetail.amount"></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" style="width: 88px" v-if="pageType === 'entry'">
                      <el-button class="button el-icon-plus" size="small" @click="addDrug(0)">添加药材</el-button>
                    </el-col>
                  </el-row>
                  <div class="singledose">
                    <el-row>
                      <el-col :span="3">
                        <el-form-item label="" label-width="60px">
                          <el-input-number style="width: 100px" v-model="agentsnumber" size="mini"
                                           controls-position="right"
                                           :min="0" :max="1000" label="描述文字"
                                           @change="handelDoseTimesChange"
                                           v-if="pageType === 'entry'"
                          ></el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%"
                         :columns="pageType !== 'entry'?coloumsDetail : columnsPlaster"
                         :cell-edit-done="cellEditDone"
                         :table-data="docprescriptiondetails" row-hover-color="#eee"
                         row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
              </div>
            </el-row>
            <!--3.西药表单-->
            <el-row class="recipeContainer" id="plaster" v-show="recipeDetail.prescrtype === 1">
              <el-row :gutter="20" type="flex" justify="end" v-if="pageType === 'entry'">
                <el-col :span="3" style="width: 135px">
                  <el-button @click="caculateTotalPrice('show')" type="">
                    药价计算
                  </el-button>
                </el-col>
              </el-row>
              <div class="table">
                <div class="tableHeader title">
                  <span class="title-name">西药清单</span>
                  <el-row type="flex" justify="end" class='dose'>
                    <el-col :span="2" style="width: 88px" v-if="this.pageType === 'entry'">
                      <el-button class="button el-icon-plus" size="small" @click="addDrug(1)">添加药材</el-button>
                    </el-col>
                  </el-row>
                </div>
                <!--1.如果是编辑,表单列表,如果不是编辑,表单详情展示.-->
                <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%"
                         :columns="isEdit ? columnsWester:columnsWesterDetail"
                         :cell-edit-done="cellEditDone"
                         :table-data="docprescriptiondetails" row-hover-color="#eee"
                         row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
                <div class="tip-postage">满79元包邮</div>
              </div>
            </el-row>
            <!--4.丸剂表单-->
            <el-row class="recipeContainer" id="plaster" v-show="recipeDetail.prescrtype === 3">
              <el-row :gutter="20" type="flex" justify="end" v-if="pageType === 'entry'">
                <el-col :span="3" style="width: 135px">
                  <el-button @click="caculateTotalPrice('show')" type="">
                    药价计算
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="丸剂类型">
                    <el-radio-group v-model="recipeDetail.wjtype" size="medium" @change="caculateTotalPrice"
                                    :disabled="!isEdit">
                      <el-radio :label=1>浓缩丸</el-radio>
                      <el-radio :label=2>水丸(包衣)</el-radio>
                      <el-radio :label=3>水蜜丸</el-radio>
                      <el-radio :label=4>水丸(素丸)</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="table">
                <div class="tableHeader title">
                  <span class="title-name">丸剂清单</span>
                  <el-row type="flex" justify="space-between" class='dose'>
                    <el-col :span="8">
                      <el-form-item label="剂数:" label-width="50px">
                        <el-input-number size="mini" controls-position="right"
                                         @change="handleAgentNumChange" :min="1" :max="1000" label="描述文字"
                                         :disabled="recipeDetail.status >= 15"
                                         v-model="recipeDetail.amount"></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" style="width: 88px" v-if="pageType === 'entry'">
                      <el-button class="button el-icon-plus" size="small" @click="addDrug(0)">添加药材</el-button>
                    </el-col>
                  </el-row>
                </div>
                <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%"
                         :columns="pageType !== 'entry'?coloumsDetail : columnsPlaster"
                         :cell-edit-done="cellEditDone"
                         :table-data="docprescriptiondetails" row-hover-color="#eee"
                         row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
              </div>
              <el-row id="nsw_margin" v-if="pill.name"><span
                id="wj_name">{{pill.name}} {{pill.min}} g </span>起订,当前剂量<span
                id="nsw_weight">{{statistics.doseSum}}</span>g
              </el-row>
            </el-row>
            <!--5.中成药标案-->
            <el-row class="recipeContainer" id="plaster" v-show="recipeDetail.prescrtype === 6">
              <el-row :gutter="20" type="flex" justify="end" v-if="pageType === 'entry'">
                <el-col :span="3" style="width: 135px">
                  <el-button @click="caculateTotalPrice('show')" type="">
                    药价计算
                  </el-button>
                </el-col>
              </el-row>
              <div class="table">
                <div class="tableHeader title">
                  <span class="title-name">中成药清单</span>
                  <el-row type="flex" justify="end" class='dose'>
                    <el-col :span="2" style="width: 88px" v-if="this.pageType === 'entry'">
                      <!--中成药-->
                      <el-button class="button el-icon-plus" size="small" @click="addDrug(6)">添加药材</el-button>
                    </el-col>
                  </el-row>
                </div>
                <!--1.如果是编辑,表单列表,如果不是编辑,表单详情展示.-->
                <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%"
                         :columns="isEdit ? chinesePatentDrugForm:chinesePatentDrugList"
                         :cell-edit-done="cellEditDone"
                         :table-data="docprescriptiondetails" row-hover-color="#eee"
                         row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
                <div class="tip-postage">满79元包邮</div>
              </div>
            </el-row>
            <!--6.药柜-->
            <el-row class="recipeContainer" id="plaster" v-show="recipeDetail.prescrtype === 7">
              <el-row :gutter="20" type="flex" justify="end" v-if="pageType === 'entry'">
                <el-col :span="3" style="width: 135px">
                  <el-button @click="caculateTotalPrice('show')" type="">
                    药价计算
                  </el-button>
                </el-col>
              </el-row>
              <div class="table">
                <div class="tableHeader title">
                  <span class="title-name">药柜清单</span>
                  <el-row type="flex" justify="end" class='dose'>
                    <el-col :span="2" style="width: 88px" v-if="this.pageType === 'entry'">
                      <!--中成药-->
                      <el-button class="button el-icon-plus" size="small" @click="addDrug(7)">添加药材</el-button>
                    </el-col>
                  </el-row>
                </div>
                <!--1.如果是编辑,表单列表,如果不是编辑,表单详情展示.-->
                <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%"
                         :columns="isEdit ? chinesePatentDrugForm:chinesePatentDrugList"
                         :cell-edit-done="cellEditDone"
                         :table-data="docprescriptiondetails" row-hover-color="#eee"
                         row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
              </div>
            </el-row>
          </div>
          <!--5.金额统计表格-->
          <div class="countTableWrap" v-if="this.pageType !== 'entry'">
            <div class="countTable">
              <el-form-item label="药费" lable-width="100px">
                {{Math.formatFloat(recipeDetail.unitprice, 2)}}元/剂*{{recipeDetail.amount}}
              </el-form-item>
              <el-form-item label="加工费">
                {{recipeDetail.serviceAcount}} 元
              </el-form-item>
              <el-form-item label="诊金">
                <el-input-number size="mini"
                                 v-model="recipeDetail.treatfee"
                                 @change="caculateTotalPrice"
                                 :min="0" :max="10000"
                                 label="描述文字"></el-input-number>
                元
              </el-form-item>
              <el-form-item label="运费" v-if="recipeDetail.prescrtype === 1||recipeDetail.prescrtype === 6">
                {{recipeDetail.logisticsfee}} 元
              </el-form-item>
              <el-form-item label="提示" v-if="recipeDetail.prescrtype === 1||recipeDetail.prescrtype === 6"
                            style="color:lightgreen">
                满79元包邮
              </el-form-item>
              <el-form-item label="处方总计">
                {{recipeDetail.recipeAcount}} 元
              </el-form-item>
              <el-form-item label="订单总计">
                {{recipeDetail.totalMoney}} 元
              </el-form-item>
            </div>
          </div>
        </el-form>
        <br>
        <br>
        <br>
        <br>
      </el-tab-pane>
      <!--照片信息-->
      <el-tab-pane label="处方照片" num="30" name="recipePhone">
        <el-collapse accordion>
          <el-collapse-item>
            <template slot="title">
              <el-row type="flex" justify="space-between">
                <el-col>处方照片</el-col>
                <el-col style="text-align: right">{{recipeDetail.prescriid}}</el-col>
              </el-row>
            </template>
            <el-carousel height="600px" v-if="recipepicurl.length > 0">
              <el-carousel-item v-for="item in recipepicurl" :key="item">
                <h3 style="text-align: center;max-height: 600px">
                  <!--pdf文件-->
                  <a @click="previewImg(item)"><img :src="item" alt="" width="300px" height="200px"
                                                    style="margin-top:5px;"/></a>
                  <!--<embed width="800" height="600" :src='item'/>-->
                  <!--<object :data="item" type="application/pdf" width="300" height="200">
                    <a :href="item">test.pdf</a>
                  </object>-->
                </h3>
              </el-carousel-item>
            </el-carousel>
            <h3 style="text-align: center;max-height: 600px" v-if="recipepicurl.length === 0">无</h3>
          </el-collapse-item>
          <el-collapse-item title="数字签名">
            <h3 style="text-align: center;max-height: 600px" v-if="recipeDetail.digitalsignature">
              <img
                :src='recipeDetail.digitalsignature' alt="数字签名" style="max-height: 600px">
            </h3>
            <h3 style="text-align: center;max-height: 600px" v-if="!recipeDetail.digitalsignature">无</h3>
          </el-collapse-item>
          <el-collapse-item title="医网签签名" v-if="!isEdit">
            <div><span>是否网签:</span><span>{{recipeDetail.isnetsign}}</span></div>
            <div><span>审方状态:</span><span>{{recipeDetail.ywqnoticestatus}}</span></div>
            <div v-if="recipeDetail.isnetsign"><span>医网签返回处方ID:</span><span>{{recipeDetail.recipefileid}}</span></div>
          </el-collapse-item>
          <el-collapse-item title="付款二维码" v-if="!isEdit">
            <div><span>微信支付二维码:</span><span>{{recipeDetail.wxqrcode}}</span></div>
            <div><span>支付二维码链接:</span><span>{{recipeDetail.wxqrUrl}}</span></div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="病史" num="30" name="medicalrecordspic" v-if="!isEdit">
        <el-collapse accordion>
          <el-collapse-item>
            <template slot="title">
              <el-row type="flex" justify="space-between">
                <el-col>病史</el-col>
              </el-row>
            </template>
            <el-carousel height="600px" v-if="medicalrecordspic.length > 0">
              <el-carousel-item v-for="item in medicalrecordspic" :key="item">
                <h3 style="text-align: center;max-height: 600px"><img :src='item' alt="病例图片" style="height: 600px"></h3>
              </el-carousel-item>
            </el-carousel>
            <h3 style="text-align: center;max-height: 600px" v-if="medicalrecordspic.length === 0">无</h3>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
    <!--添加辅料 -->
    <el-dialog
      title="添加辅料可以优化口感。若不填写，药方会酌情添加"
      :visible.sync="dialogFormVisible"
      width="30%"
      center
      top="30px"
      :modal-append-to-body="false" :append-to-body="true"
      :before-close="addOtherClose">
      <el-form size="mini">
        <div class="typeBox">
          <div class="title">
            糖类:
          </div>
          <el-form-item v-for="(item,index) in docaccessorieslist" v-if="index<5" :key="item.index"
                        :label="item.accessorname" :label-width="formLabelWidth">
            <el-input-number v-model="item.accessordose" :min="0" :max="1000000" label="描述文字"></el-input-number>
          </el-form-item>
        </div>
        <div class="typeBox">
          <div class="title">
            代糖类:
          </div>
          <el-form-item v-for="(item,index) in docaccessorieslist" v-if="index>4&&index<9" :key="item.index"
                        :label="item.accessorname" :label-width="formLabelWidth">
            <el-input-number v-model="item.accessordose" :min="0" :max="1000000" label="描述文字"></el-input-number>
          </el-form-item>
        </div>
        <div class="typeBox">
          <div class="title">
            其他:
          </div>
          <el-form-item v-for="(item,index) in docaccessorieslist" v-if="index>8" :key="item.index"
                        :label="item.accessorname" :label-width="formLabelWidth">
            <el-input-number v-model="item.accessordose" :min="0" :max="1000000" label="描述文字"></el-input-number>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddOther">确 定</el-button>
      </div>
    </el-dialog>
    <!--放弃理由-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleGiveup"
      :modal-append-to-body="false" :append-to-body="true"
      width="30%"
    >
      <el-select v-model="giveupReason" placeholder="请选择" style="width: 300px">
        <el-option
          label="我不想买了"
          value="我不想买了">
        </el-option>
        <el-option
          label="信息填写错误,请下单"
          value="信息填写错误,请下单">
        </el-option>
        <el-option
          label="付款遇到问题(如月不足、不知道怎么付款等)"
          value="下挫单了">
        </el-option>
        <el-option
          label="下错单了"
          value="下错单了">
        </el-option>
        <el-option
          label="其他原因"
          value="其他原因">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleGiveup = false">取 消</el-button>
    <el-button type="primary" @click="giveUP">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import yilin from '@/utils/yilinAjax21';
import java from '@/utils/javaApiRequest';
import Vue from 'vue';
import ElRow from 'element-ui/packages/row/src/row';
export default {
  components: {
    ElRow,
  },
  data() {
    return {
      giveupReason: '',
      dialogVisibleGiveup: false,
      sourcePage: 'recipe', // 来源页面
      // 当前剂量
      doseTotalNow: '',
      recipepicurl: [],
      medicalrecordspic: [],
      // 时间快捷键
      pickerOptions1: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
      },
      // 订单来源
      ordersource: 'App下单',
      // 膏药模拟倍数
      agentsnumber: 0,
      // 0.表单切换
      activeTable: 'plaster',
      // 确定已经保存的辅料
      docaccessorieslistSave: [],
      // 1.清单数据
      docprescriptiondetails: [],
      // 2.处方录入详情,
      recipeDetail: {},
      // 辅料列表
      docaccessorieslist: [
        {
          'prescriid': '',
          'accessorname': '饴糖',
          'accessordose': 0
        }, {
          'prescriid': '',
          'accessorname': '红糖',
          'accessordose': 0
        }, {
          'prescriid': '',
          'accessorname': '麦芽糖',
          'accessordose': 0
        }, {
          'prescriid': '',
          'accessorname': '蜂蜜',
          'accessordose': 0
        }, {
          'prescriid': '',
          'accessorname': '白冰糖',
          'accessordose': 0
        },
        {
          'prescriid': '',
          'accessorname': '蛋白糖',
          'accessordose': 0
        }, {
          'prescriid': '',
          'accessorname': '木糖醇',
          'accessordose': 0
        }, {
          'prescriid': '',
          'accessorname': '甜蜜素',
          'accessordose': 0
        }, {
          'prescriid': '',
          'accessorname': '元贞糖',
          'accessordose': 0
        },
        {
          'prescriid': '',
          'accessorname': '黄酒',
          'accessordose': 0
        }, {
          'prescriid': '',
          'accessorname': '雪梨膏',
          'accessordose': 0
        }, {
          'prescriid': '',
          'accessorname': '益母草膏',
          'accessordose': 0
        }
      ],
      // 3.1省份
      proviceList: [
        {
          label: '江苏',
        }, {
          label: '浙江',
        }],
      // 3.2区域地址, 编码
      areaAddress: [],
      // 3.3 地址,中文
      areaAddressCN: [],
      chineseMedicineForm: {},
      sidebarValue: this.sidebarStatus,
      activeName: 'recipeMsg',
      pageType: 'entry',
      rules: {
        username: [
          { required: true, message: '请输入病人姓名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 14 个字符', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入病人年龄', trigger: 'blur' },
        ],
        tel: [
          { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' }
        ],
        id_number: [
          { min: 15, max: 18, message: '长度在 15-18 个字符', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '请输入医生姓名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        medicationinstruction: [
          { required: true, message: '请输入用药指导', trigger: 'blur' },
        ],
        consignee: [
          { required: true, message: '请输入收货人', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        contel: [
          { required: true, message: '请输入收货人电话', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' }
        ],
        sendgoodstime: [
          { required: true, message: '请输入收货人地址', trigger: 'blur' },
        ],
        addrstr: [
          { required: true, message: '请输入收货人地址-详情', trigger: 'blur' },
        ],
      },
      formLabelWidth: '120px',
      // 请求参数
      business: {
        pageIndex: 1,
        pageSize: 10,
        status: 0
      },
      // 表格数据
      tableData: [],
      // 选择的记录
      selection: [],
      // 总数
      total: 0,
      // 弹出层
      dialogFormVisible: false,
      addData: {
        resource: '',
        type: ''
      },
      // 弹出框商户审核
      toExamineAdopt: false,
      detailed: {},
      modifyData: {
        resource: ''
      },
      lock: false,
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    },
    // 性别为男,禁用孕妇选项,非孕妇
    'recipeDetail.gender': function (value, oldValue) {
      if (this.recipeDetail.gender === 1) {
        this.recipeDetail.ispregnant = 0;
      }
    },
    'recipeDetail.treatfee': function () {
      // 如果处方列表不为空,则重新计算
      this.caculateTotalPrice();
    },
    'recipeDetail.prescrtype': function (value) {
      if (value !== 0) {
        this.recipeDetail.issuffering = 0;
      }
    },
  },
  computed: {
    isEdit() {
      return this.pageType === 'entry' ? true : false;
    },
    // 清单-list
    coloumsDetail() {
      let _self = this;
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'medicines',
          title: '*药品名',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'dose',
          title: '*剂量',
          width: 225,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return rowData.dose + rowData.unit;
          },
        },
        {
          field: 'musage',
          title: '用法',
          width: 180,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'herbunitprice',
          title: '标准价',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'herbunitprice',
          title: '单价',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'total',
          title: '总计(元)',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'remark',
          title: '备注',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
      ];
      return columns;
    },
    // 1.中药清单-form
    columnsChinieseMedicine() {
      let _self = this;
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'medicines',
          title: '*药品名',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true,
          componentName: 'chinese-select-drug', // 中药清单表单
        },
        {
          field: 'dose',
          title: '*剂量',
          width: 225,
          titleAlign: 'center',
          columnAlign: 'left',
          componentName: 'table-operation-drug-num'
        },
        {
          field: 'musage',
          title: '用法',
          width: 180,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          componentName: 'table-operation-drug-usage',
        },
        {
          field: 'herbunitprice',
          title: '*药价',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return (rowData.herbunitprice * rowData.dose).toFixed(4);
          },
          isResize: true,
        },
        {
          field: 'drugname',
          title: '*医生开单药品名称',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true
        },
        {
          field: '',
          title: '操作',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operation-drug-remove',
          isResize: true,
          isEdit: true
        }
      ];
      return columns;
    },
    // 2.1膏药清单-form
    columnsPlaster() {
      let _self = this;
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'medicines',
          title: '*药品名',
          width: 210,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'chinese-select-drug', // 膏方表单列表
          isEdit: true
        },
        {
          field: 'dose',
          title: '剂量',
          width: 160,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operation-drug-num'
        },
        {
          field: 'musage',
          title: '用法',
          width: 180,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          componentName: 'table-operation-drug-usage',
        },
        {
          field: 'herbunitprice',
          title: '*药价',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return (rowData.herbunitprice * rowData.dose).toFixed(4);
          },
        },
        {
          field: 'drugname',
          title: '*医生开单药品名称',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true
        },
        {
          field: 'remark',
          title: '备注',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true
        },
        {
          field: 'option',
          title: '操作',
          width: 150,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operation-drug-remove',
          isResize: true,
          isEdit: true
        }
      ];
      return columns;
    },
    // 2.1膏药清单-list() {
    titleRows() {
      return [
        [
          { fields: ['custome'], title: '排序', titleAlign: 'center', rowspan: 2 },
          { fields: ['medicines'], title: '*药品名', titleAlign: 'center', colspan: 1, rowspan: 2 },
          { fields: ['singledose', 'agentsnumber', 'dose'], title: ' 剂量', titleAlign: 'center', colspan: 3, },
          { fields: ['musage'], title: '*用法', titleAlign: 'center', colspan: 1, rowspan: 2 },
          { fields: ['herbunitprice'], title: '*药价', titleAlign: 'center', colspan: 1, rowspan: 2 },
          { fields: ['drugname'], title: '*医生开单药品名称', titleAlign: 'center', colspan: 1, rowspan: 2 },
          { fields: ['remark'], title: '备注', titleAlign: 'center', colspan: 1, rowspan: 2 },
          { fields: ['option'], title: '操作', titleAlign: 'center', colspan: 1, rowspan: 2 },
        ],
        [
          { fields: ['singledose'], title: '基数', titleAlign: 'center' },
          { fields: ['dose'], title: '量', titleAlign: 'center' },
        ],
      ];
    },
    // 3.1西药-表单列表
    columnsWester() {
      let _self = this;
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'medicines',
          title: '*药品名',
          width: 230,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'java-select-drug',
          isEdit: true
        },
        {
          field: 'dose',
          title: '*数量',
          width: 225,
          titleAlign: 'center',
          columnAlign: 'left',
          componentName: 'table-operation-drug-num'
        },
        {
          field: 'goodsnorms',
          title: '规格',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'goodsorgin',
          title: '产地',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'herbunitprice',
          title: '*药价',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return (rowData.herbunitprice * rowData.dose).toFixed(4);
          },
        },
        {
          field: 'musage',
          title: '用法',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true
        },
        {
          field: 'drugname',
          title: '*医生开单药品名称',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true
        },
        {
          field: 'remark',
          title: '备注',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true
        },
        {
          field: '',
          title: '操作',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operation-drug-remove',
          isResize: true,
          isEdit: true
        }
      ];
      return columns;
    },
    // 3.2西药-列表详情.已编辑
    columnsWesterDetail() {
      let _self = this;
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'medicines',
          title: '*药品名',
          width: 230,
          titleAlign: 'center',
          columnAlign: 'center',
        },
        {
          field: 'dose',
          title: '*数量',
          width: 225,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return rowData.dose + rowData.unit;
          },
        },
        {
          field: 'goodsnorms',
          title: '规格',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'goodsorgin',
          title: '产地',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'herbunitprice',
          title: '标准价',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'herbunitprice',
          title: '单价',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'total',
          title: '总计',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'musage',
          title: '用法',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'remark',
          title: '备注',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        }
      ];
      return columns;
    },
    // 5.1中成药表单列表
    chinesePatentDrugForm() {
      let _self = this;
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'medicines',
          title: '*药品名',
          width: 230,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'java-select-drug',
          isEdit: true
        },
        {
          field: 'dose',
          title: '*数量',
          width: 225,
          titleAlign: 'center',
          columnAlign: 'left',
          componentName: 'table-operation-drug-num'
        },
        {
          field: 'goodsnorms',
          title: '规格',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'goodsorgin',
          title: '产地',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'herbunitprice',
          title: '*药价',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return (rowData.herbunitprice * rowData.dose).toFixed(4);
          },
        },
        {
          field: 'musage',
          title: '用法',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true
        },
        {
          field: 'drugname',
          title: '*医生开单药品名称',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true
        },
        {
          field: 'remark',
          title: '备注',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          isEdit: true
        },
        {
          field: '',
          title: '操作',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operation-drug-remove',
          isResize: true,
          isEdit: true
        }
      ];
      return columns;
    },
    // 5.2中成药列表详情.已编辑
    chinesePatentDrugList() {
      let _self = this;
      let columns = [
        {
          field: 'custome',
          title: '序号',
          width: 50,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.business.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        {
          field: 'medicines',
          title: '*药品名',
          width: 230,
          titleAlign: 'center',
          columnAlign: 'center',
        },
        {
          field: 'dose',
          title: '*数量',
          width: 225,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            return rowData.dose + rowData.unit;
          },
        },
        {
          field: 'goodsnorms',
          title: '规格',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'goodsorgin',
          title: '产地',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'herbunitprice',
          title: '标准价',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'herbunitprice',
          title: '单价',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'total',
          title: '总计',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'musage',
          title: '用法',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        },
        {
          field: 'remark',
          title: '备注',
          width: 100,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
        }
      ];
      return columns;
    },
    // 辅料
    otherStr() {
      let temp = ' ';
      temp = this.docaccessorieslist.map(item => {
        if (item.accessordose && item.accessordose !== '0') {
          return item.accessorname + ' ' + item.accessordose + ' g';
        }
        return null;
      });
      temp = temp.join(' ');
      return temp;
    },
    pill() {
      let result = {};
      switch (this.recipeDetail.wjtype) {
        case 1:
          result.name = '浓缩丸';
          result.min = 3000;
          break;
        case 2:
          result.name = '水丸(包衣)';
          result.min = 1000;
          break;
        case 3:
          result.name = '水蜜丸';
          result.min = 1000;
          break;
        case 4:
          result.name = '水丸(素丸)';
          result.min = 1000;
          break;
        default:
      }
      return result;
    },
    // 汇总
    statistics() {
      let doseSum = 0;
      for (let i = 0; i < this.docprescriptiondetails.length; i++) {
        let dose = parseInt(this.docprescriptiondetails[i].dose, 10);
        doseSum = dose > 0 ? dose + doseSum : doseSum;
      }
      return {
        doseSum: parseInt(doseSum, 10)
      };
    },
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    previewImg(url) { // 自定义弹窗
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        distinguishCancelAndClose: false,
        customClass: 'reviewImg',
        showConfirmButton: false,
        closeOnPressEscape: true,
        closeOnClickModal: true
      });
    },
    // 获取查询参数,用来保存上个页面搜索状态.
    getSearchParams() {
      return {
        orderId: this.$route.query.orderId,
        docName: this.$route.query.docName,
        patientName: this.$route.query.patientName,
        saleName: this.$route.query.saleName,
        patientTel: this.$route.query.patientTel,
        isInvoice: this.$route.query.isInvoice,
        orderStatus: this.$route.query.orderStatus,
        prescrType: this.$route.query.prescrType,
        startOrderTime: this.$route.query.startOrderTime,
        endOrderTime: this.$route.query.endOrderTime,
        pageIndex: this.$route.query.pageIndex,
        pageSize: this.$route.query.pageSize,
        status: this.$route.query.status,
        tapType: this.$route.query.tapType,
      };
    },
    giveUP() {
      this.dialogVisibleGiveup = false;
      let id = this.$route.query.orderid;
      // 传入userid
      let userid = sessionStorage.getItem('userid');
      yilin.post('/api/ordermanage/giveupdocprescription',
        { Id: id, Remark: this.giveupReason, userid: userid }
      ).then((res) => {
        if (res.status === 200 && res.statusText === 'OK') {
          console.info('放弃录入!,res.data:', res.data);
          if (res.data.code === 0) {
            this.$message({ message: '放弃录入成功!', type: 'success' });
            let sourcePage = this.$route.query.sourcePage;
            if (sourcePage === 'order') {
              this.$router.push({ path: '/orderManage/msgConfirm' });
            } else {
              this.$router.push({ path: '/orderManage/msgEntry' });
            }
          } else {
            this.$alert(res.data.message, '提示');
          }
        }
      });
    },
    // 清单-添加中药药材
    addDrug(value) {
      this.docprescriptiondetails.push(
        {
          prescriid: this.recipeDetail.prescriid,
          prescriptiondetailsid: this.recipeDetail.prescriid + '1',
          medicines: '',
          dose: 0,
          singledose: 0,
          agentsnumber: this.agentsnumber,
          musage: '',
          goodsnum: '',
          herbunitprice: '',
          drugname: '',
          remark: ' ',
          goodsnorms: ' ',
          goodsorgin: ' ',
          type: value
        });
    },
    // 清单单元格编辑回调
    cellEditDone(newValue, oldValue, rowIndex, rowData, field) {
      this.docprescriptiondetails[rowIndex][field] = newValue;
      // 接下来处理你的业务逻辑，数据持久化等...
    },
    // 3.获取拍照处方录入详情
    getPrescriptionDetail() {
      // 检测是录入还是查看详情
      let type = this.$route.query.type;
      if (type === 'viewDetail') {
        this.pageType = 'viewDetail';
      } else {
        this.pageType = 'entry';
      }
      let orderid = this.$route.query.orderid;
      yilin.get('/api/ordermanage/getdocprescriptiondetail', {
        params: { 'orderId': orderid }
      }).then((res) => {
        if (res.status === 200 && res.statusText === 'OK') {
          console.info('获取拍照处方录入详情成功!,res.data.data:', res.data.data);
          this.recipeDetail = res.data.data;
          // 赋值
          // 1.给清单列表赋值
          if (this.recipeDetail.docprescriptiondetails.length > 0) {
            this.docprescriptiondetails = this.recipeDetail.docprescriptiondetails;
            this.agentsnumber = this.recipeDetail.docprescriptiondetails[0].agentsnumber;
            // 2.给辅料赋值
            let list = this.docaccessorieslist;
            list.map((item) => {
              item.prescriid = this.recipeDetail.prescriid;
              if (this.recipeDetail.docaccessorieslist.length > 0) {
                this.recipeDetail.docaccessorieslist.forEach((oldItem) => {
                  if (oldItem.accessorname === item.accessorname) {
                    item.accessordose = oldItem.accessordose;
                  }
                });
              }
              return item;
            });
            this.docaccessorieslist = list;
          }
          // 3.给处方图片赋值
          this.recipepicurl = this.recipeDetail.recipepicurl !== '' ? this.recipeDetail.recipepicurl.split(',') : [];
          // 给病例图片赋值
          this.medicalrecordspic = this.recipeDetail.medicalrecordspic !== ''
            ? this.recipeDetail.medicalrecordspic.split(',')
            : [];
          // 4.如果是查看详情,计算总计
          if (this.pageType !== 'entry') {
            this.recipeDetail.docprescriptiondetails.map((item) => {
              item.total = parseFloat(item.dose * item.herbunitprice).toFixed(5);
              return item;
            });
            // 当处于放弃状态的时候,不计算钱
            this.caculateTotalPrice();
          }
          // 5.设置地址
          this.areaAddress = [
            parseInt(this.recipeDetail.provincescode, 10),
            this.recipeDetail.citycode,
            this.recipeDetail.zonecode];
          this.areaAddressCN = [this.recipeDetail.provinces, this.recipeDetail.city, this.recipeDetail.zone];
          this.getProvinceslist();
          if (this.areaAddress[0] !== '') {
            setTimeout(() => {
              this.handleItemChange(this.areaAddress);
              this.handleItemChange(this.areaAddress);
            }, 300);
          }
          // 上锁
          this.lockorder();
        }
      });
    },
    // 4.获取省份
    getProvinceslist() {
      yilin.get('/api/provinces/getprovinceslist', {}).then((res) => {
        if (res.status === 200 && res.statusText === 'OK') {
          let proviceList = res.data.data;
          for (let i = 0; i < proviceList.length; i++) {
            proviceList[i].label = proviceList[i].region_name;
            proviceList[i].value = proviceList[i].id;
            // 设置省份的第二级
            proviceList[i].children = [];
          }
          this.proviceList = proviceList;
        }
      });
    },
    // 4.2 省份改变,查询城市信息
    handleItemChange(val) {
      // 2.0获取城市信息
      yilin.get('/api/provicecity/getprovicecitylist', {
        params: { 'regionCode': val[0] }
      }).then((res) => {
        if (res.status === 200 && res.statusText === 'OK') {
          let cityList = res.data.data;
          for (let i = 0; i < cityList.length; i++) {
            cityList[i].label = cityList[i].regionname;
            cityList[i].value = cityList[i].regioncode;
            cityList[i].children = [];
          }
          let proviceList = this.proviceList;
          for (let j = 0; j < proviceList.length; j++) {
            if (proviceList[j].id === val[0]) {
              if (proviceList[j].children.length === 0 && cityList.length > 0) {
                proviceList[j].children = cityList;
              }
            }
          }
          this.proviceList = proviceList;
        }
      });
      // 2.1获取区域信息
      if (val.length >= 2) {
        yilin.get('/api/cityareas/getcityareaslist', {
          params: { 'regionCode': val[1] }
        }).then((res) => {
          if (res.status === 200 && res.statusText === 'OK') {
            let proviceList = this.proviceList;
            let areaList = res.data.data;
            for (let i = 0; i < areaList.length; i++) {
              areaList[i].label = areaList[i].regionname;
              areaList[i].value = areaList[i].regioncode;
            }
            for (let j = 0; j < proviceList.length; j++) {
              if (proviceList[j].id === val[0]) {
                // 或去到城市,然后继续,获取县区
                for (let k = 0; k < proviceList.length; k++) {
                  if (proviceList[j].children[k].value === val[1]) {
                    // 给地区赋值
                    proviceList[j].children[k].children = areaList.length === 0
                      ? [
                        {
                          label: '无',
                          value: '无'
                        }]
                      : areaList;
                    this.proviceList = proviceList;
                    return;
                  }
                }
              }
            }
          }
        });
      }
    },
    handleItemLastChange(val) {
      let addressCN = [];
      // 迭代地址,获取中文地址
      this.proviceList.map((item) => {
        if (item.value === val[0]) {
          addressCN[0] = item.label;
          item.children.map((item1) => {
            if (item1.regioncode === val[1]) {
              addressCN[1] = item1.regionname;
              item1.children.map((item2) => {
                if (item2.regioncode === val[2]) {
                  addressCN[2] = item2.regionname;
                  console.info('addressCN:', addressCN);
                }
                return item2;
              });
            }
            return item1;
          });
        }
        return item;
      });
      this.areaAddressCN = addressCN;
      console.info('value Change~~~~~~~~~~~~~~~~~~~~~~~~addressCN:', addressCN);
    },
    // 5.表单切换sssss
    tapTable(type) {
      this.recipeDetail.prescrtype = type;
      this.docprescriptiondetails.length = 0;
      // 如果是添加中成药
      this.addDrug(type);
    },
    // 5.1 处方列表-中藥表單-添加辅料
    addOther() {
      this.dialogFormVisible = true;
    },
    // 5.1.1处方列表-关闭添加辅料
    addOtherClose(done) {
      this.dialogFormVisible = false;
    },
    // 5.2 处理添加辅料
    handleAddOther() {
      this.dialogFormVisible = false;
      // this.docaccessorieslistSave = this.docaccessorieslist;
    },
    // 5.2.1 处方列表-模拟计算-剂量总数改变
    handleAgentNumChange(value) {
      this.caculateTotalPrice();
    },
    // 5.3 处理庄胜方式
    handleWithin(value) {
      this.recipeDetail.remark = this.recipeDetail.remark + ';' + value;
    },
    // 6.处方列表,剂量倍数
    handelDoseTimesChange(value) {
      this.docprescriptiondetails.map(item => {
        return Object.assign(item, {
          agentsnumber: this.agentsnumber,
          dose: this.agentsnumber * item.singledose
        });
      });
    },
    showPrice() {
      let html = '';
      let sigleAcount = this.recipeDetail.unitPrice;
      let serviceAcount = this.recipeDetail.serviceAcount;
      let recipeAcount = this.recipeDetail.recipeAcount;
      let treatfee = this.recipeDetail.treatfee;
      if (this.recipeDetail.prescrtype === 0) {
        html = `<div>单剂药价：` + Math.formatFloat(sigleAcount, 5) + `</div>
                <div>煎煮费用：` + Math.formatFloat(serviceAcount, 5) + `</div>
                <div>处方总价：` + Math.formatFloat(recipeAcount, 5) + `</div>
                <div>诊金：` + Math.formatFloat(treatfee, 5) + `</div>`;
      }
      else if (this.recipeDetail.prescrtype === 2) {
        html = `<div>单剂药价：` + Math.formatFloat(sigleAcount, 3) + `</div>
                <div>制作费用：` + Math.formatFloat(serviceAcount, 3) + `</div>
                <div>处方总价：` + Math.formatFloat(recipeAcount, 3) + `</div>
                <div>诊金：` + Math.formatFloat(treatfee, 3) + `</div>`;
      }
      else {
        html = `<div>单剂药价：` + Math.formatFloat(sigleAcount, 3) + `</div>
                <div>处方总价：` + Math.formatFloat(recipeAcount, 3) + `</div>
                <div>诊金：` + Math.formatFloat(treatfee, 3) + `</div>`;
      }
      this.$alert(html, '提示', {
        dangerouslyUseHTMLString: true
      });
    },
    //  计算价格
    /* eslint-disable */
    caculateTotalPrice(param) {
      // 1.计算单剂药价
      let list = this.docprescriptiondetails;
      let sigleAcount = 0;  // 单剂药价
      let serviceAcount = 0; // 服务药价,加工费
      let treatfee = 100; // 诊金
      let recipeAcount = 100; // 处方费用
      let fryprice = 1; // 价格系数
      let totalDose = 0; // 总剂量
      let doseNum = 1;
      let totalMoney = 100; // 总价格
      let isCheckFalse = true;
      if (list.length > 0 && this.recipeDetail.prescrtype !== 5) {
        list.forEach((item) => {
          if (!item.medicines) {
            this.$alert('请选择药品', '提示');
            isCheckFalse = false;
            return false;
          }
          if (item.dose === 0) {
            let tip = item.type === 0 ? '剂量不能为 0' : '数量不能为 0';
            this.$alert(tip, '提示');
            isCheckFalse = false;
            return false;
          }
          sigleAcount = item.dose * item.herbunitprice + sigleAcount;
          totalDose += item.dose;
        });
        totalDose = totalDose * this.recipeDetail.amount;
      } else if (list.length === 0) {
        this.$alert('请添加药材', '提示');
        isCheckFalse = false;
        return false;
      }
      // 单剂药价,保留三位小数
      sigleAcount = sigleAcount;
      // 验证
      // 先判断剂数
      if (this.recipeDetail.prescrtype !== 1) {
        if (this.recipeDetail.amount === 0 || !this.recipeDetail.amount) {
          this.$alert('剂数不能为 0', '提示');
          isCheckFalse = false;
          return isCheckFalse;
        } else {
          doseNum = this.recipeDetail.amount;
        }
      }
      if (isCheckFalse === false) {
        return false;
      }
      // 开始计算
      treatfee = this.recipeDetail.treatfee ? this.recipeDetail.treatfee : 0;
      // 1.根据处方类型计算额外类型
      if (this.recipeDetail.prescrtype === 0) {
        if (this.recipeDetail.issuffering === 1) {
          fryprice = this.recipeDetail.sufferingtype === 1 ? 4 : 3;
        } else {
          fryprice = 0;
        }
        serviceAcount = fryprice * doseNum;
        recipeAcount = parseFloat(serviceAcount + sigleAcount * doseNum).toFixed(5);
      }
      // 膏方
      else if (this.recipeDetail.prescrtype === 2) {
        fryprice = totalDose <= 2000 ? 208 : 208 + (totalDose - 2000) * 0.1;
        serviceAcount = fryprice;
        recipeAcount = parseFloat(serviceAcount + sigleAcount * doseNum).toFixed(5);
      }
      // 丸剂
      else if (this.recipeDetail.prescrtype === 3) {
        let wanji_type = this.recipeDetail.wjtype;
        if (wanji_type === 0) {
          this.$alert('请选择丸剂类型', '提示');
          return false;
        }
        if (wanji_type === 1) {
          fryprice = totalDose <= 3000 ? 450 : 450 + (totalDose - 3000) * 0.15;
        } else if (wanji_type === 2) {
          fryprice = totalDose <= 1000 ? 100 : 100 + (totalDose - 1000) * 0.1;
        } else if (wanji_type === 3) {
          fryprice = totalDose <= 1000 ? 120 : 120 + (totalDose - 1000) * 0.12;
        } else {
          fryprice = totalDose <= 1000 ? 80 : 80 + (totalDose - 1000) * 0.08;
        }
        serviceAcount = fryprice;
        recipeAcount = parseFloat(fryprice + sigleAcount * doseNum).toFixed(5);
      }
      else if (this.recipeDetail.prescrtype === 5) {
        sigleAcount = this.recipeDetail.retailprice;
        recipeAcount = sigleAcount * this.recipeDetail.amount;
      }
      else {
        recipeAcount = sigleAcount * doseNum;
      }
      //向上取整,处方总价.
      totalMoney = treatfee + 1 * recipeAcount + this.recipeDetail.logisticsfee;
      // 存储
      this.recipeDetail.unitPrice = sigleAcount;
      this.recipeDetail.serviceAcount = parseFloat(serviceAcount).toFixed(2);
      this.recipeDetail.recipeAcount = parseFloat(recipeAcount).toFixed(2);
      this.recipeDetail.totalMoney = parseFloat(totalMoney).toFixed(2);
      this.recipeDetail.money = parseFloat(sigleAcount * doseNum).toFixed(2);
      this.recipeDetail.totalDose = parseFloat(totalDose).toFixed(2);
      ;
      if (param && param === 'show') {
        this.showPrice();
      }
      return isCheckFalse;
    },
    handelHeaderOperat(type) {
      let params = {};
      let _this = this;
      this.$refs['recipeDetail'].validate((valid) => {
          // 需要验证表单的事务
          if (type === 'save' || type === 'done' || type === 'orderSave' || type === 'orderDone' ||
            type === 'singleAgain') {
            if (!valid) {
              this.$alert('请输入带*号的必填项!', "提示");
              return;
            }
            // 送货人地址不能为空
            if (_this.areaAddress[2] === '') {
              this.$alert('送货人地址不能为空!', "提示");
              return;
            }
            if (_this.recipeDetail.prescrtype === 3 && _this.recipeDetail.wjtype === 0) {
              this.$alert('请选择丸剂类型', '提示');
              return false;
            }
            if (valid && this.caculateTotalPrice()) {
              // 存储信息,1.药材列表,2.辅料
              Object.assign(params, this.recipeDetail, {
                docprescriptiondetails: this.docprescriptiondetails,
                docaccessorieslist: this.docaccessorieslist
              });
              // 1.验证通过,手机和身份证号码二选一
              if (!params.id_number && !params.tel) {
                this.$alert('手机或者身份证必须填写一个!', "提示");
                return;
              }
              // 2.中药处方,煎煮时,剂数不能小于3
              if (_this.recipeDetail.prescrtype !== 0) {
                _this.recipeDetail.issuffering = 0;
              } else if (_this.recipeDetail.prescrtype === 0 && params.issuffering === 1 && params.amount < 3) {
                this.$alert('中药煎煮时剂数不能小于3!', "提示");
                return;
              }
              // 如果不是膏方,不传docprescriptiondetails
              if (params.prescrtype !== 2) {
                params.docaccessorieslist = [];
              } else {
                // 如果是膏方,处理辅料,如果剂量数为0,不上传.
                params.docaccessorieslist = params.docaccessorieslist.filter(item => {
                  if (item.accessordose > 0) {
                    return item;
                  }
                });
                console.info(params.docaccessorieslist);
              }
              // 存储城市
              params.provinces = this.areaAddressCN[0];
              params.city = this.areaAddressCN[1];
              params.zone = this.areaAddressCN[2];
              params.detailaddress = params.provinces + params.city + params.zone + params.addrstr;
              // 地址详情做修改
              if (type === 'save') {
                Object.assign(params, { Status: 0 });
                console.info('打印传入参数~~~~~~~~~~~~~~~~~~~~~~~~~');
                console.info(JSON.stringify(params));
                // 临时保存测试
                yilin.post('/api/ordermanage/savedocprescription', params).then((res) => {
                  if (res.status === 200 && res.statusText === 'OK') {
                    console.info('临时保存成功!,res:', res);
                    if (res.data.code === 0) {
                      this.$alert('临时保存成功!', '提示');
                      this.$router.push({ path: '/orderManage/msgEntry' });
                    } else {
                      console.info('临时保存失败!');
                    }
                  }
                });
              }
              else if (type === 'done') {
                Object.assign(params, { Status: 5 });
                yilin.post('/api/ordermanage/savedocprescription', params).then((res) => {
                  if (res.status === 200 && res.statusText === 'OK') {
                    if (res.data.code === 0) {
                      this.$alert('录入成功!', '提示');
                      /* let id = this.$route.params.orderid;
                       this.$router.push({ path: '/orderManage/recipeCheck?orderid='+id });*/
                      this.$router.push({ path: '/orderManage/msgEntry' });
                    }
                  }
                });
              }
              else if (type === 'orderSave') {
                yilin.post('/api/ordermanage/audittempsaveorder', params).then((res) => {
                  if (res.status === 200 && res.statusText === 'OK') {
                    if (res.data.code === 0) {
                      this.$alert('临时保存成功!', '提示');
                      this.$router.push({ path: '/orderManage/msgConfirm', query: this.getSearchParams() });
                    } else {
                      this.$alert(res.data.message, '警告');
                    }
                  }
                });
              }
              else if (type === 'orderDone') {
                console.info(JSON.stringify(params));
                // 订单确认
                yilin.post('/api/ordermanage/auditoksaveorder', params).then((res) => {
                  if (res.status === 200 && res.statusText === 'OK') {
                    if (res.data.code === 0) {
                      this.$alert('订单确认成功!', '提示');
                      this.$router.push({ path: '/orderManage/msgConfirm', query: this.getSearchParams() });
                    } else {
                      this.$alert(res.data.message, '警告');
                    }
                  }
                });
              }
              else if (type === 'singleAgain') {  // 再来一单
                yilin.post('/api/ordermanage/againdocprescription', params
                ).then((res) => {
                  if (res.status === 200 && res.statusText === 'OK') {
                    if (res.data.code === 0) {
                      this.$alert('再来一单成功!', '提示');
                      this.$router.push({ path: '/orderManage/msgConfirm' });
                    } else {
                      this.$alert(res.data.message, '警告');
                    }
                  }
                });
              }
            }
            else {
              // this.$alert('请添加药材!', "提示");
            }
          }
        }
      );
      if (type === 'removelock') {
        let id = this.$route.query.orderid;
        yilin.post('/api/ordermanage/removelockorder', {
          Id: id,
          userid: sessionStorage.getItem('userid')
        }).then((res) => {
          if (res.status === 200 && res.statusText === 'OK') {
            console.info('移除锁定!,res:', res.data);
            if (res.data.code === 0) {
              this.$alert('移除锁定成功!', '提示');
            }
          }
        });
      }
      else if (type === 'giveup') {  // 放弃录入失败
        let id = this.$route.query.orderid;
        this.dialogVisibleGiveup = true;
      }
      else if (type === 'sendMSG') {  // 发送信息
        this.$router.push({ 'path': '/orderManage/smsSend' });
      }
    },
    lockorder(callback)
    {
      let id = this.$route.query.orderid;
      yilin.post('/api/ordermanage/lockorder', {
        Id: id,
        UserId: sessionStorage.getItem('userid'),
        Remark: sessionStorage.getItem('nickname')
      }).then((res) => {
        if (res.status === 200 && res.statusText === 'OK') {
          if (res.data.code === 0) {
            console.info('2.录入锁定success!,res.data:', res.data);
            if (callback) {
              callback();
            }
          } else if (res.data.code === -1) {
            this.$alert('其他录入人员正在使用!', '提示');
            this.lock = true;
          }
        }
      });
    },
    empty()
    {
      console.log('清空');
    },
    // 查询
    query()
    {
      console.log('查询');
    },
    // 添加操作
    add()
    {
      this.dialogFormVisible = true;
    },
    queryAdd()
    {
      this.$refs['recipeDetail'].validate(() => {
        console.log(this.addData);
        console.log('添加完成');
        this.dialogFormVisible = false;
      });
    },
    // 审核提交
    queryModify()
    {
      console.log(this.modifyData);
    },
    // 删除列表数据
    removeTableData()
    {
      console.log('删除');
    },
    // 自定义组件删改操作
    customCompFunc(params)
    {
      let isSame = false;
      // 1.中药清单-移除药材
      if (params.type === 'removeChineseMedicine') { // do remove operation
        this.docprescriptiondetails.splice(params.index, 1);
      }
      // 2.中药清单-药材改变
      else if (params.type === 'medicineChange') { // do change medicines
        // 验证是否为同一药品
        this.docprescriptiondetails.map((item) => {
          if (item.drugname === params.value) {
            isSame = true;
            this.docprescriptiondetails[params.index].medicines = '';
            this.docprescriptiondetails[params.index].herbunitprice = '';
            this.docprescriptiondetails[params.index].drugname = '';
            this.docprescriptiondetails[params.index].unit = '';
            this.docprescriptiondetails[params.index].goodsnorms = '';
            this.docprescriptiondetails[params.index].goodsorgin = '';
            this.docprescriptiondetails[params.index].goodsnum = '';
            this.docprescriptiondetails = Object.assign([], this.docprescriptiondetails);
            this.$alert('药品重复', '提示');
            return;
          }
        });
        if (!isSame) {
          this.docprescriptiondetails[params.index].herbunitprice = params.unitprice;
          this.docprescriptiondetails[params.index].drugname = params.value;
          this.docprescriptiondetails[params.index].medicines = params.value;
          this.docprescriptiondetails[params.index].unit = params.unit;
          this.docprescriptiondetails[params.index].dose = 1;
          this.docprescriptiondetails[params.index].goodsnorms = params.goodsnorms;
          this.docprescriptiondetails[params.index].goodsorgin = params.goodsorgin;
          this.docprescriptiondetails[params.index].goodsnum = params.goodsnum;
          //如果是西药,productid,赋值,isOtc賦值
          if (params.productid) {
            this.docprescriptiondetails[params.index].productid = params.productid;
            this.docprescriptiondetails[params.index].isOtc = params.isOtc;
          }
          console.info(params.rowData);
        }
      }
      // 3.中药清单-用法改变
      else if (params.type === 'usageChange') { // do change medicines
        this.docprescriptiondetails[params.index].musage = params.value;
      }
      // 3.中药清单-剂量增加
      else if (params.type === 'numChange') { // do change numChange
        this.docprescriptiondetails[params.index].dose = params.value;
      }
      // 3.中药清单-剂量倍数
      else if (params.type === 'singledoseChange') { // do change numChange
        this.docprescriptiondetails[params.index].singledose = params.value;
        // this.docprescriptiondetails[params.index].dose = params.value + '*' + this.agentsnumber +'=' + params.value * this.agentsnumber;
        this.docprescriptiondetails[params.index].dose = params.value * this.agentsnumber;
      }
    },
    // 分页
    pageChange(pageIndex)
    {
      this.business.pageIndex = pageIndex;
      this.getOrderList();
    },
    ageSizeChange(pageSize)
    {
      this.business.pageSize = pageSize;
      this.getOrderList();
    },
  },
  mounted: function () {
    let test = this.$route.params.id;
    Math.formatFloat = function (f, digit) {
      let m = Math.pow(10, digit);
      return Math.round(f * m, 10) / m;
    };
    this.ordersource = this.$route.query.ordersource;
    // 获取订单状态
    this.sourcePage = this.$route.query.sourcePage;
    this.getPrescriptionDetail();
  },
  create() {
    window.previewImg = this.previewImg;
  }
};
// 选择药品
Vue.component('selectdrug', {
  template: `<div class="input-remote">
  <el-select
    v-model="rowData.medicines"
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    @change="changeValue"
    :loading="loading">
    <el-option
      v-for="item in options"
      :key="item.key"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</div>`,
  props: {
    options4: {
      type: Array
    },
    rowData: {
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      options: []
    };
  },
  watch: {
    options4: function (val) {
      this.options = val;
    },
  },
  create(){
  },
  methods: {
    remoteMethod(query) {
      this.loading = true;
      // 调用接口,搜索药品列表,传送options4
      this.$emit('remote', { query: query, type: 'remoteMethod' });
      this.loading = false;
    },
    changeValue(value) {
      let item = this.options.filter(item => {
        return item.label === value;
      });
      console.info(item[0]);
      this.$emit('remote', { value: item[0], type: 'medicineChange' });
    },
    clean() {
      this.options.length = 0;
      this.medicines = '';
    }
  },
});
// 药品搜索,调用.net接口,中药
Vue.component('chinese-select-drug', {
  template: `<div>
            <selectdrug  :options4="options4" @remote="handleEvent" :rowData="rowData"> </selectdrug>
            </div>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    },
  },
  data() {
    return {
      options4: []
    }
  },
  methods: {
    handleEvent(params){
      if (params.type === 'remoteMethod') {
        this.getChineseDrug(params);
      } else if (params.type === 'medicineChange') {
        this.$emit('on-custom-comp',
          Object.assign(params.value, { type: 'medicineChange', index: this.index, rowData: this.rowData }));
      }
    },
    getChineseDrug(params) {
      let _this = this;
      yilin.get('/api/ordermanage/searchherbslist', {
        params: { 'pyCode': params.query, 'count': 8, 'type': 0 }
      }).then((res) => {
        if (res.status === 200 && res.statusText === 'OK') {
          let list = res.data.data;
          _this.options4 = list.map(item => {
            return Object.assign(item, { label: item.drugname, value: item.drugname });
          });
        }
      });
    },
  }
},);
// 药品搜索,调用,java接口,中成药,西药
Vue.component('java-select-drug', {
  template: `<div>
            <selectdrug  :options4="options4" @remote="handleEvent" :rowData="rowData"> </selectdrug>
            </div>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    },
  },
  data() {
    return {
      options4: []
    }
  },
  methods: {
    handleEvent(params){
      if (params.type === 'remoteMethod') {
        this.getDrugFromJava(params);
      } else if (params.type === 'medicineChange') {
        this.$emit('on-custom-comp',
          Object.assign(params.value, { type: 'medicineChange', index: this.index, rowData: this.rowData }));
      }
    },
    getDrugFromJava(params) {
      let _this = this;
      // 如果是西药,则掉java的接口
      let requestData = {
        categoryDoctors: '',
        keyword: params.query,
        pageNum: 1,
        pageSize: 8,
        getCommon: '1',
        sellerUserId: 1,
        pharmaceuticalIngredients: 2 // 默认西药
      };
      // 如果是中成药
      if (this.rowData.type === 6) {
        requestData.pharmaceuticalIngredients = 1; // 中成药
        console.info('中成药');
      }
      java.post('/mall_manage/back/product/queryByDoctor', requestData).then((res) => {
        console.info(res);
        let list = res.data.resultData.data;
        _this.options4 = list.map(item => {
          return Object.assign(item, {
            label: item.productName,
            value: item.productName,
            goodsnorms: item.productSpecification,
            goodsorgin: item.productProducingPlace,
            unitprice: item.productStocks[0].productPrice,
            unit: item.productUnit,
            productid: item.productId,
            isOtc:item.isOtc
          });
        });
        console.info(_this.options4);
      });
    },
  }
},);
</script>
<style lang="less" scoped>
  @themeColor: #0182EB;
  @grey: #E4E7ED;
  .entryNum {
    color: red;
    margin: 10px 10px 15px 0px;
  }
  .table {
    margin-bottom: 10px;
    .title {
      color: @themeColor;
      text-align: center;
      margin-bottom: 10px;
    }
    border: 1px solid @grey;
    padding: 10px 5px 5px 0;
  }
  .btn-group {
    text-align: center;
    margin: 20px 0;
  }
  /*中药清单样式*/
  .tableHeader {
    border-bottom: 1px solid #FFF !important;
    position: relative;
    // .button {
    // }
    .dose {
      text-align: left;
      height: 30px
    }
  }
  .table-Container-box {
    padding: 5px;
  }
  // .table-operation-drug-usage {}
  // 辅料盒子
  .title {
    padding: 0 10px 5px 10px;
    border-bottom: 1px solid #CCC;
    margin-bottom: 10px;
    font-size: 20px;
  }
  .el-dialog__header {
    padding: 10px 10px 10px;
  }
  .el-dialog--center .el-dialog__body {
    text-align: initial;
    padding: 10px 10px 0px !important;
  }
  .input-remote {
    position: relative;
  }
  .singledose {
    position: absolute;
    left: 563px;
    z-index: 800;
    top: 89px;
  }
  .gutterSpan {
    padding-right: 5px;
    color: blue;
  }
  /*丸剂说明*/
  #nsw_margin {
    text-align: center;
  }
  .btn-group-head {
    position: absolute;
    left: 275px;
    top: 5px;
    z-index: 1000;
  }
  .baseINFO {
    padding: 10px 0;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
  .countTableWrap {
    text-align: right;
    .countTable {
      display: inline-block;
      width: 260px;
      text-align: left;
    }
  }
  .doseNow {
    text-align: center;
    font-size: 24px;
    height: 45px;
    line-height: 45px;
    color: #3ABA6F;
  }
  .el-tabs__content {
    .el-row {
      margin-bottom: 20px;
    }
  }
  /* 邮费提示 */
  .tip-postage {
    text-align: right;
    margin-left: 10px;
  }
</style>
