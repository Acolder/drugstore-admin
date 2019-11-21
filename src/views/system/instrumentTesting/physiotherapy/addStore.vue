<template>
  <div id="addStore">
    <info :addStore='true'></info>
  </div>
</template>

<script>
import storeInfo from './storeInfo';
export default {
  data() {
    return {};
  },
  components: {
    'info': storeInfo
  }
};
</script>

<style>

</style>
