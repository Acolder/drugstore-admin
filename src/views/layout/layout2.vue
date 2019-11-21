<template>
  <div class="layout">
    <el-container class="container-wrapper">
      <el-header class="header-wrapper box-shadow">
        <transition name="el-fade-in">
          <div
            class="logo-wrapper"
            :class="!sidebarStatus?'collapse':''"
          >
            <i
              v-if="sidebarStatus===false"
              class="iconfont icon-browser"
            ></i>
            <span
              v-if="sidebarStatus"
              slot="title"
            >药葫芦-中控管理平台</span>
          </div>
        </transition>
        <div class="nav-wrapper">
          <div class="toggle-menu">
            <a
              href="javascript:void(0);"
              @click="toggleSidebar"
            >
              <span class="iconfont icon-menu"></span>
            </a>
          </div>
          <el-menu
            @select="selectNav"
            :unique-opened="true"
            :default-active="activeNavName"
            class='menu-list'
            mode="horizontal"
            background-color="#fff"
            text-color="#363f44"
            active-text-color="#7266ba"
          >
            <el-menu-item
              v-for="(item,index) in navs"
              :key="item.name"
              :index="item.name"
              :tabindex="index"
            > {{item.title}}</el-menu-item>
          </el-menu>
        </div>
        <div class="user-wrapper">
          <el-dropdown>
            <span class="el-dropdown-link">
              <img
                class="user-icon"
                :src="avatar?avatar:defaultAvatar"
              />
              <span class="user-name">{{name}}</span>
              <!--<i class="el-icon-arrow-down el-icon--right"></i>-->
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="c"
                @click.native="modifyPassword"
              >修改密码</el-dropdown-item>
              <el-dropdown-item
                command="d"
                divided
                @click.native="logout"
              >注销</el-dropdown-item>
              <el-dropdown-item
                command="e"
                divided
                @click.native="logout"
              >退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container class="content-wrapper">
        <el-aside
          class="sidebar-wrapper"
          width="200px"
        >
          <transition name="el-fade-in">
            <el-menu
              :collapse="!sidebarStatus"
              :default-openeds="menu_default_opens"
              background-color="#3a3f51"
              text-color="#b4b6bd"
              active-text-color="#fff"
            >
              <!-- <el-menu-item
                index="'home'"
                class="home-menu"
                @click="homePage"
              >
                <i class="iconfont icon-home"></i>
                <span slot="title">系统首页</span>
              </el-menu-item> -->
              <template v-for="(item1, index1) in routers">
                <template v-if="item1.children&&item1.children.length>0&&item1.meta&&item1.meta.show!==false">
                  <!--一级菜单 有子菜单-->
                  <el-submenu
                    :key="index1"
                    :index="index1.toString()"
                  >
                    <template slot="title">
                      <i
                        class="iconfont"
                        :class="item1.icon?item1.icon:'icon-sitting'"
                      ></i>
                      <span slot="title">{{item1.meta.title}}</span>
                    </template>

                    <template v-for="(item2, index2) in item1.children">
                      <!--二级菜单 有子菜单-->
                      <template v-if="item2.children&&item2.children.length>0&&item2.meta&&item2.meta.show!==false">
                        <el-submenu
                          :key="index2"
                          :index="index1.toString()+'-'+index2.toString()"
                        >
                          <template>
                            <span slot="title">{{item2.meta.title}}</span>
                          </template>
                          <!--三级菜单-->
                          <el-menu-item
                            @click="menuClick(item3,item2.path+'/'+item3.path)"
                            v-for="(item3,index3) in item2.children"
                            :key="index3"
                            :index="index1.toString()+'-'+index2.toString()+'-'+index3.toString()"
                            v-if="item3.meta&&item3.meta.show!==false"
                          >{{item3.meta.title}}</el-menu-item>
                        </el-submenu>
                      </template>

                      <template v-else>
                        <!--二级菜单 没有子菜单-->
                        <el-menu-item
                          @click="menuClick(item2,item2.path)"
                          :key="index2"
                          :index="index1.toString()+'-'+index2.toString()"
                          v-if="item2.meta&&item2.meta.show!==false"
                        >
                          <i
                            class="iconfont"
                            :class="item2.icon?item2.icon:'icon-file'"
                          ></i>
                          <span slot="title">{{item2.meta.title}}</span>
                        </el-menu-item>
                      </template>
                    </template>
                  </el-submenu>
                </template>

                <template v-else>
                  <!--一级菜单 无子菜单-->
                  <el-menu-item
                    :key="index1"
                    v-if="item1.meta&&item1.meta.show!==false"
                    :index="index1.toString()"
                    @click="menuClick(item1,item.path)"
                  >
                    <i class="iconfont" :class="item1.icon?item1.icon:'icon-sitting'"></i>
                    <span slot="title">{{item1.meta.title}}</span>
                  </el-menu-item>
                </template>
              </template>
            </el-menu>
          </transition>
        </el-aside>
        <el-container class="main-wrapper">
          <el-header height="37px">
            <div v-if="visitedViews&&visitedViews.length>0">
              <el-tabs
                v-model="tabValue"
                type="card"
                @tab-click="tabClick"
                @tab-remove="tabRemove"
                closable
              >
                <el-tab-pane
                  v-for="(item) in visitedViews"
                  :key="item.name"
                  :label="item.title"
                  :name="item.name"
                >
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-header>
          <el-main>
            <section class="app-main">
              <transition
                name="fade"
                mode="out-in"
              >
                <keep-alive :include="cachedViews">
                  <router-view></router-view>
                </keep-alive>
              </transition>
            </section>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex';
// import store from './store';
import redirectConfirmList from './redirectConfirm.js';
export default {
  data() {
    return {
      defaultAvatar: 'https://uploads.kangmei.com.cn/ue/upload/image/20181115/6367789443797124333888755.jpg',
      routers: [],
      menu_default_opens: ['0'],
      userId: 'userid',
      user: ''
    };
  },
  computed: {
    ...mapGetters([
      'sidebarStatus',
      'navs',
      'name',
      'mobile',
      'avatar',
      'permissions',
      'visitedViews',
      'cachedViews',
      'activeNavName'
    ]),
    tabValue: {
      get: function () {
        return this.$store.state.app.tabValue;
      },
      set: function (tabValue) {
        this.$store.state.app.tabValue = tabValue;
      }
    },
  },
  watch: {
    '$route': 'appendCurrentTab',
  },
  methods: {
    ...mapActions([
      'userLogOut',
      'getUserInfo',
      'modifyPassword'
    ]),
    // 修改密码
    modifyPassword() {
      // console.log(1);
      let _self = this;
      // _self.modifyPassword().then(() => {
      console.log(1);
      // _self.$router.push('/modifyPassword');
      _self.$router.push({
        path: '/modifyPassword',
        query: {
          id: this.user,
        }
      });
      // });
    },
    // 退出登录
    logout() {
      let _self = this;
      _self.userLogOut().then(() => {
        _self.$router.push('/login');
      });
    },
    toggleSidebar() {
      this.$store.dispatch('toggleSidebar');
    },
    // 顶部tab选择
    selectNav(key, keyPath) {
      this.loadRouters(key);
      this.$store.dispatch('setActiveNavName', key);
    },
    homePage() {
      this.$router.push('/home/index');
    },
    // load routers by nav name
    loadRouters(navName) {
      let promission = this.permissions.find((n) => n.name === navName);
      if (promission) {
        this.routers = promission.routers;
      }
    },
    // 点击菜单
    menuClick(menu, path) {
      let _self = this;
      let data = {
        name: menu.name,
        path: menu.path,
        meta: {
          title: menu.meta.title
        },
        query: menu.query
      };
      let currentRouteName = _self.$route.name;
      let rc = redirectConfirmList.find((x) => x.routeName === currentRouteName);
      if (rc) {
        _self.$confirm(rc.message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.$store.dispatch('addVisitedViews', data);
          _self.tabValue = data.name;
          _self.$router.push({
            path: path
          });
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '操作已取消'
          });
        });
      } else {
        _self.$store.dispatch('addVisitedViews', data);
        _self.tabValue = data.name;
        _self.$router.push({
          path: path
        });
      }
    },
    // tab点击
    tabClick(tab) {
      let _self = this;
      let tabname = tab.name;
      let view = _self.visitedViews.find((x) => x.name === tabname);
      let currentRouteName = _self.$route.name;
      let rc = redirectConfirmList.find((x) => x.routeName === currentRouteName);
      if (rc) {
        _self.$confirm(rc.message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (view) {
            _self.$router.push({
              path: view.path,
              query: view.query
            });
          }
        }).catch(() => {
          _self.tabValue = currentRouteName;
          _self.$message({
            type: 'info',
            message: '操作已取消'
          });
        });
      } else {
        if (view) {
          _self.$router.push({
            path: view.path,
            query: view.query
          });
        }
      }
    },
    // tab 关闭
    tabRemove(name) {
      let _self = this;
      if (_self.visitedViews.length > 1) {
        let tab = _self.visitedViews.find((x) => x.name === name);
        _self.$store.dispatch('delVisitedViews', tab).then((res) => {
          let current = res.pop();
          _self.$router.push({
            path: current.path
          });
        });
      } else {
        _self.$message({
          message: '最后一个标签不能删除',
          center: true
        });
      }
    },
    // 刷新页面时添加当前页面tab信息
    appendCurrentTab() {
      let data = {
        name: this.$route.name,
        path: this.$route.path,
        meta: {
          title: this.$route.meta.title
        },
        query: this.$route.query
      };
      this.$store.dispatch('addVisitedViews', data);
      this.tabValue = data.name;
    },
  },
  mounted() {
    this.loadRouters(this.activeNavName);
    this.user = sessionStorage.getItem(this.userId);
  },
  created() {
    this.appendCurrentTab();
  }
};
</script>

<style lang="less" scoped>
@import url("./iconfont/iconfont.css");
@header-height: 50px;
@header-fontColor: #363f44;
@sidebar-bgcolor: #3a3f51;
@sidebar-collapse-width: 60px;
.foot {
  // position: relative;
  // bottom: 0;
  // left: 0;
  // right: 0;
  // margin-top: 60px;
  padding: 10px 0;
  text-align: center;
  border-top: 1px solid #ccc;
  p {
    margin-top: 20px;
  }
}

.layout {
  height: 100%;
}

.app-wrapper {
  clear: both;
  position: relative;
  height: 100%;
  width: 100%;
}

.container-wrapper {
  height: 100%;
  width: 100%;
}

.header-wrapper {
  height: @header-height!important;
  padding: 0;
  overflow: hidden;
  background-color: #fff;
  .logo-wrapper {
    background-color: #3a3f51 !important;
    height: @header-height;
    width: 200px;
    float: left;
    padding: 0 20px;
    line-height: @header-height;
    // border-bottom: 1px solid #2e3344;
    font-weight: 800;
    &.collapse {
      width: @sidebar-collapse-width!important;
    }
    i,
    span {
      color: #fff !important;
    }
    vertical-align: middle;
    a {
      color: #363f44;
      font-size: 18px;
      font-weight: bold;
    }
  }
  .nav-wrapper {
    height: @header-height;
    float: left;
    .toggle-menu {
      width: 50px;
      float: left;
      padding: 15px;
      a {
        font-size: 20px;
        color: @header-fontColor;
      }
    }
    .menu-list {
      height: @header-height;
      float: left;
      margin-left: 30px;
      /deep/.el-menu-item {
        height: @header-height!important;
        line-height: @header-height!important;
        // border:none;
      }
    }
  }
  .search-wrapper {
    float: left;
    max-width: 300px;
  }
  .user-wrapper {
    height: @header-height;
    padding: 5px 20px 5px 20px;
    float: right;
    text-align: right;
    .xinxi {
      float: left;
      line-height: 40px;
      font-size: 30px;
      color: @header-fontColor;
      cursor: pointer;
    }
    .shezhi {
      float: left;
      line-height: 40px;
      font-size: 30px;
      color: @header-fontColor;
      cursor: pointer;
    }
    .el-dropdown {
      min-width: 180px;
      line-height: 40px;
      color: @header-fontColor;
      .user-name {
        float: right;
        min-width: 120px;
        padding-right: 8px;
        padding-left: 8px;
        text-align: right;
        overflow: hidden;
      }
      .user-icon {
        float: right;
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
  }
}

.content-wrapper {
  position: fixed;
  top: 50px;
  left: 0;
  height: 100%;
  width: 100%;
}

.sidebar-wrapper {
  width: auto !important;
  transition: width 0.28s;
  border-right: solid 1px #e6e6e6;
  background-color: @sidebar-bgcolor;
  padding-bottom: 50px;
  font-weight:800;
  .el-menu {
    width: 200px;
    border: none;
    &.el-menu--collapse {
      width: @sidebar-collapse-width !important;
    }
    .home-menu {
      background-color: @sidebar-bgcolor!important;
      // height: 50px !important;
      // line-height: 50px !important;
      // border-bottom: 1px solid #2e3344;
      &:hover {
        i,
        span {
          color: #fff !important;
        }
      }
    }
    .iconfont {
      margin-right: 5px;
    }
    .el-submenu {
      // /deep/.el-submenu__title {
      //   border-bottom: 1px solid #2e3344;
      //   height: 50px !important;
      //   line-height: 50px !important;
      // }
      /deep/.el-menu {
        .el-menu-item {
          background-color: #2e3344 !important;
          // height: 50px !important;
          // line-height: 50px !important;
          i,
          span {
            color: #b4b6bd !important;
          }
          &:hover {
            background-color: #2e3344 !important;
            i,
            span {
              color: #fff !important;
            }
          }
        }
        .el-menu-item.is-active {
          background-color: #2e3344 !important;
          i,
          span {
            color: #43d967 !important;
          }
        }
      }
    }
    .el-submenu:hover {
      background-color: #2e3344 !important;
      /deep/ .el-submenu__title {
        i,
        span {
          color: #fff !important;
        }
      }
    }
    .el-submenu.is-opened {
      /deep/ .el-submenu__title {
        background-color: #32374a !important;
        // border-bottom: 1px solid #32374a;
        i,
        span {
          color: #fff !important;
        }
      }
    }
    .el-submenu.is-active {
      /deep/ .el-submenu__title {
        // background-color: #564aa3 !important;
        // border-bottom: 1px solid #2e3344;
        i,
        span {
          color: #fff !important;
        }
      }
    }
  }
  .el-menu--collapse {
    width: auto !important;
  }
}

.main-wrapper {
  padding: 0;
  @tabs-height: 35px;
  .el-header {
    padding: 0;
    height: @tabs-height;
    overflow: hidden;
    .el-tabs {
      height: @tabs-height;
      margin-top: 6px;
      /deep/ .el-tabs__header {
        background-color: #fff;
        // border: none;
        padding: 0 10px;
        .el-tabs__nav-prev,
        .el-tabs__nav-next {
          height: 30px;
          line-height: 30px;
        }
        .el-tabs__item {
          // margin: 0 10px 0 0;
          height: 30px;
          line-height: 30px;
          // border: 1px solid #dcdfe6;
          &.is-active {
            color: #43d967;
            background-color: #fff;
            border-bottom-color: #fff;
          }
        }
      }
      /deep/ .el-tabs__content {
        padding: 0;
      }
    }
  }
  .el-main {
    height: 100%;
    background-color: #fff;
    .app-main {
      height: 100%;
    }
  }
}

.box-shadow {
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(0, 0, 0, 0.05);
}
</style>

