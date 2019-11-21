<template>
  <div>
    <info :addFood='true'></info>
  </div>
</template>

<script>
import foodInfo from './foodInfo';
export default {
  data() {
    return {};
  },
  components: {
    'info': foodInfo
  }
};
</script>

<style lang="less" scoped>

</style>
