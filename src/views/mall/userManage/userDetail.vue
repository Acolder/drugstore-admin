<template>
  <div class="userDetails">
    <div class="userInfo">
      <table width="1100" border=1 cellspacing="0" align="center" class="tableList">
        <tr>
          <td rowspan="3" class="headPhoto"><img class="user-icon" :src="defaultAvatar" /></td>
          <td class="tdCommom">用户ID</td>
          <td>{{Resultdata.userid}}</td>
          <td class="tdCommom">性别</td>
          <td>{{Resultdata.gender}}</td>
        </tr>
        <tr>
          <td class="tdCommom">用户昵称</td>
          <td>{{Resultdata.nickname}}</td>
          <td class="tdCommom">出生日期</td>
          <td>{{Resultdata.birthday}}</td>
        </tr>
        <tr>
          <td class="tdCommom">手机号</td>
          <td>{{Resultdata.mobile}}</td>
          <td class="tdCommom">注册时间</td>
          <td>{{Resultdata.registime}}</td>
        </tr>
      </table>
    </div>
    <div class="countNews">
      <p class="count">统计信息</p>
      <div class="table-wrapper">
        <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:400px" :columns="columns" :table-data="tableData" row-hover-color="#eee"
        row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      defaultAvatar: 'https://uploads.kangmei.com.cn/ue/upload/image/20181115/6367789443797124333888755.jpg',
      tableData: [],
      Resultdata: '',
      dataNews: '',
      columns: this.getColumns(),
    };
  },
  methods: {
    getColumns() {
      let columns = [
        { field: 'consumptionamount', title: '消费金额', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'orderquantity', title: '订单数量', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'consumptionavg', title: '订单均价', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
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
        if (item.field === 'consumptionavg') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let value = rowData[field];
            if (value) {
              return value.toFixed(3);
            }
          };
        }
      }
      return columns;
    },
    // 获取用户信息
    getDetail() {

      ajax.get(`/api/userinfo/get?id=` + this.$route.query.id).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.Resultdata = res.data.data;
        }
      });
    },
    // 获取统计信息
    getdataNews() {
      ajax.get(`/api/userinfo/getorderinfo?user_id=` + this.$route.query.id).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.tableData.push(res.data.data);
        }
      });
    },
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    }
  },
  created() {
    this.getDetail();
    this.getdataNews();
  }
};
</script>

<style lang="less" scopes>
  .userInfo{
    width: 100%;
    .tableList{
      margin: 0 0 0 20px;
      .headPhoto{
        width: 150px;
        text-align: center;
      }
      tr{
        td{
          height: 40px;
          line-height: 40px;
          padding: 0 20px;
          border: 1px solid #666;
          text-align: left;
        }
        .tdCommom{
          text-align: center;
          width: 180px;
        }
      }
    }
    .user-icon {
        margin-top: 15px;
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
  }
  .countNews{
    margin: 50px 0 0 20px;
    width: 1100px;
    height: 300px;
    border: 1px solid #f3f3f3;
    border-radius: 3px 3px 0 0;
    .count{
      width: 100%;
      height:40px;
      line-height: 40px;
      padding: 0 0 0 20px;
      background-color: #f3f3f3;
      color: #666;
      font-size: 12px;
    }
    .table-wrapper{
      margin: 30px 0 0 65px;
    }
  }
</style>
