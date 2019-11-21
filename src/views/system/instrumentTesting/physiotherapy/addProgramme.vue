<template>
  <div id="addStore">
    <info :addProgramme='true'></info>
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
