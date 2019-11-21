<template>
  <div id="addStore">
    <info :addStore='false'></info>
  </div>
</template>

<script>
import store from './storeInfo';
export default {
  data() {
    return {};
  },
  components: {
    'info': store
  }
};
</script>

<style>

</style>