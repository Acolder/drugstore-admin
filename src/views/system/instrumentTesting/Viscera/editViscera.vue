<template>
  <div>
    <info :addViscera='false'></info>
  </div>
</template>
<script>
import visceraInfo from './visceraInfo1';
export default {
  data() {
    return {};
  },
  components: {
    'info': visceraInfo
  }
};
</script>

<style lang="less" scoped>

</style>
