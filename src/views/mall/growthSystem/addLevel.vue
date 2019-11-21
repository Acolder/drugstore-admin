<template>
  <div>
    <info :addlevel=true></info>
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
