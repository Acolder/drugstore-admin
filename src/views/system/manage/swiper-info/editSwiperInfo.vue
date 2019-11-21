<template>
  <div>
    <info :isAdd="false"></info>
  </div>
</template>

<script>
import swiperInfo from './swiperInfo';
export default {
  data() {
    return {};
  },
  components: {
    'info': swiperInfo,
  }
};
</script>

<style>

</style>