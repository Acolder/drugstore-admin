<template>
  <div class="add">
    <info :isAdd="true"></info>
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
