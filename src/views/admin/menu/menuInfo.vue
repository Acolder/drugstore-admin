<template>
  <div>
    <el-form ref="menuInfo" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="parentId" prop="parentId" v-show="false">
        <input type="hidden" v-model="form.parentId" />
      </el-form-item>
      <el-form-item label="parent" prop="parentName">
        <el-input v-model="form.parentName" disabled></el-input>
      </el-form-item>
      <el-form-item label="name" prop="name">
        <el-input v-model="form.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="title" prop="title">
        <el-input v-model.number="form.title" clearable></el-input>
      </el-form-item>
      <el-form-item label="show" prop="show">
        <el-radio-group v-model="form.show">
          <el-radio :label="'1'">true</el-radio>
          <el-radio :label="'0'">false</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="sort" prop="sort">
        <el-input v-model="form.sort"></el-input>
      </el-form-item>
      <el-form-item label="component" prop="component">
        <el-input v-model="form.component" clearable></el-input>
      </el-form-item>
      <el-form-item label="path" prop="path">
        <el-input v-model="form.path" clearable></el-input>
      </el-form-item>
      <el-form-item label="redirect" prop="redirect">
        <el-input v-model="form.redirect" clearable></el-input>
      </el-form-item>
      <el-form-item label="icon" prop="icon">
        <el-input v-model="form.icon" style="width:50%" clearable>
          <template slot="append"><i class="iconfont" style="color:red;font-size:20px;" :class="form.icon" v-if="form.icon"></i></template>
        </el-input>
        <el-button type="default" icon="el-icon-more" :plain="true" @click="selectIcon" size="mini" circle></el-button>
      </el-form-item>
      <div class="btn-Wrapper">
        <el-button @click="resetForm" icon="el-icon-circle-close-outline" size="small">重置</el-button>
        <el-button @click="submitForm" type="primary" icon="el-icon-check" size="small">提交</el-button>
      </div>
    </el-form>
    <el-dialog :title="iconfontTitle" :visible.sync="iconDialogVisible"  width="800px" :center="true" :modal-append-to-body="false" :append-to-body="true" :fullscreen="true">
      <iconfontView @selectIconfont="selectIconfont"></iconfontView>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
@import url("../../layout/iconfont/iconfont.css");
  .btn-Wrapper {
    text-align: center;
  }
</style>

<script>
import java from '@/utils/javaApiRequest';
import iconfont from './iconfont';
export default {
  data() {
    return {
      iconDialogVisible: false,
      form: {
        // 父id
        parentId: '',
        // 父名称
        parentName: '',
        // 路由名称
        name: '',
        // 名称
        title: '',
        // 显示
        show: '1',
        // 排序
        sort: '0',
        // 组件
        component: '',
        // 路由路径
        path: '',
        // 重定向
        redirect: '',
        // 图标
        icon: '',
      },
      rules: {
        parentId: [{
          required: false,
          trigger: 'blur'
        }],
        name: [{
          required: true,
          trigger: 'blur'
        }],
        title: [{
          required: true,
          trigger: 'blur'
        }],
        show: [{
          required: false,
          trigger: 'blur'
        }],
        component: [{
          required: true,
          trigger: 'blur'
        }],
        path: [{
          required: true,
          trigger: 'blur'
        }],
        redirect: [{
          required: false,
          trigger: 'blur'
        }],
      },
      // 操作枚举 1:新增,2:编辑
      operationEnum: {
        append: 1,
        edit: 2
      },
      iconfontTitle: '设置图标',
    };
  },
  props: {
    // 操作 1:新增,2:编辑
    operation: {
      type: Number,
      default: 1
    }
  },
  components: {
    'iconfontView': iconfont
  },
  methods: {
    submitForm() {
      let _self = this;
      _self.$refs['menuInfo'].validate((valid) => {
        if (valid) {
          let postData = _self.form;
          let postUrl = '/mall_manage/back/insertMenu';
          let msg = '操作成功';
          if (_self.operation === _self.operationEnum.edit) {
            postUrl = '/mall_manage/back/updateMenu';
          }
          java.post(postUrl, postData).then(res => {
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message({
                showClose: true,
                message: msg,
                type: 'success'
              });
              _self.$emit('formSubmitSuccess');
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    setFormData(data) {
      let _self = this;
      if (data) {
        for (let key in _self.form) {
          if (data.hasOwnProperty(key)) {
            if (_self.operation === _self.operationEnum.append) {
              if (key === 'parentId') {
                _self.$set(_self.form, 'parentId', data['menuId']);
              } else if (key === 'parentName') {
                _self.$set(_self.form, 'parentName', data['title']);
              } else {
                continue;
              }
            } else if (_self.operation === _self.operationEnum.edit) {
              _self.$set(_self.form, key, data[key]);
            }
          }
        }
        if (_self.operation === _self.operationEnum.edit && data.hasOwnProperty('menuId')) {
          _self.$set(_self.form, 'menuId', data['menuId']);
        }
      }
    },
    resetForm() {
      this.$refs['menuInfo'].resetFields();
    },
    selectIcon() {
      this.iconDialogVisible = true;
      this.iconfontTitle = `设置菜单${this.form.title ? '-' + this.form.title : ''}`;
    },
    selectIconfont(iconClass) {
      this.$set(this.form, 'icon', iconClass);
      this.iconDialogVisible = false;
    },
  },
};
</script>
