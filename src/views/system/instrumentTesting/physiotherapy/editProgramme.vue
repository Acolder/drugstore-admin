<template>
  <div id="addStore">
    <info :addProgramme='false'></info>
  </div>
</template>

<script>
import Info from './programme';
export default {
  data() {
    return {};
  },
  components: {
    'info': Info
  }
};
</script>

<style>

</style>