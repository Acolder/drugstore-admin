<template>
  <div id="wrap">
    <info :addTalkHall="false"></info>
  </div>
</template>

<script>
import talkHallInfo from './talkHallInfo';
export default {
  data() {
    return {};
  },
  components: {
    'info': talkHallInfo,
  }
};
</script>

<style lang="less" scoped>

</style>
