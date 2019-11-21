<template>
  <div>
    <script :id="id" :style="'height:'+height+'px;width:100%;'" type="text/plain">
    {{defaultContent}}
    </script>
  </div>
</template>
<script>
import '@static/js/ueditor/ueditor.config.js';
import '@static/js/ueditor/ueditor.all.min.js';
import '@static/js/ueditor/lang/zh-cn/zh-cn.js';
import '@static/js/ueditor/ueditor.parse.min.js';
export default {
  data() {
    return {
      ueditor: null
    };
  },
  props: {
    // id
    id: {
      type: String,
      required: true,
    },
    // height
    height: {
      type: Number,
      default: 450,
    },
    // 初始值
    defaultContent: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 初始化ueditor
    init() {
      /* eslint-disable */
      UE.delEditor(this.id);
      this.ueditor = UE.getEditor(this.id, {
        autoHeightEnabled:false,
        autoFloatEnabled:false,
      });
    },
    // 获取UE对象
    getUEObject() {
      return this.ueditor;
    },
    // 获取html内容
    getContent() {
      let _self = this;
      let conetent = '';
      _self.ueditor.ready(() => {
        conetent = _self.ueditor.getContent();
      });
      return conetent;
    },
    // 获取纯文本内容
    getContentTxt() {
      let _self = this;
      let conetentTxt = '';
      _self.ueditor.ready(() => {
        conetentTxt = _self.ueditor.getContentTxt();
      });
      return conetentTxt;
    },
    // 设置编辑器的内容
    setContent(text) {
      let _self = this;
      _self.ueditor.ready(() => {
        _self.ueditor.setContent(text);
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
