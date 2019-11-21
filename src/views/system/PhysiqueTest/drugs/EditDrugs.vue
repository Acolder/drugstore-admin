<template>
  <div>
    <info :drugAdd="false"></info>
  </div>
</template>

<script>
import DrugInfo from './DrugInfo';
export default {
  data() {
    return {};
  },
  components: {
    'info': DrugInfo
  }
};
</script>

<style>

</style>