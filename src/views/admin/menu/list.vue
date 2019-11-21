/* eslint-disable max-nested-callbacks */
<template>
  <div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="append">菜单</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="query">刷新</el-button>
        <!-- <el-button type="default" size="small" icon="el-icon-upload2" @click="generateMenus">生成菜单</el-button> -->
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <el-tree :props="treeProps" :data="treeData" node-key="menuId" :default-expanded-keys="defaultExpandedKeys" :expand-on-click-node="false">
        <span slot-scope="{ node, data }">
          <i class="iconfont" :class="data.icon?data.icon:'icon-file'"></i>
          <span>{{data.sort}}-{{data.title}}</span>
          <span style="margin-left:15px;">
            <el-button type="text" size="small" @click="() => modify(data)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button type="text" size="small" @click="() => remove(data,node)">
              <i class="el-icon-delete"></i>
            </el-button>
            <el-button type="text" size="small" @click="() => append(data)">
              <i class="el-icon-plus"></i>
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="closeDialog" width="600px" :center="true" :modal-append-to-body="false" :append-to-body="true" :close-on-click-modal="false">
      <menuInfo ref="menuInfo" :operation="operation" @formSubmitSuccess="formSubmitSuccess"></menuInfo>
    </el-dialog>
  </div>
</template>
<script>
import javaRequest from '@/utils/javaApiRequest';
import menuInfo from './menuInfo';
import { systemRouterMap, mallRouterMap, consultRouterMap, adminRouterMap } from '@/router';
export default {
  data() {
    return {
      dialogTitle: '新增菜单',
      dialogVisible: false,
      treeProps: {
        label: 'title',
        children: 'child',
      },
      treeData: [],
      defaultExpandedKeys: [],
      // 操作枚举 1:新增,2:编辑
      operationEnum: { append: 1, edit: 2 },
      operation: 1,
    };
  },
  components: {
    'menuInfo': menuInfo
  },
  methods: {
    query() {
      let _self = this;
      let url = `/mall_manage/back/queryMenuList`;
      let postData = {
        pageIndex: 0,
        pageSize: 500,
      };
      javaRequest.post(url, postData).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          let data = res.data.resultData;
          _self.treeData = data;
          if (data && data.length > 0) {
            _self.defaultExpandedKeys.push(data[0].menuId);
          }
        }
      });
    },
    append(data) {
      let _self = this;
      _self.dialogTitle = '新增菜单';
      _self.operation = _self.operationEnum.append;
      _self.dialogVisible = true;
      if (data) {
        setTimeout(() => {
          _self.$refs.menuInfo.setFormData(data);
        }, 500);
      }
    },
    modify(data) {
      let _self = this;
      _self.dialogTitle = '编辑菜单-' + data.title;
      _self.operation = _self.operationEnum.edit;
      _self.dialogVisible = true;
      if (data) {
        setTimeout(() => {
          _self.$refs.menuInfo.setFormData(data);
        }, 500);
      }
    },
    remove(data, node) {
      let _self = this;
      _self.$confirm(`是否确定永久删除菜单'${data.title}'?`, '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let postData = {
            menuIds: data.menuId
          };
          javaRequest.post('/mall_manage/back/deleteMenu', postData).then((res) => {
            if (res.status === 200 && res.data.resultCode === '0') {
              _self.$message({
                message: '删除成功',
                type: 'success'
              });
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
    },
    closeDialog() {
      this.$refs.menuInfo.resetForm();
    },
    formSubmitSuccess() {
      this.dialogVisible = false;
      this.query();
    },
    generateMenus() {
      let _self = this;
      _self.$confirm('是否确定生成菜单？', '提示').then(() => {
        let navs = [
          { name: 'system', title: '平台管理', routers: systemRouterMap },
          { name: 'mall', title: '电商中心', routers: mallRouterMap },
          { name: 'consult', title: '问诊管理', routers: consultRouterMap },
          { name: 'admin', title: '系统设置', routers: adminRouterMap },
        ];
        navs.forEach((item) => {
          let menu = {
            name: item.name,
            title: item.title,
            show: '1',
            component: '',
            path: '',
            redirect: '',
          };
          _self.insertMenu(menu).then((res) => {
            if (res.status === 200 && res.data.resultCode === '0') {
              console.log(`>${menu.title}--已添加`);
              _self.query();
              let menu_id = res.data.resultData;
              if (item.routers) {
                for (let i = 0; i < item.routers.length; i++) {
                  let route = item.routers[i];
                  if (route.meta) {
                    let show = route.meta.show === false ? '0' : '1';
                    let componentPath = route.component.__file;
                    componentPath = componentPath.replace(new RegExp(/(\\)/g), '/');
                    componentPath = componentPath.replace('src/views/', '');
                    let m1 = {
                      parentId: menu_id,
                      parentName: menu.name,
                      name: route.name,
                      title: route.meta.title,
                      show: show,
                      path: route.path,
                      redirect: route.redirect,
                      component: componentPath,
                    };
                    /* eslint-disable */
                    _self.insertMenu(m1).then((rs) => {
                      if (rs.status === 200 && rs.data.resultCode === '0') {
                        console.log(`>>${m1.title}--已添加`);
                        _self.query();
                        let m1_id = rs.data.resultData;
                        if (route.children!== undefined && route.children.length > 0) {
                          for (let j = 0; j < route.children.length; j++) {
                            let child = route.children[j];
                            if (child.meta) {
                              let show2 = child.meta.show === false ? '0' : '1';
                              let componentPath2 = child.component.__file;
                              componentPath2 = componentPath2.replace(new RegExp(/(\\)/g), '/');
                              componentPath2 = componentPath2.replace('src/views/', '');
                              componentPath2 = componentPath2.replace('.vue', '');
                              let m2 = {
                                parentId: m1_id,
                                parentName: m1.name,
                                name: child.name,
                                title: child.meta.title,
                                show: show2,
                                path: child.path,
                                redirect: child.redirect,
                                component: componentPath2,
                              };
                              console.info(m2);
                              _self.insertMenu(m2).then((r) => {
                                if (r.status === 200 && r.data.resultCode === '0') {
                                   console.log(`>>>${m2.title}--已添加`);
                                   _self.query();
                                }
                              });
                            }
                          }
                        }
                      }
                    });
                  }
                }
              }
            }
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作',
        });
      });
    },
    insertTreeMenu(menu, parentId, parentName) {
      console.log(1);
    },
    insertMenu(menuData) {
      return javaRequest.post('/mall_manage/back/insertMenu', menuData);
    },
  },
  created() {
    this.query();
  }
};
</script>
<style lang="less" scoped>
@import url("../../layout/iconfont/iconfont.css");
</style>

