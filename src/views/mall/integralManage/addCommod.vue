<template>
  <div class="add">
    <info :isAdd="true"></info>
  </div>
</template>

<script>
import info from './commodInfo';
export default {
  data() {
    return {};
  },
  components: {
    'info': info
  }
};
</script>

<style lang="less" scoped>

</style>
