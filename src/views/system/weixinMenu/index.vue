<template>
  <div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="success" size="small" icon="el-icon-plus" @click="addNewMenu">添加</el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" @click="clearMenu">清空菜单</el-button>
        <el-button type="info" size="small" icon="el-icon-refresh" @click="query">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <el-tree :props="treeProps" :data="treeData" node-key="key" :expand-on-click-node="false" :default-expand-all="true">
        <span slot-scope="{ node, data }">
          <i class="el-icon-tickets"></i>
          <span>{{data.name}}</span>
          <span style="margin-left:15px;">
            <el-button type="text" size="small" @click="() => modify(data, node)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button type="text" size="small" @click="() => remove(data, node)">
              <i class="el-icon-delete"></i>
            </el-button>
            <el-button type="text" size="small" @click="() => append(data, node)" v-if="node.level===1">
              <i class="el-icon-plus"></i>
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="750px" @close="dialogClose" :center="true" :modal-append-to-body="false" :append-to-body="true" :close-on-click-modal="false">
    <el-form ref="info" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="type" prop="type">
        <el-select v-model="form.type" placeholder="请选择类型" style="width:100%;">
          <el-option v-for="item in buttonType" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="name" prop="name">
        <el-input type="text" v-model="form.name" placeholder="请输入菜单名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="url" prop="url">
        <el-input type="text" v-model="form.url" placeholder="view、miniprogram类型必须，网页 链接，用户点击菜单可打开链接，不超过1024字节。" clearable></el-input>
      </el-form-item>
      <el-form-item label="key" prop="key">
        <el-input type="text" v-model="form.key" placeholder="click等点击类型必须,菜单KEY值，用于消息接口推送，不超过128字节。" clearable>
          <el-button slot="append" @click="createKey">生成</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="media_id" prop="media_id">
        <el-input type="text" v-model="form.media_id" placeholder="media_id类型和view_limited类型必须，调用新增永久素材接口返回的合法media_id。" clearable></el-input>
      </el-form-item>
      <el-form-item label="appid" prop="appid">
        <el-input type="text" v-model="form.appid" placeholder="miniprogram类型必须，小程序的appid（仅认证公众号可配置）。" clearable></el-input>
      </el-form-item>
      <el-form-item label="pagepath" prop="pagepath">
        <el-input type="text" v-model="form.pagepath" placeholder="miniprogram类型必须，小程序的页面路径。" clearable></el-input>
      </el-form-item>
      <div class="btn-Wrapper">
        <el-button @click="resetForm" icon="el-icon-circle-close-outline" size="small">重置</el-button>
        <el-button @click="modifyData" type="primary" icon="el-icon-check" size="small">保存</el-button>
      </div>
    </el-form>
    </el-dialog>
  </div>
</template>
<script>
import ajax from '@/utils/ajax.js';
import { newGuid } from '@/utils/index';
export default {
  data() {
    return {
      dialogTitle: '菜单信息',
      dialogVisible: false,
      currentData: null,
      cuttentNode: null,
      isEdit: false,
      treeData: [],
      treeProps: {
        label: 'name',
        children: 'sub_button',
      },
      form: {
        // 菜单的响应动作类型，view表示网页类型，click表示点击类型，miniprogram表示小程序类型
        type: '',
        // 菜单标题，不超过16个字节，子菜单不超过60个字节
        name: '',
        // 菜单KEY值，用于消息接口推送，不超过128字节
        key: '',
        // 网页 链接，用户点击菜单可打开链接，不超过1024字节。 type为miniprogram时，不支持小程序的老版本客户端将打开本url。
        url: '',
        // 调用新增永久素材接口返回的合法media_id
        media_id: '',
        // 小程序的appid（仅认证公众号可配置）
        appid: '',
        // 小程序的页面路径
        pagepath: '',
      },
      rules: {
        type: [
          {
            required: true,
            trigger: 'blur',
          }
        ],
        name: [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      },
      // 按钮类型
      buttonType: [
        {
          name: '网页',
          value: 'view'
        },
        {
          name: '点击',
          value: 'click'
        },
        {
          name: '小程序',
          value: 'miniprogram'
        },
      ]
    };
  },
  methods: {
    query() {
      let _self = this;
      ajax.get('/api/system/GetWXMenuInfo').then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          let menuStr = res.data.data;
          if (menuStr) {
            let menuData = JSON.parse(menuStr);
            if (menuData.menu && menuData.menu.button) {
              let btns = menuData.menu.button;
              if (btns) {
                _self.treeData = btns;
              }
            } else {
              _self.treeData = [];
            }
          }
        } else {
          _self.treeData = [];
        }
      });
    },
    createKey() {
      let guid = newGuid();
      this.$set(this.form, 'key', guid);
    },
    addNewMenu() {
      this.isEdit = false;
      this.currentData = null;
      this.currentNode = null;
      this.dialogTitle = '新增菜单';
      this.dialogVisible = true;
    },
    modify(data, node) {
      this.isEdit = true;
      this.currentData = data;
      this.currentNode = node;
      this.dialogTitle = '修改菜单';
      this.dialogVisible = true;

      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          this.form[key] = data[key];
        }
      }
    },
    remove(data, node) {
      let _self = this;
      _self.$confirm(`是否确定删除菜单'${data.name}'?`, '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let parent = node.parent;
          const children = parent.data.sub_button || parent.data;
          const index = children.findIndex(d => d.name === data.name);
          children.splice(index, 1);
          _self.submitData();
        })
        .catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    append(data, node) {
      this.isEdit = false;
      this.currentData = data;
      this.currentNode = node;
      this.form = {};
      this.dialogTitle = '新增菜单';
      this.dialogVisible = true;
    },
    modifyData(data, node) {
      let _self = this;
      // eslint-disable-next-line complexity
      _self.$refs['info'].validate((valid) => {
        /* eslint-disable */
        if (valid) {
          let data = {};
          for (let keyText in _self.form) {
            if (_self.form.hasOwnProperty(keyText)) {
              let valueData = _self.form[keyText];
              // if (valueData) {
              data[keyText] = valueData;
              // }
            }
          }
          if (_self.isEdit) { // 编辑
            if (_self.currentData && _self.currentNode) {
              if (_self.currentNode.parent && _self.currentNode.parent.parent) { // 二级菜单
                let parent = _self.currentNode.parent.data;
                let menu = _self.treeData.find(x => x.name === parent.name);
                if (menu.sub_button && menu.sub_button.length > 0) {
                  let sub_btn = menu.sub_button.find(x => x.name === _self.currentData.name);
                  for (let key in data) {
                    if(data.hasOwnProperty(key)) {
                      let value = data[key];
                      sub_btn[key] = value;
                    }
                  }
                }
              } else { // 一级菜单
                let menu = _self.treeData.find(x => x.name === _self.currentData.name);
                if (menu) {
                  // eslint-disable-next-line max-depth
                  for (let key in data) {
                    // eslint-disable-next-line max-depth
                    if (data.hasOwnProperty(key)) {
                      let value = data[key];
                      menu[key] = value;
                    }
                  }
                }
              }
            }
          } else { // 新增
            if (_self.currentData && _self.currentNode) {
              if (_self.currentNode.parent && _self.currentNode.parent.data) { // 二级菜单
                let menu = _self.treeData.find(x => x.name === _self.currentData.name);
                if (menu) {
                  if (!menu.sub_button) {
                    menu.sub_button = [];
                  }
                  menu.sub_button.push(data);
                }
              }
            } else {
              _self.treeData.push(data);
            }
          }
          _self.dialogVisible = false;
          _self.resetForm();
          _self.submitData();
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs['info'].resetFields();
      console.log('resetFields');
    },
    dialogClose() {
      this.resetForm();
    },
    // 提交
    submitData() {
      let _self = this;
      if (_self.treeData && _self.treeData.length > 0) {
        let postData = {};
        postData.button = _self.treeData;
        ajax.post('/api/system/CreateWXMenu', postData).then(res => {
          if (res.status === 200 && res.data.code === 0) {
            let resultStr = res.data.data;
            let resultData = JSON.parse(resultStr);
            if (resultData.errcode === 0) {
              _self.$message({
                type: 'success',
                message: '操作成功'
              });
            } else {
              _self.$alert('出错了：' + resultData.errmsg);
            }
            _self.query();
          } else {
            _self.query();
            console.error(res.data);
          }
        });
      } else {
        _self.$alert('暂无无可提交的数据');
      }
    },
    // 清空菜单
    clearMenu() {
      let _self = this;
      _self.$confirm(`您确定清空所有菜单吗?`, '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          ajax.get('/api/system/DelWXMenuInfo').then(res => {
            if (res.status === 200 && res.data.code === 0) {
              let resultData = res.data.data;
               if (resultData.errcode === '0') {
                  _self.$message({
                  type: 'success',
                  message: '删除成功'
               });
              } else {
                _self.$alert('出错了：' + resultData.errmsg);
              }
              _self.query();
            }
          });
        })
        .catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    }
  },
  created() {
    this.query();
  }
};
</script>
<style lang="less" scoped>
 .btn-Wrapper {
   text-align: center;
 }
</style>

