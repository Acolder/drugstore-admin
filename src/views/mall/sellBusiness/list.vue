<template>
  <div class="list">
    <info :isExamine="false" :index="index"></info>
  </div>
</template>

<script>
import info from './info';
export default {
  data() {
    // console.log(this.$route.query.index);
    return {
      index: this.$route.query.index ? this.$route.query.index : 1
    };
  },
  components: {
    'info': info
  }
};
</script>

<style>

</style>
