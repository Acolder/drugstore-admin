<template>
  <div class="edit">
    <info :isAdd="false"></info>
  </div>
</template>

<script>
import info from './info';
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