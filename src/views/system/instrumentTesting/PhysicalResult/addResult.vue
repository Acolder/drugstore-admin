<template>
  <div>
    <info :addPhysical='true'></info>
  </div>
</template>

<script>
import physicalInfo from './physicalInfo';
export default {
  data() {
    return {};
  },
  components: {
    'info': physicalInfo
  }
};
</script>

<style lang="less" scoped>

</style>
