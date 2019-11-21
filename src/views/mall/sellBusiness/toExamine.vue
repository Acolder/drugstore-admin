<template>
  <div class="list">
    <info :isExamine="true" :index="index"></info>
  </div>
</template>

<script>
import info from './info';
export default {
  data() {
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
