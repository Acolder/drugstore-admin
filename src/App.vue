<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
@import './styles/reset.css';
@import './styles/basic.css';
@import 'element-ui/lib/theme-chalk/index.css';
@import "kindeditor/themes/default/default.css";
</style>
<style lang="less">
@import './styles/common.less';
</style>
