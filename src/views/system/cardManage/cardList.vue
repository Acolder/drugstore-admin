<template>
  <div id="cardList">
    <!-- 查询栏 -->
    <div class="search-wrapper">
      <el-form :inline="true" :model="screenInfo" size="small" >
        <el-form-item label="用户昵称:">
          <el-input v-model="screenInfo.name" placeholder="请输入用户昵称" clearable ></el-input>
        </el-form-item>
        <el-form-item label="标题:">
          <el-input v-model="screenInfo.content" placeholder="请输入标题" clearable ></el-input>
        </el-form-item>
        <el-form-item label="所属分类:">
          <el-select v-model="screenInfo.type" placeholder="请选择" clearable >
            <el-option v-for="(item, index) in CategoryArr" :key="index" :label="item.title" :value="item.section_id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete" >清 除</el-button>
          <el-button type="primary" @click="query" icon="el-icon-search" >查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 帖子列表表格 -->
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%"
        :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :select-all="selectALL"
        :select-change="selectChange" :select-group-change="selectGroupChange" @on-custom-comp="customCompFunc" ></v-table>
    </div>
    <!-- 分页器 -->
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total"
        :page-size="screenInfo.pageSize" :page-index="screenInfo.pageIndex"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']" >
      </v-pagination>
    </div>
    <!--  请选择需要的资讯  -->
    <el-dialog title="请选择需要的资讯" :visible.sync="informationShow" :modal-append-to-body="false" :append-to-body="true" width="1300px" center>
      <iframe :src="informationURL" frameborder="0" style="width:100%;height:600px;"></iframe>
    </el-dialog>
    <!--  请选择置顶页面  -->
    <el-dialog :title="topTitle" :visible.sync="topShow" :modal-append-to-body="false" :append-to-body="true" width="330px" center>
      <el-form size="small" label-width="80px" >
        <div class="stick" v-if="topRowData.is_home_top === 0 && topRowData.is_section_top === 0">
          <el-button plain class="stick_button" @click="setTop(0)" >大厅置顶</el-button>
          <el-button plain class="stick_button" @click="setTop(1)" >议堂置顶</el-button>
        </div>
        <div class="stick" v-else-if="topRowData.is_home_top === 1 && topRowData.is_section_top === 0">
          <el-button type="primary" class="stick_button gl" @click="setTop(2)" >取消大厅置顶</el-button>
          <el-button plain class="stick_button" @click="setTop(1)" >议堂置顶</el-button>
        </div>
        <div class="stick" v-else-if="topRowData.is_home_top === 0 && topRowData.is_section_top === 1">
          <el-button plain class="stick_button" @click="setTop(0)" >大厅置顶</el-button>
          <el-button type="primary" class="stick_button gl" @click="setTop(3)">取消议堂置顶</el-button>
        </div>
        <div class="stick" v-else-if="topRowData.is_home_top === 1 && topRowData.is_section_top === 1">
          <el-button type="primary" class="stick_button gl" @click="setTop(2)" >取消大厅置顶</el-button>
          <el-button type="primary" class="stick_button gl" @click="setTop(3)" >取消议堂置顶</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!--  帖子详情  -->
    <el-dialog :title="detailData.subject" :visible.sync="detailShow" :modal-append-to-body="false" :append-to-body="true" width="800px" center >
      <el-form size="small" label-width="80px" >
        <div class="post_detail">
          <!-- 帖子内容和图片 -->
          <p> &nbsp; &nbsp; &nbsp; {{detailData.body}}</p>
          <el-form-item class="images">
            <uploadImg :imgUrl="detailData.images" :fileName="'images'"></uploadImg>
            <el-input class="left" type="hidden" v-model="detailData.images"></el-input>
          </el-form-item>
          <h2>评论</h2>
          <div class="user_comment" v-if="this.commentData.length !== 0">
            <li v-for="(item, index) in commentData" :key="index">
              <!-- 用户头像 -->
              <i><img :src="item.photo_path" alt=""></i>
              <!-- 用户呢称和评论回复 -->
              <div class="user_right">
                <h3>{{item.nickname}}</h3>
                <span class="comment_time">{{item.create_time|time}}</span>
                <p class="comment_content">{{item.body}}</p>
                <div class="replay" v-for="(active, index) in item.replylist" :key="index">
                  <em>{{active.user_nickname}} </em>回复 <b>{{item.nickname}} :</b> {{active.body}} <span class="comment_time beforeTime">{{active.create_time|time}}</span>
                </div>
              </div>
            </li>
          </div>
          <div v-else  class="user_comment">
            <span class="comment_none">该帖子暂无评论~</span>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import uploadImg from '@/components/upload/uploadImg';
import { goodTime } from './js/handelTime.js';
export default {
  filters: {
    time: function (value) {
      return goodTime(value);
    },
  },
  data() {
    return {
      total: 0,
      selection: [],
      tableData: [],
      screenInfo: {
        name: '',
        content: '',
        type: '',
        pageIndex: 1,
        pageSize: 10
      },
      CategoryArr: [],   // 所属分类
      detailShow: false,  // 帖子详情
      topShow: false,   // 帖子置顶
      setTopId: '',    // 需要置顶的帖子ID
      detailData: [],
      commentData: [],
      topTitle: '',
      topRowData: '',
      recommendRowData: '',
      informationShow: false,
      recommendData: {
        id: '',
        categoryid: '',
        categoryname: '',
      },
      recommendTitle: '',
      informationURL: `${process.env.WEB_HOST}/cardManage/newInformationComponent?limit=1&index=`,
      imgPic: '',
    };
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        { width: 40, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 20, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.pageIndex - 1) * _self.screenInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'nickname', title: '用户昵称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'section', title: '所属分类', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'subject', title: '标题', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'images', title: '图片', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'browse_count', title: '浏览量', width: 30, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'reply_count', title: '评论', width: 30, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'share_count', title: '分享', width: 30, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'star_count', title: '赞', width: 30, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'collect_count', title: '收藏', width: 30, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'is_deleted', title: '状态', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'create_time', title: '发布时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'option', title: '操作', width: 250, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-cardList', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 2) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'images') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              let img = value.split(',');
              return `<a href="javascript:previewImg('${img[0]}');"><img src="${img[0]}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            }
          };
        }
        if (item.field === 'is_deleted') {  // 帖子状态
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === false) {
              return '正常';
            } else {
              return '已删除';
            }
          };
        }
      }
      return columns;
    },
  },
  components: {
    'uploadImg': uploadImg,
  },
  methods: {
    // 自定义图片弹窗
    previewImg(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        distinguishCancelAndClose: false,
        customClass: 'reviewImg',
        showConfirmButton: false,
        closeOnPressEscape: true,
        closeOnClickModal: true
      });
    },
    // 清除搜索栏
    clean() {
      this.screenInfo.name = '';
      this.screenInfo.content = '';
      this.screenInfo.type = '';
      this.getTable();
    },
    // 搜索栏查询功能
    query() {
      this.screenInfo.pageIndex = 1;
      this.getTable();
    },
    // 删除帖子功能
    remove(id) {
      ajax.get(`/api/news/DelPostInfoByid?id=` + id).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.getTable();
        }
      });
    },
    // 查看帖子详情
    seeDetail(id) {
      ajax.get(`/api/news/GetPostInfoByid?id=` + id).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.detailData = res.data.data;
        }
      });
    },
    // 帖子详情评论
    seereplyDetail(id) {
      let param = {
        post_id: id,
        pageindex: 1,
        pagesize: 10
      };
      ajax.post(`/api/news/getPostReplyList`, param).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.commentData = res.data.data;
        }
      });
    },
    // 帖子置顶
    setTop(id) {
      let param = {
        id: this.setTopId,
        top: '',
        value: ''
      };
      if (id === 0) {   // 大厅置顶
        param.top = 0;
        param.value = 1;
      } else if (id === 1) {  // 议堂置顶
        param.top = 1;
        param.value = 1;
      } else if (id === 2) {  // 取消大厅置顶
        param.top = 0;
        param.value = 0;
      } else if (id === 3) {  // 取消议堂置顶
        param.top = 1;
        param.value = 0;
      }
      ajax.get(`/api/news/UpdatePostToTopByid`, { params: param }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.topShow = false;
          this.getTable();
        }
      });
    },
    // 判断点击的操作是哪一个，对应执行
    customCompFunc(params) {
      if (params.type === 'detail') {  // 查看详情
        this.detailShow = true;
        this.seeDetail(params.rowData.post_id);
        this.seereplyDetail(params.rowData.post_id);
      } else if (params.type === 'remove') {  // 删除
        if (params.rowData.is_deleted === false) {
          this.$confirm('是否删除该帖子?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.remove(params.rowData.post_id);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        } else {
          this.$message({
            type: 'warning',
            message: '该帖子为已删除状态'
          });
        }
      } else if (params.type === 'top') { // 置顶
        if (params.rowData.is_deleted === false) {
          this.topShow = true;
          this.setTopId = params.rowData.post_id;
          this.topRowData = params.rowData;
          if (this.topRowData.is_home_top === 0 && this.topRowData.is_section_top === 0) {
            this.topTitle = '请选择置顶页面';
          } else {
            this.topTitle = '请选择取消置顶页面';
          }
        } else {
          this.$message({
            type: 'warning',
            message: '该帖子为已删除状态，不能进行置顶操作'
          });
        }
      }
    },
    // 获取帖子列表数据
    getTable() {
      let _self = this;
      let param = _self.screenInfo;
      ajax.get(`/api/news/GetPostInfo`, { params: param }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.tableData = res.data.data;
          _self.total = res.data.recordscount;
        }
      });
    },
    // 获取分类
    getCatecory() {
      let _self = this;
      let param = {
        pageIndex: 1,
        pageSize: 100
      };
      ajax.get(`/api/news/GetPostSectionInfo`, { params: param }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          _self.CategoryArr = res.data.data;
        }
      });
    },
    pageChange(pageIndex) {
      this.screenInfo.pageIndex = pageIndex;
      this.getTable();
    },
    pageSizeChange(pageSize) {
      this.screenInfo.pageIndex = 1;
      this.screenInfo.pageSize = pageSize;
      this.getTable();
    },
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    },
    // 选择介绍资讯
    selectNewList(data, proudctNum) {
      let _self = this;
      setTimeout(function() {
        if (data.length === 1 && proudctNum === true) {
          _self.recommendData.categoryid = data[0].categoryid;
          _self.recommendData.categoryname = data[0].categoryname;
          _self.$set(_self.recommendData, 'name', data[0].categoryname);
          _self.informationShow = false;
        } else if (data === false) {
          _self.informationShow = false;
        } else {
          _self.$message({
            type: 'warning',
            message: '该资讯只能选择一个，请重试',
          });
        }
      }, 50);
    },
  },
  created() {
    this.getTable();
    this.getCatecory();
    window.selectNewList = this.selectNewList;
    window.previewImg = this.previewImg;
  }
};
</script>
<style lang="less" scoped>
h2,h3{
  font-weight: normal;
  font-size: 16px;
}
// 帖子置顶弹窗
.stick {
  width: 100%;;
  height: 120px;
  text-align: center;
  /deep/ .el-button {
    padding: 0;
    margin-left: 0px;
  }
  .stick_button {
    margin-bottom: 15px;
    width: 150px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-radius: 5px;
  }
}
.form-button-wrapper {
  text-align: center;
  margin: 15px 0 0 -80px;
}
// 帖子详情
.post_detail{
  h2{
    height: 30px;
    line-height: 30px;
  }
  img{
    display: inline-block;
    margin-right: 10px;
    width: 50px;
    height: 50px;
  }
  /deep/ .upload-wrapper{
    margin-left: -80px;
  }
  /deep/ .el-icon-close{
    display: none;
  }
  .user_comment{
    // width: 400px;
    background: #f5f5f5;
    padding: 30px 10px 8px;
    li{
      border-bottom: 1px solid #ccc;
      padding-bottom: 8px;
      position: relative;
      margin-top: 10px;
      i{
        display: inline-block;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .user_right{
        // display: inline-block;
        margin-left: 40px;
        h3{
          font-size: 14px;
          line-height: 14px;
        }
        span{
          font-size: 12px;
          color:#ccc;
        }
        .beforeTime{
          position: absolute;
          right: 10px;
        }
        p{
          line-height: 20px;
        }
        .replay{
          margin: 5px 0 15px 0;
          padding: 7px 50px 7px 8px;
          background: #fff;
          font-size: 10px;
          position: relative;
          em{
            color:#0099FF;
          }
        }
      }
    }
  }
  .comment_none{
    display: block;
    margin: -10px 0 10px;
    font-size: 16px;
    text-align: center;
  }
}
.detailTitle{
  cursor: pointer;
}
</style>
