import Vue from 'vue';
// 自定义列组件
// <el-button type="primary" size="mini" plain icon="" ></el-button>
// 药品管理列表操作
Vue.component('table-operation-druglist', {
  template: `<span class="table-operation-btns"><el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="update(rowData,index)">编辑</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="viewRow(rowData,index)">预览</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-arrow-up" @click.stop.prevent="check_pass(rowData,index)">上架</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-arrow-down" @click.stop.prevent="check_reject(rowData,index)">下架</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    update() {

      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    viewRow() {

      let params = {
        type: 'view',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    check_pass() {

      let params = {
        type: 'check_pass',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    check_reject() {

      let params = {
        type: 'check_reject',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// Excel转换表操作
Vue.component('table-operation-export', {
  template: `<span class="table-operation-btns"><el-button type="primary" size="mini" plain @click.stop.prevent="down(rowData,index)">下载文件</el-button></span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    down() {

      let params = {
        type: 'down',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 补方药店列表操作
Vue.component('table-operation-RPseller', {
  template: `<span class="table-operation-btns">
  <el-button type="success" size="mini" plain @click.stop.prevent="enable(rowData,index)" v-if="rowData.enterprise_status === -1">启用药店</el-button>
  <el-button type="danger" size="mini" plain @click.stop.prevent="disables(rowData,index)" v-if="rowData.enterprise_status !== -1">禁用药店</el-button>
  <el-button type="primary" size="mini" plain @click.stop.prevent="see(rowData,index)">查看详情</el-button>
  </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    enable() {
      let params = {
        type: 'enable',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    disables() {
      let params = {
        type: 'disables',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    see() {
      let params = {
        type: 'see',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 临时商品表操作
Vue.component('table-operation-temporary', {
  template: `<span class="table-operation-btns"><el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="comparison(rowData,index)">对比</el-button></span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    comparison() {

      let params = {
        type: 'comparison',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 对比表操作
Vue.component('table-operation-contrast', {
  template: `<span class="table-operation-btns"><el-button type="primary" size="mini" plain icon="el-icon-sort" @click.stop.prevent="guideInto(rowData,index)">同步sku到商品表</el-button></span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    guideInto() {
      // 参数根据业务场景随意构造
      let params = { type: 'guideInto', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 选择数据操作
Vue.component('table-operation-selectRow', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-check" @click.stop.prevent="selectRow(rowData,index)">选择</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    selectRow() {

      let params = {
        type: 'selectRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 意见反馈列表操作
Vue.component('table-operation-feedback', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="remarks(rowData,index)">备注</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="handle(rowData,index)">处理</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    deleteRow() {

      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    remarks() {

      let params = {
        type: 'remark',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    handle() {

      let params = {
        type: 'handle',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 用户日志 错误日志 支付日志，操作日志列表操作
Vue.component('table-operations', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="readDetail(rowData,index)">查看详情</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    readDetail() {

      let params = {
        type: 'detail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 订单列表列表操作
Vue.component('table-operations-roder', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="readDetail(rowData,index)">查看详情</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="sign(rowData,index)" v-if="rowData.isTest === 0">标记为测试订单</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="signnormal(rowData,index)" v-if="rowData.isTest === 1">标记为正常订单</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    readDetail() {
      let params = {
        type: 'detail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    sign() {
      let params = {
        type: 'sign',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    signnormal() {
      let params = {
        type: 'signnormal',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 药柜订单列表操作
Vue.component('table-operations-machineorder', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="readDetail(rowData,index)">查看详情</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    readDetail() {
      let params = {
        type: 'detail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 热门关键词列表操作
Vue.component('table-operation-hotSearch', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modify(rowData,index)">修改</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    modify() {

      let params = {
        type: 'modify',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 骑手列表操作
Vue.component('table-operation-rider', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="edit(rowData,index)">编辑</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deletes(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    edit() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deletes() {
      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 商户列表操作
Vue.component('table-operation-business', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="seeInformation(rowData,index)">查看详情</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeInformation() {
      let params = {
        type: 'seeInformation',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 商户审核操作
Vue.component('table-operation-toExamine', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="seeInformation(rowData,index)">查看商户全部信息</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="toExamine(rowData,index)">审核</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeInformation() {

      let params = {
        type: 'seeInformation',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    toExamine() {

      let params = {
        type: 'toExamine',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 优惠券列表操作
Vue.component('table-operation-marke', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="seeMarke(rowData,index)">查看</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-warning" @click.stop.prevent="endMarke(rowData,index)" v-if="rowData.state === 1">结束</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="delateMarke(rowData,index)" v-if="rowData.state === 1 || rowData.state === 2">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeMarke() {
      let params = {
        type: 'seeMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    endMarke() {
      let params = {
        type: 'endMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    delateMarke() {
      let params = {
        type: 'delateMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 营销活动列表操作
Vue.component('table-operation-activit', {
  template: `<span class="table-operation-btns">
        <el-button type="success" size="mini"  icon="el-icon-search" @click.stop.prevent="seeMarke(rowData,index)">查看</el-button>
        <el-button type="danger" size="mini"  icon="el-icon-warning" @click.stop.prevent="endMarke(rowData,index)" v-if="rowData.activityState === 1">结束</el-button>
        <el-button type="danger" size="mini"  icon="el-icon-delete" @click.stop.prevent="delateMarke(rowData,index)" v-if="rowData.activityState === 1 || rowData.activityState === 2 || rowData.activityState === 3">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeMarke() {
      let params = {
        type: 'seeMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    editMarke() {
      let params = {
        type: 'editMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    endMarke() {
      let params = {
        type: 'endMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    delateMarke() {
      let params = {
        type: 'delateMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 账单列表
Vue.component('table-operation-bill', {
  template: `<span class="table-operation-btns">
        <el-button type="success" size="mini" icon="el-icon-search" @click.stop.prevent="seeOrderDetail(rowData,index)">查看明细</el-button>
        <el-button type="danger" size="mini" icon="el-icon-info" @click.stop.prevent="seeGiftDetail(rowData,index)" v-if="rowData.status === 2 && rowData.intoAccount">确认打款</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeOrderDetail() {
      let params = {
        type: 'seeOrderDetail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    seeGiftDetail() {
      let params = {
        type: 'query',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 账单明细列表
Vue.component('table-operation-billdetail', {
  template: `<span class="table-operation-btns">
        <el-button type="success" size="mini" icon="el-icon-search" @click.stop.prevent="seeOrderDetail(rowData,index)">查看结算明细</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeOrderDetail() {
      let params = {
        type: 'seeOrderDetail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 寻稀缺药
Vue.component('table-operation-tow', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="update(rowData,index)" v-show="rowData.isreply === '未回访'">填写回访</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="search(rowData,index)" v-show="rowData.isreply === '已回访'">查看回访</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modify(rowData,index)" v-show="rowData.isreply === '已回访'">修改回访</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-printer" @click.stop.prevent="copy(rowData,index)" v-show="rowData.prescriptionurl">复制</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="logistics(rowData,index)" v-show="!rowData.fastmail">填写物流</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="remarks(rowData,index)" v-show="!rowData.remark">备注</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    update() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {
      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    copy() {
      let params = {
        type: 'copy',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    logistics() {
      let params = {
        type: 'logistics',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    remarks() {
      let params = {
        type: 'remarks',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    search() {
      let params = {
        type: 'search',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    modify() {
      let params = {
        type: 'modify',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 处方药
Vue.component('table-operation-one', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-circle-check-outline" @click.stop.prevent="update(rowData,index)" v-show="rowData.isreply == '0'">更新为已读</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    update() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {
      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 推广员管理
Vue.component('table-operations-extension', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="edit(rowData,index)">修改信息</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    stop() {
      let params = {
        type: 'stop',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
      // <el-button type="danger" size="mini" plain icon="el-icon-warning" @click.stop.prevent="stop(rowData,index)" v-if="rowData.state === 1">停用</el-button>
      // <el-button type="success" size="mini" plain icon="el-icon-success" @click.stop.prevent="start(rowData,index)" v-if="rowData.state === 0">启用</el-button>
    },
    start() {
      let params = {
        type: 'start',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {
      let params = {
        type: 'deleteRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    edit() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 脉诊仪管理
Vue.component('table-operations-equipment', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="see(rowData,index)">查看信息</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="edit(rowData,index)">修改信息</el-button>
      <el-button type="danger" size="mini" plain icon="el-icon-warning" @click.stop.prevent="repair(rowData,index)" v-if="rowData.status !== 1">报修</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-view" @click.stop.prevent="useLog(rowData,index)">使用记录</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    see() {
      let params = {
        type: 'see',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
      // <el-button type="danger" size="mini" plain icon="el-icon-warning" @click.stop.prevent="stop(rowData,index)" v-if="rowData.state === 1">停用</el-button>
      // <el-button type="success" size="mini" plain icon="el-icon-success" @click.stop.prevent="start(rowData,index)" v-if="rowData.state === 0">启用</el-button>
    },
    repair() {
      let params = {
        type: 'repair',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {
      let params = {
        type: 'deleteRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    useLog() {
      let params = {
        type: 'useLog',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    edit() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 使用记录详情查看
Vue.component('table-operations-useLog', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="see(rowData,index)">查看详情</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    see() {
      let params = {
        type: 'see',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 脉诊仪借还
Vue.component('table-operations-equipmentBorrow', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="see(rowData,index)">查看详情</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-view" @click.stop.prevent="borrow(rowData,index)">使用记录</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    see() {
      let params = {
        type: 'see',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    borrow() {
      let params = {
        type: 'borrow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 脉诊仪检测记录
Vue.component('table-operations-testRecord', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="testRecord(rowData,index)">查看检测报告</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    testRecord() {
      let params = {
        type: 'testRecord',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});

// 脉诊仪借还企业合作
Vue.component('table-operations-equipmentRemarks', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain @click.stop.prevent="remarks(rowData,index)">备注</el-button>
      <el-button type="primary" size="mini" plain @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
      <el-button type="primary" size="mini" plain @click.stop.prevent="detailed(rowData,index)">详情</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    remarks() {
      let params = {
        type: 'remarks',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {
      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    detailed() {
      let params = {
        type: 'detailed',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 脉诊仪借还选择
Vue.component('table-operations-equipmentChoice', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain @click.stop.prevent="choice(rowData,index)">选择</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    choice() {
      let params = {
        type: 'choice',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 资讯列表
Vue.component('table-operation-informationList', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="update(rowData,index)">修改</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-sort-up" @click.stop.prevent="release(rowData,index)">上架</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-sort-down" @click.stop.prevent="down(rowData,index)">下架</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="seeDetail(rowData,index)">查看详情</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    update() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    release() {
      let params = {
        type: 'release',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    down() {
      let params = {
        type: 'down',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {
      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    seeDetail() {
      let params = {
        type: 'seeDetail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 评论管理
Vue.component('table-operation-comment', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="update(rowData,index)">编辑</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteComment(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    update() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteComment() {
      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 药品专题
Vue.component('table-operation-drug', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="update(rowData,index)">修改</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    update() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {
      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 商品分类列表
Vue.component('table-operation-class', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="update(rowData,index)">修改</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    update() {

      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 轮播管理列表
Vue.component('table-operation-swiper', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modify(rowData,index)">修改</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="goodsDetail(rowData,index)">查看详情</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteSwiper(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    goodsDetail() {

      let params = {
        type: 'goodsDetail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    modify() {

      let params = {
        type: 'modify',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteSwiper() {

      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 业务员列表
Vue.component('table-operation-salesmanList', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="update(rowData,index)">编辑</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    update() {


      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {


      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 药品专题
Vue.component('table-operation-special', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modifyImg(rowData,index)">更改商品图片</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    modifyImg() {

      let params = {
        type: 'modifyImg',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'deleteRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 版本控制
Vue.component('table-operation-versionControl', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    deleteRow() {

      let params = {
        type: 'deleteRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 脉诊仪-脏腑
Vue.component('table-operation-versionTable', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modifyImg(rowData,index)">更改商品图片</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-sort-up" @click.stop.prevent="sortUp(rowData,index)">上移</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    modifyImg() {

      let params = {
        type: 'modifyImg',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'deleteRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    sortUp() {

      let params = {
        type: 'sortUp',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 意见反馈
Vue.component('table-operations-feedbackFeedback', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="readDetail(rowData,index)">查看详情</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    readDetail() {

      let params = {
        type: 'readDetail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'deleteRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);

    }
  }
});
// 使用帮助
Vue.component('table-operation-useHelp', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modify(rowData,index)">修改</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    modify() {

      let params = {
        type: 'modify',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'deleteRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 发帖审核
Vue.component('table-operation-postAudit', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-check" @click.stop.prevent="setExamine(rowData,index)" v-show="rowData.status === 2||rowData.status ===0 ">审核成功</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-close" @click.stop.prevent="cancelExamine(rowData,index)" v-show="rowData.status === 1">审核失败</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-check" @click.stop.prevent="setHot(rowData,index)" v-show="rowData.hotspot === 0">设置热门</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-close" @click.stop.prevent="cancelHot(rowData,index)" v-show="rowData.hotspot === 1">取消热门</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="readDetail(rowData,index)">编辑</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-plus" @click.stop.prevent="setFocus(rowData,index)" v-show="rowData.is_loop === 0">设置焦点图</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-minus" @click.stop.prevent="cancelFocus(rowData,index)" v-show="rowData.is_loop ===1">取消焦点图</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    setExamine() {

      let params = {
        type: 'setExamine',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    cancelExamine() {

      let params = {
        type: 'cancelExamine',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    setHot() {

      let params = {
        type: 'setHot',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    cancelHot() {

      let params = {
        type: 'cancelHot',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    readDetail() {

      let params = {
        type: 'readDetail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    setFocus() {

      let params = {
        type: 'setFocus',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    cancelFocus() {

      let params = {
        type: 'cancelFocus',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'deleteRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 微信素材管理
Vue.component('table-operation-weChatMaterial', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modify(rowData,index)">修改</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    modify() {

      let params = {
        type: 'modify',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'deleteRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 音频管理
Vue.component('table-operation-audioManagement', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="catalog(rowData,index)">关联目录</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modify(rowData,index)">编辑</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-check" @click.stop.prevent="setExamine(rowData,index)" v-show="rowData.status ===2||rowData.status ===0">审核成功</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-close" @click.stop.prevent="cancelExamine(rowData,index)" v-show="rowData.status ===1 ">审核失败</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-check" @click.stop.prevent="setHot(rowData,index)" v-show="rowData.is_hot ===0 ">设置热门</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-close" @click.stop.prevent="cancelHot(rowData,index)" v-show="rowData.is_hot ===1 ">取消热门</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-check" @click.stop.prevent="setRecommend(rowData,index)" v-show="rowData.is_recommend ==0 ">设置推荐</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-close" @click.stop.prevent="cancelRecommend(rowData,index)" v-show="rowData.is_recommend ===1 ">取消推荐</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-check" @click.stop.prevent="setFocus(rowData,index)" v-show="rowData.is_focus ===0 ">设置焦点图</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-close" @click.stop.prevent="cancelFocus(rowData,index)" v-show="rowData.is_focus ===1 ">取消焦点图</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-setting" @click.stop.prevent="famousDoctor(rowData,index)">名医推荐图</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    catalog() {

      let params = {
        type: 'catalog',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    modify() {

      let params = {
        type: 'modify',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    setExamine() {

      let params = {
        type: 'setExamine',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    cancelExamine() {

      let params = {
        type: 'cancelExamine',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    setHot() {

      let params = {
        type: 'setHot',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    cancelHot() {

      let params = {
        type: 'cancelHot',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    setRecommend() {

      let params = {
        type: 'setRecommend',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    cancelRecommend() {

      let params = {
        type: 'cancelRecommend',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    setFocus() {

      let params = {
        type: 'setFocus',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    cancelFocus() {

      let params = {
        type: 'cancelFocus',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    famousDoctor() {

      let params = {
        type: 'famousDoctor',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'deleteRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 未关联音频
Vue.component('table-operation-unassociatedAudio', {
  template: `<span class="table-operation-btns">
  <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modify(rowData,index)">编辑</el-button>
  <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    modify() {

      let params = {
        type: 'modify',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'deleteRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 关联音频
Vue.component('table-operation-associatedAudio', {
  template: `<span class="table-operation-btns">
  <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modify(rowData,index)">编辑</el-button>
  <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="relieveRelation(rowData,index)">解除关联</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    modify() {

      let params = {
        type: 'modify',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    relieveRelation() {

      let params = {
        type: 'relieveRelation',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 员工管理
Vue.component('table-operation-employeeManage', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modifyEmployee(rowData,index)">编辑</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteEmployee(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    details() {

      let params = {
        type: 'details',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteEmployee() {

      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    modifyEmployee() {

      let params = {
        type: 'modifyEmployee',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 角色管理
Vue.component('table-operation-role', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modifyRole(rowData,index)">修改信息</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-view" @click.stop.prevent="setPermission(rowData,index)">设置权限</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRole(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    modifyRole() {
      let params = {
        type: 'modifyRole',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    setPermission() {
      let params = {
        type: 'setPermission',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRole() {
      let params = {
        type: 'deleteRole',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 菜单管理
Vue.component('table-operation-menuManage', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modifyMenu(rowData,index)">修改</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteMenu(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    deleteMenu() {

      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    modifyMenu() {

      let params = {
        type: 'modifyMenu',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 系统管理--权限管理
Vue.component('table-operation-powerManage', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modifyPower(rowData,index)">修改</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deletePower(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    modifyPower() {
      let params = {
        type: 'modifyPower',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deletePower() {
      let params = {
        type: 'deletePower',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 系统管理--用户管理
Vue.component('table-operation-userManage', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modifyUser(rowData,index)">修改信息</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-edit-outline" @click.stop.prevent="changePassword(rowData,index)">修改密码</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-menu" @click.stop.prevent="setRoles(rowData,index)">设置角色</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteUser(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    modifyUser() {
      let params = {
        type: 'modifyUser',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    changePassword() {
      let params = {
        type: 'changePassword',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    setRoles() {
      let params = {
        type: 'setRoles',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteUser() {
      let params = {
        type: 'deleteUser',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 标准处方状态
Vue.component('table-standard-prescription', {
  template: `<span class="table-standard-prescription">
        <el-button type="primary" size="mini" plain icon="el-icon-arrow-down" @click.stop.prevent="use(rowData,index)" v-show="rowData.status == 0">已启用</el-button>
        <el-button type="danger" size="mini" plain icon="el-icon-arrow-down" @click.stop.prevent="use(rowData,index)"  v-show="rowData.status == 1">已禁用</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  methods: {
    use() {

      let params = {
        type: 'use',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    nouse() {

      let params = {
        type: 'nouse',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 经典膏方状态
Vue.component('table-classic-prescription', {
  template: `<span class="table-standard-prescription">
        <el-button type="primary" size="mini" plain icon="el-icon-arrow-down" @click.stop.prevent="use(rowData,index)" v-show="rowData.state == 0">已启用</el-button>
        <el-button type="danger" size="mini" plain icon="el-icon-arrow-down" @click.stop.prevent="use(rowData,index)"  v-show="rowData.state == 1">已禁用</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  methods: {
    use() {

      let params = {
        type: 'use',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    nouse() {

      let params = {
        type: 'nouse',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 启用禁用
Vue.component('table-operation-doctorlist', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="details(rowData,index)">查看详情</el-button>
        <el-button type="primary" size="mini" plain :icon="String(rowData.isdisabled)==='0'?'el-icon-close':'el-icon-check'" @click.stop.prevent="disable(rowData,index)">{{String(rowData.isdisabled)==='0'?'禁用':'启用'}}</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    disable() {

      let params = {
        type: 'disable',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    details() {
      let params = {
        type: 'details',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 医院列表
Vue.component('table-operation-hospitallist', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="details(rowData,index)">查看详情</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        <el-button type="primary" size="mini" plain :icon="String(rowData.state)==='1'?'el-icon-close':'el-icon-check'" @click.stop.prevent="disable(rowData,index)">{{String(rowData.state)==='1'?'禁用':'启用'}}</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    disable() {

      let params = {
        type: 'disable',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    details() {
      let params = {
        type: 'details',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 药品列表
Vue.component('table-operation-drugmgr', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="details(rowData,index)">编辑</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        <el-button type="primary" size="mini" plain :icon="String(rowData.status)==='0'?'el-icon-close':'el-icon-check'" @click.stop.prevent="disable(rowData,index)">{{String(rowData.status)==='0'?'禁用':'启用'}}</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    disable() {

      let params = {
        type: 'disable',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    details() {
      let params = {
        type: 'details',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 业务员列表
Vue.component('table-classic-salesmanList', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-plus" @click.stop.prevent="add(rowData,index)">添加膏方</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="update(rowData,index)">编辑</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    add() {
      let params = {
        type: 'add',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    update() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {
      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 1.待录入操作
Vue.component('table-operation-waitEntry', {
  template: `<div style="line-height: 40px;">
                <span class="table-operation-btns"><el-button  size="mini" type="primary" icon="el-icon-edit" plain  @click.stop.prevent="handelClickEvent(rowData,index)">录入</el-button></span>
               <div class="operate" style="line-height: 22px">{{rowData.orderoperatename}}</div>
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
    }
  },
  methods: {
    handelClickEvent() {

      let params = {
        type: 'entry',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 1.1待确认操作
Vue.component('table-operation-waitConfirm', {
  template: `<div style="line-height: 40px;">
        <el-button  size="mini" type="primary" icon="el-icon-edit" plain @click.stop.prevent="handelClickEvent(rowData,index)">确认</el-button>
         <div class="operate" style="line-height: 22px">{{rowData.orderoperatename}}</div>
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
    }
  },
  methods: {
    handelClickEvent() {

      let params = {
        type: 'confirm',
        index: this.index,
        rowData: this.rowData,
        sourcePage: 'order'
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 2.已录入操作.
Vue.component('table-operation-hadEntry', {
  template: `<div style="line-height: 40px;">
              <el-button size="mini" type="primary" icon="el-icon-edit" plain   @click.stop.prevent="viewDetail(rowData,index)">查看详情</el-button>
              <el-button size="mini" type="warning" icon="el-icon-edit" plain  v-show="rowData.orderstatus === 15" @click.stop.prevent="viewLogistics(rowData,index)">查看物流</el-button>
              <div class="operate" style="line-height: 22px">{{rowData.orderoperatename}}</div>
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
    }
  },
  methods: {
    viewDetail() {

      let params = {
        type: 'viewDetail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    viewLogistics() {
      let params = {
        type: 'viewLogistics',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 2.2.已确认操作.
Vue.component('table-operation-hadConfirm', {
  template: `<div>
               <el-button size="mini" type="primary" icon="el-icon-edit" plain   @click.stop.prevent="viewDetail(rowData,index)">详情</el-button>
               <el-button size="mini" type="primary" icon="el-icon-edit" plain   @click.stop.prevent="printRecipe(rowData,index)">打印</el-button>
              <el-button size="mini" type="warning" icon="el-icon-edit" plain  v-show="rowData.orderstatus === '用户已确认'||rowData.orderstatus === '后台已确认'"  @click.stop.prevent="viewLogistics(rowData,index)">物流</el-button>
             <div class="operate" style="line-height: 22px">{{rowData.orderoperatename}}</div>
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
    }
  },
  methods: {
    viewDetail() {

      let params = {
        type: 'viewDetail',
        index: this.index,
        rowData: this.rowData,
        sourcePage: 'order'
      };
      this.$emit('on-custom-comp', params);
    },
    viewLogistics() {
      let params = {
        type: 'viewLogistics',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    printRecipe() {
      let params = {
        type: 'printRecipe',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 处方列表-药品剂量基数
Vue.component('table-operation-drug-singledose', {
  template: ` <div class="table-operation-drug-num"><el-input-number  size="mini" v-model="rowData.singledose" @change="handleChange" :min="0" :max="1000" label="描述文字"></el-input-number>
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
    }
  },
  methods: {
    handleChange(value) {

      let params = {
        type: 'singledoseChange',
        value: value,
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 处方列表-药品剂量最终doseResult
Vue.component('table-operation-drug-doseResult', {
  template: `<div><span :style="gutterSpan">{{rowData.singledose}} * {{rowData.agentsnumber}}=</span>
  <span :style="gutterSpan">{{rowData.dose}}</span><span :style="gutterSpan">{{rowData.unit}}</span></div>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      gutterSpan: {
        color: 'red',
        paddingRight: '5px'
      }
    };
  },
  methods: {
    handleChange(value) {

      let params = {
        type: 'singledoseChange',
        value: value,
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 处方列表-药品剂量
Vue.component('table-operation-drug-num', {
  template: ` <div class="table-operation-drug-num"><el-input-number  size="mini" v-model="rowData.dose" @change="handleChange" :min="0" :max="100000" label="描述文字"></el-input-number>
        <span style="padding: 0 10px">{{rowData.unit}}</span>
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
    }
  },
  methods: {
    handleChange(value) {

      let params = {
        type: 'numChange',
        value: value,
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 处方列表-药品用法
Vue.component('table-operation-drug-usage', {
  template: ` <div class="table-select">
                 <el-select  v-model="rowData.musage"
                          @change="changeValue"
                          size="mini"
                          placeholder="用法">
                          <el-option label="无" value="无"></el-option>
                          <el-option label="水煮" value="水煮"></el-option>
                          <el-option label="煎服" value="煎服"></el-option>
                          <el-option value="先煎">先煎</el-option>
                          <el-option value="后下">后下</el-option>
                          <el-option value="包煎">包煎</el-option>
                          <el-option value="另煎">另煎</el-option>
                          <el-option value="熔化">熔化</el-option>
                          <el-option value="冲服">冲服</el-option>
                           <el-option value="焗服">焗服</el-option>
                           <el-option value="打碎">打碎</el-option>
                           <el-option value="另包配送">另包配送</el-option>
                           <el-option value="去核">去核</el-option>
                           <el-option value="水煎">水煎</el-option>
                           <el-option value="掰开">掰开</el-option>
                 </el-select>
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
    }
  },
  methods: {
    changeValue(value) {

      let params = {
        type: 'usageChange',
        value: value,
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 经典膏方列表详情-药品用法
Vue.component('table-classic-drug-usage', {
  template: ` <div class="table-select">
                 <el-select  v-model="rowData.m_usage"
                          @change="changeValue"
                          size="mini"
                          placeholder="用法">
                          <el-option label="无"  value="无"></el-option>
                          <el-option label="水煮" value="水煮"></el-option>
                          <el-option label="煎服" value="煎服"></el-option>
                          <el-option value="先煎">先煎</el-option>
                          <el-option value="后下">后下</el-option>
                          <el-option value="包煎">包煎</el-option>
                          <el-option value="另煎">另煎</el-option>
                          <el-option value="熔化">熔化</el-option>
                          <el-option value="冲服">冲服</el-option>
                           <el-option value="焗服">焗服</el-option>
                           <el-option value="打碎">打碎</el-option>
                           <el-option value="另包配送">另包配送</el-option>
                           <el-option value="去核">去核</el-option>
                           <el-option value="水煎">水煎</el-option>
                           <el-option value="掰开">掰开</el-option>
                 </el-select>
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
    }
  },
  methods: {
    changeValue(value) {

      let params = {
        type: 'usageChange',
        value: value,
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});

// 处方列表-移除药材
Vue.component('table-operation-drug-remove', {
  template: `<div><el-button  type='primary' plain  size="small" class="el-icon-circle-close" @click.stop.prevent="removeChineseMedicine(rowData,index)"> 移除药材</el-button></div>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    removeChineseMedicine() {

      let params = {
        type: 'removeChineseMedicine',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 广告banner页
Vue.component('table-operation-adverBanner', {
  template: `<span class="table-operation-btns">
  <el-button type="success" size="mini" plain icon="el-icon-success" @click.stop.prevent="start(rowData,index)" v-show="rowData.status == '1'">启用</el-button>
  <el-button type="danger" size="mini" plain icon="el-icon-warning" @click.stop.prevent="disable(rowData,index)" v-show="rowData.status == '0'">禁用</el-button>
  <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="edit(rowData,index)">编辑</el-button>
  <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
  </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    start() {
      let params = {
        type: 'start',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    disable() {
      let params = {
        type: 'disable',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    edit() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {
      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 药葫芦广告
Vue.component('adverIndex', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="edit(rowData,index)">修改</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="detail(rowData,index)">查看详情</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleta(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    edit() { // 编辑
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleta() { // 删除
      let params = {
        type: 'deleta',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    detail() { // 查看详情
      let params = {
        type: 'detail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 资讯--标签管理
Vue.component('table-operation-Tags', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modifyTags(rowData,index)">修改</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteTags(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    modifyTags() {
      let params = {
        type: 'modifyTags',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteTags() {
      let params = {
        type: 'deleteTags',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 健康头条-选择资讯
Vue.component('outNewList', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-success" @click.stop.prevent="querySelect(rowData,index)">确定选择</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    querySelect() {
      let params = {
        type: 'querySelect',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 白名单列表
Vue.component('table-operation-whiteList', {
  template: `<span class="table-operation-btns">
  <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modifyRow(rowData,index)">编辑</el-button>
  <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除白名单</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    modifyRow() {

      let params = {
        type: 'modifyRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'deleteRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 新增白名单列表
Vue.component('table-operation-addWhiteList', {
  template: `<span class="table-operation-btns">
  <el-button type="primary" size="mini" plain icon="el-icon-plus" @click.stop.prevent="addWhite(rowData,index)">添加白名单</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    addWhite() {

      let params = {
        type: 'addWhite',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});

// 添加/编辑为你推荐
Vue.component('table-operations-addRecommend', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    readDetail() {

      let params = {
        type: 'readDetail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 电商中心-提现
Vue.component('table-operations-forward', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="seeRow(rowData,index)">查看</el-button>
      <el-button type="success" size="mini" plain icon="el-icon-success" @click.stop.prevent="auditorRow(rowData,index)" v-if="rowData.withdrawStatus === 10">审核</el-button>
      <el-button type="success" size="mini" plain icon="el-icon-success" @click.stop.prevent="payRow(rowData,index)" v-if="rowData.withdrawStatus === 20">已付款</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeRow() {

      let params = {
        type: 'seeRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    auditorRow() {

      let params = {
        type: 'auditorRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    payRow() {

      let params = {
        type: 'payRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});

// 中医体质检测
Vue.component('table-operations-physique', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="edit(rowData,index)">编辑</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-arrow-up" @click.stop.prevent="up(rowData,index)">上架</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-arrow-down" @click.stop.prevent="down(rowData,index)">下架</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="Delete(rowData,index)">删除</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    edit() {

      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    up() {

      let params = {
        type: 'up',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    down() {

      let params = {
        type: 'down',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    Delete() {

      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 编辑商品描述、删除
Vue.component('table-operations-proDescriptionis', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="editDes(rowData,index)">编辑文案</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-sort-up" @click.stop.prevent="sortUp(rowData,index)">上移</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    editDes() {

      let params = {
        type: 'editDes',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    sortUp() {

      let params = {
        type: 'sortUp',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 编辑、删除、上移
Vue.component('table-operations-editAndremove', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="editDes(rowData,index)">编辑</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-sort-up" @click.stop.prevent="sortUp(rowData,index)">上移</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    editDes() {

      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {

      let params = {
        type: 'remove',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    sortUp() {

      let params = {
        type: 'sortUp',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 数据删除
Vue.component('table-operations-listDelete', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    deleteRow() {

      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});

// 资讯新增/编辑 推荐商品列表操作
Vue.component('newsinfo-product-operations', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="replaceRow(rowData,index)">更改商品图片</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    deleteRow() {

      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    replaceRow() {

      let params = {
        type: 'seePic',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 微循环新增/编辑 推荐商品列表操作
Vue.component('newsinfo-delete-operations', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    deleteRow() {

      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 诊脉仪检测-体质结果
Vue.component('newsinfo-product-PhysicalResult', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.search="seeDetails(rowData,index)">查看详情</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.edit="editContent(rowData,index)">修改</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.delete="removeResult(rowData,index)">删除</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeDetails() {

      let params = {
        type: 'see',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    editContent() {

      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    removeResult() {

      let params = {
        type: 'remove',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 医生商品分类
Vue.component('table-operations-doctorCategoryList', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.edit="editContent(rowData,index)">修改</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.delete="removeResult(rowData,index)">删除</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    editContent() {

      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    removeResult() {

      let params = {
        type: 'remove',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 查看详情 赠送积分
Vue.component('table-operation-details', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="seeDetails(rowData,index)">查看详情</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeDetails() {
      let params = {
        type: 'details',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    // giveIntegral() {
    //   let params = {
    //     type: 'give',
    //     index: this.index,
    //     rowData: this.rowData
    //   };
    //   this.$emit('on-custom-comp', params);
    // },
  }
});
// 第三方O2O平台管理后台
// 订单管理 查看详情
Vue.component('table-o2oPlatformOrderList', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="seeDetails(rowData,index)">详情</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeDetails() {
      let params = {
        type: 'seeDetails',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 门店管理 主店列表
Vue.component('table-o2oPlatformStoreMainStore', {
  template: `<span class="table-operation-btns">
        <el-button type="danger" size="mini" plain icon="el-icon-error" @click.stop.prevent="prohibit(rowData,index)" v-if="rowData.isEnable === 1">禁用</el-button>
        <el-button type="success" size="mini" plain icon="el-icon-success" @click.stop.prevent="enable(rowData,index)" v-if="rowData.isEnable === -1">启用</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-setting" @click.stop.prevent="setUp(rowData,index)">设置</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="seeInfo(rowData,index)">信息</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="seeStore(rowData,index)">查看门店</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    prohibit() {
      let params = {
        type: 'prohibit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    enable() {
      let params = {
        type: 'enable',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    setUp() {
      let params = {
        type: 'setUp',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    seeInfo() {
      let params = {
        type: 'seeInfo',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    seeStore() {
      let params = {
        type: 'seeStore',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 门店管理 查看列表
Vue.component('table-subordinateStore', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="storeInfo(rowData,index)">查看店铺信息</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    storeInfo() {
      let params = {
        type: 'storeInfo',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 渠道管理 删除
Vue.component('table-o2oPlatformChannelActivity', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    deleteRow() {
      let params = {
        type: 'deleteRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 渠道管理 编辑
Vue.component('table-o2oPlatformChannelBusinessSetup', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="edit(rowData,index)">编辑</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    edit() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 药品管理 本地药品
Vue.component('table-o2oPlatformDrugsLocal', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="drugs(rowData,index)">药品列表</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    drugs() {
      let params = {
        type: 'drugs',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 药品管理 第三方药品
Vue.component('table-o2oPlatformDrugsOther', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="drugs(rowData,index)">药品列表</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="classification(rowData,index)">分类列表</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="unsynchronized(rowData,index)">未同步药品</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    drugs() {
      let params = {
        type: 'drugs',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    classification() {
      let params = {
        type: 'classification',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    unsynchronized() {
      let params = {
        type: 'unsynchronized',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 药品管理 编辑删除
Vue.component('table-o2oPlatformDrugsOtherDeletion', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="edit(rowData,index)">编辑</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    edit() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {
      let params = {
        type: 'deleteRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 分类管理 编辑删除 上下移
Vue.component('table-o2oPlatformDrugsOtherClassification', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-arrow-up" @click.stop.prevent="upMove(rowData,index)">上移</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-arrow-down" @click.stop.prevent="downMove(rowData,index)">下移</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="edit(rowData,index)">编辑</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    upMove() {
      let params = {
        type: 'upMove',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    downMove() {
      let params = {
        type: 'downMove',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    edit() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {
      let params = {
        type: 'deleteRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 微循环 -删除-诊断
Vue.component('TB-remove-confirm', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="confirm(rowData,index)" v-show="!rowData.status">诊断</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="deleteRow(rowData,index)" v-show="rowData.status">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    confirm() {
      let params = {
        type: 'confirm',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteRow() {
      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});

// 为循环 修改-删除-查看详情
Vue.component('TB-edit-delete', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="edit(rowData,index)">修改</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="removeRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    edit() { // 编辑
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    removeRow() { // 删除
      let params = {
        type: 'removeRow',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 查看记录
Vue.component('table-operation-seeRecord', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="seeRecord(rowData,index)">查看记录</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeRecord() {
      let params = {
        type: 'seeRecord',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 查看记录
Vue.component('table-operation-seeOrderDetail', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="seeOrderDetail(rowData,index)">查看订单详情</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeOrderDetail() {
      let params = {
        type: 'seeDetail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 查看订单、礼包详情
Vue.component('table-operation-seegiftListDetail', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="seeOrderDetail(rowData,index)">查看订单详情</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="seeGiftDetail(rowData,index)">查看礼包详情</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeOrderDetail() {
      let params = {
        type: 'seeOrderDetail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    seeGiftDetail() {
      let params = {
        type: 'seeGiftDetail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});

// 食材管理
Vue.component('table-operation-foodManage', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="edit(rowData,index)">编辑</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="seeDetail(rowData,index)">查看详情</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="remove(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    edit() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    seeDetail() {
      let params = {
        type: 'seeDetail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    remove() {
      let params = {
        type: 'remove',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 编辑、删除
Vue.component('editAndremove', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="edit(rowData,index)">编辑</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="remove(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    edit() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    remove() {
      let params = {
        type: 'remove',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 修改、查看、删除
Vue.component('tb-edit-detail-delete', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="edit(rowData,index)">修改</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="detail(rowData,index)">查看</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="remove(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    edit() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    detail() {
      let params = {
        type: 'detail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    remove() {
      let params = {
        type: 'remove',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 设置介绍、删除
Vue.component('table-operations-setPresent', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-setting" @click.stop.prevent="setPrevent(rowData,index)">设置介绍</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="remove(rowData,index)">删除</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-refresh" @click.stop.prevent="replace(rowData,index)">替换商品</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    setPrevent() {
      let params = {
        type: 'setPrevent',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    remove() {
      let params = {
        type: 'remove',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    replace() {
      let params = {
        type: 'replace',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 理疗门店
Vue.component('table-operation-storeList', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="edit(rowData,index)">编辑门店</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-setting" @click.stop.prevent="manage(rowData,index)">管理理疗套餐</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="seeDetail(rowData,index)">查看详情</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="remove(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    edit() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    manage() {
      let params = {
        type: 'manage',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    seeDetail() {
      let params = {
        type: 'seeDetail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    remove() {
      let params = {
        type: 'remove',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 预约理疗订单
Vue.component('table-operation-Appointment', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="detail(rowData,index)">查看明细</el-button>
        <el-button v-if="rowData.reserve_status === 0" type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="handle(rowData,index)">处理预约</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-tickets" @click.stop.prevent="remarkNews(rowData,index)">客服备注</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    detail() {
      let params = {
        type: 'detail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    handle() {
      let params = {
        type: 'handle',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    remarkNews() {
      let params = {
        type: 'remark',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 帖子管理
// <el-button type="primary" size="mini" plain icon="el-icon-share" v-if="rowData.is_to_news === false" @click.stop.prevent="recommend(rowData,index)">推荐</el-button>
// <el-button type="primary" size="mini" plain icon="el-icon-share" v-else @click.stop.prevent="recommend(rowData,index)">取消推荐</el-button>
Vue.component('table-operation-cardList', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-caret-top" v-if="rowData.is_home_top === 0 && rowData.is_section_top === 0" @click.stop.prevent="top(rowData,index)">置顶</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-caret-bottom" v-else @click.stop.prevent="top(rowData,index)">取消置顶</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="detail(rowData,index)">查看</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="remove(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    recommend() {
      let params = {
        type: 'recommend',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    detail() {
      let params = {
        type: 'detail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    remove() {
      let params = {
        type: 'remove',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    top() {
      let params = {
        type: 'top',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 积分商品管理
Vue.component('table-operation-IntegralCommodManage', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="detail(rowData,index)">查看详情</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    detail() {
      let params = {
        type: 'detail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 商品管理-（商品、礼品）专题
Vue.component('table-operation-productSpecial', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.prevent="modify(rowData,index)">修改</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-setting" @click.stop.prevent="productManaage(rowData,index)">商品管理</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="remove(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    remove() {
      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    productManaage() {
      let params = {
        type: 'manage',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    modify() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 商品管理-（商品、礼品）专题--商品管理
Vue.component('table-operation-specialManage', {
  template: `<span class="table-operation-btns">
        <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.delete="remove(rowData,index)">删除</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.delete="preview(rowData,index)">预览</el-button>
        <el-button type="primary" size="mini" plain icon="el-icon-edit" @click.stop.delete="editSort(rowData,index)">编辑排序</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    remove() {
      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    preview() {
      let params = {
        type: 'detail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    editSort() {
      let params = {
        type: 'editSort',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 积分体系-商品管理
Vue.component('table-operations-integralManage', {
  template: `<span class="table-operation-btns">
      <el-button type="primary" size="mini" plain icon="el-icon-edit" v-if="rowData.coupon_status !== 'Disable'" @click.stop.prevent="edit(rowData,index)">编辑</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-arrow-up" v-if="rowData.coupon_status !== 'Disable'" @click.stop.prevent="up(rowData,index)">上架</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-arrow-down" v-if="rowData.coupon_status !== 'Disable'" @click.stop.prevent="down(rowData,index)">下架</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-search" v-if="rowData.coupon_status === 'Disable'" @click.stop.prevent="look(rowData,index)">查看</el-button>
      <el-button type="primary" size="mini" plain icon="el-icon-delete" @click.stop.prevent="Delete(rowData,index)">删除</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    edit() {

      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    up() {

      let params = {
        type: 'up',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    down() {

      let params = {
        type: 'down',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    Delete() {

      let params = {
        type: 'delete',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    look() {

      let params = {
        type: 'look',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 开放平台申请管理-申请用户管理
Vue.component('table-operations-applayUserManage', {
  template: `<span class="table-operation-btns">
            <el-button type="primary" size="mini" plain icon="el-icon-plus" @click.stop.prevent="addRemarks(rowData,index)">添加备注</el-button>
            <el-button type="primary" size="mini" plain icon="el-icon-check" @click.stop.prevent="checkPass(rowData,index)">审核通过</el-button>
            <el-button type="primary" size="mini" plain icon="el-icon-close" @click.stop.prevent="checkReject(rowData,index)">审核不通过</el-button>
      </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    addRemarks() {

      let params = {
        type: 'addRemarks',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    checkPass() {

      let params = {
        type: 'checkPass',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    checkReject() {

      let params = {
        type: 'checkReject',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});