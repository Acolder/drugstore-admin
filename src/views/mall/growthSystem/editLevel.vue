<template>
  <div>
    <info :addlevel=false></info>
  </div>
</template>

<script>
import levelInfo from './levelInfo';
export default {
  data() {
    return {};
  },
  components: {
    'info': levelInfo,
  }
};
</script>

<style lang="less" scoped>

</style>
