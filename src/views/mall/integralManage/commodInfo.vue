<template>
  <div id="discountCoupon">
    <el-form ref="form_Data" :inline="true" :model="formData" :rules="rules" size="small" >
      <div v-if="this.type_hidden === 1">
        <p v-if="this.flag === 1"><a class='add_coupon' @click="add_yhq">添加优惠券</a></p>
        <p v-else><a class='add_coupon' @click="replay_yhq">更换优惠券</a></p>
      </div>
      <!-- 优惠券信息 -->
      <div class="Coupon" v-if="this.flag === 2" >
        <h3>优惠券信息</h3>
        <div class="Coupon_yhqxx">
          <el-row>
            <el-col :span="8">
              <el-form-item label="优惠券名称:" >
                <span v-if="formData.coupondto">{{formData.coupondto[0].couponname}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用范围:" >
                <span v-if="_self.formData.coupondto">商城商品</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发行数量:" >
                <span v-if="_self.formData.coupondto">{{formData.coupondto[0].distributionquantity}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="优惠券券面:" >
                <span v-if="_self.formData.coupondto">
                  {{formData.coupondto[0].sellername}}
                  </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用群体:">
                <span v-if="_self.formData.coupondto">{{formData.coupondto[0].accessiblegroup}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="有效时间:" >
                <span v-if="_self.formData.coupondto">{{formData.coupondto[0].usetimetype}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="规则描述:" >
                <span v-if="_self.formData.coupondto">{{formData.coupondto[0].ruledescription}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 基本信息 -->
      <div class="basic Coupon">
        <h3>基本信息</h3>
        <div class="Coupon_yhqxx">
          <el-row>
            <el-col :span="8">
              <el-form-item label="商品名称:" prop="name">
                <el-input class="el-input" v-model.trim="formData.name"  clearable placeholder="请输入商品名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品分类:" prop="type">
                <el-select v-model="formData.type"  placeholder="请选择" @change="typeAction">
                  <el-option label="实体" :value='"Reality"'></el-option>
                  <el-option label="虚拟" :value='"Virtual"'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品规格:" prop="specifications">
                <el-input class="el-input" v-model.trim="formData.specifications"  clearable placeholder="请输入商品规格" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="商品库存:" prop="stock">
                <el-input class="el-input" v-if="formData.type === 'Virtual'" disabled="" v-model="formData.stock" clearable placeholder="请输入商品库存"></el-input>
                <el-input class="el-input" v-else v-model="formData.stock" clearable placeholder="请输入商品库存"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="条 形 码 :" prop="bar_code" >
                <el-input class="el-input" v-model.trim="formData.bar_code" clearable placeholder="请输入条形码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 前端展示 -->
      <div class="display Coupon">
        <h3>前端展示</h3>
        <div class="Coupon_yhqxx">
          <el-row>
            <el-col :span="12">
              <el-form-item label="全积分：" prop="integral">
                <el-input class="el-input" v-model="formData.integral" clearable ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="img">
              <el-form-item label="商品图片:" :prop="'icon'" :rules="{ required: true, message: '请选择图片', trigger: 'change'}" >
                <uploadImg :imgUrl="formData.icon" :fileName="'formData.icon'" @uploadSuccess="uploadImg" @removeImg="removeImg"></uploadImg>
                <el-input type="hidden" v-model="formData.icon"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="商品标价:" prop="original_price">
                <el-input class="el-input" v-model.trim="formData.original_price" clearable ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="前端排序:" prop="sort" >
                <el-input class="el-input" v-model.trim="formData.sort"  clearable ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="商品描述:" prop="desc">
                <el-input class="el-input" v-model.trim="formData.desc" clearable style="width:500%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="商品详情:" prop="detail">
                <textarea id="content" v-model.trim="formData.detail" style="display:none;"></textarea>
                <ueditor :id="'content_ueditor'" ref="content_ueditor"></ueditor>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-form-item class="form-submit">
        <el-button size="small" type="default" @click="cancel" icon="el-icon-circle-close">重置</el-button>
        <el-button size="small" type="primary" @click="save" icon="el-icon-check">确定</el-button>
      </el-form-item>
    </el-form>
    <!-- 添加优惠券 -->
    <el-dialog title="添加优惠券" :visible.sync="CouponShow" :modal-append-to-body="false" :append-to-body="true" :close-on-click-modal="false" width="1200px" center>
      <iframe :src="couponURL" frameborder="0" style="width:100%;height:600px;"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import uploadImg from '@/components/upload/uploadImg';
import ueditor from '@/components/ueditor/editor';
import { formatDate } from '@/utils/date.js';
import ajax from '@/utils/ajax';
import { mapGetters } from 'vuex';
export default {
  data() {
    // 排序
    let validateSort = (rule, value, callback) => {
      if (value) {
        const reg = /^[1-9]\d{0,9}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入10位数以内，大于0的正整数'));
        }
      } else {
        return callback(new Error('请输入10位数以内，大于0的正整数'));
      }
    };
    // 库存
    let validatestock = (rule, value, callback) => {
      if (value) {
        const reg = /^[1-9]\d{0,9}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入10位数以内的正整数'));
        }
      } else {
        return callback(new Error('请输入10位数以内的正整数'));
      }
    };
    // 价格
    let validatePrice = (rule, value, callback) => {
      if (value) {
        const reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确格式的商品价格'));
        }
      } else {
        return callback(new Error('请输入正确格式的商品价格'));
      }
    };
    return {
      Body_editor: null,
      formData: {
        nature: '',
        name: '',
        type: '',
        specifications: '',
        stock: '',
        bar_code: '',
        integral: '',
        sort: '',
        original_price: '',
        exchange_quantity: '0',
        icon: '',
        desc: '',
        detail: '',
        attrs: '',
        coupondto: [],
      },
      rules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        type: [{ required: true, message: '请输入商品分类', trigger: 'blur' }],
        specifications: [{ required: true, message: '请输入商品规格', trigger: 'blur' }],
        bar_code: [{ required: true, message: '请输入条形码', trigger: 'blur' }],
        sort: [{ required: true, validator: validateSort, trigger: 'blur' }],
        integral: [{ required: true, validator: validateSort, trigger: 'blur' }],
        stock: [{ required: true, validator: validatestock, trigger: 'blur' }],
        original_price: [{ required: true, validator: validatePrice, trigger: 'blur' }],
        desc: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入商品详情', trigger: 'blur' }],
      },
      CouponShow: false,
      CouponData: '',
      couponURL: `${process.env.WEB_HOST}/integralManage/couponComponent`,
      tip: '',
      flag: 1,
      type_hidden: '',
      days: '',
      date: ''
    };
  },
  components: {
    'uploadImg': uploadImg,
    'ueditor': ueditor,
  },
  props: {
    isAdd: Boolean
  },
  watch: {
    'formData.type': function() {
      if (this.formData.type === 'Virtual') {
        this.type_hidden = 1;
      } else if (this.formData.type === 'Reality') {
        this.flag = 1;
        this.formData.nature = 'Normal';
        this.formData.coupondto = [];
      }
    }
  },
  computed: {
    ...mapGetters([
      'visitedViews',
    ]),
  },
  methods: {
    // 上传图标
    uploadImg(data, imgUrl) {
      this.formData.icon = imgUrl;
    },
    // 删除图标
    removeImg(url) {
      this.formData.icon = url;
    },
    // 添加优惠券
    SureCoupon() {
      this.CouponShow = false;
    },
    // 重置
    cancel() {
      if (this.$route.query.id) {
        this.getDetail();
      } else {
        this.$refs['form_Data'].resetFields();
        this.formData.detail = '';
        this.Body_editor.setContent('');
        this.formData.coupondto[0] = {};
      }
      // this.CouponShow = true;
    },
    // 虚拟选择优惠券
    typeAction(data) {
      if (data === 'Virtual') {
        this.type_hidden = 1;
        this.formData.stock = '';
      } else {
        this.type_hidden = '';
        this.formData.stock = '';
      }
    },
    // 替换优惠券
    replay_yhq() {
      this.CouponShow = true;
    },
    // 添加优惠券
    add_yhq() {
      let _self = this;
      _self.CouponShow = true;
    },
    // 确定提交
    save() {
      let _self = this;
      _self.formData.detail = _self.Body_editor.getContent();
      let url;
      if (_self.isAdd) {
        url = '/api/integral/CreateIntegralProInfo';
        if (_self.tip === 1) {
          _self.formData.nature = 'SaleTicket';
        } else {
          _self.formData.nature = 'Normal';
        }
      } else {
        url = '/api/integral/UpdateIntegralProInfo';
      }
      let param = _self.formData;
      if (_self.formData.type === 'Virtual' && param.coupondto.length < 1) {
        _self.$alert('请添加优惠券', '提示', {
          type: 'warning'
        });
      } else {
        _self.$refs['form_Data'].validate((valid) => {
          if (valid) {
            let a;
            if (_self.formData.type === 'Virtual') {
              if (_self.formData.stock <= _self.formData.coupondto[0].distributionquantity) {
                a = 1;
              }
            } else if (_self.formData.type === 'Reality') {
              a = 1;
            }
            if (a === 1) {
              ajax.post(url, param).then(res => {
                if (res.status === 200 && res.data.code === 0) {
                  _self.$message({
                    type: 'success',
                    message: '操作成功'
                  });
                  // 关闭当前也并跳转列表页
                  let currentName = _self.$route.name;
                  let currentTab = _self.visitedViews.find((x) => x.name === currentName);
                  _self.$store.dispatch('delVisitedViews', currentTab).then((res) => {
                    let query = _self.$route.query;
                    query.from = _self.$route.name;
                    if (query.id) {
                      delete query.id;
                    }
                    _self.$router.push({
                      path: '/integralManage/commodManage',
                    });
                  });
                }
              });
            } else {
              _self.$alert('商品库存不能大于发行量', '提示', {
                type: 'warning'
              });
            }

          } else {
            this.$message({
              type: 'warning',
              message: '请将信息填写完整',
            });
            return false;
          }
        });
      }
    },
    // 获取详情
    getDetail() {
      let _self = this;
      let id = _self.$route.query.id;
      ajax.get(`/api/integral/GetIntegralProInfoByid?id=` + id).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          _self.formData = res.data.data;
          if (_self.formData.coupondto.length > 0) {
            _self.flag = 2;
          } else {
            _self.flag = 1;
          }
          _self.Body_editor.setContent(_self.formData.detail);
          if (_self.formData.coupondto.length > 0) {
            _self.formData.coupondto[0].couponId = _self.formData.couponId;
            _self.formData.coupondto[0].securitiesInformationId = _self.formData.securitiesInformationId;
            _self.formData.coupondto[0].sellerUserId = _self.formData.sellerUserId;
            _self.CouponShow = false;
          }
          if (_self.formData.type === 'Reality') {
            this.type_hidden = 2;
          }
        }
      });
    },
    // 确定添加优惠券
    selectCoupon(data) {
      let _self = this;
      if (data) {
        _self.CouponData = data;
        _self.CouponShow = false;
        _self.tip = 1;
        _self.flag = 2;
        _self.formData.nature = 'SaleTicket';
        if (data.useTimeType === 1) {
          data.effectiveDate = data.startDate + '至' + data.endDate;
        } else {
          data.effectiveDate = '领取后' + data.effectiveDate + '天内';
        }
        if (_self.formData.type === 'Virtual') {
          _self.formData.stock = data.distributionQuantity;
        }
        _self.formData.coupondto = [{
          couponname: data.couponName,
          distributionquantity: data.distributionQuantity,
          sellername: '满' + data.useTheThreshold + '减' + data.preferentialAmount,
          accessiblegroup: data.accessibleGroup === 1 ? data.accessibleGroup = '全部用户' : (data.accessibleGroup === 2 ? data.accessibleGroup = '优惠券创建后的新用户' : data.accessibleGroup = '时间段内的新用户'),
          usetimetype: data.effectiveDate,
          ruledescription: data.ruleDescription,
          couponid: data.couponId,
          securitiesinformationid: data.securitiesInformationId,
          selleruserid: data.sellerUserId,
          useListTime: data.endDate ? data.endDate + ' 00:00:00' : _self.addDay(new Date(), data.effectiveDate.slice(3, -2)),
        }];
      }
    },
    // 方法 增添dayNumber天（整形），date：如果没传就使用今天（日期型）
    addDay(date, dayNumber) {
      this.date = date ? date : new Date();
      let ms = dayNumber * (1000 * 60 * 60 * 24);
      let newDate = new Date(this.date.getTime() + ms);
      return formatDate(newDate);
    },
  },
  mounted() {
    this.Body_editor = this.$refs.content_ueditor;
  },
  created() {
    window.selectCoupon = this.selectCoupon;
    if (this.$route.query.id) {
      this.getDetail();
    }
  }
};
</script>

<style lang="less" scoped>
#discountCoupon{
  p{
    text-align: right;
    margin-top: 5px;
    .add_coupon{
      color: #0066cc;
      font-size: 16px;
    }
  }
  h3{
    color: #6b6b6b;
    margin: 42px 0 10px 0;
    font-size: 20px;
    font-weight: normal;
  }
  .Coupon{
    .Coupon_yhqxx{
      padding: 20px 50px;
      background: #f2f2f2;
      color: #666666;
      .img {
        /deep/ .el-input{
          display: none;
        }
      }
    }
  }
  .form-submit{
    display: block;
    text-align: center;
    margin: 30px 0 80px 0;
  }
  .img {
    /deep/ .el-form-item__content{
      height: 58px;
    }
  }
}
</style>
