<template>
  <div class="eidt">
    <info :isAdd="false"></info>
  </div>
</template>

<script>
import info from './Info-lsit';
export default {
  data() {
    return {};
  },
  components: {
    'info': info
  }
};
</script>

<style>

</style>