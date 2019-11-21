<template>
  <div>
    <info :addFood='false'></info>
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
