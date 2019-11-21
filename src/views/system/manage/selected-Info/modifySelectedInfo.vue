<template>
  <div class="edit">
    <info :isAdd="false"></info>
  </div>
</template>

<script>
import selectedInfo from './selectedInfo';
export default {
  data() {
    return {};
  },
  components: {
    'info': selectedInfo
  }
};
</script>

<style>

</style>
