<template>
  <div id="wrap">
    <info :addIll="false"></info>
  </div>
</template>

<script>
import illInfo from './illInfo';
export default {
  data() {
    return {};
  },
  components: {
    'info': illInfo,
  }
};
</script>

<style lang="less" scoped>

</style>
